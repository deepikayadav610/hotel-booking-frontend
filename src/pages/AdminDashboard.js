import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("All");
    const [bookingStatusFilter, setBookingStatusFilter] = useState("All");

    useEffect(() => {
        fetchUsers();
        fetchListings();
        fetchBookings();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://hotel-booking-backend-rikq.onrender.com/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchListings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://hotel-booking-backend-rikq.onrender.com/api/listings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setListings(res.data);
        } catch (err) {
            console.error("Error fetching listings:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://hotel-booking-backend-rikq.onrender.com/api/bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data);

            // Calculate Total Revenue from Confirmed Bookings
            const totalRevenue = res.data
                .filter(booking => booking.status === "Confirmed")
                .reduce((sum, booking) => sum + booking.totalPrice, 0);

            setRevenue(totalRevenue);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter Users Based on Role
    const filteredUsers = users.filter(user => {
        return (
            (userRoleFilter === "All" || user.role === userRoleFilter) &&
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    // Filter Bookings Based on Status
    const filteredBookings = bookings.filter(booking => {
        return (
            (bookingStatusFilter === "All" || booking.status === bookingStatusFilter) &&
            (booking.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.listing?.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Admin Dashboard</h1>

            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="mb-6 flex justify-center">
                        <input
                            type="text"
                            placeholder="Search Users, Listings, or Bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border p-2 rounded w-1/3"
                        />
                    </div>

                    {/* User Filters */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Users</h2>
                        <select
                            value={userRoleFilter}
                            onChange={(e) => setUserRoleFilter(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="All">All Roles</option>
                            <option value="Customer">Customer</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                        <table className="w-full border border-gray-300 text-center">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Email</th>
                                    <th className="border p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-100">
                                        <td className="border p-2">{user.name}</td>
                                        <td className="border p-2">{user.email}</td>
                                        <td className="border p-2">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Booking Filters */}
                    <div className="flex justify-between items-center mt-8 mb-4">
                        <h2 className="text-2xl font-bold">Bookings</h2>
                        <select
                            value={bookingStatusFilter}
                            onChange={(e) => setBookingStatusFilter(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Bookings Table */}
                    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                        <table className="w-full border border-gray-300 text-center">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="border p-2">Customer</th>
                                    <th className="border p-2">Listing</th>
                                    <th className="border p-2">Check-in</th>
                                    <th className="border p-2">Check-out</th>
                                    <th className="border p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(booking => (
                                    <tr key={booking._id} className="hover:bg-gray-100">
                                        <td className="border p-2">{booking.customer?.name}</td>
                                        <td className="border p-2">{booking.listing?.name}</td>
                                        <td className="border p-2">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                        <td className="border p-2">{booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}</td>
                                        <td className="border p-2">{booking.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
