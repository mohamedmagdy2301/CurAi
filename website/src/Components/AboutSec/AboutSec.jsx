import React from 'react';
import { FaHeart, FaUserMd, FaHospitalAlt } from 'react-icons/fa';
import Swal from 'sweetalert2'; // استيراد SweetAlert2
import imgsec from '../../assets/images/doc2.png';

export default function AboutSec() {
    const stats = [
        {
            icon: <FaHeart className="text-4xl text-blue-500" />,
            number: "5000+",
            description: "Happy Patients",
            bg: "bg-blue-50"
        },
        {
            icon: <FaUserMd className="text-4xl text-green-500" />,
            number: "700+",
            description: "Expert Doctors",
            bg: "bg-green-50"
        },
        {
            icon: <FaHospitalAlt className="text-4xl text-red-500" />,
            number: "200+",
            description: "Different Cities",
            bg: "bg-red-50"
        }
    ];

    // دالة التحقق من تسجيل الدخول
    const handleBookAppointment = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                title: "Unauthorized!",
                text: "You need to log in or register to book an appointment.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Login",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login"; // توجيه المستخدم إلى صفحة تسجيل الدخول
                }
            });
        } else {
            // هنا يمكنك تنفيذ عملية الحجز مباشرة بدون إظهار أي تنبيه
            console.log("Appointment booked successfully!");
        }
    };

    return (
        <>
            <div className='bg-blue-100 py-10'>
                {/* النص العلوي */}
                <div className="about-text text-center max-w-xl mx-auto py-8">
                    <h4 className="text-blue-600 text-lg font-semibold mb-2">About</h4>
                    <h2 className='text-3xl font-bold text-gray-800 mb-4'>Our States</h2>
                    <p className='text-gray-600 leading-relaxed'>
                        Lorem ipsum dolor sit amet consectetur. Morbi dolor eros non ullamcorper nunc sagittis. Faucibus tempus id quam ac nam luctus massa.
                    </p>
                </div>

                {/* الكروت */}
                <div className='flex flex-col md:flex-row justify-center items-center gap-6'>
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className={`w-64 p-6 rounded-2xl shadow-md text-center ${stat.bg} transition-transform duration-300 hover:scale-105`}
                        >
                            <div className="mb-4 flex justify-center">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800">{stat.number}</h3>
                            <p className="text-gray-600">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* قسم لماذا تختارنا */}
            <div className='container mx-auto px-8 lg:px-20'>
                <div className='flex flex-col md:flex-row items-center justify-between py-10 gap-8'>
                    {/* الجزء النصي */}
                    <div className="w-full md:w-6/12 space-y-4">
                        <h5 className='text-3xl font-bold text-gray-800 leading-tight'>
                            Why choose Us for all your medical appointments?
                        </h5>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-green-500">
                                    <i className="fa-solid fa-check text-xl"></i>
                                </span>
                                <span className="text-gray-600">Lorem ipsum dolor sit amet consectetur.</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-green-500">
                                    <i className="fa-solid fa-check text-xl"></i>
                                </span>
                                <span className="text-gray-600">Lorem ipsum dolor sit amet consectetur.</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-green-500">
                                    <i className="fa-solid fa-check text-xl"></i>
                                </span>
                                <span className="text-gray-600">Lorem ipsum dolor sit amet consectetur.</span>
                            </div>
                        </div>

                        {/* زر حجز الموعد مع التحقق من تسجيل الدخول */}
                        <button 
                            onClick={handleBookAppointment}
                            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Book Appointment
                        </button>
                    </div>

                    {/* الصورة */}
                    <div className="w-full md:w-5/12">
                        <img 
                            src={imgsec} 
                            alt="Why Choose Us" 
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
