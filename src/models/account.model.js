const mongose = require("mongoose");


const accountSchema = new mongose.Schema({
    user: {
        type:mongose.Schema.Types.ObjectId,
        ref:"user",
        required:[true, "User is required"],
        index:true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status must be either ACTIVE, FROZEN, or CLOSED",
         },
         default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongose.model("account", accountSchema);

module.exports = accountModel;