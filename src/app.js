const expres = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");


const app = expres();

app.use(expres.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);


module.exports = app;