import React from 'react';
import { FaHeartbeat, FaCalendarCheck, FaLock } from 'react-icons/fa';

const features = [
  {
    icon: <FaHeartbeat className="text-4xl text-blue-600" />,
    title: "Search about your doctor’s name",
    linkText: "",
  },
  {
    icon: <FaHeartbeat className="text-4xl text-blue-600" />,
    title: "Find the suitable doctors for your disease",
    linkText: "Go to Chatbot →",
  },
  {
    icon: <FaCalendarCheck className="text-4xl text-blue-600" />,
    title: "Book an appointment easily",
    linkText: "Explore doctors →",
  },
  {
    icon: <FaLock className="text-4xl text-blue-600" />,
    title: "Flexibility in time and security in payments",
    linkText: "",
  },
];

const Service = () => {
  return (
    <div className='container mx-auto px-4 max-w-4xl mb-8'>
      <div className='m-5'>
        <h4 className='text-gray-600'>Service</h4>
        <h2 className='text-xl md:text-2xl font-bold text-gray-800 leading-tight'>
          Let us make going <br /> to the doctor 
          <span className='ms-2'
            style={{ 
              color: 'var(--main-color)', 
              borderBottom: '2px solid var(--main-color)', 
              display: 'inline-block' 
            }}
          >
            Easier
          </span>
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border rounded-2xl shadow-sm p-6 w-64 h-56 hover:shadow-lg transition-shadow duration-300"
            style={{ borderColor: 'var(--main-color)' }} 
          >
            <div className="flex mb-4">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100">
                {React.cloneElement(feature.icon, { color: 'var(--main-color)', size: '32px' })}
              </div>
            </div>
            <h3 className="text-gray-800 text-lg font-semibold mb-2">{feature.title}</h3>
            {feature.linkText && (
              <a href="#" className="text-blue-600 text-sm hover:underline transition-colors duration-300" style={{ color: 'var(--main-color)' }}>
                {feature.linkText}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
