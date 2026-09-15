import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 group inline-flex">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-600/30">
              <Globe className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Global<span className="text-indigo-600">International</span>
            </span>
          </Link>
          <p className="text-slate-500 font-medium leading-relaxed">
            Empowering global leaders of tomorrow through holistic education, state-of-the-art facilities, and enterprise excellence.
          </p>
          </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Explore</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Home</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">About Us</Link></li>
            <li><Link href="/admissions" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Admissions</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Curriculum</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Resources</h3>
          <ul className="space-y-3">
            <li><Link href="/login" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Parent Portal</Link></li>
            <li><Link href="/login" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Staff Login</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">Fee Structure</Link></li>
            <li><Link href="#" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-slate-500 font-medium">
              <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>100 Global Avenue, Knowledge City, International Campus</span>
            </li>
            <li className="flex items-center gap-3 text-slate-500 font-medium">
              <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
              <span>+1 (800) GLOBAL-EDU</span>
            </li>
            <li className="flex items-center gap-3 text-slate-500 font-medium">
              <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
              <span>info@globalinternational.edu</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 text-center text-slate-400 font-medium">
        <p>&copy; {new Date().getFullYear()} Global International School ERP. All rights reserved.</p>
      </div>
    </footer>
  );
}
