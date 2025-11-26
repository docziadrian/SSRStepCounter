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

router.get("/", (req, res) => {
  // Majd ezt ird at!
  const isLoggedIn = !!req.session.userid;

  //Renderelje be az index.ejs fájlt
  ejs.renderFile(
    "views/index.ejs",
    {
      user: req.session.username || null,
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
        res.send(html);
      }
    }
  );
});

module.exports = router;
