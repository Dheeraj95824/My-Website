// =========================
// GENERAL MESSAGE
// =========================

function showMessage(message) {
    alert(message);
}


// =========================
// GUEST MANAGEMENT
// =========================

async function loadGuests() {

    try {

        const response =
            await fetch("/api/guests");

        const guests =
            await response.json();

        const tableBody =
            document.getElementById("guestTableBody");

        if (!tableBody) return;

        tableBody.innerHTML = "";

        guests.forEach((guest) => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${guest.Guest_ID}</td>

                <td>${guest.Name}</td>

                <td>${guest.Email || ""}</td>

                <td>${guest.Phone || ""}</td>

                <td>${guest.Address || ""}</td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteGuest(${guest.Guest_ID})">

                        Delete

                    </button>

                </td>

            `;

            tableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Error loading guests:",
            error
        );

    }

}


const guestForm =
    document.getElementById("guestForm");


if (guestForm) {

    guestForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const guestData = {

                name:
                    document.getElementById("name").value,

                email:
                    document.getElementById("email").value,

                pmail:
                    document.getElementById("pmail").value,

                phone:
                    document.getElementById("phone").value,

                address:
                    document.getElementById("address").value

            };


            try {

                const response =
                    await fetch("/api/guests", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(guestData)

                    });


                const result =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Guest added successfully!"
                    );

                    guestForm.reset();

                    loadGuests();

                }

                else {

                    alert(
                        result.error ||
                        "Failed to add guest."
                    );

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Server connection error."
                );

            }

        }
    );

}


async function deleteGuest(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this guest?"
        );

    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                `/api/guests/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            alert(
                "Guest deleted successfully!"
            );

            loadGuests();

        }

        else {

            alert(
                result.error ||
                "Failed to delete guest."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );

    }

}


// =========================
// ROOM MANAGEMENT
// =========================


// Load rooms

async function loadRooms() {

    try {

        const response =
            await fetch("/api/rooms");


        const rooms =
            await response.json();


        const tableBody =
            document.getElementById(
                "roomTableBody"
            );


        if (!tableBody) return;


        tableBody.innerHTML = "";


        rooms.forEach((room) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${room.Room_ID}
                </td>

                <td>
                    ${room.Room_Type}
                </td>

                <td>
                    ₹${room.Price}
                </td>

                <td>
                    ${room.Status}
                </td>

                <td>
                    ${room.Floor_No}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteRoom(${room.Room_ID})">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Error loading rooms:",
            error
        );

    }

}


// Add room

const roomForm =
    document.getElementById("roomForm");


if (roomForm) {

    roomForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const roomData = {

                room_type:
                    document.getElementById(
                        "room_type"
                    ).value,

                price:
                    document.getElementById(
                        "price"
                    ).value,

                status:
                    document.getElementById(
                        "status"
                    ).value,

                floor_no:
                    document.getElementById(
                        "floor_no"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        "/api/rooms",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    roomData
                                )

                        }
                    );


                const result =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Room added successfully!"
                    );


                    roomForm.reset();


                    loadRooms();

                }

                else {

                    alert(
                        result.error ||
                        "Failed to add room."
                    );

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Server connection error."
                );

            }

        }
    );

}


// Delete room

