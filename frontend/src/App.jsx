import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import Form from './Pages/Form'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import {ToastContainer} from 'react-toastify'
import axios from 'axios'
import CreateResume from './Pages/CreateResume'
import Profile from './Component/Profile'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
function App() {

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path='/' element = {<Home/>}></Route>
      <Route path='/register' element = {<Register/>}></Route>
      <Route path='/login' element = {<Login/>}></Route>
      <Route path='/dashboard' element = {<Dashboard/>}></Route>
      <Route path='/form/:id' element = {<Form/>}></Route>
      <Route path='/create-resume' element = {<CreateResume/>}></Route>
      <Route path='/profile' element = {<Profile/>}></Route>
    </Routes>

    </>
  )
}

export default App
