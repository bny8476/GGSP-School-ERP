"use client";

import { useState, useEffect } from 'react';
import { Plus, BookOpen, Calendar, ChevronRight, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

type Curriculum = {
  _id: string;
  title: string;
  theme: string;
  grade: string;
  weekStartDate: string;
  weekEndDate: string;
  activities: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    description: string;
    learningOutcomes: string[];
  }[];
  createdBy?: {
    firstName: string;
    lastName: string;
  };
};

export default function CurriculumPage() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Curriculum | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    grade: 'LKG',
    weekStartDate: '',
    weekEndDate: '',
  });

  const [activities, setActivities] = useState<any>({
    Monday: { description: '', learningOutcomes: '' },
    Tuesday: { description: '', learningOutcomes: '' },
    Wednesday: { description: '', learningOutcomes: '' },
    Thursday: { description: '', learningOutcomes: '' },
    Friday: { description: '', learningOutcomes: '' },
  });

  const fetchCurriculums = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/curriculum`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurriculums(data);
      }
    } catch (error) {
      console.error('Failed to fetch curriculums', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Transform activities object into array
      const activitiesArray = Object.keys(activities).map(day => ({
        day,
        description: activities[day].description,
        learningOutcomes: activities[day].learningOutcomes.split(',').map((o: string) => o.trim()).filter((o: string) => o)
      })).filter(a => a.description); // Only include days with a description

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/curriculum`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          activities: activitiesArray
        })
      });

      if (res.ok) {
        toast.success('Curriculum plan created!');
        fetchCurriculums();
        setShowCreateModal(false);
        // Reset form
        setFormData({ title: '', theme: '', grade: 'LKG', weekStartDate: '', weekEndDate: '' });
        setActivities({
          Monday: { description: '', learningOutcomes: '' },
          Tuesday: { description: '', learningOutcomes: '' },
          Wednesday: { description: '', learningOutcomes: '' },
          Thursday: { description: '', learningOutcomes: '' },
          Friday: { description: '', learningOutcomes: '' },
        });
      } else {
        const errorData = await res.json();
        toast.error(`Failed to create plan: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating curriculum:', error);
      toast.error('An error occurred while creating the plan.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Curriculum Planner</h1>
          <p className="text-slate-500 mt-1">Manage weekly themes and learning outcomes.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Plan
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-white rounded-2xl w-full"></div>
          <div className="h-24 bg-white rounded-2xl w-full"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {curriculums.length > 0 ? (
            curriculums.map((plan) => (
              <div 
                key={plan._id} 
                onClick={() => setSelectedPlan(plan)}
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100">
                    {plan.grade}
                  </span>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Calendar className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{plan.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow border-l-2 border-indigo-200 pl-3">Theme: <span className="font-medium text-slate-700">{plan.theme}</span></p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Week Of</span>
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(plan.weekStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(plan.weekEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <ChevronRight className="h-4 w-4 text-indigo-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="bg-indigo-50 p-5 rounded-full mb-5">
                <BookOpen className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No curriculum plans</h3>
              <p className="text-slate-500 text-center max-w-sm mb-6">You haven't created any weekly lesson plans yet. Get started by designing your first curriculum.</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-white bg-indigo-600 font-medium hover:bg-indigo-700 px-6 py-2.5 rounded-xl shadow-sm flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create First Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* CREATE CURRICULUM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Design Weekly Curriculum</h3>
                <p className="text-xs text-slate-500 mt-1">Plan out themes, activities, and learning outcomes.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full shadow-sm border border-slate-100 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-8">
              <form id="curriculum-form" onSubmit={handleCreateSubmit} className="space-y-8">
                {/* Meta Section */}
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Plan Title</label>
                      <input required type="text" placeholder="e.g. Week 4: The Solar System" className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Theme / Topic</label>
                      <input required type="text" placeholder="e.g. Space & Planets" className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Grade Level</label>
                      <select className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                        <option>Pre-KG</option>
                        <option>LKG</option>
                        <option>UKG</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Start Date</label>
                      <input required type="date" className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.weekStartDate} onChange={e => setFormData({...formData, weekStartDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">End Date</label>
                      <input required type="date" className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.weekEndDate} onChange={e => setFormData({...formData, weekEndDate: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Daily Activities Section */}
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                    Daily Schedule & Outcomes
                  </h4>
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-bold text-slate-700 flex items-center">
                          <span className="w-24">{day}</span>
                        </div>
                        <div className="p-5 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Activity Description</label>
                            <textarea 
                              rows={2} 
                              className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none" 
                              placeholder={`Describe what the students will do on ${day}...`}
                              value={activities[day].description}
                              onChange={(e) => setActivities({...activities, [day]: { ...activities[day], description: e.target.value }})}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Learning Outcomes (comma separated)</label>
                            <input 
                              type="text" 
                              className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                              placeholder="e.g. Fine motor skills, Recognizing colors"
                              value={activities[day].learningOutcomes}
                              onChange={(e) => setActivities({...activities, [day]: { ...activities[day], learningOutcomes: e.target.value }})}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end space-x-3 shrink-0">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="curriculum-form" className="px-6 py-2.5 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5">Publish Curriculum</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW CURRICULUM MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-indigo-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <BookOpen className="h-64 w-64" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    {selectedPlan.grade}
                  </span>
                  <span className="text-indigo-100 text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {new Date(selectedPlan.weekStartDate).toLocaleDateString()} - {new Date(selectedPlan.weekEndDate).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="font-bold text-3xl mb-1">{selectedPlan.title}</h2>
                <p className="text-indigo-100 text-lg">Theme: {selectedPlan.theme}</p>
                {selectedPlan.createdBy && (
                  <p className="text-xs text-indigo-200 mt-4 font-medium">Created by {selectedPlan.createdBy.firstName} {selectedPlan.createdBy.lastName}</p>
                )}
              </div>
              <button onClick={() => setSelectedPlan(null)} className="relative z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-8 bg-slate-50">
              <div className="space-y-6">
                {selectedPlan.activities.map((activity, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 text-indigo-600 border-b border-slate-100 pb-3">{activity.day}</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Activity Description</h4>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">{activity.description}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Learning Outcomes</h4>
                        {activity.learningOutcomes.length > 0 ? (
                          <ul className="space-y-2">
                            {activity.learningOutcomes.map((outcome, i) => (
                              <li key={i} className="flex items-start">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 mr-2 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-sm text-slate-400 italic">No specific outcomes logged.</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedPlan.activities.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 font-medium">No activities recorded for this week.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
