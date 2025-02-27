import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function BookingPage() {
    const location = useLocation();
    const { listing } = location.state || {}; // Get listing data passed from ListingsPage

    const [unitType, setUnitType] = useState(listing?.unitTypes?.[0] || "Standard");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [guests, setGuests] = useState(1);
    const navigate = useNavigate();

    const handleBooking = async () => {
        try {
            const token = localStorage.getItem("token");
            const totalPrice = listing.pricing * guests; // Adjust if pricing depends on unitType

            const res = await axios.post(
                "https://hotel-booking-backend-rikq.onrender.com/api/bookings",
                {
                    listingId: listing._id,
                    unitType,
                    checkInDate,
                    checkOutDate,
                    bookingTime,
                    totalPrice,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate("/booking-confirmation", { state: { booking: res.data } });
        } catch (err) {
            console.error("Booking error:", err);
            alert("Booking failed! Try again.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Book {listing?.name}</h1>

            {/* Unit Type Selection */}
            <label className="block mt-4">Unit Type:</label>
            <select
                className="border p-2 w-full"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
            >
                {listing?.unitTypes?.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>

            {/* Check-in Date */}
            <label className="block mt-4">Check-in Date:</label>
            <input
                type="date"
                className="border p-2 w-full"
                onChange={(e) => setCheckInDate(e.target.value)}
            />

            {/* Check-out Date */}
            <label className="block mt-4">Check-out Date:</label>
            <input
                type="date"
                className="border p-2 w-full"
                onChange={(e) => setCheckOutDate(e.target.value)}
            />

            {/* Booking Time */}
            <label className="block mt-4">Booking Time:</label>
            <input
                type="time"
                className="border p-2 w-full"
                onChange={(e) => setBookingTime(e.target.value)}
            />

            {/* Number of Guests */}
            <label className="block mt-4">Guests:</label>
            <input
                type="number"
                className="border p-2 w-full"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
            />

            {/* Total Price */}
            <p className="mt-4 text-lg">
                <strong>Total Price:</strong> ${listing?.pricing * guests}
            </p>

            {/* Confirm Booking Button */}
            <button
                onClick={handleBooking}
                className="bg-blue-500 text-white p-2 mt-4 w-full"
            >
                Confirm Booking
            </button>
        </div>
    );
}

export default BookingPage;
