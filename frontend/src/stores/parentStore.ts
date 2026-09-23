import { create } from "zustand";
import { getQueryClient } from "@/providers/QueryProvider";

export interface StudentChild {
  _id: string;
  id?: string;
  name: string;
  admissionNumber?: string;
  rollNumber?: string;
  grade?: string;
  section?: string;
  class?: string;
  gender?: string;
  bloodGroup?: string;
  avatar?: string;
  photo?: string;
  attendancePercentage?: number;
  totalFees?: number;
  pendingFees?: number;
  [key: string]: unknown;
}

interface ParentState {
  children: StudentChild[];
  selectedChildId: string | null;
  selectedChild: StudentChild | null;
  isLoading: boolean;
  setChildren: (children: StudentChild[]) => void;
  setSelectedChildId: (id: string) => void;
}

export const useParentStore = create<ParentState>((set, get) => ({
  children: [],
  selectedChildId: null,
  selectedChild: null,
  isLoading: false,

  setChildren: (children) => {
    const currentSelectedId = get().selectedChildId;
    let selectedChild = children.find(c => (c._id || c.id) === currentSelectedId) || null;
    if (!selectedChild && children.length > 0) {
      selectedChild = children[0];
    }
    const selectedChildId = selectedChild ? (selectedChild._id || selectedChild.id || null) : null;
    
    set({
      children,
      selectedChild,
      selectedChildId,
    });
  },

  setSelectedChildId: (id: string) => {
    const child = get().children.find(c => (c._id || c.id) === id) || null;
    set({
      selectedChildId: id,
      selectedChild: child,
    });

    // Invalidate child-specific TanStack queries immediately
    try {
      const qc = getQueryClient();
      if (qc) {
        qc.invalidateQueries({ queryKey: ["parent"] });
        qc.invalidateQueries({ queryKey: ["child-attendance"] });
        qc.invalidateQueries({ queryKey: ["child-homework"] });
        qc.invalidateQueries({ queryKey: ["child-diary"] });
        qc.invalidateQueries({ queryKey: ["child-fees"] });
      }
    } catch {
      // Invalidation safe fail
    }
  },
}));
