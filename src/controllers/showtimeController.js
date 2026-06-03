const pool = require("../config/db");

const createShowtime = async (req, res) => {
    try {
        const {
            movie_id,
            hall_id,
            start_time,
            price
        } = req.body;

        const result = await pool.query(
            `INSERT INTO showtimes
            (movie_id, hall_id, start_time, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [movie_id, hall_id, start_time, price]
        );

        res.status(201).json({
            message: "Showtime created successfully",
            showtime: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



const getShowtimes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                s.id,
                m.title AS movie,
                h.name AS hall,
                s.start_time,
                s.price
            FROM showtimes s
            JOIN movies m ON s.movie_id = m.id
            JOIN halls h ON s.hall_id = h.id
            ORDER BY s.start_time
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



const getShowtimeSeats = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
           SELECT
        s.id,
        s.row_name,
        s.seat_number,

        CASE
            WHEN rs.seat_id IS NULL
            THEN true
            ELSE false
        END AS available

    FROM seats s

    JOIN showtimes st
        ON s.hall_id = st.hall_id

    LEFT JOIN (
        SELECT rs.seat_id, r.showtime_id
        FROM reservation_seats rs
        JOIN reservations r
            ON rs.reservation_id = r.id
        WHERE r.status = 'booked'
    ) rs
        ON s.id = rs.seat_id
        AND rs.showtime_id = st.id

    WHERE st.id = $1

    ORDER BY
        s.row_name,
        s.seat_number
    `,
            [id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createShowtime,
    getShowtimes,
    getShowtimeSeats
};