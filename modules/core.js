const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const db = require("./db");
const fs = require("fs");

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


router.get("/getPicture/:picture", (req, res) => {
  const picture = req.params.picture;
  console.log(picture);
  const picturePath = `./pictures/${picture}`;
  fs.readFile(picturePath, (err, data) => {
    if (err) {
      res.status(404).send("Nem található a kép.");
    } else {
      res.setHeader("Content-Type", "image/jpeg");
      res.send(data);
    }
  });
});

module.exports = router;
