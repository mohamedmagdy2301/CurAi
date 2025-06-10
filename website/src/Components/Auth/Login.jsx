import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../assets/Login.jfif';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { CircleLoader } from 'react-spinners';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(150, "Username must be at most 150 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(150, "Password must be at most 150 characters"),
  });

  const handleSubmit = async (values) => {
    setisLoading(true);
    try {
      const response = await axios.post(
        'https://mostafa3mad.pythonanywhere.com/api/login/',
        values
      );
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("authChange")); // 🔥 تحديث الـ Navbar تلقائيًا
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.detail || "Login failed");
    } finally {
      setisLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validateSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full mx-4">
        <div className="hidden md:block md:w-1/2 relative">
          <img src={LoginImage} alt="Login" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center poppins">Login to Curai</h1>
          {error && (
            <p className="text-red-500 text-sm text-center py-2 mb-6 border-2 rounded-2xl">
              {error}
            </p>
          )}
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-6 poppins">
              By creating an account, you agree to the{' '}
              <a href="#" className="text-blue-500 hover:underline">
                terms of use
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-500 hover:underline">
                privacy policy
              </a>
              .
            </p>

            <button
              type="submit"
              className="w-full bg-[#c3c3c3] text-white py-3 px-4 rounded-lg font-semibold poppins hover:scale-105 transition-transform duration-300"
            >
              {isLoading ? <CircleLoader color="#ffffff" size={20} /> : 'Login'}
            </button>

            <p className="text-sm text-gray-600 mt-6 text-center poppins">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline poppins">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
