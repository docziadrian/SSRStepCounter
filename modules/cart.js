const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const db = require("./db");

const {
  guestNavbarItemsRight,
  guestNavbarItemsLeft,
  userNavbarItemsRight,
  userNavbarItemsLeft,
} = require("../modules/clientRendering/navbar");

function clearSessionMessages(req, res, next) {
  req.session.message = null;
  req.session.severity = null;
  next();
}

router.get("/view", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const isLoggedIn = !!req.session.userid;

  ejs.renderFile(
    "views/cart/cart.ejs",
    {
      error: req.session.message || null,
      user: req.session.username || null,
      useremail: req.session.useremail || null,

      navbarItemsLeft: isLoggedIn ? userNavbarItemsLeft : guestNavbarItemsLeft,
      navbarItemsRight: isLoggedIn
        ? userNavbarItemsRight
        : guestNavbarItemsRight,
    },
    (err, html) => {
      if (err) {
        console.error("Sablon renderelési hiba: ", err);
        res.status(500).send("Hiba a sablon renderelésekor.");
      } else {
        clearSessionMessages(req, res, () => {});
        res.send(html);
      }
    }
  );
});

module.exports = router;
