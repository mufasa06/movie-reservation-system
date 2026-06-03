const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/admin");

const {
    getAllReservations,
    getRevenueReport
} = require("../controllers/adminController");

router.get(
    "/reservations",
    authenticate,
    authorizeAdmin,
    getAllReservations
);

router.get(
    "/revenue",
    authenticate,
    authorizeAdmin,
    getRevenueReport
);

module.exports = router;