async function deleteRoom(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this room?"
        );


    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                `/api/rooms/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            alert(
                "Room deleted successfully!"
            );

            loadRooms();

        }

        else {

            alert(
                result.error ||
                "Failed to delete room."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );

    }

}


// =========================
// LOAD DATA
// =========================

loadGuests();

loadRooms();

// =========================
// RESERVATION MANAGEMENT
// =========================


// Load guests into dropdown

async function loadReservationGuests() {

    try {

        const response =
            await fetch(
                "/api/reservation-guests"
            );

        const guests =
            await response.json();


        const guestSelect =
            document.getElementById(
                "guest_id"
            );


        if (!guestSelect) return;


        guestSelect.innerHTML = `
            <option value="">
                Select Guest
            </option>
        `;


        guests.forEach((guest) => {

            const option =
                document.createElement("option");


            option.value =
                guest.Guest_ID;


            option.textContent =
                `${guest.Name} (ID: ${guest.Guest_ID})`;


            guestSelect.appendChild(
                option
            );

        });

    }

    catch (error) {

        console.error(
            "Error loading guests:",
            error
        );

    }

}



// Load available rooms

async function loadReservationRooms() {

    try {

        const response =
            await fetch(
                "/api/reservation-rooms"
            );


        const rooms =
            await response.json();


        const roomSelect =
            document.getElementById(
                "room_id"
            );


        if (!roomSelect) return;


        roomSelect.innerHTML = `
            <option value="">
                Select Room
            </option>
        `;


        rooms.forEach((room) => {

            const option =
                document.createElement("option");


            option.value =
                room.Room_ID;


            option.dataset.price =
                room.Price;


            option.textContent =
                `Room ${room.Room_ID} - ${room.Room_Type} - ₹${room.Price}`;


            roomSelect.appendChild(
                option
            );

        });

    }

    catch (error) {

        console.error(
            "Error loading rooms:",
            error
        );

    }

}



// Calculate total amount

function calculateReservationTotal() {

    const roomSelect =
        document.getElementById(
            "room_id"
        );


    const checkIn =
        document.getElementById(
            "check_in_date"
        ).value;


    const checkOut =
        document.getElementById(
            "check_out_date"
        ).value;


    const totalField =
        document.getElementById(
            "total_amount"
        );


    if (
        !roomSelect ||
        !checkIn ||
        !checkOut
    ) {

        return;

    }


    const selectedOption =
        roomSelect.options[
            roomSelect.selectedIndex
        ];


    if (!selectedOption) return;


    const price =
        parseFloat(
            selectedOption.dataset.price
        );


    const startDate =
        new Date(checkIn);


    const endDate =
        new Date(checkOut);


    const timeDifference =
        endDate - startDate;


    const numberOfNights =
        timeDifference /
        (1000 * 60 * 60 * 24);


    if (
        numberOfNights <= 0 ||
        isNaN(numberOfNights) ||
        isNaN(price)
    ) {

        totalField.value = "";

        return;

    }


    const total =
        numberOfNights * price;


    totalField.value =
        total.toFixed(2);

}



// Room change

const reservationRoom =
    document.getElementById(
        "room_id"
    );


if (reservationRoom) {

    reservationRoom.addEventListener(
        "change",
        calculateReservationTotal
    );

}



// Date changes

const checkInDate =
    document.getElementById(
        "check_in_date"
    );


const checkOutDate =
    document.getElementById(
        "check_out_date"
    );


if (checkInDate) {

    checkInDate.addEventListener(
        "change",
        calculateReservationTotal
    );

}


if (checkOutDate) {

    checkOutDate.addEventListener(
        "change",
        calculateReservationTotal
    );

}



// Load reservations

async function loadReservations() {

    try {

        const response =
            await fetch(
                "/api/reservations"
            );


        const reservations =
            await response.json();


        const tableBody =
            document.getElementById(
                "reservationTableBody"
            );


        if (!tableBody) return;


        tableBody.innerHTML = "";


        reservations.forEach(
            (reservation) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${reservation.Reservation_ID}
                    </td>

                    <td>
                        ${reservation.Guest_Name}
                    </td>

                    <td>
                        Room ${reservation.Room_ID}
                        <br>
                        ${reservation.Room_Type}
                    </td>

                    <td>
                        ${formatDate(
                            reservation.Check_In_Date
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            reservation.Check_Out_Date
                        )}
                    </td>

                    <td>
                        ${reservation.Status}
                    </td>

                    <td>
                        ₹${reservation.Total_Amount}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteReservation(
                                ${reservation.Reservation_ID}
                            )">

                            Delete

                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading reservations:",
            error
        );

    }

}



// Format date

function formatDate(dateValue) {

    if (!dateValue) return "";

    return String(dateValue)
        .split("T")[0];

}



// Add reservation

const reservationForm =
    document.getElementById(
        "reservationForm"
    );


if (reservationForm) {

    reservationForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const reservationData = {

                guest_id:
                    document.getElementById(
                        "guest_id"
                    ).value,

                room_id:
                    document.getElementById(
                        "room_id"
                    ).value,

                check_in_date:
                    document.getElementById(
                        "check_in_date"
                    ).value,

                check_out_date:
                    document.getElementById(
                        "check_out_date"
                    ).value,

                status:
                    document.getElementById(
                        "reservation_status"
                    ).value,

                total_amount:
                    document.getElementById(
                        "total_amount"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        "/api/reservations",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    reservationData
                                )

                        }
                    );


                const result =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Reservation added successfully!"
                    );


                    reservationForm.reset();


                    document.getElementById(
                        "total_amount"
                    ).value = "";


                    loadReservations();


                    loadReservationRooms();

                }

                else {

                    alert(
                        result.error ||
                        "Failed to add reservation."
                    );

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Server connection error."
                );

            }

        }
    );

}



// Delete reservation

async function deleteReservation(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this reservation?"
        );


    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                `/api/reservations/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            alert(
                "Reservation deleted successfully!"
            );


            loadReservations();

        }

        else {

            alert(
                result.error ||
                "Failed to delete reservation."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );

    }

}



