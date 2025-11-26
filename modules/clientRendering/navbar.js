const guestNavbarItemsRight = [
  { name: "Regisztráció", link: "/users/registration" },
  { name: "Bejelentkezés", link: "/users/login" },
];

const guestNavbarItemsLeft = [];

const userNavbarItemsRight = [
  { name: "Profil", link: "/users/profile" },
  { name: "Kijelentkezés", link: "/users/logout" },
];

const userNavbarItemsLeft = [
  { name: "Lépésszámláló", link: "/stepcounter/view" },
  { name: "Edzésterveink", link: "/plans" },
];

module.exports = {
  guestNavbarItemsRight,
  guestNavbarItemsLeft,
  userNavbarItemsRight,
  userNavbarItemsLeft,
};
