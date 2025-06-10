/*eslint-disable*/
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import Home from './Components/Home/Home.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'
import Login from './Components/Auth/Login.jsx'
import Register from './Components/Auth/Register.jsx'
import { Toaster } from 'react-hot-toast'

let routers = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }, 
      { path: '*', element: <NotFound /> }
    ]
  }
])

function App() {
  return (
    <>
      <RouterProvider router={routers} />
      <Toaster />
    </>
  )
}

export default App
