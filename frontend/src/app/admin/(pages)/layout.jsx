"use client";
import BreadcrumNav from '@/components/bredcrum';
import { useState } from 'react';
import SilderbarAdmin from '@/components/sidebarAdmin';
import React from 'react';
import withAuth from '@/components/withAuth2';

function Layout({ children }) {
  const [isopen, setIsopen] = useState(true);
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <SilderbarAdmin isopen={isopen} setIsopen={setIsopen} />

      <div className="flex flex-1 flex-col min-w-0">
        <BreadcrumNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default withAuth(Layout);