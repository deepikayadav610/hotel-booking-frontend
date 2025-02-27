import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VendorDashboard({ user }) {
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://hotel-booking-backend-rikq.onrender.com/api/listings/vendor", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setListings(res.data);
        } catch (err) {
            console.error("Error fetching listings:", err);
        }
    };

    const handleEditListing = (listing) => {
        navigate("/edit-listing", { state: { listing } });
    };

    const handleAddListing = () => {
        navigate("/add-listing");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Your Listings</h1>
                <button
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={handleAddListing}
                >
                    + Add Listing
                </button>
            </div>

            {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                        <div key={listing._id} className="border p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">{listing.name}</h3>
                            <p>{listing.description}</p>
                            <p className="text-blue-600 font-bold">${listing.pricing} per night</p>
                            <button
                                className="bg-yellow-500 text-white p-2 mt-2 w-full"
                                onClick={() => handleEditListing(listing)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center mt-4">No listings available. Start by adding one!</p>
            )}
        </div>
    );
}

export default VendorDashboard;
