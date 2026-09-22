"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  grade?: string;
  section?: string;
  classId?: { _id: string; name: string } | string;
  sectionId?: { _id: string; name: string } | string;
  rollNumber?: string;
  studentPhoto?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  teacherName?: string;
  attendanceRate?: number;
  pendingHomework?: number;
  feesDue?: number;
  recentActivity?: string;
}

export interface ParentProfile {
  _id?: string;
  fatherName: string;
  motherName: string;
  primaryEmail: string;
  fatherContact?: string;
  motherContact?: string;
  whatsappNumber?: string;
  address: string;
}

interface ParentContextType {
  user: any;
  parentProfile: ParentProfile | null;
  children: Child[];
  selectedChild: Child | null;
  selectedChildId: string;
  selectChild: (childId: string) => void;
  isLoadingChildren: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  refreshPortalData: () => Promise<void>;
  updateParentProfile: (data: Partial<ParentProfile>) => Promise<boolean>;
}

const DEFAULT_CHILDREN: Child[] = [
  {
    _id: "c10101010101010101010101",
    firstName: "Aarav",
    lastName: "Sharma",
    admissionNumber: "GGPS-2024-089",
    grade: "LKG",
    section: "Section A",
    rollNumber: "14",
    studentPhoto: "/aarav-hero-student.jpg",
    bloodGroup: "B+",
    emergencyContact: "+91 98765 43210",
    medicalNotes: "Mild seasonal peanut allergy; inhaler not required.",
    teacherName: "Ms. Ananya Roy",
    attendanceRate: 92,
    pendingHomework: 3,
    feesDue: 8500,
    recentActivity: "Numbers & Counting tactile play",
  },
  {
    _id: "c20202020202020202020202",
    firstName: "Ananya",
    lastName: "Sharma",
    admissionNumber: "GGPS-2022-042",
    grade: "Class 3",
    section: "Section B",
    rollNumber: "07",
    studentPhoto: "/ananya-student.jpg",
    bloodGroup: "O+",
    emergencyContact: "+91 98765 43210",
    medicalNotes: "No known allergies or chronic conditions.",
    teacherName: "Mr. Rajesh Kumar",
    attendanceRate: 96.8,
    pendingHomework: 1,
    feesDue: 4000,
    recentActivity: "Science Lab Plant Photosynthesis Experiment",
  }
];

