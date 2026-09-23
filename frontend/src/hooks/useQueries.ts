import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface StudentFilterParams {
  grade?: string;
  section?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// 1. Students Queries
export function useStudentsQuery(params?: StudentFilterParams) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const res = await apiClient.get<Record<string, unknown>>("/api/students", {
        params: {
          class: params?.grade,
          section: params?.section,
          search: params?.search,
          status: params?.status,
          page: params?.page,
          limit: params?.limit,
        },
      });
      return res;
    },
    staleTime: 60 * 1000,
  });
}

export function useStudentDetailQuery(studentId: string | null) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      if (!studentId) return null;
      return await apiClient.get<Record<string, unknown>>(`/api/students/${studentId}`);
    },
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  });
}

// 2. Admissions Query
export function useAdmissionsQuery(stage?: string) {
  return useQuery({
    queryKey: ["admissions", stage],
    queryFn: async () => {
      return await apiClient.get<Record<string, unknown>>("/api/admissions", {
        params: stage ? { stage } : undefined,
      });
    },
    staleTime: 30 * 1000,
  });
}

// 3. Attendance Query
export function useAttendanceQuery(date: string, entityType: "Student" | "Staff" = "Student") {
  return useQuery({
    queryKey: ["attendance", date, entityType],
    queryFn: async () => {
      return await apiClient.get<Record<string, unknown>>("/api/attendance", {
        params: { date, entityType },
      });
    },
    staleTime: 30 * 1000,
  });
}

// 4. Fees Query
export function useFeesQuery() {
  return useQuery({
    queryKey: ["fees"],
    queryFn: async () => {
      return await apiClient.get<Record<string, unknown>>("/api/v1/finance/fees");
    },
    staleTime: 60 * 1000,
  });
}

// 5. Notifications Query & Mutations
export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        return await apiClient.get<{ notifications: unknown[]; unreadCount: number }>("/api/notifications");
      } catch {
        return { notifications: [], unreadCount: 0 };
      }
    },
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiClient.put(`/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 6. Parent Portal Queries (scoped to selected child)
export function useParentChildDataQuery(childId: string | null) {
  return useQuery({
    queryKey: ["parent", "child", childId],
    queryFn: async () => {
      if (!childId) return null;
      const [attendance, homework, diary, activities] = await Promise.allSettled([
        apiClient.get<Record<string, unknown>>(`/api/v1/attendance/today`, { params: { childId } }),
        apiClient.get<unknown[]>(`/api/v1/homework`, { params: { childId } }),
        apiClient.get<Record<string, unknown>>(`/api/v1/daily-diary/today`, { params: { childId } }),
        apiClient.get<unknown[]>(`/api/v1/activities/today`, { params: { childId } }),
      ]);

      return {
        attendance: attendance.status === "fulfilled" ? attendance.value : null,
        homework: homework.status === "fulfilled" ? homework.value : [],
        diary: diary.status === "fulfilled" ? diary.value : null,
        activities: activities.status === "fulfilled" ? activities.value : [],
      };
    },
    enabled: !!childId,
    staleTime: 30 * 1000,
  });
}
