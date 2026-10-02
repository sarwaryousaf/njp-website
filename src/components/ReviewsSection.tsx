import React, { useEffect, useState } from 'react';
import { Send, Star } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type ReviewItem = {
  id?: string;
  name: string;
  rating: number;
  review: string;
  package_name?: string;
  is_approved?: boolean;
  created_at?: string;
};

const defaultReviews: ReviewItem[] = [
  { name: 'Ayesha Raja', rating: 5, review: 'Everything was well organized, the driver was very professional and the views were beyond beautiful.', package_name: 'Skardu Explorer Package' },
  { name: 'Usman Malik', rating: 5, review: 'NJP Tour Skardu made our family trip to Hunza and Skardu completely stress-free. Highly recommended!', package_name: 'Skardu + Hunza Grand Tour' },
  { name: 'Dr. Tariq Mahmood', rating: 5, review: 'Exceptional hospitality and wonderful hotels. The 4x4 jeep safari to Deosai was unforgettable.', package_name: 'Deosai Wildlife Safari' }
];

const initialForm = {
  name: '',
  package_name: '',
  rating: 5,
  review: ''
};

export function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, name, rating, review, package_name, is_approved, created_at')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        if (data && data.length > 0) {
          setReviews(
            data.map((item) => ({
              id: item.id,
              name: item.name,
              rating: Number(item.rating || 5),
              review: item.review,
              package_name: item.package_name,
              is_approved: item.is_approved,
              created_at: item.created_at
            }))
          );
        }
      } catch (error) {
        console.warn('Reviews table not available yet, showing fallback testimonials.', error);
      }
    };

    fetchReviews();
  }, []);

  const handleChange = (field: keyof typeof initialForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.review.trim()) {
      setMessage('Please enter your name and review before submitting.');
      return;
    }
    if (!isSupabaseConfigured) {
      setMessage('Review submission is temporarily unavailable. Please try again later.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const payload = {
        name: form.name.trim(),
        package_name: form.package_name.trim() || 'General Customer',
        rating: Number(form.rating),
        review: form.review.trim(),
        is_approved: false
      };

      const { error } = await supabase.from('reviews').insert([payload]);

      if (error) throw error;

      setForm(initialForm);
      setMessage('Thank you! Your review has been submitted for moderation.');
    } catch (error) {
      console.error('Review submit error:', error);
      setMessage('Review could not be submitted right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600">Read authentic feedback from travelers who explored GB with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={rev.id ?? `${rev.name}-${idx}`} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4" aria-label={`${rev.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-gray-300 fill-none'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm leading-relaxed mb-6">"{rev.review}"</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold text-gray-900">{rev.name}</h4>
                <p className="text-xs text-emerald-700 font-medium">{rev.package_name || 'Traveler Review'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6">Leave a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Package</label>
                  <input
                    type="text"
                    value={form.package_name}
                    onChange={(event) => handleChange('package_name', event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Optional package name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={form.rating}
                  onChange={(event) => handleChange('rating', Number(event.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black focus:border-emerald-500 focus:outline-none"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows={5}
                  value={form.review}
                  onChange={(event) => handleChange('review', event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Tell us about your trip experience..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>

                {message && (
                  <p className="text-sm text-emerald-700 font-medium">{message}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}