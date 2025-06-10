import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userimg from "../../assets/images/user.jpg"; // صورة افتراضية

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userData, setUserData] = useState({ name: "Guest", profileImage: userimg });
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);

            if (token) {
                const storedUser = JSON.parse(localStorage.getItem("user.name")) || {};
                setUserData({
                    name: storedUser.username || "Guest",
                    profileImage: storedUser.profileImage || userimg,
                });
            } else {
                setUserData({ name: "Guest", profileImage: userimg });
            }
        };

        // 🔹 استماع لتغيرات تسجيل الدخول/الخروج
        window.addEventListener("authChange", handleAuthChange);
        
        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // window.dispatchEvent(new Event("authChange")); // 🔹 إجبار التحديث
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
            <div className="flex justify-between items-center py-2 px-4 md:px-8">
                <div className="text-xl md:text-2xl font-bold text-blue-700">Curai</div>

                <ul className="hidden md:flex space-x-4 md:space-x-8">
                    <li className="text-gray-700 hover:text-blue-700">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="text-gray-700 hover:text-blue-700">
                        <Link to="/find-doctor">Find a doctor</Link>
                    </li>
                    <li className="text-gray-700 hover:text-blue-700">
                        <Link to="/about">About</Link>
                    </li>
                </ul>

                <div className="hidden md:flex space-x-2 md:space-x-4 items-center">
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <img 
                                    src={userData.profileImage} 
                                    alt="User Avatar" 
                                    className="w-10 h-10 rounded-full border border-gray-300"
                                />
                                <span className="text-gray-700 font-medium">
                                    Welcome, {userData.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white rounded-full px-4 py-1 text-sm hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="border border-blue-600 text-blue-600 hover:text-white rounded-full px-3 md:px-4 py-1 text-sm bg-blue-100">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="bg-blue-600 text-white rounded-full px-3 md:px-4 py-1 text-sm hover:bg-blue-700">
                                    Register
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