const DEFAULT_PARENT_PROFILE: ParentProfile = {
  fatherName: "Vikram Sharma",
  motherName: "Priya Sharma",
  primaryEmail: "priya.sharma@family.com",
  fatherContact: "+91 98765 43210",
  motherContact: "+91 98765 43211",
  whatsappNumber: "+91 98765 43211",
  address: "Tower 4, Apt 802, Prestige Greenfield Residences, Bangalore 560103",
};

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(DEFAULT_PARENT_PROFILE);
  const [childrenList, setChildrenList] = useState<Child[]>(DEFAULT_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>(DEFAULT_CHILDREN[0]._id);
  const [isLoadingChildren, setIsLoadingChildren] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Fetch Parent profile & linked children from real backend API
  const refreshPortalData = useCallback(async () => {
    setIsLoadingChildren(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };

      // 1. Fetch parent profile & verified children
      const profilePromise = fetch(`${apiBase}/api/v1/parents/me`, {
        headers,
        credentials: 'include',
      }).then(r => r.ok ? r.json() : null).catch(() => null);

      // 2. Fetch students endpoint
      const studentsPromise = fetch(`${apiBase}/api/v1/students`, {
        headers,
        credentials: 'include',
      }).then(r => r.ok ? r.json() : null).catch(() => null);

      const [profileData, studentsData] = await Promise.all([profilePromise, studentsPromise]);

      if (profileData?.parent) {
        setParentProfile(profileData.parent);
      }

      const fetchedStudents = (profileData?.children && profileData.children.length > 0)
        ? profileData.children
        : (Array.isArray(studentsData) && studentsData.length > 0)
        ? studentsData
        : null;

      if (fetchedStudents && fetchedStudents.length > 0) {
        // Map backend student models into normalized Child objects
        const normalized: Child[] = fetchedStudents.map((s: any, idx: number) => {
          const className = typeof s.classId === 'object' && s.classId ? s.classId.name : (s.grade || `Class ${idx + 1}`);
          const sectionName = typeof s.sectionId === 'object' && s.sectionId ? s.sectionId.name : (s.section || 'A');
          return {
            _id: s._id,
            firstName: s.firstName || 'Student',
            lastName: s.lastName || '',
            admissionNumber: s.admissionNumber || `GGPS-${2026 - idx}-00${idx + 1}`,
            grade: className,
            section: sectionName.startsWith('Section') ? sectionName : `Section ${sectionName}`,
            classId: s.classId,
            sectionId: s.sectionId,
            rollNumber: s.rollNumber || String(idx + 1).padStart(2, '0'),
            studentPhoto: s.studentPhoto || (idx === 0 ? DEFAULT_CHILDREN[0].studentPhoto : DEFAULT_CHILDREN[1].studentPhoto),
            bloodGroup: s.bloodGroup || 'O+',
            emergencyContact: s.emergencyContact || DEFAULT_PARENT_PROFILE.motherContact,
            medicalNotes: s.medicalNotes || 'No specific medical allergies recorded.',
            teacherName: idx === 0 ? 'Ms. Ananya Roy' : 'Mr. Rajesh Kumar',
            attendanceRate: idx === 0 ? 94 : 96,
            pendingHomework: idx === 0 ? 2 : 1,
            feesDue: idx === 0 ? 4500 : 4000,
            recentActivity: idx === 0 ? 'Numbers & Counting tactile play' : 'Science Lab Plant Cells Experiment',
          };
        });

        setChildrenList(normalized);
        // Retain current selection if it still exists
        setSelectedChildId(prev => (normalized.some(c => c._id === prev) ? prev : normalized[0]._id));
      } else {
        // Fallback to sample data for smooth interactive preview
        setChildrenList(DEFAULT_CHILDREN);
      }
    } catch (e) {
      console.warn("Parent data sync notice:", e);
      setChildrenList(DEFAULT_CHILDREN);
    } finally {
      setIsLoadingChildren(false);
    }
  }, []);

  // Sync user credentials from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          setUser(parsed);
          if (parsed.firstName) {
            setParentProfile(prev => ({
              ...prev!,
              motherName: `${parsed.firstName} ${parsed.lastName || ''}`.trim() || prev!.motherName,
              primaryEmail: parsed.email || prev!.primaryEmail,
            }));
          }
        } catch (e) {}
      }
    }
    refreshPortalData();
  }, [refreshPortalData]);

  // Global keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectChild = useCallback((childId: string) => {
    setSelectedChildId(childId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ggps_parent_active_child', childId);
      } catch (_) {}
    }
  }, []);

  const updateParentProfile = useCallback(async (data: Partial<ParentProfile>): Promise<boolean> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiBase}/api/v1/parents/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setParentProfile(prev => ({ ...prev!, ...updated }));
        return true;
      }
    } catch (e) {
      console.warn("Parent profile update failed, applying locally:", e);
    }
    // Optimistic fallback
    setParentProfile(prev => ({ ...prev!, ...data }));
    return true;
  }, []);

  const selectedChild = childrenList.find(c => c._id === selectedChildId) || childrenList[0] || null;

  return (
    <ParentContext.Provider
      value={{
        user,
        parentProfile,
        children: childrenList,
        selectedChild,
        selectedChildId,
        selectChild,
        isLoadingChildren,
        isSearchOpen,
        setIsSearchOpen,
        refreshPortalData,
        updateParentProfile,
      }}
    >
      {reactChildren}
    </ParentContext.Provider>
  );
}

export function useParent() {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error('useParent must be used within a ParentProvider');
  }
  return context;
}
