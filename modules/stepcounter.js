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
  const goalquery = "SELECT `daily_goal` FROM `step_goals` WHERE userid = ?";

  db.query(userquery, [req.session.useremail], (err, results) => {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a lekérdezés során.";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }

    const user = results[0];

    // Lépések lekérdezése
    db.query(stepquery, [user.id], (err, stepResults) => {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a lekérdezés során.";
        req.session.severity = "error";
        return res.redirect("/users/login");
      }

      const stepsData = stepResults || [];

      // Napi cél lekérdezése
      db.query(goalquery, [user.id], (err, goalResults) => {
        if (err) {
          console.error("Adatbázis hiba: ", err);
        }

        // Napi cél (alapértelmezett 10000, ha nincs beállítva)
        const dailyGoal =
          goalResults && goalResults.length > 0
            ? goalResults[0].daily_goal
            : 10000;

        // Számítások
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayString = `${year}-${month}-${day}`;

        const todaySteps = stepsData.find((s) => {
          const stepDate = new Date(s.date);
          const stepYear = stepDate.getUTCFullYear();
          const stepMonth = String(stepDate.getUTCMonth() + 1).padStart(2, "0");
          const stepDay = String(stepDate.getUTCDate()).padStart(2, "0");
          const stepDateString = `${stepYear}-${stepMonth}-${stepDay}`;
          return stepDateString === todayString;
        });
        const dailySteps = todaySteps ? todaySteps.steps : 0;

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoString = `${weekAgo.getFullYear()}-${String(
          weekAgo.getMonth() + 1
        ).padStart(2, "0")}-${String(weekAgo.getDate()).padStart(2, "0")}`;

        const weekSteps = stepsData.filter((s) => {
          const stepDate = new Date(s.date);
          const stepYear = stepDate.getUTCFullYear();
          const stepMonth = String(stepDate.getUTCMonth() + 1).padStart(2, "0");
          const stepDay = String(stepDate.getUTCDate()).padStart(2, "0");
          const stepDateString = `${stepYear}-${stepMonth}-${stepDay}`;
          return stepDateString >= weekAgoString;
        });

        const weeklyAverage =
          weekSteps.length > 0
            ? Math.round(
                weekSteps.reduce((sum, s) => sum + s.steps, 0) /
                  weekSteps.length
              )
            : 0;

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthStartString = `${monthStart.getFullYear()}-${String(
          monthStart.getMonth() + 1
        ).padStart(2, "0")}-01`;

        const monthSteps = stepsData.filter((s) => {
          const stepDate = new Date(s.date);
          const stepYear = stepDate.getUTCFullYear();
          const stepMonth = String(stepDate.getUTCMonth() + 1).padStart(2, "0");
          const stepDay = String(stepDate.getUTCDate()).padStart(2, "0");
          const stepDateString = `${stepYear}-${stepMonth}-${stepDay}`;
          return stepDateString >= monthStartString;
        });

        const monthlyTotal = monthSteps.reduce((sum, s) => sum + s.steps, 0);

        const dailyProgress = Math.min(
          Math.round((dailySteps / dailyGoal) * 100),
          100
        );

        ejs.renderFile(
          "views/stepcounter/stepcounter.ejs",
          {
            error: req.session.message || null,
            user: req.session.username || null,
            useremail: req.session.useremail || null,
            stepsdata: stepsData,
            dailySteps: dailySteps,
            weeklyAverage: weeklyAverage,
            monthlyTotal: monthlyTotal,
            dailyGoal: dailyGoal,
            dailyProgress: dailyProgress,
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
    const userId = user.id;

    // Ellenőrizzük, hogy létezik-e már aznapi bejegyzés
    const checkQuery =
      "SELECT * FROM `steps` WHERE `userid` = ? AND `date` = ?";
    db.query(checkQuery, [userId, date], function (err, existingSteps) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt az ellenőrzés során.";
        req.session.severity = "error";
        return res.redirect("/stepcounter/view");
      }

      if (existingSteps.length > 0) {
        // Frissítés, ha már létezik
        const updateQuery =
          "UPDATE `steps` SET `steps` = ? WHERE `userid` = ? AND `date` = ?";
        db.query(updateQuery, [steps, userId, date], function (err, results) {
          if (err) {
            console.error("Adatbázis hiba: ", err);
            req.session.message = "Hiba történt a lépés frissítése során.";
            req.session.severity = "error";
            return res.redirect("/stepcounter/view");
          }

          req.session.message = "Sikeres adatfrissítés!";
          req.session.severity = "success";
          res.redirect("/stepcounter/view");
        });
      } else {
        // Új bejegyzés létrehozása
        const createQuery =
          "INSERT INTO `steps`(`userid`, `date`, `steps`) VALUES (?,?,?)";
        db.query(createQuery, [userId, date, steps], function (err, results) {
          if (err) {
            console.error("Adatbázis hiba: ", err);
            req.session.message = "Hiba történt a lépés felvétele során.";
            req.session.severity = "error";
            return res.redirect("/stepcounter/view");
          }

          req.session.message = "Sikeres adatfelvétel!";
          req.session.severity = "success";
          res.redirect("/stepcounter/view");
        });
      }
    });
  });
});

// Napi cél beállítása route
router.post("/goal", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const { dailyGoal } = req.body;
  const userEmail = req.session.useremail;

  if (!dailyGoal || parseInt(dailyGoal) < 1000) {
    req.session.message = "A napi cél legalább 1000 lépés kell legyen!";
    req.session.severity = "error";
    return res.redirect("/stepcounter/view");
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [userEmail], function (err, results) {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a felhasználó lekérdezése során.";
      req.session.severity = "error";
      return res.redirect("/stepcounter/view");
    }

    if (!results || results.length === 0) {
      req.session.message = "Felhasználó nem található!";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }

    const user = results[0];
    const userId = user.id;

    // Ellenőrizzük, hogy van-e már cél beállítva
    const checkQuery = "SELECT * FROM `step_goals` WHERE `userid` = ?";
    db.query(checkQuery, [userId], function (err, existingGoals) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a cél ellenőrzése során.";
        req.session.severity = "error";
        return res.redirect("/stepcounter/view");
      }

      if (existingGoals.length > 0) {
        // Frissítés, ha már létezik
        const updateQuery =
          "UPDATE `step_goals` SET `daily_goal` = ?, `updated_at` = NOW() WHERE `userid` = ?";
        db.query(updateQuery, [dailyGoal, userId], function (err, results) {
          if (err) {
            console.error("Adatbázis hiba: ", err);
            req.session.message = "Hiba történt a cél frissítése során.";
            req.session.severity = "error";
            return res.redirect("/stepcounter/view");
          }

          req.session.message = "Napi cél sikeresen frissítve!";
          req.session.severity = "success";
          res.redirect("/stepcounter/view");
        });
      } else {
        // Új cél létrehozása
        const createQuery =
          "INSERT INTO `step_goals`(`userid`, `daily_goal`, `created_at`, `updated_at`) VALUES (?, ?, NOW(), NOW())";
        db.query(createQuery, [userId, dailyGoal], function (err, results) {
          if (err) {
            console.error("Adatbázis hiba: ", err);
            req.session.message = "Hiba történt a cél létrehozása során.";
            req.session.severity = "error";
            return res.redirect("/stepcounter/view");
          }

          req.session.message = "Napi cél sikeresen beállítva!";
          req.session.severity = "success";
          res.redirect("/stepcounter/view");
        });
      }
    });
  });
});

