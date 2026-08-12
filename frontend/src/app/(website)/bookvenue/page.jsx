"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Bookingimg from '../../../../public/Bookin.png';
import { MdWarning } from "react-icons/md";


export default function BookVenue() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const searchParams = useSearchParams();

  const venue = searchParams.get("venue");




  useEffect(() => {

    fetchVenues();
    fetchData();
  }, [])
  const fetchData = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/getBooking?status=approved`)
      .then((res) => {
        setBookings(res.data.data);
        console.log(res.data.data);


      })
      .catch((err) => {
        console.log(err);
      })
  }
  const fetchVenues = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hall/getHall`).
      then((res) => {

        setVenues(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    Organization: "",
    hall: venue || "",
    title: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    resonForBooking: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Ensure startTime and endTime are valid time values before comparison
    const startTime = formData.startTime || "00:00";
    const endTime = formData.endTime || "00:00";

    // If both dates are the same, enforce time order
    if (formData.startDate && formData.endDate && formData.startDate === formData.endDate) {
      if (id === "endTime" && value < startTime) {
        setFormData({ ...formData, endTime: value, startTime: value }); // Sync both times
        return;
      }
      if (id === "startTime" && value > endTime) {
        setFormData({ ...formData, startTime: value, endTime: value }); // Sync both times
        return;
      }
    }

    // Default behavior: update formData normally
    setFormData({ ...formData, [id]: value });
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedFormData = formData;
    if (image) {
      if (image.type !== 'application/pdf' && image.type !== 'image/jpeg' && image.type !== 'image/png' && image.type !== 'image/jpg') {
        toast.error('Only PDF, png, jpeg, jpg are allowed')
        setLoading(false);
        return;
      }
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "trails");
      setLoading(true);
      try {
        const res = await axios.post("https://api.cloudinary.com/v1_1/dy0fshunc/image/upload", data)
        setLoading(false);
        updatedFormData = { ...formData, document: res.data.secure_url }

        onSubmit(updatedFormData)
      }
      catch (error) {
        setLoading(false);
        console.log(error);
        if (error.response && error.response.data.error.message.includes("File size")) {
          toast.error("File Is too large")
        }
        toast.error("Error in Uploading Data")

      }

    }
    else {
      onSubmit(updatedFormData)

    }

  };
  const onSubmit = async (data) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/booking/addBooking`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("xccess-token")}`,
      },
    }).

      then((res) => {
        toast.success("Booking Successfull");
        handleReset();
        window.location.href = "/bookingstatus";
      })
      .catch((err) => {
        console.error(err);
        toast.error("Booking Failed");
      });
  }

  const handleReset = () => {
    setFormData({
      Organization: "",
      hall: "",
      startDate: "",
      endDate: "",
      startTime: "",
      title: "",
      endTime: "",
      resonForBooking: "",

    });
    setImage(null)
  };
  const getDateTime = (date, time) => new Date(`${date}T${time}:00`);
  if (loading) {
    return (
      <div className="w-1/3 mx-auto  p-6 rounded-2xl drop-shadow-lg  bg-white ">
        <h2 className="text-2xl text-center font-bold mb-4">Book a Venue</h2>
        <div className='mx-auto my-20 animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>

    )

  }
  else {
    return (<div className="flex justify-between ">

      <div className="w-fit mr-auto ml-56 mb-20  p-6 rounded-2xl drop-shadow-lg  bg-white ">
        <h2 className="text-2xl font-bold mb-4">Book a Venue</h2>

        {formData.hall && formData.startDate && formData.endDate && formData.startTime && formData.endTime && (() => {
          const conflictingBookings = bookings.filter((booking) => {
            const start = getDateTime(formData.startDate, formData.startTime);
            const end = getDateTime(formData.endDate, formData.endTime);
            const bookingStart = getDateTime(booking.startDate, booking.startTime);
            const bookingEnd = getDateTime(booking.endDate, booking.endTime);

            return booking.hall === formData.hall && start < bookingEnd && end > bookingStart;
          });

          if (conflictingBookings.length > 0) {
            return (
              <div className="border-yellow-400 bg-yellow-100 border-2 rounded-lg p-2 max-h-50 overflow-y-auto mb-4">
                <MdWarning className="inline text-yellow-500" /> This venue is already booked for the selected date and time.
                <div className="mt-2 font-semibold">Details:</div>
                {conflictingBookings.map((booking) => (
                  <div key={booking._id} className="p-2 border-t border-yellow-400">
                    <span className="font-semibold">Organization:</span> {booking.Organization}<br />
                    <span className="font-semibold">Title:</span> {booking.title}<br />
                    <span className="font-semibold">Venue:</span> {venues.find((venue) => venue._id === booking.hall)?.name || "Unknown Venue"}<br />
                  </div>
                ))}
              </div>
            );
          }

          return null;
        })()}


        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization */}
          <label className="block">
            <span className="font-semibold">Club/Society/Organization:</span>
            <input
              type="text"
              id="Organization"
              value={formData.Organization}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </label>
          {/* Title */}
          <label className="block">
            <span className="font-semibold">Title of Event:</span>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </label>

          {/* Hall for Booking */}
          <label className="block">
            <span className="font-semibold">Venue for Booking:</span>
            <select
              id="hall"
              value={formData.hall}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Venue</option>
              {venues.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {hall.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex w-full gap-4">
            {/* Date from*/}
            <label className="block w-full">
              <span className="font-semibold block">Date From:</span>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                max={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </label>
            {/* Date to*/}
            <label className="block w-full">
              <span className="font-semibold block">Date To:</span>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                min={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </label>
          </div>
          <div className="flex w-full gap-4">

            {/* Time From */}
            <label className="block w-full" >
              <span className="font-semibold block">Time From:</span>
              <input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </label>

            {/* Time To */}
            <label className="block w-full">
              <span className="font-semibold block">Time To:</span>
              <input
                type="time"
                id="endTime"
                value={formData.endTime || ""} // Ensure it never becomes undefined
                min={formData.startDate === formData.endDate ? formData.startTime : "00:00"}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </label>

          </div>
          {/* Reason */}
          <label className="block">
            <span className="font-semibold">Booking Requirement (Optional):</span>
            <textarea
              id="resonForBooking"
              value={formData.resonForBooking}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows="3"

            ></textarea>
          </label>
          <label className="block">
            <span className="font-semibold">Document:</span>
            <input
              type="file"
              id="image"
              required
              value={formData.image}
              onChange={(e) => {
            
               if (e.target.files.length > 0)
                {
                  const file = e.target.files[0];
                  const fileType = file.type;
                  const fileSize = file.size / 1024 / 1024; // Convert to MB
                  const maxSize = 5; // 5 MB  
                  if (fileSize > maxSize) {
                    toast.error("File size exceeds 5 MB");
                    return;
                  }
                  setImage(e.target.files[0]);
                }

                else
                  setImage(e.target.files);
              }

              }
              className="w-full p-2 border rounded-lg"
              rows="3"

            ></input>
          </label>


          {/* Buttons */}
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Submit
            </button>
            <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
              Reset
            </button>
          </div>
        </form>
      </div>
      <Image src={Bookingimg} width={600} height={600} alt="Booking" className=" absolute right-28 -z-50  drop-shadow-2xl" />
    </div>
    );
  }
}
