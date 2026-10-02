import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, MapPin, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';

const paymentLink = import.meta.env.VITE_EASYPAISA_PAYMENT_LINK;

const faqs = [
  {
    question: 'Do you provide customized tours?',
    answer: 'Yes. We create private and family-friendly packages based on your dates, budget, and preferred destinations.'
  },
  {
    question: 'Can I book through WhatsApp?',
    answer: 'Absolutely. Most clients book through WhatsApp for quick coordination and instant confirmation.'
  },
  {
    question: 'Do you arrange transport and hotels?',
    answer: 'Yes. We handle accommodation, local transport, jeep arrangements, and travel planning for your trip.'
  },
  {
    question: 'What is the best time to visit Gilgit-Baltistan?',
    answer: 'Spring and summer are ideal for lush scenery and road trips, while autumn and winter are perfect for snow and serene landscapes.'
  }
];

export function ContactPage() {
  const handleOpenBooking = () => {
    window.location.href = '/#packages';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onOpenBooking={handleOpenBooking} />

      <div className="pt-24 pb-10">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="max-w-3xl text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 font-semibold">Need help planning?</p>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold font-serif leading-tight">Contact NJP Tour Skardu</h1>
              <p className="mt-4 text-lg text-slate-200">
                Plan your dream Gilgit-Baltistan holiday with a team that understands the region, the roads, and the experience.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/923495100509?text=Hello%20NJP%20Tour%20Skardu,%20I%20want%20to%20book%20a%20tour."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
                >
                  <MessageCircle className="w-4 h-4" /> Book on WhatsApp
                </a>
                {paymentLink && (
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:bg-amber-400 transition"
                  >
                    <span className="text-base">💳</span> Pay Now
                  </a>
                )}
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <Phone className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Call us</p>
                  <a href="tel:+923495100509" className="mt-2 block text-lg font-semibold text-gray-900">+92 349 5100509</a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-sky-100 p-2.5 text-sky-700">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email</p>
              <a href="mailto:info@njptourskardu.com" className="mt-2 block text-lg font-semibold text-gray-900">info@njptourskardu.com</a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-amber-100 p-2.5 text-amber-700">
                <Clock3 className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Office hours</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Mon - Sat</p>
              <p className="text-sm text-gray-600">9:00 AM - 9:00 PM</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Skardu, GB</p>
              <p className="text-sm text-gray-600">Yadgar Chowk</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-8">
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-700 font-semibold">FAQs</p>
              <h2 className="mt-2 text-3xl font-bold font-serif text-gray-900">Common Questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-100 p-1.5 text-emerald-700">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-6">
          <ContactSection />
        </div>
      </div>

      <a
        href="https://wa.me/923495100509?text=Hello%20NJP%20Tour%20Skardu,%20I%20need%20help%20with%20my%20trip."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 transition hover:scale-105 hover:bg-emerald-600"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      <Footer />
    </div>
  );
}
