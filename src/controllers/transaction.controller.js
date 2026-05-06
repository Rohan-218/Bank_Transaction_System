const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');

/** 
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
    * 1. Validate request
    * 2. Validate idempotency key
    * 3. Check account status
    * 4. Derive sender balance from ledger
    * 5. Create transaction (PENDING)
    * 6. Create DEBIT ledger entry
    * 7. Create CREDIT ledger entry
    * 8. Mark transaction COMPLETED
    * 9. Commit MongoDB session
    * 10. Send email notification
*/

async function createTransactionController(req, res) {

    /**
     * 1. Validate request
    */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (fromAccount === toAccount) {
        return res.status(400).json({
            message: "Cannot transfer to the same account"
        });
    }

    const fromUserAccount = await accountModel.findById({
        _id: fromAccount
    });

    const toUserAccount = await accountModel.findById({
        _id: toAccount
    });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({ message: "Invalid fromAccount or toAccount" });
    }

    if (fromUserAccount.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You are not authorized to perform transactions from this account"
        });
    }

    /**
     * 2. Validate idempotency key
    */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey
    });

    if (isTransactionAlreadyExists) {
        return res.status(200).json({
        message: "Transaction already exists",
        status: isTransactionAlreadyExists.status // COMPLETED | PENDING | FAILED | REVERSED
    });
    }

    /**
     * 3. Check account status
    */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both accounts must be ACTIVE to perform a transaction"
        });
    }

    /**
     * 4. Derive sender balance from ledger
    */
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance in sender's account"
        });
    }

    /**
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
    */
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    /**
     * 10. Send email notification
    */
    emailService.sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        toAccount
    );

    return res.status(201).json({
        transaction,
        message: "Transaction completed successfully",
        status: "success"
    })
}

async function createInitialFundsController(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const toUserAccount = await accountModel.findById({
        _id: toAccount
    });

    if(!toUserAccount) {
        return res.status(400).json({ message: "Invalid toAccount" });
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user.id
    });

    if (!fromUserAccount) {
        return res.status(400).json({ message: "System account not found for the user" });
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey
    });

    if (isTransactionAlreadyExists) {
        return res.status(200).json({
        message: "Transaction already exists",
        status: isTransactionAlreadyExists.status // COMPLETED | PENDING | FAILED | REVERSED
    });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount: toUserAccount._id,
        amount,
        idempotencyKey,
        status: "PENDING"
    });

    const [debitLedgerEntry] = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session });

    const [creditLedgerEntry] = await ledgerModel.create([{
        account: toUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session });

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        transaction,
        message: "Initial funds added successfully",
        status: "success"
    })
}

module.exports = {
    createTransactionController,
    createInitialFundsController
}