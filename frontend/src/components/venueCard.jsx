"use client";
import Image from 'next/image'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { MdEdit ,MdDelete } from 'react-icons/md';


function VenueCard({ venue ,isAdmin=false,OnEdit={},OnDelete={}}) {
  const [ishover,setHover]=useState(false);
  const router = useRouter()
  return (
    <div className="relative w-full h-56 rounded-2xl  overflow-hidden shadow-lg" onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{
      setHover(false)
    }}>
      {/* Background Image using Next.js Image */}
      <div className="absolute inset-0" >
        <Image
          src={venue.image}
          alt={venue.name}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl border-b-2 border-black  brightness-75"
        />
       
      </div>

      {/* Overlay */}
      <div className="absolute inset-0"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
        <h2 className="text-2xl font-bold text-center">{venue.name}</h2>
        {isAdmin&&
        <div className={`flex transition-all ease-in-out gap-2 mt-2 ${ishover?"block":"hidden"} `}>
          <div className='bg-gray-500 p-2 rounded-full ' onClick={()=>{OnEdit(venue)}}>
        <MdEdit />
        </div>
          <div className='bg-red-700 p-2 rounded-full  ' onClick={()=>{OnDelete(venue._id)}}>
        <MdDelete/>
        </div>
       

          </div>}
      </div>

      {/* Buttons */}
      <div className="absolute bottom-0 left-0 right-0 flex">
        <button className={`${isAdmin?"w-full bg-blue-600 hover:bg-blue-500" :"w-1/2 bg-gray-800 hover:bg-gray-700"} text-white py-2 text-sm`} onClick={() =>{
          if(isAdmin){
            router.push(`/admin/venues/${venue._id}`)
          } 
          else{
            router.push(`/venues/${venue._id}`)
          }
          }}>
          View Details
        </button>

        {!isAdmin && <button className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white py-2 text-sm" onClick={()=>{
          router.push(`/bookvenue?venue=${venue._id}`)
        }}>
          Book Venue
        </button>}
      </div>
    </div>
  )
}

export default VenueCard
