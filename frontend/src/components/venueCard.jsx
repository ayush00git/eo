"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react';


function VenueCard({ venue, isAdmin = false, OnEdit = () => {}, OnDelete = () => {} }) {
  const router = useRouter()
  return (
    <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
      <Image
        src={venue.image}
        alt={venue.name}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); OnEdit(venue); }}
            className="rounded-full bg-white/90 p-2 text-neutral-700 shadow-sm transition hover:bg-white"
            aria-label="Edit venue"
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); OnDelete(venue._id); }}
            className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white"
            aria-label="Delete venue"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-12 px-4">
        <h2 className="text-lg font-semibold text-white drop-shadow-sm">{venue.name}</h2>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex">
        <button
          className={`${isAdmin ? "w-full bg-neutral-900/90 hover:bg-neutral-900" : "w-1/2 bg-neutral-900/80 hover:bg-neutral-900"} py-2.5 text-sm font-medium text-white transition`}
          onClick={() => {
            if (isAdmin) {
              router.push(`/admin/venues/${venue._id}`)
            }
            else {
              router.push(`/venues/${venue._id}`)
            }
          }}
        >
          View details
        </button>

        {!isAdmin && (
          <button
            className="w-1/2 bg-amber-600 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
            onClick={() => {
              router.push(`/bookvenue?venue=${venue._id}`)
            }}
          >
            Book venue
          </button>
        )}
      </div>
    </div>
  )
}

export default VenueCard
