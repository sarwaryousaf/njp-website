import React from 'react';
import { Compass, Phone, Mail, MapPin, CreditCard } from 'lucide-react';

const paymentLink = import.meta.env.VITE_EASYPAISA_PAYMENT_LINK;

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-xl text-white">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif text-white">NJP Tour Skardu</span>
              <span className="block text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Explore • Discover • Travel</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted local tour operator for unforgettable journeys across Skardu, Hunza, Deosai, and all of Gilgit-Baltistan.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 font-serif">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-emerald-400 transition">Home</a></li>
            <li><a href="#about" className="hover:text-emerald-400 transition">About Us</a></li>
            <li><a href="#packages" className="hover:text-emerald-400 transition">Tour Packages</a></li>
            <li><a href="#gallery" className="hover:text-emerald-400 transition">Gallery</a></li>
            <li><a href="#reviews" className="hover:text-emerald-400 transition">Reviews</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 font-serif">Destinations</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Skardu Valley</li>
            <li>Hunza Valley</li>
            <li>Deosai Plains</li>
            <li>Astore & Minimarg</li>
            <li>Khaplu & Shigar</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 font-serif">Contact Us</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-emerald-400" /> +92 349 5100509</li>
            <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-emerald-400" /> info@njptourskardu.com</li>
            <li className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-emerald-400" /> Yadgar Chowk, Skardu, Gilgit-Baltistan</li>
            {paymentLink && (
              <li>
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 text-amber-300 hover:text-amber-200 transition"
                >
                  <CreditCard className="w-4 h-4" /> Pay Now
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
        © 2026 NJP Tour Skardu. All Rights Reserved.
      </div>
    </footer>
  );
}