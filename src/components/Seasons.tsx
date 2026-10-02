import React from 'react';
import { Sun, Snowflake, Leaf, Flower2 } from 'lucide-react';

const seasonsData = [
  {
    title: 'Spring',
    subtitle: 'Blossom Season',
    desc: 'Witness breathtaking Apricot and Cherry blossoms blooming across the valleys of Skardu and Hunza.',
    icon: Flower2,
    image: 'https://images.unsplash.com/photo-1590603098555-a4f995c734b4?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Summer',
    subtitle: 'Lakes, Valleys & Deosai',
    desc: 'Lush green pastures, crystal clear glacial lakes, and vibrant wildflowers in the Deosai Plains.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a563?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Autumn',
    subtitle: 'Golden Hunza',
    desc: 'Golden, red, and orange foliage painting the landscapes against the backdrop of snow-capped peaks.',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Winter',
    subtitle: 'Snow-Covered GB',
    desc: 'Magical frozen waterfalls, pristine white snowscapes, and serene winter mountain tranquility.',
    icon: Snowflake,
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&q=80&w=600'
  }
];

export function Seasons() {
  return (
    <section id="seasons" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-4">The 4 Seasons of Gilgit-Baltistan</h2>
          <p className="text-gray-600">Every season has a different story. Choose your favorite view and time to travel!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {seasonsData.map((season, idx) => {
            const Icon = season.icon;
            return (
              <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img src={season.image} alt={season.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">{season.subtitle}</span>
                    <h3 className="text-2xl font-bold font-serif">{season.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-gray-600 text-sm leading-relaxed">{season.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}