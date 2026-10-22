const express = require("express");
const mysql = require("mysql2");

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "00DkxDkx##",
    database: "hotel_management"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed!");
        console.log(err);
        return;
    }

    console.log("MySQL connected successfully!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));


// =========================
// GUEST API
// =========================

// Get all guests
app.get("/api/guests", (req, res) => {

    const sql = "SELECT * FROM Guest ORDER BY Guest_ID DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to fetch guests"
            });
        }

        res.json(results);
    });
});


// Add guest
app.post("/api/guests", (req, res) => {

    const {
        name,
        email,
        pmail,
        phone,
        address
    } = req.body;

    const sql = `
        INSERT INTO Guest
        (Name, Email, Pmail, Phone, Address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, pmail, phone, address],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Failed to add guest"
                });
            }

            res.json({
                message: "Guest added successfully!",
                guest_id: result.insertId
            });
        }
    );
});


// Delete guest
app.delete("/api/guests/:id", (req, res) => {

    const guestId = req.params.id;

    const sql = `
        DELETE FROM Guest
        WHERE Guest_ID = ?
    `;

    db.query(sql, [guestId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to delete guest"
            });
        }

        res.json({
            message: "Guest deleted successfully!"
        });
    });
});


// =========================
// ROOM API
// =========================

// Get all rooms
app.get("/api/rooms", (req, res) => {

    const sql = `
        SELECT *
        FROM Room
        ORDER BY Room_ID ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch rooms"
            });
        }

        res.json(results);
    });
});


// Add room
app.post("/api/rooms", (req, res) => {

    const {
        room_type,
        price,
        status,
        floor_no
    } = req.body;

    const sql = `
        INSERT INTO Room
        (Room_Type, Price, Status, Floor_No)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [room_type, price, status, floor_no],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Failed to add room"
                });
            }

            res.json({
                message: "Room added successfully!",
                room_id: result.insertId
            });
        }
    );
});


// Delete room
app.delete("/api/rooms/:id", (req, res) => {

    const roomId = req.params.id;

    const sql = `
        DELETE FROM Room
        WHERE Room_ID = ?
    `;

    db.query(sql, [roomId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to delete room"
            });
        }

        res.json({
            message: "Room deleted successfully!"
        });
    });
});
// =========================
// RESERVATION API
// =========================


// Get all reservations

app.get("/api/reservations", (req, res) => {

    const sql = `
        SELECT
            r.Reservation_ID,
            r.Guest_ID,
            g.Name AS Guest_Name,
            r.Room_ID,
            rm.Room_Type,
            rm.Price,
            r.Check_In_Date,
            r.Check_Out_Date,
            r.Status,
            r.Total_Amount

        FROM Reservation r

        INNER JOIN Guest g
            ON r.Guest_ID = g.Guest_ID

        INNER JOIN Room rm
            ON r.Room_ID = rm.Room_ID

        ORDER BY r.Reservation_ID DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch reservations"
            });

        }

        res.json(results);

    });

});


// Get guests for reservation form

app.get("/api/reservation-guests", (req, res) => {

    const sql = `
        SELECT
            Guest_ID,
            Name
        FROM Guest
        ORDER BY Name
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch guests"
            });

        }

        res.json(results);

    });

});


// Get rooms for reservation form

app.get("/api/reservation-rooms", (req, res) => {

    const sql = `
        SELECT
            Room_ID,
            Room_Type,
            Price,
            Status

        FROM Room

        WHERE Status = 'Available'

        ORDER BY Room_ID
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to fetch rooms"
            });

        }

        res.json(results);

    });

});


// Add reservation

app.post("/api/reservations", (req, res) => {

    const {
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        status,
        total_amount
    } = req.body;


    const sql = `
        INSERT INTO Reservation
        (
            Guest_ID,
            Room_ID,
            Check_In_Date,
            Check_Out_Date,
            Status,
            Total_Amount
        )

        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            guest_id,
            room_id,
            check_in_date,
            check_out_date,
            status,
            total_amount
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Failed to add reservation"
                });

            }


            res.json({

                message:
                    "Reservation added successfully!",

                reservation_id:
                    result.insertId

            });

        }
    );

});


// Delete reservation

app.delete(
    "/api/reservations/:id",
    (req, res) => {

        const reservationId =
            req.params.id;


        const sql = `
            DELETE FROM Reservation
            WHERE Reservation_ID = ?
        `;


        db.query(
            sql,
            [reservationId],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        error:
                            "Failed to delete reservation"
                    });

                }


                res.json({

                    message:
                        "Reservation deleted successfully!"

                });

            }
        );

    }
);

// =========================
// EMPLOYEE API
// =========================


// Get all employees

app.get("/api/employees", (req, res) => {

    const sql = `
        SELECT
            e.Employee_ID,
            e.Name,
            e.Phone,
            e.Email,
            e.Role,
            e.Salary,
            e.Department_ID,
            d.Department_Name

        FROM Employee e

        LEFT JOIN Department d
            ON e.Department_ID = d.Department_ID

        ORDER BY e.Employee_ID DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error:
                    "Failed to fetch employees"
            });

        }


        res.json(results);

    });

});


