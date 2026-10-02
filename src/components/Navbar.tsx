import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Menu, X, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md group-hover:bg-emerald-500 transition">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold font-serif text-white tracking-wide">NJP Tour Skardu</span>
            <span className="block text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Explore • Discover • Travel</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-200">
          <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
          <a href="/#seasons" className="hover:text-emerald-400 transition">4 Seasons</a>
          <a href="/#packages" className="hover:text-emerald-400 transition">Tour Packages</a>
          <a href="/#gallery" className="hover:text-emerald-400 transition">Gallery</a>
          <a href="/#reviews" className="hover:text-emerald-400 transition">Reviews</a>
          <Link to="/contact" className="hover:text-emerald-400 transition">Contact</Link>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onOpenBooking}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition flex items-center gap-2 text-sm"
          >
            <PhoneCall className="w-4 h-4" /> Book Tour
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="lg:hidden text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-t border-white/10 py-6 px-6 shadow-2xl space-y-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-emerald-400 font-medium">Home</Link>
          <a href="/#seasons" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-emerald-400 font-medium">4 Seasons</a>
          <a href="/#packages" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-emerald-400 font-medium">Tour Packages</a>
          <a href="/#gallery" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-emerald-400 font-medium">Gallery</a>
          <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-emerald-400 font-medium">Reviews</a>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-gray-200 hover:text-emerald-400 font-medium">Contact</Link>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-center shadow-lg"
          >
            Book Tour Now
          </button>
        </div>
      )}
    </nav>
  );
}