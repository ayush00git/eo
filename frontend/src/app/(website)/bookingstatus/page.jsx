"use client"
import { useState, useEffect } from 'react';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import BookingList from '@/components/BookingStatusList';
import BookingEditModal from '@/components/BookingEditModal';
import toast from 'react-hot-toast';

export default function BookingStatus() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const[initialData,setInitialData]=useState({});
  const [IsModalOpen, setModalOpen] = useState(false);
  const [venuesList, setVenues] = useState([]);

  useEffect(() => {
    fetchData();
    fetchVenues();
  }, []);

  const fetchData = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/getBookingByUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("xccess-token")}`,
      },
    })
      .then((res) => {
        setBookings(res.data.data.map((booking) => ({
          ...booking,
          colour: booking.status === "pending" ? "yellow-500" :
            booking.status === "rejected" ? "red-500" :
              booking.status === "approved" ? "green-500" : "gray-500" // Default color
        })));
      }) 
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchVenues = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hall/getHall`)
      .then((res) => {
        setVenues(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return; // Exit if the user cancels the confirmation
    }
      // Make the DELETE request to the server
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/booking/deleteBooking/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("xccess-token")}`,
      },
    })
      .then((res) => {
        toast.success("Booking deleted successfully!");
        fetchData(); // Refresh the bookings list after deletion
      })
      .catch((err) => {
        console.error(err);
      toast.error("Failed to delete booking.");
      });

  };
  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/booking/cancelBooking/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("xccess-token")}`,
        },
      })
        .then((res) => {
          setBookings(bookings.filter((booking) => booking._id !== id));
          fetchData();
        })
        .catch((err) => {
          console.error(err);
        }
        )
    }
  };

  const handleEdit = (id) => {
    const booking = bookings.find((booking) => booking._id === id);
    setInitialData(booking);
    setModalOpen(true);
  };
  const handleSubmit = (id,formdata) => {
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/booking/updateBooking/${id}`, formdata, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("xccess-token")}`,
      },
    })
      .then((res) => {
        toast.success("Booking updated successfully!");
        setModalOpen(false);
        fetchData(); // Refresh the bookings list after editing
        
      })
      .catch((err) => {
        console.error(err);
      });
    }
  const filteredBookings = filter === 'All' ? bookings : bookings.filter((b) => b.status.toLowerCase() === filter.toLowerCase());

  return (<>
    <div className="p-6 bg-white rounded-xl drop-shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Booking Status</h1>

      {/* Filter Dropdown */}
      <div className="mb-4 flex items-center space-x-8">
        <label className="font-semibold">Filter:</label>
        <select className="border p-2 rounded w-40" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Status Legend */}
      <div className="flex items-center mb-4 space-x-3">
        <span className="font-semibold">REQUEST STATUS:</span>
        <span className="flex items-center space-x-1"><span className="bg-red-500 w-4 h-4 rounded-full"></span> <span>Rejected</span></span>
        <span className="flex items-center space-x-1"><span className="bg-green-500 w-4 h-4 rounded-full"></span> <span>Approved</span></span>
        <span className="flex items-center space-x-1"><span className="bg-yellow-500 w-4 h-4 rounded-full"></span> <span>Pending</span></span>
        <span className="flex items-center space-x-1"><span className="bg-black w-4 h-4 rounded-full"></span> <span>Cancelled</span></span>
      </div>

      {/* Booking List */}
      <BookingList filteredBookings={filteredBookings} venuesList={venuesList} handleEdit={handleEdit} handleDelete={handleDelete} handleCancel={handleCancel} />
    </div>
      <BookingEditModal isOpen={IsModalOpen} onClose={() => setModalOpen(false)} initalData={initialData} venueList={venuesList} onSubmit={handleSubmit} /></>
  );


}
