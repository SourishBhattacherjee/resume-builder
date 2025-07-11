import React from 'react'
import { useState } from 'react'
const Register = () => {
  const [data,setData] = useState({
    fullName:'',
    email: '',
    password:''
  })

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <>
    <form>
      <label>Full Name:</label>
      <input 
      type = 'text'
      placeholder='please enter you full name'/>
      <label>Email:</label>
      <input 
      type = 'text'
      placeholder='please enter you email'/>
      <label>Password:</label>
      <input 
      type = 'text'
      placeholder='please enter you password'/>
      <button type='button' onClick={handleSubmit} className='bg-red-800 border-radius-10'>Sign Up</button>
    </form>
    </>
  )
}

export default Register