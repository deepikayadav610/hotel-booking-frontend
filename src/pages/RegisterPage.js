import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Customer");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post("https://hotel-booking-backend-rikq.onrender.com/api/auth/register", { name, email, password, role });
            navigate("/login");
        } catch (err) {
            alert("Registration failed! Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <input className="border p-2 mb-2" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input className="border p-2 mb-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input className="border p-2 mb-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <select className="border p-2 mb-2" onChange={(e) => setRole(e.target.value)}>
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
            </select>
            <button onClick={handleRegister} className="bg-green-500 text-white p-2">Register</button>
        </div>
    );
}

export default RegisterPage;
