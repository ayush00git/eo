"use client";
import VenueCard from '@/components/venueCard';
import React,{useEffect,useState} from 'react'
import {PlusIcon} from 'lucide-react'
import axios from 'axios';
import VenueFormModal from '@/components/adminModals/AdminVenuModal';
import VenueUpdateFormModal from '@/components/adminUpdateModals/AdminUpdateModal';
import toast from 'react-hot-toast';
function Venues() {
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [isEditOpen,SetIsEditOpen]=useState(false);
  const [initialData,setInitialData]=useState({});

  const [vneueslist,setVenues]=useState([]);
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
  const handleAddVenue=(formData)=>{
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hall/addHall`,formData,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('xccess-token-Admin')}`
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
  
 const  handleDelete=(id)=>{
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/hall/deleteHall/${id}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('xccess-token-Admin')}`
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
  const handleEditSubmit=(formData,id)=>{
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/hall/updateHall/${id}`,formData,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('xccess-token-Admin')}`
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
    <div className='grid gap-2 gap-y-5 lg:grid-cols-4 justify-center items-center md:grid-cols-2 grid-cols-1  p-4 h-full'>
      {[...vneueslist.map((venue,index)=>{
        return <VenueCard key={index} venue={venue} isAdmin={true} OnEdit={(venue)=>{
          SetIsEditOpen(true);
          setInitialData(venue);  

        }} OnDelete={handleDelete} />
      }),(<div key={"a4"} className='w-full h-56 hover:scale-95 transition-all ease-in-out bg-gray-200 rounded-lg shadow-md p-4 flex justify-center items-center' onClick={()=>{
        setIsModalOpen(true);
      }}>
            <PlusIcon className='mr-2 hover:scale-105'/>
            Add Venue
        
        </div>)]}
        <VenueFormModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} onSubmit={handleAddVenue}/>
          <VenueUpdateFormModal isOpen={isEditOpen} onClose={()=>SetIsEditOpen(false)} onSubmit={handleEditSubmit} initialData={initialData}/>
    </div>
  )
}

export default Venues;