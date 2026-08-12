"use client";
import VenueCard from '@/components/venueCard';
import React,{useState,useEffect} from 'react'
import axios from 'axios';

function Venues() {
  const [venues,setVenues]=useState([]);
  useEffect(() => {
    fetchVenues();
  }, [])
  const fetchVenues=async()=>{
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hall/getHall`).
    then((res) => {
      
      setVenues(res.data.data);
    })
    .catch((err) => {
      console.error(err);
    });
  }
  return (
    <div className='grid gap-2 gap-y-5 lg:grid-cols-4 justify-center items-center md:grid-cols-2 grid-cols-1  p-4 h-full'>
      {venues.map((venue,index)=>{
        return <VenueCard key={index} venue={venue}/>
      })}
    </div>
  )
}

export default Venues;