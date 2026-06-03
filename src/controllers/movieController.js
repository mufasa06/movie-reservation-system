const pool = require("../config/db");

const createMovie = async (req, res) => {
    try {
        const {
            title,
            description,
            poster_url,
            genre_id,
            duration
        } = req.body;

        const result = await pool.query(
            `INSERT INTO movies
            (title, description, poster_url, genre_id, duration)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                title,
                description,
                poster_url,
                genre_id,
                duration
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



const getMovies = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                movies.id,
                movies.title,
                movies.description,
                movies.duration,
                movies.poster_url,
                genres.name AS genre
            FROM movies
            LEFT JOIN genres
            ON movies.genre_id = genres.id
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            poster_url,
            genre_id,
            duration
        } = req.body;

        const result = await pool.query(
            `
            UPDATE movies
            SET
                title = $1,
                description = $2,
                poster_url = $3,
                genre_id = $4,
                duration = $5
            WHERE id = $6
            RETURNING *
            `,
            [
                title,
                description,
                poster_url,
                genre_id,
                duration,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie updated successfully",
            movie: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM movies
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createMovie,
    getMovies,
    updateMovie,
    deleteMovie
};