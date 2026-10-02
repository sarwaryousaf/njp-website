import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Seasons } from './components/Seasons';
import { PackagesSection } from './components/PackagesSection';
import { GallerySection } from './components/GallerySection';
import { WhyTravelWithUs } from './components/WhyTravelWithUs';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PackageModal } from './components/PackageModal'; // <-- PackageModal import kiya
const AdminLogin = lazy(() => import('./pages/AdminLogin').then((module) => ({ default: module.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));

type TourPackage = any;

function PublicWebsite() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null); // Details modal ke liye
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null); // Booking form ke liye

  const handleOpenBooking = (pkg?: TourPackage | null) => {
    if (pkg) setBookingPackage(pkg);
    else setBookingPackage(null);
    setIsBookingOpen(true);
  };

  const handleSelectPackage = (pkg: TourPackage) => {
    setSelectedTour(pkg); // Jab user package par click kare toh details modal khule
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Navbar onOpenBooking={() => handleOpenBooking()} />
      <Hero onOpenBooking={() => handleOpenBooking()} />
      <Seasons />
      <WhyTravelWithUs />
      <PackagesSection onSelectPackage={handleSelectPackage} />
      <GallerySection />
      <ReviewsSection />
      <Footer />

      {/* Tour Detail Modal */}
      <PackageModal 
        tour={selectedTour} 
        onClose={() => setSelectedTour(null)} 
        onBookNow={(tour) => {
          setSelectedTour(null);
          handleOpenBooking(tour);
        }} 
      />

      {/* Booking Form Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        selectedPackage={bookingPackage} 
      />
    </div>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link to="/" className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500">Return to homepage</Link>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;