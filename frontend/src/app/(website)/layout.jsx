"use client";
import { useState } from 'react'
import Silderbar from '@/components/silderbar'
import React from 'react'
import withAuth from '@/components/withAuth'

function Layout({ children }) {
  const [isopen, setIsopen] = useState(true)
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Silderbar isopen={isopen} setIsopen={setIsopen} />

      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default withAuth(Layout)
