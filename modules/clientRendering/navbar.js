const guestNavbarItemsRight = [
  { name: "Regisztráció", link: "/users/registration" },
  { name: "Bejelentkezés", link: "/users/login" },
];

const guestNavbarItemsLeft = [];

const userNavbarItemsRight = [
  { name: "Kosár", link: "/cart", type: "cart" },
  { name: "Profil", link: "/users/profile" },
  { name: "Kijelentkezés", link: "/users/logout" },
];

const userNavbarItemsLeft = [
  { name: "Lépésszámláló", link: "/stepcounter/view" },
  { name: "Edzésterv", link: "/plans/view" },
  { name: "Termékeink", link: "/products/view" },
];

module.exports = {
  guestNavbarItemsRight,
  guestNavbarItemsLeft,
  userNavbarItemsRight,
  userNavbarItemsLeft,
};
