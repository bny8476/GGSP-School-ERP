"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, Search, ChevronDown, CheckCircle2, Award, User, Calendar, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const RUBRIC_TEMPLATE = [
  { category: 'Motor Skills', skill: 'Holds pencil correctly and traces lines' },
  { category: 'Motor Skills', skill: 'Uses scissors to cut along a straight line' },
  { category: 'Motor Skills', skill: 'Can run, jump, and maintain balance' },
  { category: 'Social Skills', skill: 'Shares toys and cooperates with peers' },
  { category: 'Social Skills', skill: 'Follows multi-step instructions' },
  { category: 'Social Skills', skill: 'Expresses emotions appropriately' },
  { category: 'Cognitive', skill: 'Recognizes primary colors and basic shapes' },
  { category: 'Cognitive', skill: 'Counts objects up to 10' },
  { category: 'Cognitive', skill: 'Shows curiosity and asks questions' }
];

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [teacherComments, setTeacherComments] = useState('');
  const [rubricScores, setRubricScores] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Assessments
      const assmRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments`, { headers });
      if (assmRes.ok) setAssessments(await assmRes.json());

      // Fetch Students for dropdown
      const stuRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers });
      if (stuRes.ok) setStudents(await stuRes.json());
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScoreChange = (skill: string, score: string) => {
    setRubricScores(prev => ({ ...prev, [skill]: score }));
  };

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error("Please select a student.");
      return;
    }

    // Build rubrics array from state
    const rubrics = RUBRIC_TEMPLATE.map(r => ({
      category: r.category,
      skill: r.skill,
      score: rubricScores[r.skill] || 'Developing' // default if missed
    }));

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          childId: selectedStudent,
          term: selectedTerm,
          rubrics,
          teacherComments
        })
      });

      if (res.ok) {
        toast.success("Assessment saved successfully!");
        fetchData(); // Refresh list
        setActiveTab('view');
        // Reset form
        setSelectedStudent('');
        setTeacherComments('');
        setRubricScores({});
      } else {
        const err = await res.json();
        toast.error(`Failed to save: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving assessment');
    } finally {
      setIsSaving(false);
    }
  };

  // Group the template by category for rendering
  const categories = Array.from(new Set(RUBRIC_TEMPLATE.map(r => r.category)));

  // Helper to color-code scores in the View tab
  const getScoreBadge = (score: string) => {
    switch (score) {
      case 'Mastered': return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Mastered</span>;
      case 'Developing': return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">Developing</span>;
      case 'Beginning': return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-1 rounded">Beginning</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assessments & Reports</h1>
          <p className="text-slate-500 mt-1">Manage skill rubrics and generate professional term report cards.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('view')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'view' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            View Reports
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Assessment
          </button>
        </div>
      </div>

      {activeTab === 'view' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative w-full md:max-w-xs">
              <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Filter by Term</span>
              <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
            </div>
          </div>
          
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 text-indigo-500 mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                <p className="text-slate-500 font-medium">Loading professional reports...</p>
              </div>
            ) : assessments.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {assessments.map((assessment) => (
                  <div key={assessment._id} className="bg-white border border-slate-200 rounded-2xl p-0 hover:shadow-xl hover:border-indigo-200 transition-all overflow-hidden flex flex-col">
                    {/* Report Header */}
                    <div className="bg-indigo-600 p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                        <Award className="h-32 w-32" />
                      </div>
                      <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl border border-white/30">
                            {assessment.childId?.firstName?.[0]}{assessment.childId?.lastName?.[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-2xl">
                              {assessment.childId ? `${assessment.childId.firstName} ${assessment.childId.lastName}` : 'Unknown Student'}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5 text-indigo-100 text-sm font-medium">
                              <span className="bg-white/20 px-2.5 py-0.5 rounded-full">{assessment.childId?.grade || 'N/A'}</span>
                              <span>•</span>
                              <span>{assessment.term}</span>
                              <span>•</span>
                              <span>{new Date(assessment.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Report Body */}
                    <div className="p-6 flex-grow flex flex-col gap-6">
                      {/* Teacher Note */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                        <div className="absolute -top-3 left-4 bg-slate-100 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider rounded">Teacher's Note</div>
                        <p className="text-sm text-slate-700 italic leading-relaxed pt-2">"{assessment.teacherComments}"</p>
                        {assessment.createdBy && (
                          <p className="text-xs text-slate-400 mt-3 font-medium text-right">— {assessment.createdBy.firstName} {assessment.createdBy.lastName}</p>
                        )}
                      </div>

                      {/* Rubrics Preview */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Skills Overview</h4>
                        <div className="space-y-3">
                          {/* Just showing a summarized view of the first 4 rubrics for the card */}
                          {assessment.rubrics.slice(0, 4).map((rubric: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                              <span className="text-slate-700 font-medium truncate pr-4"><span className="text-slate-400 mr-2">{rubric.category}:</span> {rubric.skill}</span>
                              <div className="shrink-0">{getScoreBadge(rubric.score)}</div>
                            </div>
                          ))}
                        </div>
                        {assessment.rubrics.length > 4 && (
                          <div className="text-center mt-4">
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors w-full">
                              View Full Report Card
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <div className="bg-white p-5 rounded-full mb-5 shadow-sm">
                  <FileText className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No assessments found</h3>
                <p className="text-slate-500 mb-6 max-w-sm">It looks like no report cards have been generated yet for this term.</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="bg-indigo-600 text-white font-bold hover:bg-indigo-700 px-6 py-3 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" /> Start Grading
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-5">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Activity-Based Skill Assessment</h2>
              <p className="text-slate-500 text-sm font-medium">Evaluate student progress across developmental domains.</p>
            </div>
          </div>
          
          <form onSubmit={handleSaveAssessment} className="space-y-10">
            {/* Meta Section */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><User className="h-4 w-4 mr-1.5 text-slate-400"/> Select Student</label>
                <select 
                  required
                  value={selectedStudent}
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 font-medium"
                >
                  <option value="">-- Choose a student --</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.grade})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Calendar className="h-4 w-4 mr-1.5 text-slate-400"/> Term</label>
                <select 
                  required
                  value={selectedTerm}
                  onChange={e => setSelectedTerm(e.target.value)}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 font-medium"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>
            </div>

            {/* Dynamic Rubrics Section */}
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-bold text-indigo-900 bg-indigo-50 p-3 px-5 rounded-xl border border-indigo-100 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                    {category}
                  </h3>
                  <div className="space-y-3 px-2 md:px-6">
                    {RUBRIC_TEMPLATE.filter(r => r.category === category).map((rubric, idx) => {
                      const currentScore = rubricScores[rubric.skill] || 'Developing';
                      return (
                        <div key={idx} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors shadow-sm">
                          <span className="text-slate-700 font-medium flex-1">{rubric.skill}</span>
                          <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 w-full lg:w-auto">
                            {['Beginning', 'Developing', 'Mastered'].map((scoreLevel) => (
                              <button
                                key={scoreLevel}
                                type="button"
                                onClick={() => handleScoreChange(rubric.skill, scoreLevel)}
                                className={`flex-1 lg:flex-none px-4 py-2 text-xs font-bold rounded-md transition-all ${
                                  currentScore === scoreLevel 
                                    ? scoreLevel === 'Mastered' ? 'bg-emerald-500 text-white shadow-md'
                                      : scoreLevel === 'Developing' ? 'bg-amber-500 text-white shadow-md'
                                      : 'bg-rose-500 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {scoreLevel}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Comments Section */}
            <div className="pt-6 border-t border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">Teacher's Comments / Feedback</label>
              <textarea 
                required
                value={teacherComments}
                onChange={e => setTeacherComments(e.target.value)}
                rows={4} 
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 font-medium"
                placeholder="Share your observations about the child's progress this term..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center transform hover:-translate-y-0.5"
              >
                {isSaving ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                )}
                {isSaving ? 'Saving Report...' : 'Publish Official Assessment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
