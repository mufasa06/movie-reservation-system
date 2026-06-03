const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/admin");

const {
  register,
  login
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Protected Route",
        user: req.user
    });
});

router.get(
    "/admin-test",
    authenticate,
    authorizeAdmin,
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });
    }
);

// PLACE THIS AT THE ABSOLUTE END
module.exports = router;