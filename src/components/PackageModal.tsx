import React from 'react';
import { X, Clock, MapPin, CheckCircle2, XCircle, Hotel, Car } from 'lucide-react';

interface PackageModalProps {
  tour: any | null;
  onClose: () => void;
  onBookNow: (tour: any) => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({ tour, onClose, onBookNow }) => {
  if (!tour) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden my-8 text-gray-900">
        
        {/* Header Image & Close Button */}
        <div className="relative h-72">
          <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-slate-900/80 backdrop-blur-md text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold">
              {tour.price > 0 ? `PKR ${tour.price.toLocaleString()}` : 'Custom Pricing'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-2">{tour.title}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Duration & Locations */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{tour.location}</span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{tour.description}</p>
          </div>

          {/* What's Included / Excluded Mock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
              <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What's Included
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Hotel Accommodations (Standard / Deluxe)</li>
                <li>• Daily Breakfast & Dinner</li>
                <li>• Private 4x4 Jeep / Transport</li>
                <li>• Professional Tour Driver / Guide</li>
              </ul>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl">
              <h4 className="font-bold text-rose-800 text-sm mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" /> What's Excluded
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Entry tickets to Forts and National Parks</li>
                <li>• Lunch and refreshments</li>
                <li>• Personal expenses and laundry</li>
                <li>• International or domestic airfares</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-500 block">Starting Price</span>
            <span className="text-lg font-bold text-emerald-700">
              {tour.price > 0 ? `PKR ${tour.price.toLocaleString()}` : 'Flexible / Custom'}
            </span>
          </div>
          <button
            onClick={() => { onClose(); onBookNow(tour); }}
            className="px-8 py-3.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition shadow-lg text-sm"
          >
            Proceed to Book Now
          </button>
        </div>

      </div>
    </div>
  );
};