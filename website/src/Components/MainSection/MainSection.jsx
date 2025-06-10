import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth, faHeartPulse } from "@fortawesome/free-solid-svg-icons";
import img1 from "../../assets/images/6b2af7e7f21196b7430aa6476e73ab79.png";

const MainSection = () => {
  const [iconPositions, setIconPositions] = useState([
    { icon: faTooth, label: "Dental Service", style: "rotate(-10deg) translate(250px) rotate(40deg)" },
    { icon: faTooth, label: "Dental Service", style: "rotate(-70deg) translate(270px) rotate(90deg)" },
    { icon: faHeartPulse, label: "Heart Pulse", style: "rotate(-110deg) translate(250px) rotate(95deg)" },
    { icon: faHeartPulse, label: "Heart Pulse", style: "rotate(-170deg) translate(210px) rotate(160deg)" }
  ]);

  // تحديث أماكن الأيقونات عند تصغير الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIconPositions([
          { icon: faTooth, label: "Dental Service", style: "rotate(-30deg) translate(190px) rotate(40deg)" },
          { icon: faTooth, label: "Dental Service", style: "rotate(-60deg) translate(230px) rotate(90deg)" },
          { icon: faHeartPulse, label: "Heart Pulse", style: "rotate(-100deg) translate(210px) rotate(95deg)" },
          { icon: faHeartPulse, label: "Heart Pulse", style: "rotate(-140deg) translate(160px) rotate(160deg)" }
        ]);
      } else {
        setIconPositions([
          { icon: faTooth, label: "Dental Service", style: "rotate(-10deg) translate(250px) rotate(40deg)" },
          { icon: faTooth, label: "Dental Service", style: "rotate(-70deg) translate(270px) rotate(90deg)" },
          { icon: faHeartPulse, label: "Heart Pulse", style: "rotate(-110deg) translate(250px) rotate(95deg)" },
          { icon: faHeartPulse, label: "Heart Pulse", style: "rotate(-170deg) translate(210px) rotate(160deg)" }
        ]);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 py-8 md:px-16 md:py-12 mt-5">
      {/* قسم الصورة والإحصائيات */}
      <div className="w-full md:w-1/2 relative mb-4 md:mb-0">
        <img 
          className="rounded-lg relative z-10 w-full object-cover" 
          src={img1} 
          alt="Doctor" 
          width="600" 
          height="400" 
          loading="lazy" 
          decoding="async" 
        />

        {/* الدوائر والخلفيات */}
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-[300px] h-[330px] md:w-[450px] md:h-[470px] rounded-full border-2 md:border-4 border-dashed border-blue-700 absolute -top-12"></div>
          <div className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-gray-200 opacity-50 absolute -top-10 shadow-lg m-3"></div>
          <div className="w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full box opacity-50 absolute -top-1 shadow-md"></div>
          
          {/* الأيقونات المتغيرة */}
          {iconPositions.map((item, index) => (
            <div 
              key={index}
              className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 shadow-md"
              style={{ transform: `translate(-50%, -50%) ${item.style}` }}
              aria-label={item.label}
            >
              <FontAwesomeIcon icon={item.icon} size="lg" />
            </div>
          ))}
        </div>

        {/* صندوق الإحصائيات */}
        <div className="w-full box rounded-lg p-4 flex justify-around items-center text-white shadow-md">
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold">24/7</span>
            <p className="text-xs md:text-sm">Available appointments</p>
          </div>
          <div className="h-10 w-[2px] bg-white"></div>
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold">350+</span>
            <p className="text-xs md:text-sm">Doctors</p>
          </div>
          <div className="h-10 w-[2px] bg-white"></div>
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold">150k+</span>
            <p className="text-xs md:text-sm">Reservations</p>
          </div>
        </div>
      </div>

      {/* النصوص */}
      <div className="w-full md:w-1/2 text-center md:text-left ">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
          Find the right <span className="text-blue-700">doctor</span><br />
          from the comfort of your home 
        </h2>
        <p className="mt-2 md:mt-4 text-gray-600 text-sm md:text-base">
          Lorem ipsum dolor sit amet consectetur. Sem proin duis porttitor adipiscing massa pretium convallis viverra.
        </p>
      </div>
    </div>
  );
};

export default MainSection;
