'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EventDetails from '@/components/EventDetails';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { MapPin, CalendarRange, ArrowLeft, Download, CalendarX2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Categorical colours for venue events
const EVENT_COLOURS = [
  '#2563EB', // blue
  '#059669', // emerald
  '#DB2777', // pink
  '#7C3AED', // violet
  '#EA580C', // orange
  '#0891B2', // cyan
  '#DC2626', // red
];

const colourForVenue = (venueId = '') => {
  let hash = 0;
  for (let i = 0; i < venueId.length; i++) {
    hash = (hash * 31 + venueId.charCodeAt(i)) >>> 0;
  }
  return EVENT_COLOURS[hash % EVENT_COLOURS.length];
};

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month view' },
  { value: 'dayGridWeek', label: 'Week view' },
  { value: 'timeGridDay', label: 'Day view' },
];

export default function VenueBookingCalendar() {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [view, setView] = useState('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarRef, setCalendarRef] = useState(null);
  const [venues, setVenues] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchVenues();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (venues.length > 0) {
      fetchData();
    }
  }, [venues]);

  const fetchVenues = () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/hall/getHall`)
      .then((res) => {
        setVenues(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/booking/getBooking?status=approved`)
      .then((res) => {
        setEventsData(
          res.data.data.map((booking) => ({
            id: booking._id,
            title:
              booking.title +
              ' | ' +
              (venues.find((venue) => venue._id === booking.hall)?.name || 'Venue') +
              ' | ' +
              booking.startTime +
              '-' +
              booking.endTime,
            start: booking.startDate + 'T' + booking.startTime + ':00',
            end: booking.endDate + 'T' + booking.endTime + ':00',
            color: colourForVenue(booking.hall),
            venueId: booking.hall,
            org: booking.Organization,
            user: booking.user.name,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const filteredEvents = selectedVenue
    ? eventsData.filter((event) => event.venueId === selectedVenue._id)
    : eventsData;

  const changeView = (newView) => {
    if (calendarRef) {
      calendarRef.getApi().changeView(newView);
    }
    setView(newView);
  };

  const generatePDF = async () => {
    const element = document.getElementById('calendar-container');

    if (!element) {
      console.error("Element with id 'calendar-container' not found");
      return;
    }

    try {
      setTimeout(async () => {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('calendar.pdf');
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="w-full">
      <EventDetails
        isOpen={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        selectedEvent={selectedEvent}
        venues={venues}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Admin Venue Calendar
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Overview and export for all approved campus venue bookings.
          </p>
        </div>

        <Button
          onClick={generatePDF}
          variant="outline"
          className="gap-2 self-start sm:self-auto"
        >
          <Download className="size-4" />
          Export PDF
        </Button>
      </div>

      <div className="w-full">
        {/* Controls Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Select
            value={selectedVenue?._id ?? 'all'}
            onValueChange={(val) =>
              setSelectedVenue(val === 'all' ? null : venues.find((v) => v._id === val) ?? null)
            }
          >
            <SelectTrigger className="w-full overflow-hidden sm:w-52">
              <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <MapPin className="size-4 shrink-0 text-neutral-400" />
                <SelectValue placeholder="All venues" className="block min-w-0 truncate" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All venues</SelectItem>
              {venues.map((venue) => (
                <SelectItem key={venue._id} value={venue._id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={view} onValueChange={changeView}>
            <SelectTrigger className="w-full overflow-hidden sm:w-44">
              <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <CalendarRange className="size-4 shrink-0 text-neutral-400" />
                <SelectValue className="block min-w-0 truncate" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {VIEW_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {view !== 'dayGridMonth' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeView('dayGridMonth')}
              className="gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Back to month
            </Button>
          )}
        </div>

        {/* Venue Filter Badges */}
        {venues.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {venues.map((venue) => {
              const active = selectedVenue?._id === venue._id;
              return (
                <button
                  key={venue._id}
                  onClick={() => setSelectedVenue(active ? null : venue)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition',
                    active
                      ? 'border-transparent bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: colourForVenue(venue._id) }}
                  />
                  <span className="max-w-[12rem] truncate">{venue.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Calendar Container */}
        <div id="calendar-container" className="mt-6">
          {loading ? (
            <CalendarSkeleton />
          ) : (
            <>
              <div className="eo-calendar w-full">
                <FullCalendar
                  id="calendar"
                  ref={(ref) => setCalendarRef(ref)}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={view}
                  events={filteredEvents}
                  headerToolbar={{
                    left: 'prev today next',
                    center: 'title',
                    right: '',
                  }}
                  views={{
                    dayGridMonth: { buttonText: 'Month' },
                    dayGridWeek: { buttonText: 'Week' },
                    timeGridDay: { buttonText: 'Day' },
                  }}
                  height="auto"
                  eventContent={renderEventContent}
                  eventClick={(info) => setSelectedEvent(info.event)}
                  dateClick={(info) => {
                    changeView('timeGridDay');
                    calendarRef?.getApi().gotoDate(info.dateStr);
                  }}
                />
              </div>

              {filteredEvents.length === 0 && <EmptyState venueName={selectedVenue?.name} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-2">
      <div className="h-8 w-48 rounded-md bg-neutral-100" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ venueName }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-10 text-center">
      <CalendarX2 className="size-6 text-neutral-300" />
      <p className="text-sm font-medium text-neutral-600">
        No approved bookings{venueName ? ` for ${venueName}` : ''} yet.
      </p>
      <p className="text-xs text-neutral-400">New bookings will appear here once approved.</p>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div
      className="flex w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-md px-2 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-black/5 transition hover:brightness-110"
      style={{ backgroundColor: eventInfo.event.backgroundColor }}
    >
      <span className="min-w-0 truncate">{eventInfo.event.title}</span>
    </div>
  );
}

