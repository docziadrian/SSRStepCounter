require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const session = require("express-session");

// Middlewarek
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/src", express.static("src"));
app.use(
  session({
    secret: "gfg-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routingok

const core = require("./modules/core");
app.use("/", core);

const users = require("./modules/users");
app.use("/users", users);

const stepcounter = require("./modules/stepcounter");
app.use("/stepcounter", stepcounter);

// Listening...
app.listen(port, () => {
  console.log(`A szerver ezen a porton fut: ${port}`);
});
