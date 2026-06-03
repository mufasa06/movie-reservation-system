const pool = require("../config/db");

const getAllReservations = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.id AS reservation_id,
                u.name AS user_name,
                m.title AS movie,
                h.name AS hall,
                st.start_time,
                r.status,

                ARRAY_AGG(
                    s.row_name || s.seat_number
                ) AS seats

            FROM reservations r

            JOIN users u
                ON r.user_id = u.id

            JOIN showtimes st
                ON r.showtime_id = st.id

            JOIN movies m
                ON st.movie_id = m.id

            JOIN halls h
                ON st.hall_id = h.id

            JOIN reservation_seats rs
                ON r.id = rs.reservation_id

            JOIN seats s
                ON rs.seat_id = s.id

            GROUP BY
                r.id,
                u.name,
                m.title,
                h.name,
                st.start_time,
                r.status

            ORDER BY st.start_time;
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getRevenueReport = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(DISTINCT r.id) AS total_reservations,

                COUNT(rs.seat_id) AS tickets_sold,

                COALESCE(
                    SUM(st.price),
                    0
                ) AS total_revenue

            FROM reservations r

            JOIN reservation_seats rs
                ON r.id = rs.reservation_id

            JOIN showtimes st
                ON r.showtime_id = st.id

            WHERE r.status = 'booked'
        `);

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getAllReservations,
    getRevenueReport
};