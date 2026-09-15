"use client";

import { useState, useEffect } from 'react';
import { Printer, Image as ImageIcon, Download, Search } from 'lucide-react';

export default function IdCardGenerator() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [details, setDetails] = useState({
    name: 'Aria Williams',
    grade: 'LKG',
    dob: '12 May 2022',
    bloodGroup: 'O+',
    parentName: 'Sarah Williams',
    contact: '+91 98765 43210',
    address: '123 Meadow Lane, Green Park, City',
    idNumber: 'TS-2026-042',
    photoUrl: ''
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    if (!studentId) return;

    const student = students.find(s => s._id === studentId);
    if (student) {
      setDetails(prev => ({
        ...prev,
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade || 'Pre-KG',
        dob: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : prev.dob,
        idNumber: `TS-${new Date().getFullYear()}-${student._id.substring(student._id.length - 4).toUpperCase()}`,
        // Blood group, parent name, contact, etc might not be in the basic Student schema, so allow user to overwrite or leave default for now.
        parentName: student.parentName || prev.parentName,
        contact: student.parentContact || prev.contact,
        address: student.address || prev.address
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ID Card Generator</h1>
          <p className="text-slate-500 mt-1">Select a student to automatically generate their official ID card.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center transition-all shadow-md shadow-indigo-200 transform hover:-translate-y-0.5"
        >
          <Printer className="h-5 w-5 mr-2" />
          Print ID Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 print:hidden">
          
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <label className="block text-sm font-bold text-indigo-900 mb-2 flex items-center">
              <Search className="h-4 w-4 mr-2" /> Auto-Fill Student Details
            </label>
            <select 
              onChange={handleStudentSelect} 
              className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
            >
              <option value="">-- Select Enrolled Student --</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.grade})</option>
              ))}
            </select>
          </div>

          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Manual Overrides</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
              <input type="text" name="name" value={details.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Grade/Class</label>
                <select name="grade" value={details.grade} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white">
                  <option>Pre-KG</option>
                  <option>LKG</option>
                  <option>UKG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">ID Number</label>
                <input type="text" name="idNumber" value={details.idNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Date of Birth</label>
                <input type="text" name="dob" value={details.dob} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" placeholder="DD MMM YYYY" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Blood Group</label>
                <select name="bloodGroup" value={details.bloodGroup} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white">
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Parent's Name</label>
              <input type="text" name="parentName" value={details.parentName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Emergency Contact</label>
              <input type="text" name="contact" value={details.contact} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Residential Address</label>
              <input type="text" name="address" value={details.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Photo URL (Optional)</label>
              <input type="text" name="photoUrl" value={details.photoUrl} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" placeholder="https://example.com/photo.jpg" />
            </div>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-8 print:p-0 print:bg-white print:border-none print:block">
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * { visibility: hidden; }
              .printable-id, .printable-id * { visibility: visible; }
              .printable-id-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: flex;
                flex-direction: row;
                gap: 20px;
              }
            }
          `}} />

          <div className="printable-id-container flex flex-col md:flex-row gap-6 items-center justify-center w-full">
            
            {/* FRONT OF ID CARD */}
            <div className="printable-id w-[214px] h-[338px] bg-white rounded-2xl shadow-2xl shadow-indigo-100 overflow-hidden relative border border-slate-200 shrink-0">
              {/* Card Header Pattern */}
              <div className="h-28 w-full bg-gradient-to-br from-indigo-600 to-indigo-800 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                <div className="pt-4 text-center">
                  <h2 className="text-white font-black text-xl tracking-wider">E.A.S. ACADEMY SCHOOL</h2>
                  <p className="text-indigo-200 text-xs tracking-widest uppercase mt-0.5">Student ID Card</p>
                </div>
              </div>
              
              {/* Photo */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full p-1.5 shadow-lg shadow-indigo-900/10 border border-slate-100 z-10">
                <div className="w-full h-full bg-slate-50 rounded-full overflow-hidden flex items-center justify-center border border-slate-200">
                  {details.photoUrl ? (
                    <img src={details.photoUrl} alt="Student" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="mt-14 pt-3 text-center px-4 relative z-0">
                <h3 className="font-black text-slate-800 text-[18px] leading-tight mb-1">{details.name || 'Student Name'}</h3>
                <span className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full mb-3 shadow-sm">
                  {details.grade || 'Grade'}
                </span>
                
                <div className="space-y-1.5 text-left bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-500 font-bold flex justify-between uppercase tracking-wider">
                    <span>ID:</span> <span className="text-slate-800">{details.idNumber || '-'}</span>
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold flex justify-between uppercase tracking-wider">
                    <span>DOB:</span> <span className="text-slate-800">{details.dob || '-'}</span>
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold flex justify-between uppercase tracking-wider">
                    <span>BLOOD:</span> <span className="text-rose-600">{details.bloodGroup || '-'}</span>
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="absolute bottom-0 w-full h-3 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
            </div>

            {/* BACK OF ID CARD */}
            <div className="printable-id w-[214px] h-[338px] bg-white rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden relative border border-slate-200 shrink-0">
              <div className="h-12 w-full bg-slate-800 flex items-center justify-center border-b-4 border-indigo-600">
                <p className="text-white text-[11px] font-bold tracking-widest uppercase">Emergency Contact</p>
              </div>
              
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Parent / Guardian</p>
                  <p className="text-[13px] font-black text-slate-800 leading-tight">{details.parentName || '-'}</p>
                </div>
                
                <div>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Contact Number</p>
                  <p className="text-[13px] font-black text-slate-800 leading-tight">{details.contact || '-'}</p>
                </div>
                
                <div>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Residential Address</p>
                  <p className="text-[10px] font-bold text-slate-600 leading-relaxed">{details.address || '-'}</p>
                </div>

                <div className="pt-3 border-t border-dashed border-slate-300 mt-4 text-center">
                  <p className="text-[8px] font-bold text-slate-800">E.A.S. Academy School</p>
                  <p className="text-[8px] font-medium text-slate-500 mt-0.5">123 Education Lane, Learning City</p>
                  <p className="text-[8px] font-medium text-slate-500">Ph: +1 (800) EAS-ACADEMY</p>
                </div>
              </div>
              
              <div className="absolute bottom-4 w-full text-center">
                <div className="mx-auto w-28 border-t-2 border-slate-300 pt-1.5">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>
            </div>

          </div>

          <p className="text-sm font-medium text-slate-500 mt-8 print:hidden text-center max-w-sm">
            Standard CR80 size (2.13&quot; &times; 3.38&quot;). Ready for PVC printing.
          </p>

        </div>
      </div>
    </div>
  );
}
