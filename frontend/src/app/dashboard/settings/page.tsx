"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Lock,
  Bell,
  Shield,
  Key,
  Save,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  UserCircle,
  Sliders,
  Check,
  RotateCcw,
  Search,
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  // Role & Permissions Management State
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [defaultRolePermissions, setDefaultRolePermissions] = useState<Record<string, string[]>>({});
  const [selectedRole, setSelectedRole] = useState<string>('Teacher');
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]);
  const [isRolesLoading, setIsRolesLoading] = useState(false);
  const [isRoleSaving, setIsRoleSaving] = useState(false);
  const [roleStatusMsg, setRoleStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [permissionFilter, setPermissionFilter] = useState('');

  const fetchProfile = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/api/auth/profile`, {
        headers,
        credentials: 'include',
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

  const fetchRoles = async () => {
    setIsRolesLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/api/v1/roles`, {
        headers,
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data.roles || []);
        setAllPermissions(data.allPermissions || []);
        setDefaultRolePermissions(data.defaultRolePermissions || {});
        const initial = data.roles?.find((r: any) => r.name === selectedRole) || data.roles?.[0];
        if (initial) {
          setSelectedRole(initial.name);
          setSelectedRolePermissions(initial.permissions || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    } finally {
      setIsRolesLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'permissions') {
      fetchRoles();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/api/users/${user._id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
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

  const handleSelectRole = (roleName: string) => {
    setSelectedRole(roleName);
    const found = roles.find((r) => r.name === roleName);
    if (found) {
      setSelectedRolePermissions(found.permissions || []);
    } else if (defaultRolePermissions[roleName]) {
      setSelectedRolePermissions(defaultRolePermissions[roleName]);
    } else {
      setSelectedRolePermissions([]);
    }
  };

  const togglePermission = (perm: string) => {
    setSelectedRolePermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleResetToDefaults = () => {
    if (defaultRolePermissions[selectedRole]) {
      setSelectedRolePermissions([...defaultRolePermissions[selectedRole]]);
      setRoleStatusMsg({
        type: 'success',
        text: `Restored standard default permissions for ${selectedRole}. Click 'Save Role Permissions' to persist.`,
      });
      setTimeout(() => setRoleStatusMsg(null), 5000);
    }
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    setIsRoleSaving(true);
    setRoleStatusMsg(null);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiBase}/api/v1/roles/${selectedRole}/permissions`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ permissions: selectedRolePermissions }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRoleStatusMsg({
          type: 'success',
          text: `Permissions for role "${selectedRole}" updated and persisted successfully!`,
        });
        setRoles((prev) =>
          prev.map((r) => (r.name === selectedRole ? { ...r, permissions: selectedRolePermissions } : r))
        );
        setTimeout(() => setRoleStatusMsg(null), 5000);
      } else {
        setRoleStatusMsg({ type: 'error', text: data.message || 'Failed to update permissions' });
      }
    } catch (err) {
      setRoleStatusMsg({ type: 'error', text: 'Network error saving role permissions' });
    } finally {
      setIsRoleSaving(false);
    }
  };

  const permissionCategories: Record<string, string[]> = {
    'Students & Parents': allPermissions.filter(
      (p) => p.startsWith('students:') || p.startsWith('parents:') || p.startsWith('child:')
    ),
    'Teachers & Staff': allPermissions.filter((p) => p.startsWith('teachers:') || p.startsWith('profile:')),
    'Academics & Curriculum': allPermissions.filter((p) => p.startsWith('academics:') || p.startsWith('timetable:')),
    Attendance: allPermissions.filter((p) => p.startsWith('attendance:')),
    Admissions: allPermissions.filter((p) => p.startsWith('admissions:')),
    'Finance & Payroll': allPermissions.filter(
      (p) => p.startsWith('finance:') || p.startsWith('fees:') || p.startsWith('payroll:')
    ),
    'Classroom & Learning': allPermissions.filter(
      (p) =>
        p.startsWith('activities:') ||
        p.startsWith('diary:') ||
        p.startsWith('homework:') ||
        p.startsWith('assessments:')
    ),
    'Communication & Messages': allPermissions.filter(
      (p) => p.startsWith('announcements:') || p.startsWith('notifications:') || p.startsWith('messages:')
    ),
    'Operations & System Admin': allPermissions.filter(
      (p) => p.startsWith('visitors:') || p.startsWith('reports:') || p.startsWith('settings:') || p === '*'
    ),
  };

  const userRole = user?.role?.name || user?.role || '';
  const isSuperAdminOrAdmin = ['SuperAdmin', 'Admin'].includes(userRole);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        <div className="animate-spin h-8 w-8 border-4 border-[#0050CB]/20 border-t-[#0050CB] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-[#000E28]">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings, security, and administrative role permissions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-[#0050CB] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="h-5 w-5 mr-3 text-[#0050CB]" /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'security'
                ? 'bg-white text-[#0050CB] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="h-5 w-5 mr-3 text-[#0050CB]" /> Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white text-[#0050CB] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="h-5 w-5 mr-3 text-[#0050CB]" /> Notifications
          </button>

          {/* Admin Role & Permission Management Tab */}
          <button
            onClick={() => setActiveTab('permissions')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
              activeTab === 'permissions'
                ? 'bg-[#E5EEFF] text-[#0050CB] shadow-sm border border-[#0050CB]/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center">
              <Sliders className="h-5 w-5 mr-3 text-[#0050CB]" /> Roles & Access
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF690C] text-white font-black">
              Admin
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center mb-8">
                <div className="h-20 w-20 rounded-full bg-[#E5EEFF] text-[#0050CB] flex items-center justify-center font-black text-3xl border-4 border-white shadow-lg mr-6">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#000E28]">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-500 font-medium">{user?.role?.name || user?.role || 'Staff Member'}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {statusMsg && (
                  <div
                    className={`p-4 rounded-xl flex items-center ${
                      statusMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {statusMsg.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    )}
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
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0050CB] focus:border-[#0050CB] bg-slate-50 transition-all hover:bg-white shadow-sm"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0050CB] focus:border-[#0050CB] bg-slate-50 transition-all hover:bg-white shadow-sm"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0050CB] focus:border-[#0050CB] bg-slate-50 transition-all hover:bg-white shadow-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0050CB] focus:border-[#0050CB] bg-slate-50 transition-all hover:bg-white shadow-sm"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0050CB] hover:bg-[#003d99] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-[#0050CB]/20 flex items-center disabled:opacity-70"
                  >
                    {isSaving ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-[#000E28] mb-6">Security Settings</h2>

              <div className="bg-[#E5EEFF] border border-[#0050CB]/30 rounded-2xl p-6 flex items-start mb-8">
                <AlertCircle className="h-6 w-6 text-[#0050CB] mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#0050CB] font-bold mb-1">Password Management</h3>
                  <p className="text-slate-700 text-sm font-medium">
                    You can reset your password anytime via the verified email reset flow on the login page or update credentials with your administrator.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl p-5 flex justify-between items-center bg-white shadow-sm">
                  <div>
                    <h4 className="font-bold text-[#000E28]">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 font-medium">Add an extra layer of biometric/OTP protection to your login.</p>
                  </div>
                  <Link href="/dashboard/security" className="px-4 py-2 bg-[#E5EEFF] text-[#0050CB] font-bold rounded-lg hover:bg-[#0050CB] hover:text-white transition-colors cursor-pointer">
                    Setup
                  </Link>
                </div>
                <div className="border border-slate-200 rounded-2xl p-5 flex justify-between items-center bg-white shadow-sm">
                  <div>
                    <h4 className="font-bold text-[#000E28]">Active Sessions</h4>
                    <p className="text-sm text-slate-500 font-medium">Manage devices currently authenticated with your account.</p>
                  </div>
                  <Link href="/dashboard/security" className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-[#000E28] mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#000E28] mb-4">Email & Socket Alerts</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="block font-bold text-[#000E28]">New Admissions & Student Enrolment</span>
                        <span className="block text-sm text-slate-500 font-medium">
                          Receive notifications when an admission application is approved or enrolled.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 text-[#0050CB] rounded border-slate-300 focus:ring-[#0050CB]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="block font-bold text-[#000E28]">Fee Collection & Receipts</span>
                        <span className="block text-sm text-slate-500 font-medium">
                          Real-time alerts for parent fee settlements and gateway webhook confirmations.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5 text-[#0050CB] rounded border-slate-300 focus:ring-[#0050CB]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roles & Permissions Management View */}
          {activeTab === 'permissions' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-[#000E28]">Role-Based Access Control (RBAC)</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    Manage granular permissions for each ERP role using the unified permission taxonomy.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetToDefaults}
                    type="button"
                    className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleSaveRolePermissions}
                    disabled={isRoleSaving}
                    type="button"
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0050CB] hover:bg-[#003d99] shadow-md shadow-[#0050CB]/20 transition-all disabled:opacity-70"
                  >
                    {isRoleSaving ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Role Permissions
                  </button>
                </div>
              </div>

              {roleStatusMsg && (
                <div
                  className={`p-4 rounded-xl flex items-center ${
                    roleStatusMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {roleStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 text-rose-600" />
                  )}
                  <p className="font-bold text-sm">{roleStatusMsg.text}</p>
                </div>
              )}

              {/* Role Selection Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  'SuperAdmin',
                  'Admin',
                  'Principal',
                  'Teacher',
                  'Parent',
                  'Accountant',
                  'Receptionist',
                  'Staff',
                ].map((roleName) => {
                  const isSelected = selectedRole === roleName;
                  return (
                    <button
                      key={roleName}
                      type="button"
                      onClick={() => handleSelectRole(roleName)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-[#0050CB] text-white shadow-md shadow-[#0050CB]/25'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {roleName}
                      {isSelected && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 text-white">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Permission Search Bar */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter permissions (e.g. students, fees, attendance)..."
                  value={permissionFilter}
                  onChange={(e) => setPermissionFilter(e.target.value.toLowerCase())}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#0050CB] focus:border-[#0050CB] bg-slate-50 hover:bg-white transition-colors"
                />
              </div>

              {/* Selected Role Summary Card */}
              <div className="bg-[#E5EEFF]/50 border border-[#0050CB]/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-[#000E28] text-base">
                    Editing Permissions for: <span className="text-[#0050CB]">{selectedRole}</span>
                  </h3>
                  <p className="text-slate-600 text-xs mt-0.5">
                    {selectedRolePermissions.includes('*')
                      ? 'Full system wildcard (*) active — All capabilities granted'
                      : `${selectedRolePermissions.length} active permissions granted`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRolePermissions(allPermissions)}
                    className="text-xs font-bold text-[#0050CB] hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedRolePermissions([])}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Grouped Permission Categories */}
              {isRolesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-6 w-6 border-3 border-[#0050CB]/30 border-t-[#0050CB] rounded-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissionCategories).map(([category, perms]) => {
                    const filteredPerms = perms.filter(
                      (p) => !permissionFilter || p.toLowerCase().includes(permissionFilter)
                    );
                    if (filteredPerms.length === 0) return null;

                    const grantedCount = filteredPerms.filter(
                      (p) => selectedRolePermissions.includes(p) || selectedRolePermissions.includes('*')
                    ).length;

                    return (
                      <div
                        key={category}
                        className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <h4 className="font-black text-[#000E28] text-sm flex items-center gap-2">
                            {category}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB] font-bold">
                              {grantedCount} / {filteredPerms.length}
                            </span>
                          </h4>
                          <div className="flex gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                const newSet = new Set([...selectedRolePermissions, ...filteredPerms]);
                                setSelectedRolePermissions(Array.from(newSet));
                              }}
                              className="text-[#0050CB] font-bold hover:underline"
                            >
                              Grant All
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRolePermissions(
                                  selectedRolePermissions.filter((p) => !filteredPerms.includes(p))
                                );
                              }}
                              className="text-slate-500 font-bold hover:underline"
                            >
                              Revoke All
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                          {filteredPerms.map((perm) => {
                            const isGranted =
                              selectedRolePermissions.includes(perm) || selectedRolePermissions.includes('*');
                            const isWildcardInherited =
                              selectedRolePermissions.includes('*') && perm !== '*';

                            return (
                              <label
                                key={perm}
                                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                  isGranted
                                    ? 'bg-[#E5EEFF] border-[#0050CB]/40 text-[#000E28]'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <span className="font-mono truncate mr-2" title={perm}>
                                  {perm}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={isGranted}
                                  disabled={isWildcardInherited}
                                  onChange={() => togglePermission(perm)}
                                  className="h-4 w-4 rounded text-[#0050CB] border-slate-300 focus:ring-[#0050CB]"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

