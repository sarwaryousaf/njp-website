import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, CreditCard } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const paymentLink = import.meta.env.VITE_EASYPAISA_PAYMENT_LINK;

export function PackagesSection({ onSelectPackage }: { onSelectPackage: (pkg: any) => void }) {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLivePackages() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      
      // Admin dashboard wali table se data fetch karna
      const { data, error } = await supabase
        .from('packages')
        .select('id, title, duration, location, price, description, cover_image, created_at')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.id,
          title: item.title,
          duration: item.duration || '4 Nights / 5 Days',
          location: item.location || 'Gilgit-Baltistan',
          price: item.price,
          description: item.description,
          image: item.cover_image || 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=800'
        }));
        setPackages(formatted);
      }
      setLoading(false);
    }

    fetchLivePackages();
  }, []);

  return (
    <section id="packages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-4">Popular Tour Packages</h2>
          <p className="text-gray-600">Choose from our most loved tours or get a customized package tailored precisely to your preferences.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-lg font-semibold">No packages available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold">
                      {pkg.price > 0 ? `PKR ${pkg.price.toLocaleString()}` : 'Custom Pricing'}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-xs font-semibold text-emerald-700">
                      <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" /> {pkg.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif text-gray-900">{pkg.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{pkg.description}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> {pkg.location}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button 
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full py-3.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    View Details & Book <ArrowRight className="w-4 h-4" />
                  </button>
                  {paymentLink && (
                    <a
                      href={paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 w-full py-3 border border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-sm"
                    >
                      <CreditCard className="w-4 h-4" /> Pay Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}