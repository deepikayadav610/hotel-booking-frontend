import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function EditProfilePage() {
    const location = useLocation();
    const { user } = location.state || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`https://hotel-booking-backend-rikq.onrender.com/api/auth/update`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Update failed!");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full mt-2"
                placeholder="Name"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full mt-2"
                placeholder="Email"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 w-full mt-2"
                placeholder="New Password (leave blank to keep current password)"
            />
            <button onClick={handleUpdate} className="bg-green-500 text-white p-2 mt-4 w-full">
                Save Changes
            </button>
        </div>
    );
}

export default EditProfilePage;
