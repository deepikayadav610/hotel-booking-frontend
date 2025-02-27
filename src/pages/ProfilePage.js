import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const [user, setUser] = useState(null);
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
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, [navigate]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">User Profile</h1>

            {user && (
                <div className="border p-4 rounded-lg shadow-md mt-4">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <button
                        onClick={() => navigate("/edit-profile", { state: { user } })}
                        className="bg-blue-500 text-white p-2 mt-4 w-full"
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
