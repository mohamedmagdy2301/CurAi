import React from 'react';
import img1 from '../../assets/images/feedbackgirl.png';
import img2 from '../../assets/images/feedbackgirl3.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Phoneimg from'../../assets/images/phone.png';

export default function Feedback() {
    const feedbacks = [
        {
            name: "Jane Cooper",
            date: "12/4/17",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sem velit viverra amet faucibus. Lorem ipsum dolor sit amet.",
            image: img1
        },
        {
            name: "John Doe",
            date: "01/1/18",
            text: "Morbi dolor eros non ullamcorper nunc sagittis. Faucibus tempus id quam ac nam luctus massa.",
            image: img2
        },
        {
            name: "Emily Smith",
            date: "02/3/19",
            text: "Quisque euismod orci ut et lobortis. Suspendisse potenti. Fusce gravida lectus non felis ullamcorper.",
            image: img1
        }
    ];

    return (
        <>
            <div className='container mx-auto px-8 lg:px-20 py-20 bg-gray-200  my-10'>
                <div className='flex flex-col md:flex-row items-start justify-between'>
                    {/* النص الجانبي */}
                    <div className='w-full md:w-5/12 space-y-4'>
                        <h6 className='text-3xl font-bold text-gray-800 leading-tight'>
                            What <span className='text-blue-600'>Our patients’s</span><br/>
                            Saying About Us
                        </h6>
                        <p className='text-gray-600'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br/>
                            Sem velit viverra amet faucibus.
                        </p>

                        <div className='flex items-center gap-7 ms-28'>
                            <div className='relative'>
                                <img src={img1} alt="Reviewer" className='w-11 h-11 rounded-full object-cover border-2 border-white shadow-md '/>
                                <img src={img1} alt="Reviewer" className='w-11 h-11 rounded-full object-cover border-2 border-white shadow-md absolute top-0 -left-4'/>
                                <img src={img1} alt="Reviewer" className='w-11 h-11 rounded-full object-cover border-2 border-white shadow-md absolute top-0 -left-9'/>
                            </div>
                            <span className='text-gray-700'>100+ Reviews</span>
                        </div>
                    </div>

                    {/* الكروت الجانبية للتعليقات */}
                    <div className='w-full md:w-6/12  md:mt-0 relative translate-y-4 '>
                        <div className='relative '>
                            <div className='absolute inset-0 transform translate-x-8 translate-y-8 bg-white rounded-xl shadow-lg'></div>
                            <div className='absolute inset-0 transform translate-x-4 translate-y-4 bg-white rounded-xl shadow-md'></div>
                            <div className='relative bg-white rounded-xl shadow-xl p-6'>
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev'
                                    }}
                                    pagination={{ clickable: true }}
                                    className="rounded-xl "
                                >
                                    {feedbacks.map((feedback, index) => (
                                        <SwiperSlide key={index}>
                                            <div className=''>
                                                <div className='flex items-center gap-4'>
                                                    <img src={feedback.image} alt={feedback.name} className='w-11 h-11 rounded-full'/>
                                                    <div>
                                                        <h4 className='text-gray-800 font-semibold'>{feedback.name}</h4>
                                                        <p className='text-sm text-gray-500'>{feedback.date}</p>
                                                    </div>
                                                    <div className='ml-auto text-yellow-400'>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                                <p className='mt-4 text-gray-600 leading-relaxed'>
                                                    {feedback.text}
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                    {/* الأسهم خارج الكروت */}
                                    {/* <div className='swiper-button-next text-blue-600 text-2xl right-96'></div>
                                    <div className='swiper-button-prev text-blue-600 text-2xl left-[-30px]'></div> */}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


          {/* ================== Download Section ============================ */}
          <div className='bg-blue-100 py-12'>
  <div className='container mx-auto px-8 flex flex-col md:flex-row items-center justify-between'>
    
    {/* صور الهواتف */}
    <div className='relative w-full md:w-6/12'>
      <img 
        src={Phoneimg} 
        alt='phone' 
        className='w-4/12 mx-auto relative z-10'
      />
      <img 
        src={Phoneimg} 
        alt='phone' 
        className='w-4/12 absolute -top-10 left-10 opacity-90'
      />
    </div>

    {/* النص والأزرار */}
    <div className='w-full md:w-6/12 text-center md:text-left mt-8 md:mt-0 relative'>
      

      <h2 className='text-blue-600 text-3xl font-semibold mb-4'>Download the App</h2>
      <p className='text-gray-600 mb-6'>
        Get the best experience on your mobile device.
      </p>

      {/* أزرار المتاجر */}
      <div className='flex justify-center md:justify-start items-center gap-4'>
        <button className='bg-black text-white px-4 py-2 rounded flex items-center gap-2'>
          <i className='fab fa-google-play'></i> Google Play
        </button>
        <button className='bg-black text-white px-4 py-2 rounded flex items-center gap-2'>
          <i className='fab fa-apple'></i> App Store
        </button>
      </div>
    </div>

  </div>
</div>


        </>
    )
}
