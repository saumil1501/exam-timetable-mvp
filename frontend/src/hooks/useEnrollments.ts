import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface EnrollmentsResponse extends ApiResponse<any[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchEnrollments = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<EnrollmentsResponse>('/enrollments', {
          params: { page, limit },
        });
        setEnrollments(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
        setPages(response.data.pagination?.pages || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createEnrollment = useCallback(async (studentId: string, courseId: string) => {
    try {
      const response = await api.post<ApiResponse<any>>('/enrollments', {
        studentId,
        courseId,
      });
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const deleteEnrollment = useCallback(async (id: string) => {
    try {
      await api.delete(`/enrollments/${id}`);
      return true;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const getStudentEnrollments = useCallback(async (studentId: string) => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/enrollments/student/${studentId}`
      );
      return response.data.data || [];
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const getCourseEnrollments = useCallback(async (courseId: string) => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/enrollments/course/${courseId}`
      );
      return response.data.data || [];
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const getAllConflicts = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<any[]>>('/enrollments/conflicts/all');
      return response.data.data || [];
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    enrollments,
    loading,
    error,
    total,
    pages,
    fetchEnrollments,
    createEnrollment,
    deleteEnrollment,
    getStudentEnrollments,
    getCourseEnrollments,
    getAllConflicts,
  };
}