"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Sample venue data (replace with API fetch)


export default function VenueDetails() {
  const { id } = useParams(); // Get ID from URL params
  const router = useRouter();
  const [venueData,setVenues]=useState([]);
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

  // Find venue by ID
  const venue = venueData.find((v) => v._id === id);

  if (!venue)
    return <p className="text-center text-xl font-semibold text-red-500">Venue Not Found</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
      {/* Image Section */}
      <div className="relative h-64">
        <Image
          src={venue.image}
          alt={venue.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute inset-0  flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">{venue.name}</h1>
        </div>
      </div>

      {/* Venue Details */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-600 text-sm">📍 Location: <span className="font-semibold">{venue.location}</span></p>
          <p className="text-gray-600 text-sm">👥 Capacity: <span className="font-semibold">{venue.capacity} People</span></p>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">{venue.description}</p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-md hover:bg-gray-600"
            onClick={() => router.back()}
          >
            🔙 Go Back
          </button>
          
        </div>
      </div>
    </div>
  );
}
