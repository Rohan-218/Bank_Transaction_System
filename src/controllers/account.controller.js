const accountModel = require("../models/account.model");



async function createAccountController(req,res) {
    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })

    return res.status(201).json({
        account,
        message:"Account created successfully",
        status:"success"
    })

}

async function getUserAccountController(req,res) {
    const user = req.user;

    const accounts = await accountModel.find({
        user: user._id
    })

    return res.status(200).json({
        accounts,
        message:"Account details retrieved successfully",
        status:"success"
    })
}

async function getAccountBalanceController(req,res) {
    const user = req.user;
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: user._id
    })

    if (!account) {
        return res.status(404).json({
            message:"Account not found",
            status:"error"
        })
    }

    const balance = await account.getBalance();
    return res.status(200).json({
        accountId,
        balance,
        message:"Account balance retrieved successfully",
        status:"success"
    });
}
module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
}