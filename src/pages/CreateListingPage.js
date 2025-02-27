import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateListingPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: "Hotel",
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        contact: "",
        description: "",
        facilities: "",
        pricing: "",
        availability: true,
        images: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();

            // Convert structured address into an object
            const address = {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
            };

            // Append form data
            formDataToSend.append("type", formData.type);
            formDataToSend.append("name", formData.name);
            formDataToSend.append("address", JSON.stringify(address));
            formDataToSend.append("contact", formData.contact);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("facilities", formData.facilities);
            formDataToSend.append("pricing", formData.pricing);
            formDataToSend.append("availability", formData.availability);

            // Append images
            if (formData.images) {
                for (let i = 0; i < formData.images.length; i++) {
                    formDataToSend.append("images", formData.images[i]);
                }
            }

            await axios.post("https://hotel-booking-backend-rikq.onrender.com/api/listings", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Listing created successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating listing:", err);
            alert("Failed to create listing!");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Add New Listing</h1>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <select name="type" value={formData.type} onChange={handleChange} className="border p-2 w-full">
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                </select>

                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full" required />

                <h3 className="font-bold mt-2">Address</h3>
                <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" className="border p-2 w-full" required />
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2 w-full" required />
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border p-2 w-full" required />
                <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" className="border p-2 w-full" required />

                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="border p-2 w-full" required />

                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full"></textarea>

                <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} placeholder="Facilities (comma separated)" className="border p-2 w-full" />

                <input type="number" name="pricing" value={formData.pricing} onChange={handleChange} placeholder="Price per Night/Table" className="border p-2 w-full" required />

                <label className="flex items-center">
                    <input type="checkbox" name="availability" checked={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.checked })} className="mr-2" />
                    Available for Booking
                </label>

                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 w-full" />

                <button type="submit" className="bg-green-500 text-white p-2 w-full">Create Listing</button>
            </form>
        </div>
    );
}

export default CreateListingPage;
