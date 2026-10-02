import React from 'react';
import { Award, Users, ShieldAlert, Sliders, Hotel } from 'lucide-react';

const reasons = [
  { icon: Award, title: 'Local Experts', desc: 'GB Based team with extensive ground knowledge and local insights.' },
  { icon: Users, title: 'Private Tours', desc: 'No overcrowded buses. Enjoy personal cars and 4x4 jeeps exclusively for your group.' },
  { icon: ShieldAlert, title: 'Experienced Drivers', desc: 'Skilled mountain drivers specialized in navigating high-altitude terrains safely.' },
  { icon: Sliders, title: 'Customized Packages', desc: 'Itineraries tailored exactly to your timeline, budget, and family preferences.' },
  { icon: Hotel, title: 'Hotel & Resorts', desc: 'Handpicked luxury and standard accommodations with scenic mountain views.' }
];

export function WhyTravelWithUs() {
  return (
    <section id="about" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=1920" alt="Mountain bg" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">Why Travel With NJP?</h2>
          <p className="text-gray-300">We are a local Gilgit-Baltistan tour company committed to giving you the absolute best travel experience with safety, comfort, and care.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:border-emerald-500/50 transition">
                <div className="p-3.5 bg-emerald-600/20 text-emerald-400 rounded-2xl w-fit mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}