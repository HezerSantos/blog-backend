const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
// Middleware Imports
const corsMiddleware = require("./middleware/corsMiddleware");
const helmetMiddleware = require("./middleware/helmetMiddleware");
const {passport} = require("./config/passport");
const staticMiddleware = require("./middleware/staticMiddleware");
const cookieParserMiddleware = require("./middleware/cookieParserMiddleware");
const bodyParserMiddleware = require("./middleware/bodyParserMiddleware");
// Apply Middleware
app.use(cookieParserMiddleware);
app.use(bodyParserMiddleware);
app.use(corsMiddleware);
app.use(helmetMiddleware); // Uncomment when needed
app.use(passport.initialize());
app.use(staticMiddleware);
// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Routers
const loginRouter = require("./routes/loginRouter");
const signupRouter = require("./routes/signupRouter");
const indexRouter = require("./routes/indexRouter");

// Routes
app.use("/", indexRouter)
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter)

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

// Server
app.listen(8080, () => {
  console.log("App running on port 8080");
});