// Load reservation data

loadReservationGuests();

loadReservationRooms();

loadReservations();

// =========================
// EMPLOYEE MANAGEMENT
// =========================


// Load departments

async function loadEmployeeDepartments() {

    try {

        const response =
            await fetch(
                "/api/employee-departments"
            );


        const departments =
            await response.json();


        const departmentSelect =
            document.getElementById(
                "employee_department"
            );


        if (!departmentSelect) return;


        departmentSelect.innerHTML = `
            <option value="">
                Select Department
            </option>
        `;


        departments.forEach(
            (department) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    department.Department_ID;


                option.textContent =
                    department.Department_Name;


                departmentSelect.appendChild(
                    option
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading departments:",
            error
        );

    }

}



// Load employees

async function loadEmployees() {

    try {

        const response =
            await fetch(
                "/api/employees"
            );


        const employees =
            await response.json();


        const tableBody =
            document.getElementById(
                "employeeTableBody"
            );


        if (!tableBody) return;


        tableBody.innerHTML = "";


        employees.forEach(
            (employee) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${employee.Employee_ID}
                    </td>

                    <td>
                        ${employee.Name}
                    </td>

                    <td>
                        ${employee.Phone || ""}
                    </td>

                    <td>
                        ${employee.Email || ""}
                    </td>

                    <td>
                        ${employee.Role || ""}
                    </td>

                    <td>
                        ₹${employee.Salary || 0}
                    </td>

                    <td>
                        ${employee.Department_Name || ""}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteEmployee(
                                ${employee.Employee_ID}
                            )">

                            Delete

                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading employees:",
            error
        );

    }

}



// Add employee

const employeeForm =
    document.getElementById(
        "employeeForm"
    );


if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const employeeData = {

                name:
                    document.getElementById(
                        "employee_name"
                    ).value,

                phone:
                    document.getElementById(
                        "employee_phone"
                    ).value,

                email:
                    document.getElementById(
                        "employee_email"
                    ).value,

                role:
                    document.getElementById(
                        "employee_role"
                    ).value,

                salary:
                    document.getElementById(
                        "employee_salary"
                    ).value,

                department_id:
                    document.getElementById(
                        "employee_department"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        "/api/employees",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    employeeData
                                )

                        }
                    );


                const result =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Employee added successfully!"
                    );


                    employeeForm.reset();


                    loadEmployees();

                }

                else {

                    alert(
                        result.error ||
                        "Failed to add employee."
                    );

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Server connection error."
                );

            }

        }
    );

}



// Delete employee

