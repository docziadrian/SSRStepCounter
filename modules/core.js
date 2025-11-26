const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const db = require("./db");

router.get("/", (req, res) => {
  //Renderelje be az index.ejs fájlt
  ejs.renderFile(
    "views/index.ejs",
    { user: req.session.username || null },
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
