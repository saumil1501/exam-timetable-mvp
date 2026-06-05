import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Course, ApiResponse } from '@/types';

interface CoursesResponse extends ApiResponse<Course[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchCourses = useCallback(
    async (page = 1, limit = 10, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<CoursesResponse>('/courses', {
          params: { page, limit, search },
        });
        setCourses(response.data.data || []);
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

  const createCourse = useCallback(async (data: any) => {
    try {
      const response = await api.post<ApiResponse<Course>>('/courses', data);
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const updateCourse = useCallback(async (id: string, data: any) => {
    try {
      const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, data);
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      await api.delete(`/courses/${id}`);
      return true;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    total,
    pages,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}