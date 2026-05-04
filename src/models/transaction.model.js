const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Transaction must be associated with a From account'],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Transaction must be associated with a To account'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
            message: 'Status must be either PENDING, COMPLETED, or FAILED'
        },
        default: 'PENDING'
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required for a transaction'],
        min: [0, 'Amount must be a positive number']
    },
    idempotencyKey: {
        type: String,
        required: [true, 'Idempotency key is required for a transaction'],
        index: true,
        unique: true
    }
}, {
    timestamps: true
})

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;