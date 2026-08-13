import React from 'react'

function Footer() {
  return (
    <footer className="relative bg-neutral-900 text-white">
      <div className="brand-accent-bar h-0.5 w-full" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs font-medium text-white/70 text-center sm:text-left">
          Campus Venue Booking System &copy; 2025 NIT Hamirpur
        </p>
        <p className="text-xs text-white/50">
          Developed By{' '}
          <a
            href="/credits"
            className="font-medium text-white/80 underline decoration-white/30 transition-colors hover:text-white hover:decoration-white"
          >
            Developer Team NITH
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer