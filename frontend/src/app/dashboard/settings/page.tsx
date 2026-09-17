"use client";

import { useState, useEffect } from 'react';
import { User, Lock, Bell, Shield, Key, Save, AlertCircle, CheckCircle2, Mail, Phone, UserCircle } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setStatusMsg(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        // Update local storage user data as well
        const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...lsUser,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email
        }));
        setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setStatusMsg(null), 5000);
      } else {
        const err = await res.json();
        setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
      }
    } catch (error) {
      console.error(error);
      setStatusMsg({ type: 'error', text: 'A network error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'profile' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <User className="h-5 w-5 mr-3" /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'security' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Shield className="h-5 w-5 mr-3" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'notifications' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Bell className="h-5 w-5 mr-3" /> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12">
          {activeTab === 'profile' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center mb-8">
                <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-3xl border-4 border-white shadow-lg mr-6">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-slate-500 font-medium">{user?.role?.name || 'Staff Member'}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {statusMsg && (
                  <div className={`p-4 rounded-xl flex items-center ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />}
                    <p className="font-bold text-sm">{statusMsg.text}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-all hover:bg-white shadow-sm" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-all hover:bg-white shadow-sm" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="email" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-all hover:bg-white shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="tel" className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-all hover:bg-white shadow-sm" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-200 flex items-center disabled:opacity-70">
                    {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-slate-800 mb-6">Security Settings</h2>
              
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start mb-8">
                <AlertCircle className="h-6 w-6 text-amber-600 mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-amber-800 font-bold mb-1">Password Updates</h3>
                  <p className="text-amber-700 text-sm font-medium">To ensure maximum security, password resets are currently managed by your System Administrator. If you need to change your password, please contact the Admin team.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl p-5 flex justify-between items-center bg-white">
                  <div>
                    <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">Setup</button>
                </div>
                <div className="border border-slate-200 rounded-2xl p-5 flex justify-between items-center bg-white">
                  <div>
                    <h4 className="font-bold text-slate-800">Active Sessions</h4>
                    <p className="text-sm text-slate-500 font-medium">Manage devices currently logged into your account.</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">Manage</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-slate-800 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="block font-bold text-slate-800">New Admissions</span>
                        <span className="block text-sm text-slate-500 font-medium">Get notified when a new student application is received.</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="block font-bold text-slate-800">Daily Digest</span>
                        <span className="block text-sm text-slate-500 font-medium">Receive a daily summary of attendance and operations.</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