async function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                `/api/employees/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            alert(
                "Employee deleted successfully!"
            );


            loadEmployees();

        }

        else {

            alert(
                result.error ||
                "Failed to delete employee."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );

    }

}



// Load employee data

loadEmployeeDepartments();

loadEmployees();

// =========================
// PAYMENT MANAGEMENT
// =========================


// Load bookings

async function loadPaymentBookings() {

    try {

        const response =
            await fetch(
                "/api/payment-bookings"
            );


        const bookings =
            await response.json();


        const bookingSelect =
            document.getElementById(
                "payment_booking"
            );


        if (!bookingSelect) return;


        bookingSelect.innerHTML = `

            <option value="">
                Select Booking
            </option>

        `;


        bookings.forEach(
            (booking) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    booking.Booking_ID;


                option.dataset.amount =
                    booking.Total_Amount;


                option.textContent =

                    `Booking ${booking.Booking_ID}
                     - ${booking.Guest_Name}
                     - Room ${booking.Room_ID}
                     - ₹${booking.Total_Amount}`;


                bookingSelect.appendChild(
                    option
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading bookings:",
            error
        );

    }

}



// Automatically fill booking amount

const paymentBooking =
    document.getElementById(
        "payment_booking"
    );


if (paymentBooking) {

    paymentBooking.addEventListener(
        "change",
        function() {

            const selectedOption =
                paymentBooking.options[
                    paymentBooking.selectedIndex
                ];


            const amount =
                selectedOption.dataset.amount;


            const amountField =
                document.getElementById(
                    "payment_amount"
                );


            if (amount) {

                amountField.value =
                    parseFloat(
                        amount
                    ).toFixed(2);

            }

        }
    );

}



// Load payments

async function loadPayments() {

    try {

        const response =
            await fetch(
                "/api/payments"
            );


        const payments =
            await response.json();


        const tableBody =
            document.getElementById(
                "paymentTableBody"
            );


        if (!tableBody) return;


        tableBody.innerHTML = "";


        payments.forEach(
            (payment) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${payment.Payment_ID}
                    </td>

                    <td>
                        ${payment.Booking_ID}
                    </td>

                    <td>
                        ${payment.Guest_Name}
                    </td>

                    <td>
                        Room ${payment.Room_ID}
                        <br>
                        ${payment.Room_Type}
                    </td>

                    <td>
                        ₹${payment.Booking_Amount}
                    </td>

                    <td>
                        ₹${payment.Payment_Amount}
                    </td>

                    <td>
                        ${formatDate(
                            payment.Payment_Date
                        )}
                    </td>

                    <td>
                        ${payment.Method}
                    </td>

                    <td>
                        ${payment.Status}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deletePayment(
                                ${payment.Payment_ID}
                            )">

                            Delete

                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading payments:",
            error
        );

    }

}



// Add payment

const paymentForm =
    document.getElementById(
        "paymentForm"
    );


if (paymentForm) {

    paymentForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const paymentData = {

                booking_id:
                    document.getElementById(
                        "payment_booking"
                    ).value,

                amount:
                    document.getElementById(
                        "payment_amount"
                    ).value,

                payment_date:
                    document.getElementById(
                        "payment_date"
                    ).value,

                method:
                    document.getElementById(
                        "payment_method"
                    ).value,

                status:
                    document.getElementById(
                        "payment_status"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        "/api/payments",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    paymentData
                                )

                        }
                    );


                const result =
                    await response.json();


                if (response.ok) {

                    alert(
                        "Payment added successfully!"
                    );


                    paymentForm.reset();


                    loadPayments();


                    loadPaymentBookings();

                }

                else {

                    alert(
                        result.error ||
                        "Failed to add payment."
                    );

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Server connection error."
                );

            }

        }
    );

}



// Delete payment

async function deletePayment(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this payment?"
        );


    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                `/api/payments/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            alert(
                "Payment deleted successfully!"
            );


            loadPayments();

        }

        else {

            alert(
                result.error ||
                "Failed to delete payment."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );

    }

}



// Load payment data

loadPaymentBookings();

loadPayments();

// ==========================================
// STEP 12 - POST-STAY CHARGES
// ==========================================

async function loadChargePayments() {

    const select = document.getElementById("charge_payment_id");

    if (!select) return;

    try {

        const response =
            await fetch("/api/charge-payments");

        const payments =
            await response.json();

        select.innerHTML =
            '<option value="">Select Payment</option>';

        payments.forEach(payment => {

            const option =
                document.createElement("option");

            option.value = payment.Payment_ID;

            option.textContent =
                `Payment ${payment.Payment_ID} - ` +
                `Booking ${payment.Booking_ID} - ` +
                `${payment.Guest_Name} - ` +
                `Room ${payment.Room_ID} - ` +
                `₹${payment.Amount}`;

            select.appendChild(option);
        });

    } catch (error) {

        console.error(
            "Error loading charge payments:",
            error
        );
    }
}


async function loadPostStayCharges() {

    const tableBody =
        document.getElementById("chargeTableBody");

    if (!tableBody) return;

    try {

        const response =
            await fetch("/api/post-stay-charges");

        const charges =
            await response.json();

        tableBody.innerHTML = "";

        charges.forEach(charge => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${charge.Charge_ID}</td>

                <td>${charge.Payment_ID}</td>

                <td>${charge.Booking_ID}</td>

                <td>${charge.Guest_Name}</td>

                <td>${charge.Room_ID}</td>

                <td>₹${charge.Room_Damage}</td>

                <td>₹${charge.Missing_Item}</td>

                <td>₹${charge.Deep_Cleaning}</td>

                <td>₹${charge.Total_Charges}</td>

                <td>

                    <button
                        onclick="deletePostStayCharge(${charge.Charge_ID})">
                        Delete
                    </button>

                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Error loading post-stay charges:",
            error
        );
    }
}


// Add / update post-stay charge
const chargeForm =
    document.getElementById("chargeForm");

