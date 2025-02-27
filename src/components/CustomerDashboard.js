import { useEffect, useState } from "react";
import axios from "axios";

function CustomerDashboard({ user }) {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://hotel-booking-backend-rikq.onrender.com/api/bookings", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(res.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://hotel-booking-backend-rikq.onrender.com/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove the cancelled booking from UI
            setBookings(bookings.filter((booking) => booking._id !== bookingId));
            alert("Booking cancelled successfully!");
        } catch (err) {
            console.error("Error cancelling booking:", err);
            alert("Failed to cancel booking.");
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Your Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-gray-600">No bookings yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="border p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">{booking.hotelName}</h3>
                            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                            <p>Guests: {booking.guests}</p>
                            <p className="text-blue-600 font-bold">${booking.totalPrice}</p>
                            <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="bg-red-500 text-white p-2 mt-2 w-full"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomerDashboard;