// Get departments

app.get("/api/employee-departments", (req, res) => {

    const sql = `
        SELECT
            Department_ID,
            Department_Name

        FROM Department

        ORDER BY Department_Name
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error:
                    "Failed to fetch departments"
            });

        }


        res.json(results);

    });

});


// Add employee

app.post("/api/employees", (req, res) => {

    const {
        name,
        phone,
        email,
        role,
        salary,
        department_id
    } = req.body;


    const sql = `
        INSERT INTO Employee
        (
            Name,
            Phone,
            Email,
            Role,
            Salary,
            Department_ID
        )

        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,

        [
            name,
            phone,
            email,
            role,
            salary,
            department_id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error:
                        "Failed to add employee"
                });

            }


            res.json({

                message:
                    "Employee added successfully!",

                employee_id:
                    result.insertId

            });

        }
    );

});


// Delete employee

app.delete(
    "/api/employees/:id",
    (req, res) => {

        const employeeId =
            req.params.id;


        const sql = `
            DELETE FROM Employee
            WHERE Employee_ID = ?
        `;


        db.query(
            sql,
            [employeeId],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        error:
                            "Failed to delete employee"
                    });

                }


                res.json({

                    message:
                        "Employee deleted successfully!"

                });

            }
        );

    }
);

// =========================
// PAYMENT API
// =========================


// Get all payments

app.get("/api/payments", (req, res) => {

    const sql = `

        SELECT

            p.Payment_ID,

            p.Booking_ID,

            b.Reservation_ID,

            g.Name AS Guest_Name,

            rm.Room_ID,

            rm.Room_Type,

            b.Total_Amount AS Booking_Amount,

            p.Amount AS Payment_Amount,

            p.Payment_Date,

            p.Method,

            p.Status

        FROM Payment p

        INNER JOIN Booking b
            ON p.Booking_ID = b.Booking_ID

        INNER JOIN Reservation r
            ON b.Reservation_ID =
               r.Reservation_ID

        INNER JOIN Guest g
            ON r.Guest_ID =
               g.Guest_ID

        INNER JOIN Room rm
            ON r.Room_ID =
               rm.Room_ID

        ORDER BY
            p.Payment_ID DESC

    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                error:
                    "Failed to fetch payments"

            });

        }


        res.json(results);

    });

});



// Get bookings for payment form

app.get("/api/payment-bookings", (req, res) => {

    const sql = `

        SELECT

            b.Booking_ID,

            b.Reservation_ID,

            b.Total_Amount,

            b.Status,

            g.Name AS Guest_Name,

            rm.Room_Type,

            rm.Room_ID

        FROM Booking b

        INNER JOIN Reservation r
            ON b.Reservation_ID =
               r.Reservation_ID

        INNER JOIN Guest g
            ON r.Guest_ID =
               g.Guest_ID

        INNER JOIN Room rm
            ON r.Room_ID =
               rm.Room_ID

        ORDER BY
            b.Booking_ID

    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                error:
                    "Failed to fetch bookings"

            });

        }


        res.json(results);

    });

});



// Add payment

app.post("/api/payments", (req, res) => {

    const {

        booking_id,
        amount,
        payment_date,
        method,
        status

    } = req.body;


    const sql = `

        INSERT INTO Payment

        (
            Booking_ID,
            Amount,
            Payment_Date,
            Method,
            Status
        )

        VALUES (?, ?, ?, ?, ?)

    `;


    db.query(

        sql,

        [
            booking_id,
            amount,
            payment_date,
            method,
            status
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    error:
                        "Failed to add payment"

                });

            }


            res.json({

                message:
                    "Payment added successfully!",

                payment_id:
                    result.insertId

            });

        }

    );

});



// Delete payment

