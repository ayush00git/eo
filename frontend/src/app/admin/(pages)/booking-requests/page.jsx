"use client";
import { useEffect, useState } from "react";
import { SquareCheck, X } from 'lucide-react'
import axios from "axios";
import ApproveModal from "@/components/Approvemodal";
import RejectModal from "@/components/RejectModal";

const AdminRequests = () => {
  const [filter, setFilter] = useState("pending");
  const [isModalOpen,setModalOpen]=useState(false);
  const [isModal2Open,setModal2Open]=useState(false);
  
  const [venues, setVenues] = useState([]);
  const [initialData,setInitialData]=useState([]);
  const [requests, setRequest] = useState([]);
  const colours = {
    "pending": " bg-yellow-300 ",
    "rejected": " bg-red-600 text-white ",
    "approved": " bg-green-600 text-white ",
    "cancelled": " bg-black text-white "
  }
  
  useEffect(() => {

    fetchVenues();
    fetchData();


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


  const fetchData = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/getBooking`)
      .then((res) => {
        setRequest(res.data.data);
        console.log(res.data.data);


      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleUpdateSubmit = (id, status,Iscustom,messFromAdmin,conflicts) => {
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/booking/updateBookingStatus/${id}`, { status,Iscustom,messFromAdmin,conflicts },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("xccess-token-Admin")}`,
        },
      }
    )
      .then(() => {
        fetchData();

      })
      .catch((err) => {
        console.error(err);
      });
  }
  const handleUpdate = (item) => {
    setInitialData(item);
    setModalOpen(true);
  }
  const handleUpdate2 = (item) => {
    setInitialData(item);
    setModal2Open(true);
  }


  return (
    <div>
      <ApproveModal isOpen={isModalOpen} onClose={()=>{setModalOpen(false)}} selectedEvent={initialData} onSubmit={handleUpdateSubmit} venues={venues} approvedBookings={requests.filter((req)=>req.status==='approved')} />
      <RejectModal isOpen={isModal2Open} onClose={()=>{setModal2Open(false)}} selectedEvent={initialData} onSubmit={handleUpdateSubmit} venues={venues} approvedBookings={requests.filter((req)=>req.status==='approved')} /> 
      <div className="w-full p-6 bg-white rounded-xl drop-shadow-lg ">

        <h2 className="text-2xl font-bold">Manage Booking Requests</h2>

        {/* Filter Dropdown */}
        <select className="mt-3 p-2 px-5 border rounded-xl" onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {requests
            .filter((req) => req.status === filter).length===0&&<div className="mx-auto text-gray-400 text-xl w-full text-center mt-5">No Data</div>}

        {/* Requests List */}
        <ul className="mt-5 space-y-4">
          {requests
            .filter((req) => req.status === filter)
            .map((req) => {
              const venue = venues.find((venue) => venue._id === req.hall);

              return (
                <li
                  key={req._id}
                  className="p-6 border rounded-xl shadow-lg bg-white transition hover:shadow-xl"
                >
                  {/* Title Section */}
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    🏢 {venue?.name || "Unknown Venue"} | {req.title} |{" "}
                    {req.Organization}
                  </h3>
                  <p className="text-gray-500 text-sm">User: {req.user.name}</p>

                  {/* Status Badge */}
                  <p className="mt-3 flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`${colours[req.status]} w-fit p-1 px-3 text-sm font-semibold rounded-full`}
                    >
                      {req.status.toUpperCase()}
                    </span>
                    {req.status === "cancelled" && (
                      <span className="text-gray-500 text-sm">
                        Cancelled At: {new Date(req.updatedAt).toDateString()}
                      </span>
                    )}
                  </p>

                  {/* Booking Details */}
                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
                    <p>
                      <strong>📅 Start Date:</strong> {req.startDate}
                    </p>
                    <p>
                      <strong>📅 End Date:</strong> {req.endDate}
                    </p>
                    <p>
                      <strong>⏰ Start Time:</strong> {req.startTime}
                    </p>
                    <p>
                      <strong>⏰ End Time:</strong> {req.endTime}
                    </p>
                  </div>

                  {/* Reason for Booking */}
                  {req.resonForBooking && (
                    <div className="mt-4 p-3 bg-gray-100 border rounded-lg text-gray-700 text-sm">
                      <strong>📌 Reason:</strong> {req.resonForBooking}
                    </div>
                  )}
                  {req.document && (
                    <div className="mt-4 p-3 bg-gray-100 border rounded-lg text-gray-700 text-sm">
                      <strong>📌 Documents : </strong> <a href={req.document} target="_blank" className="underline text-blue-500">  Click Here</a>
                    </div>
                  )}

                  {/* Approve / Reject Buttons */}
                  {req.status === "pending" && (
                    <div className="mt-5 flex gap-4">
                      <button
                        className="px-5 py-2 flex items-center bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition"
                        onClick={() => handleUpdate(req)}
                      >
                        <SquareCheck className="mr-2" />
                        Approve
                      </button>
                      <button
                        className="px-5 py-2 flex items-center bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                        onClick={() => handleUpdate2(req)}
                      >
                        <X className="mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>


      </div>
    </div>
  );
};

export default AdminRequests;
