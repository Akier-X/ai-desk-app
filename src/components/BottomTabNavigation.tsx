'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, LayoutGrid, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tab {
  name: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function BottomTabNavigation() {
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      name: 'home',
      href: '/',
      icon: <Home size={24} />,
      label: 'Canvas',
    },
    {
      name: 'discover',
      href: '/gallery',
      icon: <Compass size={24} />,
      label: 'Discover',
    },
    {
      name: 'setups',
      href: '/dashboard',
      icon: <LayoutGrid size={24} />,
      label: 'My Setups',
    },
    {
      name: 'profile',
      href: '/profile',
      icon: <User size={24} />,
      label: 'Profile',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/20 z-40 safe-area-inset-bottom">
      <nav className="flex items-center justify-around h-20 max-w-7xl mx-auto px-4">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link key={tab.name} href={tab.href} className="flex-1 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {/* Icon */}
                <div className="relative mb-1">
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 rounded-full -z-10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab.icon}
                </div>

                {/* Label */}
                <span className="text-xs font-medium">{tab.label}</span>

                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 h-0.5 bg-blue-600 w-6 rounded-t-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
