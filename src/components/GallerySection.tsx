import React, { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=800', title: 'Upper Kachura Lake, Skardu' },
  { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800', title: 'Attabad Lake, Hunza' },
  { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800', title: 'Passu Cones' },
  { url: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&q=80&w=800', title: 'Deosai National Park' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', title: 'Shigar Fort Garden' },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', title: 'Rama Meadows, Astore' }
];

export function GallerySection() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-4">Beautiful Moments</h2>
          <p className="text-gray-600">Some glimpses from our memorable tours across Gilgit-Baltistan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <button
              type="button"
              key={idx} 
              onClick={() => setSelectedImg(img.url)}
              aria-label={`View ${img.title}`}
              className="group relative h-72 w-full rounded-3xl overflow-hidden shadow-md text-left"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = galleryImages[0].url;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                <p className="text-white font-medium text-sm">{img.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedImg && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <div role="dialog" aria-modal="true" aria-label="Gallery image preview" className="relative">
            <button type="button" aria-label="Close image preview" onClick={() => setSelectedImg(null)} className="absolute -top-3 -right-3 z-10 rounded-full bg-white p-2 text-gray-900 shadow-lg">
              <X className="h-5 w-5" />
            </button>
            <img src={selectedImg} alt="Enlarged gallery view" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}