import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const easypaisaPaymentLink = import.meta.env.VITE_EASYPAISA_PAYMENT_LINK;

export function BookingModal({ isOpen, onClose, selectedPackage }: { isOpen: boolean; onClose: () => void; selectedPackage?: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    travel_date: '',
    adults: 2,
    children: 0,
    transport: 'Private Car',
    hotel_preference: 'Standard 3-Star',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isSupabaseConfigured) {
      setError('Booking is temporarily unavailable. Please contact us on WhatsApp.');
      return;
    }

    setLoading(true);

    try {
      const booking = {
        ...formData,
        package_title: selectedPackage ? selectedPackage.title : 'Customized Package',
        user_id: null,
        destination_id: null,
        booking_date: `${formData.travel_date}T00:00:00.000Z`,
        status: 'pending',
        payment_status: 'unpaid'
      } as const;

      const { error } = await supabase.from('bookings').insert([booking]);
      if (error) throw error;

      setSubmitted(true);
    } catch {
      setError('We could not send your booking request. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 relative shadow-2xl my-8">
        <button onClick={() => { setSubmitted(false); onClose(); }} aria-label="Close booking form" className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-gray-900">Booking Request Received!</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Thank you! Our travel coordinator will contact you shortly via WhatsApp or phone call to finalize your itinerary.
            </p>
            {easypaisaPaymentLink ? (
              <a
                href={easypaisaPaymentLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl text-sm"
              >
                Pay via Easypaisa
              </a>
            ) : (
              <p className="text-gray-500 text-xs max-w-md mx-auto">
                Payment link will be shared by our coordinator.
              </p>
            )}
            <button 
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-6 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Reservation Form</span>
              <h3 className="text-2xl font-bold font-serif text-gray-900">
                {selectedPackage ? `Book: ${selectedPackage.title}` : 'Book Your Tour Package'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                    placeholder="Muhammad Ali"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                    placeholder="03495100509"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    value={formData.whatsapp} 
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                    placeholder="03495100509"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Travel Date *</label>
                <input
                  type="date"
                  required
                  value={formData.travel_date}
                  onChange={e => setFormData({...formData, travel_date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Adults</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={formData.adults} 
                    onChange={e => setFormData({...formData, adults: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Children</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formData.children} 
                    onChange={e => setFormData({...formData, children: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Additional Message / Special Request</label>
                <textarea 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:border-emerald-600 resize-none"
                  placeholder="Any specific hotel preferences or custom stops..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition text-sm"
              >
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}