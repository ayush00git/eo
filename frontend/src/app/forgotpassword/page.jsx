"use client"
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'



function Forgotpassword() {
const [email,setEmail] = React.useState('')
const [loading,setLoading]=useState(false);

const handleSubmit = async (e) => {
  setLoading(true)
    e.preventDefault()
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,{email})
    .then((res) => {
        console.log(res.data)
        toast.success('Password reset link sent to your email');
        setEmail('');
        setLoading(false)
    }
    )
    .catch((err) => {
        console.log(err)
        setLoading(false)
        if(err?.response?.data.error?.explanation) {
            toast.error(err?.response?.data.error?.explanation)
        }
        else{

          toast.error('Error sending password reset link');
        }
    });
}
  return (
    <div className='flex justify-center items-center bg-gray-50 py-36 h-screen'>
        <div className=' border-2  drop-shadow-xs px-16 py-10 bg-white rounded-xl flex flex-col justify-center h-fit  w-1/3 space-y-4'>
            <h1 className='text-3xl  font-bold text-center mb-10'>Forgot Password</h1>
            <div className='flex flex-col space-y-4'>
            <form className='flex flex-col space-y-4' onSubmit={handleSubmit} >
    
            <input type='text' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full p-2 border border-gray-300 rounded-md' />
            <button className='w-full p-2 bg-blue-500 text-white rounded-md' >{loading?<div className='mx-auto  animate-spin rounded-full h-4 w-2 my-1  border-b-2 border-white'></div>:"Send Reset Link"}</button>
            </form>
            <a href='/login' className='text-center text-blue-500 underline'>Login</a>
            
            </div>
        </div>
    </div>
  )
}

export default Forgotpassword