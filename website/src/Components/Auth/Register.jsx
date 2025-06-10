import React, { useState } from 'react';
import registerImage from '../../assets/Register.jfif';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';


const Register = () => {
  
 
  const [isLoading , setisLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const navigate = useNavigate();

  const specializations = [
    { id: 2, name: "Allergist", doctor_count: 1 },
    { id: 3, name: "Andrologists", doctor_count: 0 },
    { id: 4, name: "Anesthesiologist", doctor_count: 0 },
    { id: 1, name: "Audiologist", doctor_count: 1 },
    { id: 5, name: "Cardiologist", doctor_count: 0 },
    { id: 7, name: "Dentist", doctor_count: 0 },
    { id: 8, name: "Gynecologist", doctor_count: 0 },
    { id: 9, name: "Internists", doctor_count: 0 },
    { id: 10, name: "Orthopedist", doctor_count: 0 },
    { id: 11, name: "Pediatrician", doctor_count: 0 },
  ];

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const userregex = /^[a-zA-Z0-9]+$/
  
  const validateScheme = yup.object({
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required')
      .max(150, 'Username must be 150 characters or fewer')
      .matches(userregex, 'Username must contain only letters and numbers without spaces'),
  
    first_name: yup
      .string()
      .max(150, 'First name must be 150 characters or fewer')
      .required('First name is required')
      .min(3, 'First name must be at least 3 characters'),
    last_name: yup
      .string()
      .max(150, 'Last name must be 150 characters or fewer')
      .required('Last name is required')
      .min(3, 'Last name must be at least 3 characters'),
    phone_number: yup
      .string()
      .required('Phone number is required')
      .matches(phoneRegex, 'Phone number is invalid'),
    email: yup
      .string()
      .email('Email is invalid')
      .required('Email is required'),
    age: yup
      .number()
      .required('Age is required')
      .min(12, 'Age must be at least 12'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(150, 'Password must be 150 characters or fewer'),
    password_confirm: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Password confirmation is required'),
    role: yup.string().required('Role is required'),
    gender: yup.string().required('Gender is required'),
    location: yup.string().nullable().when('role', {
      is: 'doctor',
      then: ()=> yup.string().required('Location is required'),
    }),
    specialization: yup.number().nullable().when('role', {
      is: 'doctor',
      then: ()=> yup.string().required('Specialization is required'),
    }),
    consultation_price: yup.number().nullable().when('role', {
      is: 'doctor',
      then: ()=> yup.number().required('Consultation price is required'),
    }),
  });

  const handleSubmit = async (values) => {
    setisLoading(true);
    setErrorMessage(null); // Reset error message
  
    // Remove doctor-specific fields if role is not 'doctor'
    if (values.role !== 'doctor') {
      delete values.location;
      delete values.specialization;
      delete values.consultation_price;
      delete values.is_approved;
    }
  
    try {
      console.log(values);
      const response = await axios.post(
        'https://mostafa3mad.pythonanywhere.com/api/register/',
        values
      );
      toast.success('Account created successfully! Please login to continue.');
      navigate('/login');
      console.log(response.data);
      setisLoading(false);
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      if (error.response && error.response.data) {
        // Extract the first error message from the response
        const errorKey = Object.keys(error.response.data)[0]; // e.g., "email"
        const errorMessage = error.response.data[errorKey][0]; // e.g., "user with this email already exists."
        setErrorMessage(errorMessage); // Set the error message in state
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.'); // Generic error message
      }
    } finally {
      setisLoading(false);
    }
  };
  

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      username: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      gender: '',
      email: '',
      age: '',
      password: '',
      password_confirm: '',
      role: '',
      location: '', 
      specialization: '', 
      consultation_price: '', 
      is_approved: false,
    },
    validationSchema: validateScheme,
    onSubmit: handleSubmit,
  });



  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center w-full max-w-5xl">
        <div className="flex flex-wrap bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Register Form */}
          <div className="w-full md:w-7/12 p-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 poppins">
                Create an account
              </h2>
              {errorMessage && (<p className='text-red-500 text-lg mb-5 text-center border-2 rounded-2xl py-2'>{errorMessage}</p>)}
              <form onSubmit={formik.handleSubmit}>
                {/* First Name */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                    name="first_name"
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                    name="last_name"
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
                  )}
                </div>

                {/* Username */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    name="username"
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 text-sm">{formik.errors.username}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    name="email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    name="password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password_confirm}
                    name="password_confirm"
                  />
                  {formik.touched.password_confirm && formik.errors.password_confirm && (
                    <div className="text-red-500 text-sm">{formik.errors.password_confirm}</div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone_number}
                    name="phone_number"
                  />
                  {formik.touched.phone_number && formik.errors.phone_number && (
                    <div className="text-red-500 text-sm">{formik.errors.phone_number}</div>
                  )}
                </div>

                {/* Age */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.age}
                    name="age"
                  />
                  {formik.touched.age && formik.errors.age && (
                    <div className="text-red-500 text-sm">{formik.errors.age}</div>
                  )}
                </div>

                {/* Gender */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="gender"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="text-red-500 text-sm">{formik.errors.gender}</div>
                  )}
                </div>

                {/* Role (Doctor/Patient) */}
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="role">
                    Role
                  </label>
                  <select
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="role"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    name="role"
                  >
                    <option value="">Select role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-500 text-sm">{formik.errors.role}</div>
                  )}
                </div>

                {/* Location (Conditional Rendering) */}
                {formik.values.role === 'doctor' && (
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="location">
                      Location
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      id="location"
                      type="text"
                      placeholder="Enter your location"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.location}
                      name="location"
                    />
                    {formik.touched.location && formik.errors.location && (
                      <div className="text-red-500 text-sm">{formik.errors.location}</div>
                    )}
                  </div>
                )}

                {/* Specialization (Conditional Rendering) */}
                {formik.values.role === 'doctor' && (
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="specialization">
                      Specialization
                    </label>
                    <select
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="specialization"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.specialization}
                    name="specialization"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((specialization) => (
                      <option key={specialization.id} value={specialization.id}>
                        {specialization.name}
                      </option>
                    ))}
                  </select>
                    {formik.touched.specialization && formik.errors.specialization && (
                      <div className="text-red-500 text-sm">{formik.errors.specialization}</div>
                    )}
                  </div>
                )}

                {/* Consultation Price (Conditional Rendering) */}
                {formik.values.role === 'doctor' && (
                  <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="consultationPrice">
                      Consultation Price
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      id="consultationPrice"
                      type="number"
                      placeholder="Enter consultation price"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.consultation_price}
                      name="consultation_price"
                    />
                    {formik.touched.consultation_price && formik.errors.consultation_price && (
                      <div className="text-red-500 text-sm">{formik.errors.consultation_price}</div>
                    )}
                  </div>
                )}

                {/* Terms and Conditions */}
                <p className="text-sm text-gray-600 mb-6 poppins">
                  By creating an account, you agree to the{' '}
                  <a href="" className="text-blue-500 hover:underline">
                    terms of use
                  </a>{' '}
                  and{' '}
                  <a href="" className="text-blue-500 hover:underline">
                    privacy policy
                  </a>
                  .
                </p>

                {/* Create Account Button */}
                <div className="flex items-center justify-between">
                  <button
                    className="w-full bg-[#c3c3c3] text-white font-bold py-3 px-4 rounded-lg poppins hover:scale-105 transition-transform duration-300"
                    type="submit"
                  >
                    {isLoading ? <>
                        <BeatLoader color="#ffffff" size={10} /> 
                      </> : 'Create Account'}
                  </button>
                </div>

                {/* Login Link */}
                <p className="mt-4 text-sm text-gray-600 text-center poppins">
                  Already have an account?{' '}
                  <Link to="/Login" className="text-blue-500 hover:underline">
                    Login Now
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block md:w-5/12 relative">
            <img
              src={registerImage}
              alt="Register"
              className="w-full h-full object-center rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;