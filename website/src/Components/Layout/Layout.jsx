import React from 'react'
import style from './Layout.module.css'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'
import NestedNavbar from '../NestedNavbar/NestedNavbar.jsx'

export default function Layout() {

	return <>

		<NestedNavbar/>

		<div className=" mt-4 py-12 ">

			<Outlet></Outlet>
		</div>
		<Footer />


	</>
}
