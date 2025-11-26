const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const db = require("./db");
const bcrypt = require("bcrypt");

const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

// Bcryptes titkositas
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

function clearSessionMessages(req, res, next) {
  req.session.message = null;
  req.session.severity = null;
  next();
}

function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Hiba a kijelentkezés során: ", err);
      return res.status(500).send("Hiba történt a kijelentkezés során.");
    }
    res.redirect("/");
  });
}

// Kijelentkezés
router.get("/logout", (req, res) => {
  logoutUser(req, res);
});

router.get("/registration", (req, res) => {
  //Renderelje be a registration.ejs fájlt
  ejs.renderFile(
    "views/registration.ejs",
    { error: req.session.message || null, user: req.session.username || null },
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

router.get("/login", (req, res) => {
  //Renderelje be a login.ejs fájlt
  ejs.renderFile(
    "views/login.ejs",
    { error: req.session.message || null, user: req.session.username || null },
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

router.post("/login", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], function (err, results) {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a bejelentkezés során.";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }
    if (results.length === 0) {
      req.session.message = "Hibás email cím vagy jelszó.";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }
    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log("Password match: ", passwordMatch);
    console.log("DB pass: ", user.password);
    console.log("Input pass: ", password);
    if (!passwordMatch) {
      req.session.message = "Hibás jelszó.";
      req.session.severity = "error";
      return res.redirect("/users/login");
    }

    // Sikeres bejelentkezés
    req.session.message = "Sikeres bejelentkezés!";
    req.session.severity = "success";

    req.session.userid = user.id;
    req.session.username = user.name;
    req.session.useremail = user.email;

    res.redirect("/");
  });
});

router.post("/registration", (req, res) => {
  clearSessionMessages(req, res, () => {});
  const { username, email, password, passwordAgain } = req.body;

  if (!username || !email || !password) {
    req.session.message = "Kérlek, tölts ki minden mezőt.";
    req.session.severity = "error";
    return res.redirect("/users/registration");
  }

  if (password !== passwordAgain) {
    req.session.message = "A jelszavak nem egyeznek meg.";
    req.session.severity = "error";
    return res.redirect("/users/registration");
  }

  // Jelszó regex ellenorzes
  if (!passRegex.test(password)) {
    req.session.message =
      "A jelszónak legalább 6 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy betűt és egy számot.";
    req.session.severity = "error";
    return res.redirect("/users/registration");
  }

  // Ellenőrzés, hogy létezik-e már a felhasználó
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], function (err, results) {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a regisztráció során.";
      req.session.severity = "error";
      return res.redirect("/users/registration");
    }
    if (results.length > 0) {
      req.session.message = "Ez az email cím már regisztrálva van.";
      req.session.severity = "error";
      return res.redirect("/users/registration");
    }

    // Bcrypt jelszó hashelés hozzaadassa
    const hashedPassword = hashPassword(password);

    const insertQuery =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [username, email, hashedPassword], function (err) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a regisztráció során.";
        req.session.severity = "error";
        return res.redirect("/users/registration");
      }

      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        function (err, results) {
          if (err || results.length === 0) {
            console.error("Adatbázis hiba: ", err);
            req.session.message = "Hiba történt a regisztráció során.";
            req.session.severity = "error";
            return res.redirect("/users/registration");
          }

          const user = results[0];

          req.session.message = "Sikeres regisztráció!";
          req.session.severity = "success";
          req.session.userid = user.id;
          req.session.username = user.name;
          req.session.useremail = user.email;
          res.redirect("/");
        }
      );
    });
  });
});

router.get("/profile", (req, res) => {
  clearSessionMessages(req, res, () => {});
  if (!req.session.userid) {
    req.session.message = "Kérlek jelentkezz be a profil megtekintéséhez.";
    req.session.severity = "error";
    return res.redirect("/users/login");
  }

  const query = "SELECT id, name, email FROM users WHERE id = ?";
  db.query(query, [req.session.userid], function (err, results) {
    if (err || results.length === 0) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a profil betöltésekor.";
      return res.redirect("/");
    }

    const userData = results[0];

    ejs.renderFile(
      "views/profile.ejs",
      {
        user: req.session.username || null,
        userData: userData,
        error: req.session.message || null,
        success: req.session.success || null,
      },
      (err, html) => {
        if (err) {
          console.error("Sablon renderelési hiba: ", err);
          res.status(500).send("Hiba a sablon renderelésekor.");
        } else {
          req.session.message = null;
          req.session.success = null;
          res.send(html);
        }
      }
    );
  });
});

router.post("/profile/update", (req, res) => {
  if (!req.session.userid) {
    return res.redirect("/users/login");
  }

  const { name, email } = req.body;

  if (!name || !email) {
    req.session.message = "Kérlek töltsd ki az összes mezőt.";
    return res.redirect("/users/profile");
  }

  // Frissítő függvény
  const updateUserData = () => {
    const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(query, [name, email, req.session.userid], function (err) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt az adatok frissítésekor.";
        return res.redirect("/users/profile");
      }

      req.session.username = name;
      req.session.useremail = email;
      req.session.success = "Sikeres adatfrissítés!";
      res.redirect("/users/profile");
    });
  };

  // Ha van email változás, ellenőrizze hogy egyedi-e
  if (email !== req.session.useremail) {
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], function (err, results) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt az adatok frissítésekor.";
        return res.redirect("/users/profile");
      }
      if (results.length > 0) {
        req.session.error = "Ez az email cím már használatban van.";
        return res.redirect("/users/profile");
      }
      // Frissítse az adatokat
      updateUserData();
    });
  } else {
    // Ha nincs email változás, egyből frissítsen
    updateUserData();
  }
});

router.post("/profile/password", (req, res) => {
  if (!req.session.userid) {
    return res.redirect("/users/login");
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    req.session.message = "Kérlek töltsd ki az összes mezőt.";
    return res.redirect("/users/profile");
  }

  if (newPassword !== confirmPassword) {
    req.session.message = "Az új jelszavak nem egyeznek meg.";
    return res.redirect("/users/profile");
  }

  if (!passRegex.test(newPassword)) {
    req.session.message =
      "A jelszónak legalább 6 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy betűt és egy számot.";
    return res.redirect("/users/profile");
  }

  const query = "SELECT password FROM users WHERE id = ?";
  db.query(query, [req.session.userid], function (err, results) {
    if (err || results.length === 0) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a jelszó módosításakor.";
      return res.redirect("/users/profile");
    }

    const passwordMatch = bcrypt.compareSync(
      currentPassword,
      results[0].password
    );
    if (!passwordMatch) {
      req.session.message = "Hibás jelenlegi jelszó.";
      return res.redirect("/users/profile");
    }

    const hashedPassword = hashPassword(newPassword);
    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
    db.query(updateQuery, [hashedPassword, req.session.userid], function (err) {
      if (err) {
        console.error("Adatbázis hiba: ", err);
        req.session.message = "Hiba történt a jelszó módosításakor.";
        return res.redirect("/users/profile");
      }

      req.session.success = "Sikeres jelszó módosítás!";
      res.redirect("/users/profile");
    });
  });
});

module.exports = router;