router.post("/view/edit", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const { email, steps, date, originalDate } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], function (err, results) {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a szerkesztés során.";
      req.session.severity = "error";
      return res.redirect("/stepcounter/view");
    }

    const user = results[0];
    const userId = user.id;

    const updateQuery =
      "UPDATE `steps` SET `steps` = ?, `date` = ? WHERE `userid` = ? AND `date` = ?";
    db.query(
      updateQuery,
      [steps, date, userId, originalDate],
      function (err, results) {
        if (err) {
          console.error("Adatbázis hiba: ", err);
          req.session.message = "Hiba történt a szerkesztés során.";
          req.session.severity = "error";
          return res.redirect("/stepcounter/view");
        }

        req.session.message = "Sikeres szerkesztés!";
        req.session.severity = "success";
        res.redirect("/stepcounter/view");
      }
    );
  });
});

// Törlés route
router.post("/view/delete", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const { email, date } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], function (err, results) {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a törlés során.";
      req.session.severity = "error";
      return res.redirect("/stepcounter/view");
    }

    const user = results[0];
    const userId = user.id;

    const deleteQuery = "DELETE FROM `steps` WHERE `userid` = ? AND `date` = ?";
    db.query(deleteQuery, [userId, date], function (err, results) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a törlés során.";
        req.session.severity = "error";
        return res.redirect("/stepcounter/view");
      }

      req.session.message = "Sikeres törlés!";
      req.session.severity = "success";
      res.redirect("/stepcounter/view");
    });
  });
});

module.exports = router;
