"use client";
import { Sidebar, Calendar, SquareCheck, LayoutList,LogOut, LayoutDashboard } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

const navItems = [
  {
    title: 'Dashboard ', path: '/dashboard'
    , logo: <LayoutDashboard />,
  },

  {
    title: 'Booking Status',
    path: '/bookingstatus',
    logo: <SquareCheck />,
  },
  {
    title: 'Book Venue',
    path: '/bookvenue',
    logo: <Calendar />,
  },

  {
    title: 'Venue List',
    path: '/venues',
    logo: <LayoutList />,
  },
  ,

]

function SilderbarAdmin({isopen, setIsopen}) {
  const pathname = usePathname()
  const [hover, setHover] = useState(false)
 
  

const handletoggle=()=>{
  setIsopen((prev)=>!prev)
};
const handlehover=()=>{
  if(!isopen){
    setHover((prev)=>!prev);
  }

}
const handleLogout=()=>{
  localStorage.removeItem('xccess-token');
  window.location.href='/'
}

  return (
 
    
  
    <div className={`bg-white z-100  justify-between pb-20 text-gray-500 ${isopen?'w-1/7':'w-fit'} h-screen text-lg  drop-shadow-2xl`}>
      <div className=" px-5 py-10 ">
        <ul className='space-y-6 '>
        <div className='p-2'>
          <Sidebar  className='' onClick={handletoggle}/>
          </div>
          {navItems.map((item, index) => (
            <li className='h-15' key={index}>
              <Link href={item.path}>
              <div className={`flex items-center hover:text-blue-800   p-2 rounded-lg ${item.path.endsWith(pathname) ? 'text-blue-800' : ''}`}>
                <div className={"mr-2 "} onMouseEnter={handlehover} onMouseLeave={handlehover} >
                  {item.logo}
                </div>
                <div className={`font-semibold text-sm    ${hover||isopen?"block":"hidden"} ${hover?"absolute text-nowrap bg-white p-2 rounded-xl   border-2 left-20":"relative"}`}>
                  {item.title}
                </div>
              </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='items-center justify-start px-5 pb-20 flex'>
        <LogOut className='ml-2 mr-3' onClick={handleLogout}/>
        <div className={`font-semibold text-sm   ${hover||isopen?"block":"hidden"} ${hover?"absolute bg-white p-2 rounded-lg border-2   left-20":"relative"} `}>Logout</div>
        </div>
    </div>
    
  )
    
}

export default SilderbarAdmin