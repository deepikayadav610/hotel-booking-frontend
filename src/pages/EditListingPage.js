import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function EditListingPage() {
    const location = useLocation();
    const { listing } = location.state || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: listing?.name || "",
        type: listing?.type || "Hotel",
        address: listing?.address || { street: "", city: "", state: "", zip: "" },
        contact: listing?.contact || "",
        description: listing?.description || "",
        facilities: listing?.facilities ? listing.facilities.join(", ") : "",
        pricing: listing?.pricing || "",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        setFormData({
            ...formData,
            address: { ...formData.address, [e.target.name]: e.target.value },
        });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "facilities") {
                    formDataToSend.append(key, formData[key].split(","));
                } else if (key === "address") {
                    Object.keys(formData.address).forEach((addrKey) => {
                        formDataToSend.append(`address[${addrKey}]`, formData.address[addrKey]);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (image) {
                formDataToSend.append("image", image);
            }

            await axios.put(`https://hotel-booking-backend-rikq.onrender.com/api/listings/${listing._id}`, formDataToSend, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            alert("Listing updated successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error updating listing:", err);
            alert("Update failed!");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Edit Listing</h1>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Name" />
            <select name="type" value={formData.type} onChange={handleChange} className="border p-2 w-full mt-2">
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurant</option>
            </select>

            <input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} className="border p-2 w-full mt-2" placeholder="Street" />
            <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} className="border p-2 w-full mt-2" placeholder="City" />
            <input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} className="border p-2 w-full mt-2" placeholder="State" />
            <input type="text" name="zip" value={formData.address.zip} onChange={handleAddressChange} className="border p-2 w-full mt-2" placeholder="ZIP Code" />

            <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Contact" />
            <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Facilities (comma-separated)" />
            <input type="number" name="pricing" value={formData.pricing} onChange={handleChange} className="border p-2 w-full mt-2" placeholder="Pricing" />
            <input type="file" onChange={handleFileChange} className="border p-2 w-full mt-2" />

            <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 mt-4 w-full">
                Save Changes
            </button>
        </div>
    );
}

export default EditListingPage;
