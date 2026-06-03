const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");

const {
    createReservation,
    getMyReservations,
    cancelReservation
} = require("../controllers/reservationController");

router.post(
    "/",
    authenticate,
    createReservation
);

router.get(
    "/my",
    authenticate,
    getMyReservations
);

router.delete(
    "/:id",
    authenticate,
    cancelReservation
);

module.exports = router;