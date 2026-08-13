"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, Users } from "lucide-react";

export default function VenueDetails() {
  const { id } = useParams(); // Get ID from URL params
  const router = useRouter();
  const [venueData, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, [])

  const fetchVenues = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hall/getHall`).
      then((res) => {
        setVenues(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }

  // Find venue by ID
  const venue = venueData.find((v) => v._id === id);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-neutral-700">Venue not found</p>
        <button
          onClick={() => router.back()}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-amber-300 hover:text-amber-700"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-neutral-200">
        <Image src={venue.image} alt={venue.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <h1 className="absolute inset-x-0 bottom-4 px-6 text-2xl font-bold text-white drop-shadow-sm">
          {venue.name}
        </h1>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-neutral-400" />
            {venue.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-neutral-400" />
            {venue.capacity} people
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-neutral-700">{venue.description}</p>
      </div>
    </div>
  );
}
