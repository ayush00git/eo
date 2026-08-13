"use client";
import VenueCard from '@/components/venueCard';
import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import axios from 'axios';
import VenueFormModal from '@/components/adminModals/AdminVenuModal';
import VenueUpdateFormModal from '@/components/adminUpdateModals/AdminUpdateModal';
import toast from 'react-hot-toast';

function Venues() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, SetIsEditOpen] = useState(false);
  const [initialData, setInitialData] = useState({});

  const [vneueslist, setVenues] = useState([]);
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
      });
  }
  const handleAddVenue = (formData) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hall/addHall`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
      }
    }).
      then((res) => {
        console.log(res.data);
        fetchVenues();
        toast.success('Venue added successfully');
      }).
      catch((err) => {
        console.error(err);
      });
  }

  const handleDelete = (id) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/hall/deleteHall/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
      }
    }).
      then((res) => {
        console.log(res.data);
        fetchVenues();
      }).
      catch((err) => {
        console.error(err);
      });
  }
  const handleEditSubmit = (formData, id) => {
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/hall/updateHall/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('xccess-token-Admin')}`
      }
    }).
      then((res) => {
        console.log(res.data);
        fetchVenues();
        toast.success('Venue Updated Successfully');
      }).
      catch((err) => {
        console.error(err);
      });
  }


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Venue List</h1>
        <p className="mt-1 text-sm text-neutral-500">Campus venues available for booking.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {vneueslist.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
            isAdmin={true}
            OnEdit={(venue) => {
              SetIsEditOpen(true);
              setInitialData(venue);
            }}
            OnDelete={handleDelete}
          />
        ))}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-56 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 text-neutral-500 transition hover:border-amber-400 hover:bg-amber-50/40 hover:text-amber-700"
        >
          <Plus className="size-6" />
          <span className="text-sm font-medium">Add venue</span>
        </button>
      </div>

      <VenueFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddVenue} />
      <VenueUpdateFormModal isOpen={isEditOpen} onClose={() => SetIsEditOpen(false)} onSubmit={handleEditSubmit} initialData={initialData} />
    </div>
  )
}

export default Venues;