app.delete(
    "/api/payments/:id",
    (req, res) => {

        const paymentId =
            req.params.id;


        const sql = `

            DELETE FROM Payment

            WHERE Payment_ID = ?

        `;


        db.query(

            sql,

            [paymentId],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({

                        error:
                            "Failed to delete payment"

                    });

                }


                res.json({

                    message:
                        "Payment deleted successfully!"

                });

            }

        );

    }
);

// ===============================
// POST-STAY CHARGES APIs
// ===============================

// Get payments that can be used for post-stay charges
app.get("/api/charge-payments", (req, res) => {
    const sql = `
        SELECT
            p.Payment_ID,
            p.Booking_ID,
            p.Amount,
            b.Total_Amount AS Booking_Amount,
            g.Name AS Guest_Name,
            r.Room_ID
        FROM Payment p
        JOIN Booking b
            ON p.Booking_ID = b.Booking_ID
        JOIN Reservation rv
            ON b.Reservation_ID = rv.Reservation_ID
        JOIN Guest g
            ON rv.Guest_ID = g.Guest_ID
        JOIN Room r
            ON rv.Room_ID = r.Room_ID
        ORDER BY p.Payment_ID
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to load payment information"
            });
        }

        res.json(results);
    });
});


// Get all post-stay charges
app.get("/api/post-stay-charges", (req, res) => {
    const sql = `
        SELECT
            c.Charge_ID,
            c.Payment_ID,
            p.Booking_ID,
            g.Name AS Guest_Name,
            r.Room_ID,
            c.Room_Damage,
            c.Missing_Item,
            c.Deep_Cleaning,
            (
                c.Room_Damage +
                c.Missing_Item +
                c.Deep_Cleaning
            ) AS Total_Charges
        FROM Post_Stay_Charges c
        JOIN Payment p
            ON c.Payment_ID = p.Payment_ID
        JOIN Booking b
            ON p.Booking_ID = b.Booking_ID
        JOIN Reservation rv
            ON b.Reservation_ID = rv.Reservation_ID
        JOIN Guest g
            ON rv.Guest_ID = g.Guest_ID
        JOIN Room r
            ON rv.Room_ID = r.Room_ID
        ORDER BY c.Charge_ID DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to load post-stay charges"
            });
        }

        res.json(results);
    });
});


// Add or update post-stay charges
app.post("/api/post-stay-charges", (req, res) => {
    const {
        Payment_ID,
        Room_Damage,
        Missing_Item,
        Deep_Cleaning
    } = req.body;

    const roomDamage = Number(Room_Damage) || 0;
    const missingItem = Number(Missing_Item) || 0;
    const deepCleaning = Number(Deep_Cleaning) || 0;

    const checkSql = `
        SELECT Charge_ID
        FROM Post_Stay_Charges
        WHERE Payment_ID = ?
    `;

    db.query(checkSql, [Payment_ID], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to check existing charges"
            });
        }

        // If charges already exist, update them
        if (results.length > 0) {

            const updateSql = `
                UPDATE Post_Stay_Charges
                SET
                    Room_Damage = ?,
                    Missing_Item = ?,
                    Deep_Cleaning = ?
                WHERE Payment_ID = ?
            `;

            db.query(
                updateSql,
                [
                    roomDamage,
                    missingItem,
                    deepCleaning,
                    Payment_ID
                ],
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: "Failed to update charges"
                        });
                    }

                    res.json({
                        message: "Post-stay charges updated successfully"
                    });
                }
            );

        } else {

            // Otherwise create a new charge record
            const insertSql = `
                INSERT INTO Post_Stay_Charges
                (
                    Payment_ID,
                    Room_Damage,
                    Missing_Item,
                    Deep_Cleaning
                )
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    Payment_ID,
                    roomDamage,
                    missingItem,
                    deepCleaning
                ],
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: "Failed to add charges"
                        });
                    }

                    res.json({
                        message: "Post-stay charges added successfully"
                    });
                }
            );
        }
    });
});


// Delete post-stay charges
app.delete("/api/post-stay-charges/:id", (req, res) => {
    const chargeId = req.params.id;

    const sql = `
        DELETE FROM Post_Stay_Charges
        WHERE Charge_ID = ?
    `;

    db.query(sql, [chargeId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Failed to delete charge"
            });
        }

        res.json({
            message: "Charge deleted successfully"
        });
    });
});

// ===============================
// CHECKOUT / FINAL BILL API
// ===============================

app.get("/api/checkout-data", (req, res) => {

    const sql = `
        SELECT
            b.Booking_ID,
            b.Status AS Booking_Status,
            b.Total_Amount AS Booking_Amount,

            g.Name AS Guest_Name,

            r.Room_ID,
            r.Room_Type,

            rv.Reservation_ID,
            rv.Check_In_Date,
            rv.Check_Out_Date,
            rv.Status AS Reservation_Status,

            COALESCE(
                (
                    SELECT SUM(p2.Amount)
                    FROM Payment p2
                    WHERE p2.Booking_ID = b.Booking_ID
                ),
                0
            ) AS Paid_Amount,

            COALESCE(
                (
                    SELECT SUM(
                        c2.Room_Damage +
                        c2.Missing_Item +
                        c2.Deep_Cleaning
                    )
                    FROM Post_Stay_Charges c2
                    JOIN Payment p3
                        ON c2.Payment_ID = p3.Payment_ID
                    WHERE p3.Booking_ID = b.Booking_ID
                ),
                0
            ) AS Extra_Charges

        FROM Booking b

        JOIN Reservation rv
            ON b.Reservation_ID = rv.Reservation_ID

        JOIN Guest g
            ON rv.Guest_ID = g.Guest_ID

        JOIN Room r
            ON rv.Room_ID = r.Room_ID

        ORDER BY b.Booking_ID DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to load checkout data"
            });
        }

        res.json(results);
    });
});


