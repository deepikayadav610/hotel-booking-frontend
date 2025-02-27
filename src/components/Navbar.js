import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the authentication token
        navigate("/login"); // Redirect to the login page
    };

    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">Hotel Booking</h1>
            <div className="space-x-4">
                <Link to="/" className="hover:text-gray-300">Home</Link>
                <Link to="/listings" className="hover:text-gray-300">Listings</Link>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded-md">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
