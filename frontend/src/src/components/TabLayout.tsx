'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabLayoutProps {
  children: React.ReactNode;
}

const tabs = [
  { id: 'eos1', label: 'EOS1 Min', href: '/eos1' },
  { id: 'eos2', label: 'EOS2 Min', href: '/eos2' },
  { id: 'eos3', label: 'EOS3 Min', href: '/eos3' },
  { id: 'eos4', label: 'EOS4 Min', href: '/eos4' },
  { id: 'eos5', label: 'EOS5 Min', href: '/eos5' },
  { id: 'bepick', label: 'Bepick', href: '/bepick' },
  { id: 'eos', label: 'EOS', href: '/eos' },
  { id: 'pbg', label: 'PBG', href: '/pbg' },
  { id: 'dhpowerball', label: 'Dhpowerball', href: '/dhpowerball' },
];

export default function TabLayout({ children }: TabLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header with tabs */}
      <header className="bg-slate-900 shadow-lg sticky top-0 z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex w-full py-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center rounded transition-all duration-200 ${
                  pathname === tab.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
