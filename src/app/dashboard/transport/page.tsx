"use client";

import { useState, useEffect } from 'react';
import { Bus, MapPin, Users, Plus, Trash2, Edit2, CheckCircle2, Navigation, Phone, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransportPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // View state
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    routeName: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: ''
  });
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transport`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStop = () => {
    setStops([...stops, { stopName: '', pickupTime: '', dropTime: '', transportFee: 0 }]);
  };

  const handleStopChange = (index: number, field: string, value: any) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const removeStop = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const resetForm = () => {
    setFormData({ routeName: '', vehicleNumber: '', driverName: '', driverPhone: '' });
    setStops([]);
    setEditingRouteId(null);
    setActiveTab('list');
  };

  const openEdit = (route: any) => {
    setEditingRouteId(route._id);
    setFormData({
      routeName: route.routeName,
      vehicleNumber: route.vehicleNumber,
      driverName: route.driverName,
      driverPhone: route.driverPhone
    });
    setStops(route.stops || []);
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transport/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchRoutes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData, stops };
      const url = editingRouteId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/transport/${editingRouteId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/transport`;
      
      const res = await fetch(url, {
        method: editingRouteId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingRouteId ? 'Route updated!' : 'Route created!');
        resetForm();
        fetchRoutes();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving route');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRoutes = routes.filter(r => 
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transport Management</h1>
          <p className="text-slate-500 mt-1">Manage bus routes, drivers, and pickup/drop-off stops.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingRouteId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Routes
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingRouteId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingRouteId ? 'Edit Route' : 'New Route'}
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search routes or drivers..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
            <div className="text-sm font-bold text-slate-500 flex items-center">
              <Navigation className="h-4 w-4 mr-2" /> Total Routes: {routes.length}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading routes...</div>
            ) : filteredRoutes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Bus className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No routes found</h3>
                <p>Add a new route to start managing transport.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRoutes.map((route) => (
                  <div key={route._id} className="border border-slate-200 rounded-2xl p-0 hover:shadow-lg transition-shadow bg-white flex flex-col overflow-hidden group">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
                          <Bus className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{route.routeName}</h3>
                          <div className="flex items-center text-xs font-bold text-slate-500 mt-1">
                            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded mr-2 uppercase">{route.vehicleNumber}</span>
                            <Phone className="h-3 w-3 mr-1" /> {route.driverName} ({route.driverPhone})
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(route)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(route._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="p-5 flex-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> Route Stops ({route.stops?.length || 0})</h4>
                      {route.stops && route.stops.length > 0 ? (
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                          {route.stops.map((stop: any, idx: number) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-indigo-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                <div className="font-bold text-slate-700 text-sm">{stop.stopName}</div>
                                <div className="flex items-center justify-between mt-1.5">
                                  <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {stop.pickupTime} &bull; {stop.dropTime}
                                  </div>
                                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                    ₹{stop.transportFee}/mo
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic text-center py-4">No stops configured for this route.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center border-b border-slate-100 pb-4 mb-6">
                <Bus className="h-6 w-6 mr-3 text-indigo-500" /> 
                Vehicle & Driver Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Route Name</label>
                  <input required type="text" placeholder="e.g. Route A - Downtown" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-slate-50" value={formData.routeName} onChange={e => setFormData({...formData, routeName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Number</label>
                  <input required type="text" placeholder="e.g. KA-01-XY-1234" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-slate-50 uppercase" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Driver Name</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-slate-50" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Driver Phone</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-slate-50" value={formData.driverPhone} onChange={e => setFormData({...formData, driverPhone: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-indigo-500" /> 
                  Route Stops
                </h2>
                <button type="button" onClick={handleAddStop} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-1.5" /> Add Stop
                </button>
              </div>

              {stops.length === 0 ? (
                <div className="py-10 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-slate-500">
                  <p className="font-medium">No stops added yet.</p>
                  <button type="button" onClick={handleAddStop} className="mt-2 text-indigo-600 font-bold hover:underline">Add First Stop</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stops.map((stop, idx) => (
                    <div key={idx} className="flex flex-col lg:flex-row gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm items-start lg:items-center relative">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center shadow-md z-10">{idx + 1}</div>
                      <div className="flex-1 w-full pl-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Stop Name / Landmark</label>
                        <input required type="text" className="w-full rounded-lg border-slate-300 text-sm p-2.5 font-medium" value={stop.stopName} onChange={e => handleStopChange(idx, 'stopName', e.target.value)} />
                      </div>
                      <div className="w-full lg:w-auto grid grid-cols-2 lg:flex gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Pickup</label>
                          <input required type="time" className="w-full rounded-lg border-slate-300 text-sm p-2.5 font-medium" value={stop.pickupTime} onChange={e => handleStopChange(idx, 'pickupTime', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Drop</label>
                          <input required type="time" className="w-full rounded-lg border-slate-300 text-sm p-2.5 font-medium" value={stop.dropTime} onChange={e => handleStopChange(idx, 'dropTime', e.target.value)} />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Fee (₹/mo)</label>
                          <input required type="number" min="0" className="w-full rounded-lg border-slate-300 text-sm p-2.5 font-medium" value={stop.transportFee} onChange={e => handleStopChange(idx, 'transportFee', Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="w-full lg:w-auto flex justify-end mt-2 lg:mt-0 lg:pt-6">
                        <button type="button" onClick={() => removeStop(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center disabled:opacity-50">
                {isSaving ? 'Saving...' : (editingRouteId ? 'Update Route' : 'Create Route')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
