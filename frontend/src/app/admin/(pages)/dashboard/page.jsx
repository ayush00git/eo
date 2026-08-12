'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EventDetails from '@/components/EventDetails';
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const colours = ['#EF4444', '#F59E0B', '#10B991','#03dbfc','#fcb603',]

export default function VenueBookingCalendar() {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [view, setView] = useState('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarRef, setCalendarRef] = useState(null);
  const [venues, setVenues] = useState([]);
  const [eventsData, setEventsData] = useState([]);
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
            color: colours[Math.floor(Math.random() * colours.length)],
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



  return (<div>

    <EventDetails isOpen={selectedEvent} onClose={() => setSelectedEvent(null)} selectedEvent={selectedEvent} venues={venues} />
    <div className="w-full p-6 bg-white rounded-xl drop-shadow-lg ">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📅 Venue Booking Calendar</h1>
      <div className="flex justify-center mb-6 gap-4">
        <select
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={(e) => setSelectedVenue(venues.find(v => v._id === (e.target.value)))}
        >
          <option value="">🏢 Select Venue</option>
          {venues.map(venue => (
            <option key={venue._id} value={venue._id}>{venue.name}</option>
          ))}
        </select>

        <select
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={view}
          onChange={(e) => changeView(e.target.value)}
        >
          <option value="dayGridMonth">📆 Month View</option>
          <option value="dayGridWeek">📅 Week View</option>
          <option value="timeGridDay">📍 Day View</option>
        </select>
        <button onClick={() => generatePDF("calendar")} className="p-3 border border-gray-300 rounded-lg focus:outline-none bg-black text-white focus:ring-2 focus:ring-blue-500 transition">Export PDF</button>
      </div>
      <div id="calendar-container" className={`bg-gray-100 p-4 rounded-lg shadow-md  `}>
        {view !== 'dayGridMonth' && <button onClick={() => changeView('dayGridMonth')} className="my-2 p-2 border-2 text-black rounded-lg ">
          🔙Back
        </button>}
        <FullCalendar
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
  );
}
function renderEventContent(eventInfo) {
  return (
    <div className="bg-opacity-90 hover:scale-105 hover:overflow-visible overflow-hidden p-1 text-xs rounded-md text-black shadow-sm"
      style={{
        backgroundColor: eventInfo.event.backgroundColor,
        padding: '5px',
        borderRadius: '6px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
      }}
    >
      <span className='mx-auto block text-black'>{eventInfo.event.title}</span>




    </div>
  );
}
