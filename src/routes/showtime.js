const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/admin");

const {
    createShowtime,
    getShowtimes,
    getShowtimeSeats
} = require("../controllers/showtimeController");

router.get("/", getShowtimes);

router.get("/:id/seats", getShowtimeSeats);

router.post(
    "/",
    authenticate,
    authorizeAdmin,
    createShowtime
);

module.exports = router;