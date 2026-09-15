"use client";

import { useState } from 'react';
import { Send, CheckCircle2, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

import toast from 'react-hot-toast';

export default function AdmissionsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      childFirstName: formData.get('childFirstName'),
      childLastName: formData.get('childLastName'),
      dateOfBirth: formData.get('dob'),
      gradeAppliedFor: formData.get('grade'),
      gender: formData.get('gender'),
      parentName: formData.get('parentName'),
      email: formData.get('email'),
      contactNumber: formData.get('phone'),
      address: formData.get('address'),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const err = await response.json();
        toast.error(`Submission failed: ${err.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
        <div className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl text-center space-y-6 relative z-10 border border-slate-100 animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Application Received!</h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              Thank you for choosing School ERP. Our admissions team will review your enquiry and get back to you within 24-48 hours.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center w-full py-3 px-4 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative bg-slate-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900 to-indigo-800 transform skew-y-[-4deg] origin-top-left -z-10 shadow-2xl"></div>
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10 mt-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 text-indigo-100 font-semibold text-sm backdrop-blur-md border border-white/20 mb-4">
            <Sparkles className="h-4 w-4 mr-2" /> 2026-2027 Admissions Open
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md">Join the School ERP Family</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium">Fill out the application form below to start your child's educational journey with us.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Child Details Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4 text-indigo-600">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Child's Information</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
                <div>
                  <label htmlFor="childFirstName" className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input required name="childFirstName" type="text" id="childFirstName" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white" placeholder="e.g. Emma" />
                </div>
                <div>
                  <label htmlFor="childLastName" className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input required name="childLastName" type="text" id="childLastName" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white" placeholder="e.g. Smith" />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                  <input required name="dob" type="date" id="dob" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white text-slate-600" />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                  <select required name="gender" id="gender" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white text-slate-600">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="grade" className="block text-sm font-bold text-slate-700 mb-2">Applying For</label>
                  <select required name="grade" id="grade" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white text-slate-600">
                    <option value="">Select a Grade Level</option>
                    <option value="Pre-KG">Pre-KG (2.5 - 3.5 Years)</option>
                    <option value="LKG">LKG (3.5 - 4.5 Years)</option>
                    <option value="UKG">UKG (4.5 - 5.5 Years)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent Details Section */}
            <div>
              <div className="flex items-center mb-6 mt-10">
                <div className="h-10 w-10 bg-purple-50 rounded-2xl flex items-center justify-center mr-4 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800">Parent / Guardian</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
                <div className="sm:col-span-2">
                  <label htmlFor="parentName" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input required name="parentName" type="text" id="parentName" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white" placeholder="e.g. Michael Smith" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input required name="email" type="email" id="email" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white" placeholder="michael.s@example.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                  <input required name="phone" type="tel" id="phone" className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white" placeholder="(555) 123-4567" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2">Home Address</label>
                  <textarea required name="address" id="address" rows={3} className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium px-4 py-3 bg-white resize-none" placeholder="Enter full address..."></textarea>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl shadow-indigo-200 text-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    Submit Application <Send className="ml-3 h-6 w-6" />
                  </>
                )}
              </button>
              <p className="text-center text-slate-400 text-sm font-medium mt-4">By submitting, you agree to our Terms of Admission.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
