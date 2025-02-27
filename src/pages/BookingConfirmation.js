import { Link, useLocation } from "react-router-dom";

function BookingConfirmation() {
    const location = useLocation();
    const { booking } = location.state || {}; // Get booking details from navigation state

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-green-500">Booking Confirmed! 🎉</h1>
            <p className="text-gray-600 mt-2">Thank you for booking with us.</p>

            {booking && (
                <div className="mt-4 border p-4 rounded-lg shadow-md w-96">
                    <h2 className="text-xl font-bold">{booking.hotelName}</h2>
                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Guests:</strong> {booking.guests}</p>
                    <p className="text-blue-600 font-bold"><strong>Total Price:</strong> ${booking.totalPrice}</p>
                </div>
            )}

            <Link to="/listings" className="mt-6 text-blue-500 underline">
                Back to Listings
            </Link>
        </div>
    );
}

export default BookingConfirmation;
