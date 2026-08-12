import React from 'react'

function Footer() {
  return (
    <div className="absolute z-100 bottom-0 min-h-10 w-full flex items-center bg-gray-800 justify-between px-10 py-2">
        <p className=" text-white text-center font-semibold text-xs px-10 py-3 mx-auto">
            Campus Venue Booking System &copy; 2025 NIT Hamirpur
        </p>
        <div className='absolute right-5 text-white text-sm'>
        {"Developed By "}  
        <a href='/credits' className='hover:text-blue-500 hover:cursor-pointer underline'>Developer Team NITH</a>
        </div>
        
    </div>
  )
}

export default Footer