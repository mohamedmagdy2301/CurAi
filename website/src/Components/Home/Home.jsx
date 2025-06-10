import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import SearchBar from '../SearchBar/SearchBar';
import MainSection from '../MainSection/MainSection';
import Service from '../Service/Service';

import MostSearched from './../MostSearched/MostSearched';
import AboutSec from './../AboutSec/AboutSec';
import Feedback from './../Feedback/Feedback';
import { useNavigate } from 'react-router-dom';
import Specielities from './../Specielities/Specielities';

export default function Home() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const handleUserAction = (event) => {
  //     Swal.fire({
  //       title: 'Please singin ',
  //       icon: 'info',
  //       showCancelButton: true,
  //       confirmButtonText: ' Login',
  //       cancelButtonText: ' Register',
  //       allowOutsideClick: false
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         navigate('/login');
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         navigate('/register');
  //       }
  //     });
  //   };

  //   // إضافة الحدث على الصفحة كلها
  //   window.addEventListener('click', handleUserAction);

  //   // تنظيف الحدث عند مغادرة الصفحة
  //   return () => {
  //     window.removeEventListener('click', handleUserAction);
  //   };
  // }, [navigate]);

  return (
    <>
      <MainSection />
      <SearchBar />
      <Service />
      <Specielities />
      <MostSearched />
      <AboutSec />
      <Feedback />
    </>
  );
}
