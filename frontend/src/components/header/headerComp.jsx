import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className="flex items-center  bg-gray-800 justify-between px-10 py-2">
       <Image
        src="/logo.png"
        alt="NIT Hamirpur Logo"
        width={450}
        height={800}
        />
        <p className=" text-white font-semibold text-2xl">
            Campus Venue Booking System
        </p>
    </div>

  )
}

export default Header