// Complete checkout
app.post("/api/checkout/:bookingId", (req, res) => {

    const bookingId = req.params.bookingId;

    const findSql = `
        SELECT
            b.Booking_ID,
            rv.Reservation_ID,
            rv.Room_ID
        FROM Booking b

        JOIN Reservation rv
            ON b.Reservation_ID = rv.Reservation_ID

        WHERE b.Booking_ID = ?
    `;

    db.query(findSql, [bookingId], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Failed to find booking"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                error: "Booking not found"
            });
        }

        const reservationId = results[0].Reservation_ID;
        const roomId = results[0].Room_ID;


        // Update booking
        const bookingSql = `
            UPDATE Booking
            SET Status = 'Completed'
            WHERE Booking_ID = ?
        `;

        db.query(bookingSql, [bookingId], (err) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Failed to complete booking"
                });
            }


            // Update reservation
            const reservationSql = `
                UPDATE Reservation
                SET Status = 'Completed'
                WHERE Reservation_ID = ?
            `;

            db.query(
                reservationSql,
                [reservationId],
                (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            error: "Failed to complete reservation"
                        });
                    }


                    // Make room available
                    const roomSql = `
                        UPDATE Room
                        SET Status = 'Available'
                        WHERE Room_ID = ?
                    `;

                    db.query(
                        roomSql,
                        [roomId],
                        (err) => {

                            if (err) {
                                console.log(err);

                                return res.status(500).json({
                                    error: "Failed to update room"
                                });
                            }

                            res.json({
                                message:
                                    "Checkout completed successfully"
                            });
                        }
                    );
                }
            );
        });
    });
});

// ==========================================
// STEP 14 - DASHBOARD STATISTICS
// ==========================================

app.get("/api/dashboard-stats", (req, res) => {

    const sql = `
        SELECT

            (SELECT COUNT(*)
             FROM Guest) AS Total_Guests,

            (SELECT COUNT(*)
             FROM Room) AS Total_Rooms,

            (SELECT COUNT(*)
             FROM Room
             WHERE Status = 'Available') AS Available_Rooms,

            (SELECT COUNT(*)
             FROM Room
             WHERE Status = 'Occupied') AS Occupied_Rooms,

            (SELECT COUNT(*)
             FROM Reservation) AS Total_Reservations,

            (SELECT COUNT(*)
             FROM Employee) AS Total_Employees,

            (SELECT COUNT(*)
             FROM Payment) AS Total_Payments,

            (SELECT COALESCE(SUM(Amount), 0)
             FROM Payment) AS Total_Revenue
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                error: "Failed to load dashboard statistics"
            });
        }

        res.json(results[0]);
    });
});

// =========================
// START SERVER
// =========================

// ==========================================
// STEP 16 - ADMIN LOGIN
// ==========================================

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });

    }

    const sql = `
        SELECT
            Admin_ID,
            Username,
            Name
        FROM Admin
        WHERE Username = ?
        AND Password = ?
    `;

    db.query(
        sql,
        [username, password],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (results.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });

            }

            res.json({
                success: true,
                message: "Login successful",
                admin: results[0]
            });

        }
    );

});

app.listen(3000, () => {

    console.log(
        "Server running at http://localhost:3000"
    );

});