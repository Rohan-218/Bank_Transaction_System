const expres = require("express");

const authRouter = require("./routes/auth.routes");


const app = expres();


app.use("/api/auth", authRouter);


module.exports = app;