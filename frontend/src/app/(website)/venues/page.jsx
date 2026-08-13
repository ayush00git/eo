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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Venue List</h1>
        <p className="mt-1 text-sm text-neutral-500">Browse campus venues available for booking.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {venues.map((venue) => (
          <VenueCard key={venue._id} venue={venue} />
        ))}
      </div>
    </div>
  )
}

export default Venues;