if (chargeForm) {

    chargeForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const data = {

                Payment_ID:
                    document.getElementById(
                        "charge_payment_id"
                    ).value,

                Room_Damage:
                    document.getElementById(
                        "room_damage"
                    ).value,

                Missing_Item:
                    document.getElementById(
                        "missing_item"
                    ).value,

                Deep_Cleaning:
                    document.getElementById(
                        "deep_cleaning"
                    ).value
            };


            try {

                const response =
                    await fetch(
                        "/api/post-stay-charges",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );

                const result =
                    await response.json();


                document.getElementById(
                    "chargeMessage"
                ).textContent =
                    result.message ||
                    result.error;


                chargeForm.reset();


                loadChargePayments();

                loadPostStayCharges();

                loadCheckoutData();

            } catch (error) {

                console.error(error);

                document.getElementById(
                    "chargeMessage"
                ).textContent =
                    "Error adding charges.";
            }
        }
    );
}


// Delete post-stay charge
async function deletePostStayCharge(id) {

    if (!confirm(
        "Are you sure you want to delete this charge?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/post-stay-charges/${id}`,
                {
                    method: "DELETE"
                }
            );

        const result =
            await response.json();


        alert(
            result.message ||
            result.error
        );


        loadPostStayCharges();

        loadCheckoutData();

    } catch (error) {

        console.error(error);

        alert(
            "Error deleting charge."
        );
    }
}

// ==========================================
// STEP 12 - CHECKOUT
// ==========================================

async function loadCheckoutData() {

    const tableBody =
        document.getElementById(
            "checkoutTableBody"
        );

    if (!tableBody) return;


    try {

        const response =
            await fetch("/api/checkout-data");

        const bookings =
            await response.json();

        tableBody.innerHTML = "";


        bookings.forEach(booking => {

            const bookingAmount =
                Number(
                    booking.Booking_Amount
                ) || 0;

            const paidAmount =
                Number(
                    booking.Paid_Amount
                ) || 0;

            const extraCharges =
                Number(
                    booking.Extra_Charges
                ) || 0;


            const grandTotal =
                bookingAmount +
                extraCharges;


            const balanceDue =
                grandTotal -
                paidAmount;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${booking.Booking_ID}
                </td>

                <td>
                    ${booking.Guest_Name}
                </td>

                <td>
                    Room ${booking.Room_ID}
                    (${booking.Room_Type})
                </td>

                <td>
                    ₹${bookingAmount.toFixed(2)}
                </td>

                <td>
                    ₹${paidAmount.toFixed(2)}
                </td>

                <td>
                    ₹${extraCharges.toFixed(2)}
                </td>

                <td>
                    ₹${grandTotal.toFixed(2)}
                </td>

                <td>
                    ₹${balanceDue.toFixed(2)}
                </td>

                <td>
                    ${booking.Booking_Status}
                </td>

                <td>

                    ${
                        booking.Booking_Status ===
                        "Completed"

                        ? "<span>Completed</span>"

                        : `
                            <button
                                onclick="completeCheckout(
                                    ${booking.Booking_ID}
                                )">
                                Checkout
                            </button>
                        `
                    }

                </td>
            `;


            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Error loading checkout data:",
            error
        );
    }
}


// Complete checkout
async function completeCheckout(
    bookingId
) {

    const confirmCheckout =
        confirm(
            "Are you sure you want to complete this checkout?"
        );


    if (!confirmCheckout) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/checkout/${bookingId}`,
                {
                    method: "POST"
                }
            );


        const result =
            await response.json();


        alert(
            result.message ||
            result.error
        );


        loadCheckoutData();

        loadPostStayCharges();

    } catch (error) {

        console.error(error);

        alert(
            "Error completing checkout."
        );
    }
}


// Load Step 12 data
loadChargePayments();
loadPostStayCharges();
loadCheckoutData();

// ==========================================
// STEP 14 - DASHBOARD STATISTICS
// ==========================================

async function loadDashboardStats() {

    const totalGuests =
        document.getElementById("totalGuests");

    if (!totalGuests) {
        return;
    }

    try {

        const response =
            await fetch("/api/dashboard-stats");

        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard data"
            );

        }

        const stats =
            await response.json();


        /* =========================
           BASIC STATISTICS
        ========================= */

        document.getElementById(
            "totalGuests"
        ).textContent =
            stats.Total_Guests;


        document.getElementById(
            "totalRooms"
        ).textContent =
            stats.Total_Rooms;


        document.getElementById(
            "availableRooms"
        ).textContent =
            stats.Available_Rooms;


        document.getElementById(
            "occupiedRooms"
        ).textContent =
            stats.Occupied_Rooms;


        document.getElementById(
            "totalReservations"
        ).textContent =
            stats.Total_Reservations;


        document.getElementById(
            "totalEmployees"
        ).textContent =
            stats.Total_Employees;


        document.getElementById(
            "totalPayments"
        ).textContent =
            stats.Total_Payments;


        document.getElementById(
            "totalRevenue"
        ).textContent =
            "₹" +
            Number(
                stats.Total_Revenue
            ).toFixed(2);


        /* =========================
           ROOM OCCUPANCY
        ========================= */

        let occupancy = 0;

        if (stats.Total_Rooms > 0) {

            occupancy =
                (
                    stats.Occupied_Rooms /
                    stats.Total_Rooms
                ) * 100;

        }


        const occupancyElement =
            document.getElementById(
                "occupancyPercentage"
            );


        if (occupancyElement) {

            occupancyElement.textContent =
                occupancy.toFixed(1) + "%";

        }


        /* =========================
           TODAY'S DATE
        ========================= */

        const todayDate =
            document.getElementById(
                "todayDate"
            );


        if (todayDate) {

            const today =
                new Date();

            todayDate.textContent =
                today.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );

        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}

