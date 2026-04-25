const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required for creating an account"],
    trim: true,
    unique: [true, "Email already exists, please use a different email"],
    lowercase: true,
    match: [
      /^[a-z0-9]+[._]?[a-z0-9]+@\w+\.\w{2,3}$/,
      "Please enter a valid email address"
    ]
  },
  name: {
    type: String,
    required: [true, "Name is required for creating an account"]
  },
  password: {
    type: String,
    required: [true, "Password is required for creating an account"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false
  }
},{
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next();
});

userSchema.methods.comparePassword = async function(password) {

    return await bcrypt.compare(password, this.password);

} 

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;