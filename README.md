# 🎬 Movie Reservation System

A backend movie ticket booking platform built with Node.js, Express.js, PostgreSQL, and JWT authentication.

The system allows users to browse movies, view showtimes, select seats, make reservations, and manage their bookings. Administrators can manage movies and showtimes, monitor reservations, and view revenue reports.

## Why I Built This

Most beginner backend projects focus on simple CRUD operations. This project was built to explore real-world business logic such as:

* Preventing double booking of seats
* Managing relationships between movies, halls, showtimes, seats, and reservations
* Implementing role-based access control
* Building reporting and analytics endpoints
* Designing a relational database schema

## Features

### User Features

* User registration and login
* JWT-based authentication
* Browse movies and showtimes
* View seat availability
* Reserve multiple seats
* View personal reservations
* Cancel reservations

### Admin Features

* Create, update, and delete movies
* Create showtimes
* View all reservations
* Generate revenue reports

### Reservation Logic

* Dynamic seat availability tracking
* Double-booking prevention
* Reservation status management
* Showtime-specific seat allocation

## Database Design

The application uses PostgreSQL with the following core entities:

```text
Users
Genres
Movies
Halls
Showtimes
Seats
Reservations
Reservation_Seats
```

### Entity Relationships

```text
Movie → Showtime → Hall
                  ↓
                Seats

User → Reservation → Reserved Seats
```

## Technical Highlights

### Authentication & Authorization

* JWT Authentication
* Password hashing using bcrypt
* Admin/User role separation
* Protected routes and middleware

### Database Concepts

* Foreign Keys
* Joins
* Aggregation Queries
* Relationship Mapping
* Revenue Reporting

### Business Logic

* Seat reservation workflow
* Reservation cancellation
* Availability tracking
* Revenue calculation
* Reservation reporting

## Sample Workflow

```text
Register
   ↓
Login
   ↓
Browse Movies
   ↓
Choose Showtime
   ↓
View Available Seats
   ↓
Reserve Seats
   ↓
View Reservations
   ↓
Cancel Reservation
```

## Tech Stack

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL

Authentication:

* JWT
* bcrypt

Tools:

* Postman
* Git
* GitHub

## Future Improvements

* React frontend
* Payment gateway integration
* Email notifications
* Docker support
* Swagger documentation
* PostgreSQL transactions for seat locking
* Cloud deployment

## Lessons Learned

This project helped me gain hands-on experience with:

* REST API development
* Authentication and authorization
* Database design
* SQL joins and aggregation
* Backend architecture
* Implementing business rules in real applications
* Building production-style APIs
