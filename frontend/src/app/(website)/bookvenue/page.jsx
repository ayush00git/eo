"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Field, fieldClass, submitButtonClass } from "@/components/ui/form-field";

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


      })
      .catch((err) => {
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

  const conflictingBookings =
    formData.hall && formData.startDate && formData.endDate && formData.startTime && formData.endTime
      ? bookings.filter((booking) => {
          const start = getDateTime(formData.startDate, formData.startTime);
          const end = getDateTime(formData.endDate, formData.endTime);
          const bookingStart = getDateTime(booking.startDate, booking.startTime);
          const bookingEnd = getDateTime(booking.endDate, booking.endTime);

          return booking.hall === formData.hall && start < bookingEnd && end > bookingStart;
        })
      : [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Book a venue</h1>
        <p className="mt-1 text-sm text-neutral-500">Submit a request for the Estate Office to review.</p>
      </div>

      {conflictingBookings.length > 0 && (
        <div className="mb-4 max-h-56 overflow-y-auto rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
            <AlertTriangle className="size-4" />
            This venue is already booked for the selected date and time
          </p>
          <div className="mt-2 space-y-2">
            {conflictingBookings.map((booking) => (
              <div key={booking._id} className="border-t border-amber-200 pt-2 text-sm text-amber-800">
                <p><span className="font-medium">Organization:</span> {booking.Organization}</p>
                <p><span className="font-medium">Title:</span> {booking.title}</p>
                <p><span className="font-medium">Venue:</span> {venues.find((v) => v._id === booking.hall)?.name || "Unknown venue"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Club/Society/Department">
          <input
            type="text"
            id="Organization"
            value={formData.Organization}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </Field>

        <Field label="Title of event">
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </Field>

        <Field label="Venue for booking">
          <select
            id="hall"
            value={formData.hall}
            onChange={handleChange}
            className={fieldClass}
            required
          >
            <option value="">Select venue</option>
            {venues.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {hall.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date from">
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              max={formData.endDate}
              onChange={handleChange}
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Date to">
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              min={formData.startDate}
              onChange={handleChange}
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Time from">
            <input
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Time to">
            <input
              type="time"
              id="endTime"
              value={formData.endTime || ""} // Ensure it never becomes undefined
              min={formData.startDate === formData.endDate ? formData.startTime : "00:00"}
              onChange={handleChange}
              className={fieldClass}
              required
            />
          </Field>
        </div>

        <Field label="Booking requirement (optional)">
          <textarea
            id="resonForBooking"
            value={formData.resonForBooking}
            onChange={handleChange}
            className={fieldClass}
            rows="3"
          ></textarea>
        </Field>

        <Field label="Supporting document">
          <input
            type="file"
            id="image"
            required
            onChange={(e) => {
              if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const fileSize = file.size / 1024 / 1024; // Convert to MB
                const maxSize = 5; // 5 MB
                if (fileSize > maxSize) {
                  toast.error("File size exceeds 5 MB");
                  return;
                }
                setImage(file);
              }
              else
                setImage(null);
            }}
            className={fieldClass}
          />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className={submitButtonClass}>
            {loading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              "Submit request"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
