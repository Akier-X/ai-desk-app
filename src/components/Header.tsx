'use client';

import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-white/5">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-light tracking-tight hover:opacity-75 transition-opacity">
          Canvas
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Recommend
          </Link>
          <Link href="/gallery" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Gallery
          </Link>
          <Link href="/share" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Share
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:inline-flex text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </button>
          <button className="p-2 md:hidden">
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
      </nav>
    </header>
  );
}
