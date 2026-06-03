const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token missing"
            });
        }

        const token = authHeader.split(" ")[1];

       const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "mysecretkey"
);

        req.user = decoded;

        next();

    }catch (error) {
    console.log(error.message);

    return res.status(401).json({
        message: "Invalid token"
    });
}
};

module.exports = authenticate;