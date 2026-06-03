const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/admin");

const {
    createMovie,
    getMovies,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

router.get("/", getMovies);

router.post(
    "/",
    authenticate,
    authorizeAdmin,
    createMovie
);

router.put(
    "/:id",
    authenticate,
    authorizeAdmin,
    updateMovie
);

router.delete(
    "/:id",
    authenticate,
    authorizeAdmin,
    deleteMovie
);

module.exports = router;