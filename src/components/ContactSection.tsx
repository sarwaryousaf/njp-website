import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageSquareText, Phone, Send } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

export function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('Please fill in your name, email, and message.');
      setStatusType('error');
      return;
    }
    if (!isSupabaseConfigured) {
      setStatus('Contact form is temporarily unavailable. Please contact us by phone or WhatsApp.');
      setStatusType('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim() || 'General Inquiry',
        message: form.message.trim(),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('contact_messages').insert([payload]);

      if (error) throw error;

      setForm(initialForm);
      setStatus('Thank you! Your message has been sent successfully.');
      setStatusType('success');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('We could not send your message. Please try again or contact us by phone or WhatsApp.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            <MessageSquareText className="w-3.5 h-3.5" /> Contact Us
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold font-serif text-gray-900">Let’s Plan Your Next Adventure</h2>
          <p className="mt-3 text-gray-600">Send us your travel requirements and our team will reach out with a personalized plan.</p>
        </div>

        <div className="mb-12 overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          <iframe
            title="NJP Tour Skardu Map"
            src="https://www.google.com/maps?q=Yadgar%20Chowk%20Skardu&z=14&output=embed"
            className="h-[300px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12">
          <div className="rounded-3xl bg-slate-950 text-white p-8 shadow-xl">
            <h3 className="text-2xl font-bold font-serif mb-6">Get in touch</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                  <a href="tel:+923495100509" className="text-white hover:text-emerald-300">+92 349 5100509</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Email</p>
                  <a href="mailto:info@njptourskardu.com" className="text-white hover:text-emerald-300">info@njptourskardu.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Location</p>
                  <p className="text-white">Yadgar Chowk, Skardu, Gilgit-Baltistan</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/923495100509?text=Hello%20NJP%20Tour%20Skardu,%20I%20want%20to%20ask%20about%20your%20packages."
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              <MessageSquareText className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="03xx-xxxxxxx"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(event) => handleChange('subject', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Tour inquiry"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(event) => handleChange('message', event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Tell us about your trip and destination preferences..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {status && (
                  <div role={statusType === 'error' ? 'alert' : 'status'} className={`inline-flex items-center gap-2 text-sm font-medium ${statusType === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    {status}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
