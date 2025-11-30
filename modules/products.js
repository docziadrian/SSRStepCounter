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

  const productsQuery = "SELECT * FROM `products` ORDER BY `created_at` DESC";

  db.query(productsQuery, (err, products) => {
    if (err) {
      console.error("Adatbázis hiba: ", err);
      req.session.message = "Hiba történt a termékek lekérdezése során.";
      req.session.severity = "error";
      products = [];
    }

    const processedProducts = products.map(product => {
      let imageurls = product.imageurls;
      if (typeof imageurls === 'string') {
        try {
          imageurls = JSON.parse(imageurls);
        } catch (e) {
          imageurls = [imageurls];
        }
      }
      return {
        ...product,
        imageurls: imageurls || []
      };
    });

    const minPrice = processedProducts.length > 0 ? Math.min(...processedProducts.map(p => p.price)) : 0;
    const maxPrice = processedProducts.length > 0 ? Math.max(...processedProducts.map(p => p.price)) : 100000;
    const categories = [...new Set(processedProducts.map(p => p.category))];

    ejs.renderFile(
      "views/products/products.ejs",
      {
        error: req.session.message || null,
        user: req.session.username || null,
        useremail: req.session.useremail || null,
        products: processedProducts || [],
        minPrice: minPrice,
        maxPrice: maxPrice,
        categories: categories,
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

module.exports = router;
