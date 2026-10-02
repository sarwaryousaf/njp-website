import React from 'react';
import { ShieldCheck, MapPin, Compass, MessageCircle, CreditCard } from 'lucide-react';

const paymentLink = import.meta.env.VITE_EASYPAISA_PAYMENT_LINK;

export function Hero({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
      {/* Background Cinematic Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=1920" 
          alt="Skardu Landscapes" 
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center lg:text-left">
        <div className="max-w-3xl space-y-6 lg:ml-0 mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-4 h-4" /> NORTH JOURNEY PARTNER
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif leading-tight">
            Explore the Majestic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Gilgit-Baltistan</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl font-light">
            Travel with NJP — Your Local Travel Partner. Experience Skardu, Hunza, Deosai, and Astore with ultimate safety, comfort, and professional local guides.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
            {['Private Trips', 'Customized Tours', 'By Air & Road', '4x4 Jeeps', 'Hotel Reservations'].map((item, idx) => (
              <span key={idx} className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/15 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {item}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <a 
              href="#packages"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-600/40 transition text-center"
            >
              Explore Our Packages
            </a>
            <a 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              Contact Us
            </a>
            {paymentLink && (
              <a
                href={paymentLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" /> Pay Now
              </a>
            )}
            <a 
              href="https://wa.me/923495100509?text=Hello%20NJP%20Tour%20Skardu,%20I%20want%20to%20inquire%20about%20your%20tours."
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}