'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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
          {user && (
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              My Setups
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          ) : user ? (
            <>
              <span className="hidden sm:inline-flex text-sm text-gray-600">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="hidden sm:inline-flex text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:inline-flex text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          <button className="p-2 md:hidden">
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
      </nav>
    </header>
  );
}
