import React, { useState, useEffect, useMemo } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Package, CalendarCheck, 
  MessageSquare, Mail, LogOut, Trash2, Plus, ShieldCheck, Edit3, X, Check, Save 
} from 'lucide-react';

const normalizeWhatsAppNumber = (phone: string) => {
  const trimmedPhone = phone.trim();
  const digits = trimmedPhone.replace(/\D/g, '');

  if (!digits) return '';
  if (trimmedPhone.startsWith('+')) return digits;
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  if (digits.startsWith('92')) return digits;
  return `92${digits}`;
};

export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'packages' | 'messages' | 'reviews'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Add / Edit Package States
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoginError('Admin sign-in is unavailable until Supabase is configured.');
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const adminSession = session?.user.app_metadata?.role === 'admin' ? session : null;
      setSession(adminSession);
      if (adminSession) fetchAdminData();
      else {
        setBookings([]);
        setPackages([]);
        setMessages([]);
        setReviews([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      const queries = [
        {
          key: 'bookings',
          query: supabase.from('bookings').select('id, name, phone, whatsapp, email, message, package_title, travel_date, adults, children, status, created_at').order('created_at', { ascending: false })
        },
        {
          key: 'packages',
          query: supabase.from('packages').select('id, title, description, price, duration, location, cover_image, created_at').order('created_at', { ascending: false })
        },
        {
          key: 'messages',
          query: supabase.from('contact_messages').select('id, name, email, phone, subject, message, created_at').order('created_at', { ascending: false })
        },
        {
          key: 'reviews',
          query: supabase.from('reviews').select('id, name, package_name, rating, review, is_approved, created_at').order('created_at', { ascending: false })
        }
      ] as const;

      const results = await Promise.allSettled(
        queries.map(async ({ key, query }) => {
          const result = await query;
          if (result.error) {
            throw new Error(`${key}:${result.error.message}`);
          }
          return { key, data: result.data ?? [] };
        })
      );

      const nextBookings: any[] = [];
      const nextPackages: any[] = [];
      const nextMessages: any[] = [];
      const nextReviews: any[] = [];
      const failedTables: string[] = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { key, data } = result.value;
          if (key === 'bookings') nextBookings.push(...data);
          if (key === 'packages') nextPackages.push(...data);
          if (key === 'messages') nextMessages.push(...data);
          if (key === 'reviews') nextReviews.push(...data);
        } else {
          const failure = result.reason?.message || 'Unknown error';
          const separatorIndex = failure.indexOf(':');
          const tableName = separatorIndex >= 0 ? failure.slice(0, separatorIndex) : 'unknown table';
          const errorMessage = separatorIndex >= 0 ? failure.slice(separatorIndex + 1).trim() : failure;
          failedTables.push(`${tableName} (${errorMessage})`);
        }
      });

      setBookings(nextBookings);
      setPackages(nextPackages);
      setMessages(nextMessages);
      setReviews(nextReviews);

      if (failedTables.length > 0) {
        setDataError(
          `Some dashboard data is unavailable: ${failedTables.join(', ')}.`
        );
      } else {
        setDataError('');
      }
    } catch {
      setDataError('Dashboard data could not be loaded. Check your Supabase connection and admin access permissions.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!isSupabaseConfigured) {
      setLoginError('Admin sign-in is unavailable until Supabase is configured.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || data.user?.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        setLoginError('Unable to sign in with these credentials.');
      } else {
        setSession(data.session);
      }
    } catch {
      setLoginError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const deleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (!error) setBookings(bookings.filter(b => b.id !== id));
    }
  };

  // Save or Update Package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const packageData = {
      title,
      description,
      price: parseFloat(price) || 0,
      duration,
      location,
      cover_image: coverImage
    };

    if (editingPackageId) {
      const { error } = await supabase.from('packages').update(packageData).eq('id', editingPackageId);
      if (error) {
        alert('Error updating package: ' + error.message);
      } else {
        alert('Package successfully updated!');
        setEditingPackageId(null);
        resetPackageForm();
        fetchAdminData();
      }
    } else {
      const { error } = await supabase.from('packages').insert([packageData]);
      if (error) {
        alert('Error adding package: ' + error.message);
      } else {
        alert('Package successfully added!');
        resetPackageForm();
        fetchAdminData();
      }
    }
  };

  const startEditingPackage = (pkg: any) => {
    setEditingPackageId(pkg.id);
    setTitle(pkg.title || '');
    setDescription(pkg.description || '');
    setPrice(pkg.price?.toString() || '');
    setDuration(pkg.duration || '');
    setLocation(pkg.location || '');
    setCoverImage(pkg.cover_image || '');
    setIsAddingPackage(true);
  };

  const deletePackage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tour package?')) {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (!error) {
        setPackages(packages.filter(p => p.id !== id));
      } else {
        alert('Error deleting package: ' + error.message);
      }
    }
  };

  const updateReviewApproval = async (id: string, isApproved: boolean) => {
    const { error } = await supabase.from('reviews').update({ is_approved: isApproved }).eq('id', id);
    if (!error) {
      setReviews(reviews.map(review => review.id === id ? { ...review, is_approved: isApproved } : review));
    }
  };

  const deleteReview = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) {
        setReviews(reviews.filter(review => review.id !== id));
      }
    }
  };

  const bookingStats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthStart = new Date(currentYear, currentMonth, 1);
    const yearStart = new Date(currentYear, 0, 1);

    const monthlyMap = new Map<string, number>();

    bookings.forEach((booking) => {
      const date = booking.created_at ? new Date(booking.created_at) : null;
      if (!date || Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
    });

    const monthlySummary = [...monthlyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([key, count]) => ({
        label: new Date(`${key}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count
      }));

    const thisMonthBookings = bookings.filter((booking) => {
      const date = booking.created_at ? new Date(booking.created_at) : null;
      return !!date && !Number.isNaN(date.getTime()) && date >= monthStart;
    }).length;

    const thisYearBookings = bookings.filter((booking) => {
      const date = booking.created_at ? new Date(booking.created_at) : null;
      return !!date && !Number.isNaN(date.getTime()) && date >= yearStart;
    }).length;

    const confirmedThisYear = bookings.filter((booking) => {
      const date = booking.created_at ? new Date(booking.created_at) : null;
      return !!date && !Number.isNaN(date.getTime()) && date >= yearStart && booking.status === 'confirmed';
    }).length;

    return {
      thisMonthBookings,
      thisYearBookings,
      confirmedThisYear,
      monthlySummary
    };
  }, [bookings]);

  const resetPackageForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration('');
    setLocation('');
    setCoverImage('');
    setIsAddingPackage(false);
    setEditingPackageId(null);
  };

  if (loading && !session) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-emerald-800 font-medium">Loading Admin Portal...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-emerald-600/30 rounded-full text-emerald-400 mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif">NJP Admin Portal</h2>
            <p className="text-gray-300 text-sm mt-1">Sign in to manage tours, bookings & inquiries</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1 font-semibold">Admin Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition"
                placeholder="admin@njptourskardu.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1 font-semibold">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition duration-200"
            >
              Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-lg font-bold text-white font-serif">NJP Tour Skardu</h1>
            <p className="text-xs text-emerald-400 font-medium">Admin Dashboard</p>
          </div>
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'bookings' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <CalendarCheck className="w-4 h-4" /> Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab('packages')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'packages' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <Package className="w-4 h-4" /> Packages ({packages.length})
            </button>
            <button 
              onClick={() => setActiveTab('messages')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'messages' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <MessageSquare className="w-4 h-4" /> Inquiries ({messages.length})
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'reviews' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <Check className="w-4 h-4" /> Reviews ({reviews.filter(r => r.is_approved).length})
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <nav aria-label="Dashboard sections" className="fixed bottom-0 left-0 right-0 z-30 flex gap-1 overflow-x-auto border-t border-slate-700 bg-slate-900 p-2 md:hidden">
        {(['overview', 'bookings', 'packages', 'messages', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold capitalize ${activeTab === tab ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h2 className="text-xl font-bold text-gray-800 font-serif capitalize">{activeTab} Management</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">Active Session</span>
            <button onClick={handleLogout} className="md:hidden text-red-600 text-sm font-semibold">Logout</button>
          </div>
        </header>

        <div className="p-6">
          {dataError && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <span>{dataError}</span>
              <button type="button" onClick={() => void fetchAdminData()} className="font-semibold underline underline-offset-2">
                Retry
              </button>
            </div>
          )}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CalendarCheck className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Bookings</p>
                      <h3 className="text-3xl font-bold text-amber-600 mt-1">{bookings.filter(b => b.status === 'pending').length}</h3>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><CalendarCheck className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Packages</p>
                      <h3 className="text-3xl font-bold text-emerald-600 mt-1">{packages.length}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Package className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Inquiries</p>
                      <h3 className="text-3xl font-bold text-purple-600 mt-1">{messages.length}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><MessageSquare className="w-6 h-6" /></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved Reviews</p>
                      <h3 className="text-3xl font-bold text-orange-600 mt-1">{reviews.filter(r => r.is_approved).length}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Check className="w-6 h-6" /></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Booking Analytics</h3>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">This Month</p>
                      <h4 className="text-2xl font-bold text-emerald-900 mt-1">{bookingStats.thisMonthBookings}</h4>
                    </div>
                    <div className="rounded-xl bg-sky-50 p-4">
                      <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">This Year</p>
                      <h4 className="text-2xl font-bold text-sky-900 mt-1">{bookingStats.thisYearBookings}</h4>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Confirmed This Year</p>
                    <div className="flex items-end justify-between gap-3">
                      <span className="text-3xl font-bold text-gray-900">{bookingStats.confirmedThisYear}</span>
                      <span className="text-xs text-gray-500">from current year bookings</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Monthly Booking Trend</h3>
                  {bookingStats.monthlySummary.length === 0 ? (
                    <p className="text-gray-500 text-sm">No booking data available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {bookingStats.monthlySummary.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                          <span className="text-sm text-gray-600">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">{item.count} bookings</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
                <strong>Traffic note:</strong> This admin dashboard shows booking analytics from your database. Real website visitor traffic (visits, page views, unique users) requires an external analytics tool such as Google Analytics, Plausible, or Umami.
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Recent Bookings Queue</h3>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No bookings received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-gray-400 uppercase text-xs tracking-wider">
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Package</th>
                          <th className="pb-3 font-semibold">Travel Date</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="py-3 font-medium text-gray-900">{b.name} <span className="block text-xs text-gray-500">{b.phone}</span></td>
                            <td className="py-3 text-gray-700">{b.package_title || 'Custom Tour'}</td>
                            <td className="py-3 text-gray-600">{b.travel_date}</td>
                            <td className="py-3">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-emerald-600 hover:text-emerald-800 font-semibold text-xs">Confirm</button>
                              <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="text-red-600 hover:text-red-800 font-semibold text-xs">Cancel</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">All Tour Bookings</h3>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No bookings available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-400 uppercase text-xs tracking-wider">
                        <th className="pb-3 font-semibold">Customer Details</th>
                        <th className="pb-3 font-semibold">Package / Plan</th>
                        <th className="pb-3 font-semibold">Date & Persons</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="py-3">
                            <p className="font-semibold text-gray-900">{b.name}</p>
                            <p className="text-xs text-gray-500">Phone: {b.phone} | WhatsApp: {b.whatsapp || 'N/A'}</p>
                            {b.email && <p className="text-xs text-gray-500">Email: {b.email}</p>}
                          </td>
                          <td className="py-3 text-gray-700 font-medium">
                            {b.package_title || 'Customized Trip'}
                            {b.message && <p className="mt-1 max-w-xs whitespace-normal text-xs font-normal text-gray-500">{b.message}</p>}
                          </td>
                          <td className="py-3 text-gray-600">
                            {b.travel_date}
                            <span className="block text-xs text-gray-400">{b.adults} Adults, {b.children} Children</span>
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-emerald-600 hover:underline text-xs font-semibold">Confirm</button>
                            <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="text-amber-600 hover:underline text-xs font-semibold">Cancel</button>
                            <button onClick={() => deleteBooking(b.id)} className="text-red-600 hover:underline text-xs font-semibold">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-serif">Manage Tour Packages</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add, edit or remove tour destinations from Supabase database.</p>
                </div>
                <button 
                  onClick={() => { resetPackageForm(); setIsAddingPackage(!isAddingPackage); }} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition shadow-md"
                >
                  {isAddingPackage ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingPackage ? 'Cancel' : 'Add New Package'}
                </button>
              </div>

              {/* Add / Edit Package Form Modal/Box */}
              {isAddingPackage && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 transition animate-fadeIn">
                  <h4 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                    {editingPackageId ? <Edit3 className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4 text-emerald-600" />}
                    {editingPackageId ? 'Edit Tour Package' : 'Create New Tour Package'}
                  </h4>
                  <form onSubmit={handleSavePackage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Package Title</label>
                      <input 
                        type="text" 
                        required 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="e.g., Skardu Explorer Package" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Price (PKR)</label>
                      <input 
                        type="number" 
                        required 
                        value={price} 
                        onChange={e => setPrice(e.target.value)} 
                        placeholder="e.g., 45000" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Duration</label>
                      <input 
                        type="text" 
                        required 
                        value={duration} 
                        onChange={e => setDuration(e.target.value)} 
                        placeholder="e.g., 4 Nights / 5 Days" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Location / Spots</label>
                      <input 
                        type="text" 
                        required 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="e.g., Skardu, Kachura, Shigar" 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={coverImage} 
                        onChange={e => setCoverImage(e.target.value)} 
                        placeholder="https://images.unsplash.com/..." 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description</label>
                      <textarea 
                        required 
                        rows={3}
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Describe tour highlights..." 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <button 
                        type="button" 
                        onClick={resetPackageForm} 
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-sm transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        {editingPackageId ? 'Update Package' : 'Publish Package'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Packages List Grid */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {packages.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No packages found in Supabase database. Click "Add New Package" to create one.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map(pkg => (
                      <div key={pkg.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div>
                          <img src={pkg.cover_image || 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=800'} alt={pkg.title} className="h-44 w-full object-cover" />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-gray-900 font-serif">{pkg.title}</h4>
                              <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md">PKR {pkg.price?.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-emerald-600 font-semibold mb-2">{pkg.duration} • {pkg.location}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{pkg.description}</p>
                          </div>
                        </div>
                        <div className="p-4 pt-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                          <span className="text-xs text-gray-400">ID: {pkg.id.slice(0, 6)}...</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => startEditingPackage(pkg)} 
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button 
                              onClick={() => deletePackage(pkg.id)} 
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Customer Contact Inquiries</h3>
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No contact messages received yet.</p>
              ) : (
                <div className="space-y-4">
                  {messages.map(msg => {
                    const whatsappNumber = normalizeWhatsAppNumber(msg.phone || '');
                    const replySubject = `Re: ${msg.subject || 'General Inquiry'}`;
                    const replyBody = `Hi ${msg.name}, thanks for contacting NJP Tour Skardu.`;

                    return (
                      <div key={msg.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{msg.name}</h4>
                            <p className="text-xs text-gray-500">{msg.email} {msg.phone ? `• ${msg.phone}` : ''}</p>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-medium text-emerald-800 mb-1">Subject: {msg.subject || 'General Inquiry'}</p>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{msg.message}</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {msg.email && (
                            <a
                              href={`mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(`Hi ${msg.name},\n\n`)}`}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                            >
                              <Mail className="h-4 w-4" /> Reply by email
                            </a>
                          )}
                          {whatsappNumber && (
                            <a
                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(replyBody)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
                            >
                              <MessageSquare className="h-4 w-4" /> Reply on WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Review Moderation</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No reviews submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{review.name}</h4>
                          <p className="text-xs text-gray-500">{review.package_name || 'General Customer'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${review.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {review.is_approved ? 'Approved' : 'Pending'}
                          </span>
                          <button onClick={() => updateReviewApproval(review.id, !review.is_approved)} className="text-xs font-semibold text-emerald-700 hover:underline">
                            {review.is_approved ? 'Hide' : 'Approve'}
                          </button>
                          <button onClick={() => deleteReview(review.id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 mb-2">
                        {[...Array(Number(review.rating) || 5)].map((_, i) => (
                          <Check key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3">{review.review}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}