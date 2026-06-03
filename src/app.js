const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const showtimeRoutes = require("./routes/showtime");
const reservationRoutes = require("./routes/reservation");
const adminRoutes = require("./routes/admin");

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/showtimes", showtimeRoutes);
app.use("/reservations", reservationRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Server works");
});



module.exports = app;