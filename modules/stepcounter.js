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
  // stepcounter route
  clearSessionMessages(req, res, () => {});
  const isLoggedIn = !!req.session.userid;

  const userquery = "SELECT * FROM `users` WHERE email = ?";
  const stepquery =
    "SELECT `date`, `steps` FROM `steps` WHERE steps.userid = ? ORDER BY `date` DESC";

  db.query(userquery, [req.session.useremail], (err, results) => {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a lekérdezés során.";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }

    const user = results[0];

    db.query(stepquery, [user.id], (err, results) => {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a lekérdezés során.";
        req.session.severity = "error";
        return res.redirect("/users/login");
      }

      const stepsData = results || [];

      //Renderelje be a stepcounter.ejs fájlt
      ejs.renderFile(
        "views/stepcounter/stepcounter.ejs",
        {
          error: req.session.message || null,
          user: req.session.username || null,
          useremail: req.session.useremail || null,
          stepsdata: stepsData,
          navbarItemsLeft: isLoggedIn
            ? userNavbarItemsLeft
            : guestNavbarItemsLeft,
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
  });
});

router.post("/view/new", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const { email, steps, date } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], function (err, results) {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a bejelentkezés során.";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }

    const user = results[0];

    // User muveletek...
    const userId = user.id;

    const createQuery =
      "INSERT INTO `steps`(`userid`, `date`, `steps`) VALUES (?,?,?)";
    db.query(createQuery, [userId, date, steps], function (err, results) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a lépés felvétele során során.";
        req.session.severity = "error";
        return res.redirect("/stepcounter/view");
      }

      // Sikeres adatfelvétel
      req.session.message = "Sikeres adatfelvétel!";
      req.session.severity = "success";

      res.redirect("/stepcounter/view");
    });
  });
});

module.exports = router;