loadDashboardStats();

// ==========================================
// STEP 15 - GUEST SEARCH
// ==========================================

const guestSearch = document.getElementById("guestSearch");

if (guestSearch) {

    guestSearch.addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#guestTableBody tr");

        rows.forEach(function (row) {

            const rowText =
                row.textContent.toLowerCase();

            if (rowText.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });
}
// ==========================================
// STEP 15 - ROOM SEARCH
// ==========================================

const roomSearch = document.getElementById("roomSearch");

if (roomSearch) {

    roomSearch.addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#roomTableBody tr");

        rows.forEach(function (row) {

            const rowText =
                row.textContent.toLowerCase();

            if (rowText.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });
}
// ==========================================
// STEP 15 - EMPLOYEE SEARCH
// ==========================================

const employeeSearch =
    document.getElementById("employeeSearch");

if (employeeSearch) {

    employeeSearch.addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#employeeTableBody tr");

        rows.forEach(function (row) {

            const rowText =
                row.textContent.toLowerCase();

            if (rowText.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });
}

// ==========================================
// STEP 15 - RESERVATION SEARCH
// ==========================================

const reservationSearch =
    document.getElementById("reservationSearch");

if (reservationSearch) {

    reservationSearch.addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#reservationTableBody tr");

        rows.forEach(function (row) {

            const rowText =
                row.textContent.toLowerCase();

            if (rowText.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });
}
// ==========================================
// STEP 15 - PAYMENT SEARCH
// ==========================================

const paymentSearch =
    document.getElementById("paymentSearch");

if (paymentSearch) {

    paymentSearch.addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#paymentTableBody tr");

        rows.forEach(function (row) {

            const rowText =
                row.textContent.toLowerCase();

            if (rowText.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });
}
// ==========================================
// STEP 16 - ADMIN LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document.getElementById("username").value;

            const password =
                document.getElementById("password").value;

            const loginMessage =
                document.getElementById("loginMessage");

            try {

                const response =
                    await fetch("/api/login", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })

                    });

                const data =
                    await response.json();

                if (data.success) {

                    localStorage.setItem(
                        "adminLoggedIn",
                        "true"
                    );

                    localStorage.setItem(
                        "adminName",
                        data.admin.Name
                    );

                    window.location.href =
                        "index.html";

                } else {

                    loginMessage.textContent =
                        data.message;

                    loginMessage.style.color =
                        "#dc2626";

                }

            } catch (error) {

                console.error(error);

                loginMessage.textContent =
                    "Unable to connect to server.";

                loginMessage.style.color =
                    "#dc2626";

            }

        }
    );

}
// ==========================================
// STEP 16 - LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "adminLoggedIn"
    );

    localStorage.removeItem(
        "adminName"
    );

    window.location.href =
        "login.html";
}
// ==========================================
// STEP 16 - DISPLAY ADMIN NAME
// ==========================================

const adminNameElement =
    document.getElementById("adminName");

if (adminNameElement) {

    const adminName =
        localStorage.getItem("adminName");

    adminNameElement.textContent =
        adminName || "Administrator";
}