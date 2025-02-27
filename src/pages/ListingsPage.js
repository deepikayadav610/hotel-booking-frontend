import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ListingsPage() {
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const searchQuery = location.state?.searchQuery || "";

    useEffect(() => {
        axios.get("https://hotel-booking-backend-rikq.onrender.com/api/listings")
            .then((res) => {
                if (searchQuery) {
                    const filtered = res.data.filter((listing) =>
                        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        listing.address.city.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setListings(filtered);
                } else {
                    setListings(res.data);
                }
            })
            .catch((err) => console.error(err));
    }, [searchQuery]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Available Listings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.length > 0 ? (
                    listings.map((listing) => (
                        <div key={listing._id} className="border p-4 rounded-lg shadow-md">
                            <img
                                src={listing.images.length > 0 ? `https://hotel-booking-backend-rikq.onrender.com${listing.images[0]}` : "https://via.placeholder.com/300"}
                                alt={listing.name}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h2 className="text-xl font-bold mt-2">{listing.name}</h2>
                            <p className="text-gray-500">{listing.type}</p>
                            <p className="text-gray-600">{listing.address.city}, {listing.address.state}</p>
                            <p className="text-blue-600 font-bold">${listing.pricing} per night</p>
                            <button
                                onClick={() => navigate("/book", { state: { listing } })}
                                className="bg-green-500 text-white p-2 mt-2 w-full"
                            >
                                Book Now
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No listings found.</p>
                )}
            </div>
        </div>
    );
}

export default ListingsPage;
