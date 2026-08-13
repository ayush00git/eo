"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import BookingList from '@/components/BookingStatusList';
import BookingEditModal from '@/components/BookingEditModal';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const STATUSES = [
  { value: 'All', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BookingStatus() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [initialData, setInitialData] = useState({});
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
        setBookings(res.data.data);
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Booking Status</h1>
        <p className="mt-1 text-sm text-neutral-500">Track the requests you've made.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const count = status.value === 'All'
            ? bookings.length
            : bookings.filter((b) => b.status === status.value).length;
          const active = filter === status.value;
          return (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
              )}
            >
              {status.label}
              <span className={cn("rounded-full px-1.5 text-xs font-semibold", active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <BookingList
          filteredBookings={filteredBookings}
          venuesList={venuesList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
        />
      </div>

      <BookingEditModal isOpen={IsModalOpen} onClose={() => setModalOpen(false)} initalData={initialData} venueList={venuesList} onSubmit={handleSubmit} />
    </div>
  );
}
