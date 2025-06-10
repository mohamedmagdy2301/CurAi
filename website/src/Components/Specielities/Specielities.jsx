import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartbeat, faBrain, faUserMd, faTooth } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2"; // Import SweetAlert2

const Specializations = () => {
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpecializations = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("https://mostafa3mad.pythonanywhere.com/specializations/");
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const data = await response.json();
                setSpecializations(data);
            } catch {
                setError("Failed to fetch specializations. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSpecializations();
    }, []);

    const getSpecializationIcon = (name) => {
        const icons = {
            Cardiologist: faHeartbeat,
            Neurologist: faBrain,
            Dentist: faTooth,
            default: faUserMd,
        };

        return icons[name] || icons.default;
    };

    const handleBrowseClick = () => {
        const token = localStorage.getItem("token"); // Check if the user is logged in

        if (!token) {
            // If no token, show the login/register alert
            Swal.fire({
                title: "🔐 Login Required!",
                text: "Please log in or create an account to browse all specialists.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Register",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#28a745",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login"; // Redirect to login page
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.href = "/register"; // Redirect to register page
                }
            });
        } else {
            // If user is logged in, redirect to specialists page
            window.location.href = "/specialists";
        }
    };

    return (
        <div className="text-center p-8 bg-blue-50 my-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore the available medical fields</h2>

            {loading && <div className="text-blue-600 font-semibold">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {!loading && specializations.length > 0 && (
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    className="py-4"
                >
                    {specializations.map(({ id, name }) => (
                        <SwiperSlide key={id}>
                            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 text-left">
                                {/* Icon */}
                                <div className="bg-gray-100 p-3 rounded-full w-fit mb-4">
                                    <FontAwesomeIcon icon={getSpecializationIcon(name)} className="text-blue-600 text-3xl" />
                                </div>

                                {/* Text Content */}
                                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                                <p className="text-gray-600 text-sm mt-1">Specialist in {name} field.</p>

                                {/* Explore Button */}
                                <a href="#" className="flex items-center gap-1 text-blue-600 font-medium mt-3">
                                    Explore <span className="text-lg">→</span>
                                </a>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                onClick={handleBrowseClick}
            >
                Browse all Specialists
            </button>
        </div>
    );
};

export default Specializations;
