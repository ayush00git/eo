'use client';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import EventDetails from '@/components/EventDetails';
import { User, ArrowLeft } from 'lucide-react';
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const colours = [
  '#EF4444',
  '#F59E0B',
  '#10B991',
  '#03dbfc',
  '#fcb603',
]

// Deterministic colour per venue so the same hall keeps the same colour
// across refetches instead of jumping to a random one each time.
const colourForVenue = (venueId = '') => {
  let hash = 0;
  for (let i = 0; i < venueId.length; i++) {
    hash = (hash * 31 + venueId.charCodeAt(i)) >>> 0;
  }
  return colours[hash % colours.length];
};

export default function VenueBookingCalendar() {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [view, setView] = useState('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarRef, setCalendarRef] = useState(null);
  const [venues, setVenues] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('xccess-token'); // Check if token exists
    if (token) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, []);

  useEffect(() => {
    const fetchVenuesAndEvents = async () => {
      await fetchVenues();
      await fetchData();
    };
    fetchVenuesAndEvents();
  }, []);
  useEffect(() => {
    if (venues.length > 0) {
      fetchData();
    }
  }, [venues]);



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
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/getBooking?status=approved`)
      .then((res) => {
        setEventsData(res.data.data.map((booking) => {



          return {
            id: booking._id,
            title: booking.title + " | " + (venues.find((venue) => venue._id === booking.hall))?.name + " | " + booking.startTime + "-" + booking.endTime,
            start: booking.startDate + "T" + booking.startTime + ":00",
            end: booking.endDate + "T" + booking.endTime + ":00",
            color: colourForVenue(booking.hall),
            venueId: booking.hall,
            org: booking.Organization,
            user: booking.user.name,
          }
        }))


      })
      .catch((err) => {
        console.error(err);
      });

  }




  const filteredEvents = selectedVenue
    ? eventsData.filter(event => event.venueId === selectedVenue._id)
    : eventsData;

  const changeView = (newView) => {
    if (calendarRef) {
      calendarRef.getApi().changeView(newView);
    }
    setView(newView);
  };



  const generatePDF = async () => {
    const element = document.getElementById("calendar-container");

    if (!element) {
      console.error("Element with id 'calendar-container' not found");
      return;
    }

    try {
      // Wait for a short delay to allow styles to apply
      setTimeout(async () => {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        // Create PDF with the same aspect ratio as the calendar
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("calendar.pdf");
      }, 500);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <EventDetails isOpen={selectedEvent} onClose={() => setSelectedEvent(null)} selectedEvent={selectedEvent} venues={venues} />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Venue Booking Calendar</h1>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-blue-50 sm:self-auto"
          >
            <User className="size-4" />
            Login
          </Link>
        </div>

        <div className="w-full rounded-xl bg-white p-4 shadow-lg sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
              onChange={(e) => setSelectedVenue(venues.find(v => v._id === e.target.value))}
            >
              <option value="">All Venues</option>
              {venues.map(venue => (
                <option key={venue._id} value={venue._id}>{venue.name}</option>
              ))}
            </select>

            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
              value={view}
              onChange={(e) => changeView(e.target.value)}
            >
              <option value="dayGridMonth">Month View</option>
              <option value="dayGridWeek">Week View</option>
              <option value="timeGridDay">Day View</option>
            </select>
            {/* <button onClick={() => generatePDF("calendar")} className="p-3 border border-gray-300 rounded-lg focus:outline-none bg-black text-white focus:ring-2 focus:ring-blue-500 transition">Export PDF</button> */}
          </div>

          <div id="calendar-container" className="rounded-lg bg-gray-50 p-3 shadow-inner sm:p-4">
            {view !== 'dayGridMonth' && (
              <button
                onClick={() => changeView('dayGridMonth')}
                className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <ArrowLeft className="size-4" />
                Back to Month
              </button>
            )}
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <FullCalendar
                  id="calendar"
                  ref={(ref) => setCalendarRef(ref)} // Store calendar reference
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={view}
                  events={filteredEvents}
                  headerToolbar={{
                    left: 'prev today next',
                    center: 'title',
                    right: ''
                  }}
                  views={{
                    dayGridMonth: { buttonText: 'Month' },
                    dayGridWeek: { buttonText: 'Week' },
                    timeGridDay: { buttonText: 'Day' }
                  }}
                  height="auto"
                  eventContent={renderEventContent}
                  eventClick={(info) => setSelectedEvent(info.event)}
                  dateClick={(info) => {
                    changeView('timeGridDay');
                    calendarRef.getApi().gotoDate(info.dateStr);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function renderEventContent(eventInfo) {
  return (
    <div
      className="flex items-center gap-1 overflow-hidden rounded-md px-1.5 py-1 text-xs font-semibold text-black shadow-sm transition hover:brightness-95"
      style={{ backgroundColor: eventInfo.event.backgroundColor }}
    >
      <span className="truncate">{eventInfo.event.title}</span>
    </div>
  );
}
