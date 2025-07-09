import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Home from './Pages/Home'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element = {<Home/>}></Route>
      <Route path='/dashboard' element = {<Dashboard/>}></Route>
    </Routes>

    </>
  )
}

export default App
