"use client";
import { useEffect, useState } from "react";
import { Check, X, Building2, User, Calendar, Clock, FileText, Inbox } from 'lucide-react'
import axios from "axios";
import ApproveModal from "@/components/Approvemodal";
import RejectModal from "@/components/RejectModal";
import { cn } from "@/lib/utils";
import { STATUS_BADGE } from "@/lib/status";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminRequests = () => {
  const [filter, setFilter] = useState("pending");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModal2Open, setModal2Open] = useState(false);

  const [venues, setVenues] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [requests, setRequest] = useState([]);

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


      })
      .catch((err) => {
      })
  }

  const handleUpdateSubmit = (id, status, Iscustom, messFromAdmin, conflicts) => {
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/booking/updateBookingStatus/${id}`, { status, Iscustom, messFromAdmin, conflicts },
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

  const filteredRequests = requests.filter((req) => req.status === filter);

  return (
    <div>
      <ApproveModal isOpen={isModalOpen} onClose={() => { setModalOpen(false) }} selectedEvent={initialData} onSubmit={handleUpdateSubmit} venues={venues} approvedBookings={requests.filter((req) => req.status === 'approved')} />
      <RejectModal isOpen={isModal2Open} onClose={() => { setModal2Open(false) }} selectedEvent={initialData} onSubmit={handleUpdateSubmit} venues={venues} approvedBookings={requests.filter((req) => req.status === 'approved')} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Booking Requests</h1>
        <p className="mt-1 text-sm text-neutral-500">Review and action venue booking requests.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const count = requests.filter((req) => req.status === status.value).length;
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
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-semibold",
                  active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <Inbox className="size-6 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">No {filter} requests.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {filteredRequests.map((req) => {
            const venue = venues.find((venue) => venue._id === req.hall);

            return (
              <li
                key={req._id}
                className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-neutral-400 uppercase">
                      <Building2 className="size-3.5" />
                      {venue?.name || "Unknown venue"}
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-neutral-900">
                      {req.title}
                    </h3>
                    <p className="text-sm text-neutral-500">{req.Organization}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                      STATUS_BADGE[req.status]
                    )}
                  >
                    {req.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="size-4 text-neutral-400" />
                    {req.user.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-neutral-400" />
                    {req.startDate} &rarr; {req.endDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-neutral-400" />
                    {req.startTime} &ndash; {req.endTime}
                  </span>
                  {req.status === "cancelled" && (
                    <span className="text-neutral-400">
                      Cancelled {new Date(req.updatedAt).toDateString()}
                    </span>
                  )}
                </div>

                {req.resonForBooking && (
                  <p className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                    <span className="font-medium text-neutral-700">Reason: </span>
                    {req.resonForBooking}
                  </p>
                )}

                {req.document && (
                  <a
                    href={req.document}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:underline"
                  >
                    <FileText className="size-4" />
                    View attached document
                  </a>
                )}

                {req.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      onClick={() => handleUpdate(req)}
                    >
                      <Check className="size-4" />
                      Approve
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleUpdate2(req)}
                    >
                      <X className="size-4" />
                      Reject
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminRequests;
