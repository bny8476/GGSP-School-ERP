"use client";

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, Search, Users, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    visibility: 'All',
    mediaUrls: '' // Using comma-separated strings for MVP
  });

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlbums(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '', description: '', date: new Date().toISOString().split('T')[0], visibility: 'All', mediaUrls: ''
    });
    setEditingAlbumId(null);
    setActiveTab('list');
  };

  const openEdit = (album: any) => {
    setEditingAlbumId(album._id);
    setFormData({
      title: album.title,
      description: album.description || '',
      date: new Date(album.date).toISOString().split('T')[0],
      visibility: album.visibility || 'All',
      mediaUrls: album.mediaUrls ? album.mediaUrls.join(', ') : ''
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAlbums();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingAlbumId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${editingAlbumId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/gallery`;

      const payload = {
        ...formData,
        mediaUrls: formData.mediaUrls.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      const res = await fetch(url, {
        method: editingAlbumId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingAlbumId ? 'Album updated successfully!' : 'Album created successfully!');
        resetForm();
        fetchAlbums();
      } else {
        toast.error('Error saving album');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving album');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAlbums = albums.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Photo & Video Gallery</h1>
          <p className="text-slate-500 mt-1">Share event albums and media with parents and staff.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingAlbumId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Albums
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingAlbumId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingAlbumId ? 'Edit Album' : 'New Album'}
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
                placeholder="Search albums..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading albums...</div>
            ) : filteredAlbums.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No albums created yet</h3>
                <p>Add a new album to start sharing photos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlbums.map((album) => (
                  <div key={album._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                    {/* Thumbnail Cover Placeholder */}
                    <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                      {album.mediaUrls && album.mediaUrls.length > 0 && (album.mediaUrls[0].endsWith('.jpg') || album.mediaUrls[0].endsWith('.png')) ? (
                        <img src={album.mediaUrls[0]} alt={album.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <span className="text-xs font-bold uppercase tracking-wider">{album.mediaUrls?.length || 0} Media Items</span>
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm">
                        <button onClick={() => openEdit(album)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(album._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{album.title}</h3>
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ml-2">
                          {new Date(album.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {album.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                          {album.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 text-xs font-medium text-slate-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1.5 text-slate-400" />
                          Visible to: {album.visibility}
                        </div>
                        {album.mediaUrls && album.mediaUrls.length > 0 && (
                          <div className="flex items-center text-indigo-600">
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            {album.mediaUrls.length} Files
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
              {editingAlbumId ? 'Edit Album Details' : 'Create New Album'}
            </h2>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Album Title</label>
              <input required type="text" placeholder="e.g. Sports Day Photos 2026" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Event Date</label>
                <input required type="date" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Visibility Level</label>
                <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})}>
                  <option>All</option>
                  <option>Parents</option>
                  <option>Staff</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea rows={3} placeholder="Write a short description..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Media URLs</label>
              <textarea rows={4} placeholder="Paste image/video URLs separated by commas (e.g. https://imgur.com/..., https://...)" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium text-sm leading-relaxed" value={formData.mediaUrls} onChange={e => setFormData({...formData, mediaUrls: e.target.value})}></textarea>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Note: MVP supports remote URL links. File upload capability can be added later.</p>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : (editingAlbumId ? 'Update Album' : 'Create Album')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
