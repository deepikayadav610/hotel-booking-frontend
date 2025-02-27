import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [featuredListings, setFeaturedListings] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://hotel-booking-backend-rikq.onrender.com/api/listings")
            .then((res) => {
                // Select the first 4 listings as featured
                setFeaturedListings(res.data.slice(0, 4));
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/listings", { state: { searchQuery: search } });
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-96 flex flex-col items-center justify-center text-white"
                style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?hotel,resort')" }}>
                <h1 className="text-4xl text-black font-bold">Find Your Perfect Stay</h1>
                <p className="mt-2 text-black text-lg">Hotels & Restaurants at the Best Prices</p>
                <form onSubmit={handleSearch} className="mt-6 flex">
                    <input
                        type="text"
                        placeholder="Search by city or name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 text-black rounded-l-md border border-gray-300"
                    />
                    <button type="submit" className="bg-blue-500 px-4 text-white rounded-r-md">Search</button>
                </form>
            </div>

            {/* Featured Listings Section */}
            <div className="p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Featured Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredListings.map((listing) => (
                        <div key={listing._id} className="border p-4 rounded-lg shadow-md">
                            <img
                                src={listing.images.length > 0 ? `https://hotel-booking-backend-rikq.onrender.com${listing.images[0]}` : "https://via.placeholder.com/300"}
                                alt={listing.name}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h3 className="text-xl font-bold mt-2">{listing.name}</h3>
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
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-500 text-white text-center p-6 mt-8">
                <h2 className="text-2xl font-bold">Ready to Book Your Stay?</h2>
                <p className="mt-2">Explore the best hotels and restaurants in town.</p>
                <button
                    onClick={() => navigate("/listings")}
                    className="bg-white text-blue-500 px-4 py-2 mt-4 rounded-md"
                >
                    View Listings
                </button>
            </div>
        </div>
    );
}

export default HomePage;
