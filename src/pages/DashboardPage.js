import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios.get("https://hotel-booking-backend-rikq.onrender.com/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setUser(res.data);

                if (res.data.role === "Customer") {
                    fetchBookings(token);
                }
            })
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, [navigate]);

    // Fetch Customer's Bookings
    const fetchBookings = async (token) => {
        try {
            const res = await axios.get("https://hotel-booking-backend-rikq.onrender.com/api/bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    if (!user) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-gray-600 text-lg">Role: {user.role}</p>
            <p className="text-gray-600 text-lg">Email: {user.email}</p>

            {/* Display Customer's Bookings */}
            {user.role === "Customer" && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">Your Booking History</h2>
                    {bookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="border p-4 rounded-lg shadow-md">
                                    <h3 className="text-lg font-bold">{booking.listing?.name}</h3>
                                    {booking.checkInDate && (
                                        <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                                    )}
                                    {booking.checkOutDate && (
                                        <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                                    )}
                                    {booking.bookingTime && <p>Time: {booking.bookingTime}</p>}
                                    <p className="text-blue-600 font-bold">Total Price: ${booking.totalPrice}</p>
                                    <p>Status:
                                        <span className={`font-bold ${booking.status === "Cancelled" ? "text-red-500" : "text-green-500"}`}>
                                            {booking.status}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-4">
                            <p className="text-gray-600">No bookings yet.</p>
                            <button
                                onClick={() => navigate("/listings")}
                                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md"
                            >
                                Book Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Display "Create Listing" for Vendors */}
            {user.role === "Vendor" && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">Manage Your Listings</h2>
                    <p className="text-gray-600">You can add and manage your listings.</p>
                    <button
                        onClick={() => navigate("/create-listing")}
                        className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md"
                    >
                        + Create Listing
                    </button>
                </div>
            )}

            {/* Display Admin Panel Access */}
            {user.role === "Admin" && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-red-600">Admin Access</h2>
                    <p className="text-gray-600">You have full control over users and listings.</p>
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="bg-red-500 text-white px-4 py-2 mt-4 rounded-md"
                    >
                        Go to Admin Panel
                    </button>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
