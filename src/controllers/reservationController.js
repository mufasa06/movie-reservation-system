const pool = require("../config/db");

const createReservation = async (req, res) => {
    try {
        const { showtime_id, seat_ids } = req.body;

        const user_id = req.user.id;
console.log("Before bookedSeats query");

const bookedSeats = await pool.query(
    `
    SELECT rs.seat_id
    FROM reservation_seats rs
    JOIN reservations r
        ON rs.reservation_id = r.id
   WHERE r.showtime_id = $1
AND r.status = 'booked'
AND rs.seat_id = ANY($2::int[])
    `,
    [showtime_id, seat_ids]
);

console.log("After bookedSeats query");

if (bookedSeats.rows.length > 0) {
    return res.status(400).json({
        message: "One or more seats already booked",
        bookedSeats: bookedSeats.rows
    });
}

        const reservationResult = await pool.query(
            `
            INSERT INTO reservations
            (user_id, showtime_id)
            VALUES ($1, $2)
            RETURNING *
            `,
            [user_id, showtime_id]
        );

        const reservation = reservationResult.rows[0];

        for (const seatId of seat_ids) {
            await pool.query(
                `
                INSERT INTO reservation_seats
                (reservation_id, seat_id)
                VALUES ($1, $2)
                `,
                [reservation.id, seatId]
            );
        }

        res.status(201).json({
            message: "Reservation created",
            reservation
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyReservations = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `
            SELECT
                r.id AS reservation_id,
                m.title AS movie,
                h.name AS hall,
                st.start_time,
                ARRAY_AGG(
                    s.row_name || s.seat_number
                ) AS seats
            FROM reservations r

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

            WHERE r.user_id = $1
            AND r.status = 'booked'

            GROUP BY
                r.id,
                m.title,
                h.name,
                st.start_time

            ORDER BY st.start_time
            `,
            [user_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const cancelReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const user_id = req.user.id;

        const reservationResult = await pool.query(
            `
            SELECT
                r.id,
                r.user_id,
                r.status,
                st.start_time
            FROM reservations r
            JOIN showtimes st
                ON r.showtime_id = st.id
            WHERE r.id = $1
            `,
            [reservationId]
        );

        if (reservationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        const reservation = reservationResult.rows[0];

        if (reservation.user_id !== user_id) {
            return res.status(403).json({
                message: "Not your reservation"
            });
        }

        if (reservation.status === "cancelled") {
            return res.status(400).json({
                message: "Reservation already cancelled"
            });
        }

        if (new Date(reservation.start_time) < new Date()) {
            return res.status(400).json({
                message: "Cannot cancel past showtime"
            });
        }

        await pool.query(
            `
            UPDATE reservations
            SET status = 'cancelled'
            WHERE id = $1
            `,
            [reservationId]
        );

        res.json({
            message: "Reservation cancelled successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createReservation,
    getMyReservations,
    cancelReservation
};

