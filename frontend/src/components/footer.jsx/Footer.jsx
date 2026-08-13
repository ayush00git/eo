import React from 'react'

function Footer() {
  return (
    <footer className="relative bg-neutral-900 text-white">
      <div className="brand-accent-bar h-0.5 w-full" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs font-medium text-white/70 text-center sm:text-left">
          Campus Venue Booking System &copy; {new Date().getFullYear()} NIT Hamirpur
        </p>
        <a
          href="/credits"
          className="text-xs font-medium text-white/50 underline decoration-white/30 transition-colors hover:text-white hover:decoration-white"
        >
          Developed by
        </a>
      </div>
    </footer>
  )
}

export default Footer