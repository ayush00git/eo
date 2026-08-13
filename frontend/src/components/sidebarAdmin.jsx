"use client";
import { PanelLeftClose, PanelLeft, SquareCheck, LayoutList, LogOut, LayoutDashboard, User2 } from 'lucide-react';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    logo: LayoutDashboard,
  },
  {
    title: 'Booking Requests',
    path: '/admin/booking-requests',
    logo: SquareCheck,
  },
  {
    title: 'Venue List',
    path: '/admin/venues',
    logo: LayoutList,
  },
  {
    title: 'Audi Staff',
    path: '/admin/Staff',
    logo: User2,
  },
];

function Silderbar({ isopen, setIsopen }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('xccess-token-Admin');
    window.location.href = '/';
  };

  return (
    <aside
      className={`sticky top-0 z-40 flex h-screen flex-col justify-between border-r border-neutral-200 bg-white transition-all duration-300 ${
        isopen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4 p-3">
        {/* Toggle Button */}
        <div className={`flex items-center ${isopen ? 'justify-between px-2 py-1' : 'justify-center py-1'}`}>
          {isopen && (
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Admin Menu
            </span>
          )}
          <button
            onClick={() => setIsopen((prev) => !prev)}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            title={isopen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isopen ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.logo;
            const isActive = pathname === item.path || pathname?.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                } ${!isopen ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`size-5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-900'}`} />
                {isopen ? (
                  <span className="truncate">{item.title}</span>
                ) : (
                  <span className="absolute left-full ml-3 hidden rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white shadow-md group-hover:block z-50 whitespace-nowrap">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-neutral-200 p-3">
        <button
          onClick={handleLogout}
          className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all ${
            !isopen ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="size-5 shrink-0 text-red-500 group-hover:text-red-600" />
          {isopen ? (
            <span className="truncate">Logout</span>
          ) : (
            <span className="absolute left-full ml-3 hidden rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white shadow-md group-hover:block z-50 whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Silderbar;