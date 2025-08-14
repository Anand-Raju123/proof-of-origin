import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ChainProof
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to={createPageUrl("Home")} className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to={createPageUrl("Dashboard")} className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link to={createPageUrl("Upload")} className="text-gray-300 hover:text-white transition-colors">Upload</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900/50 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ChainProof. All rights reserved.</p>
          <p className="text-sm mt-2">Secure Document Verification on the Blockchain</p>
        </div>
      </footer>
    </div>
  );
}
