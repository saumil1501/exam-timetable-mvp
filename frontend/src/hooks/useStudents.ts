import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Student, ApiResponse } from '@/types';

interface StudentsResponse extends ApiResponse<Student[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchStudents = useCallback(
    async (page = 1, limit = 10, search = '') => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<StudentsResponse>('/students', {
          params: { page, limit, search },
        });
        setStudents(response.data.data || []);
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

  const createStudent = useCallback(async (data: any) => {
    try {
      const response = await api.post<ApiResponse<Student>>('/students', data);
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const updateStudent = useCallback(async (id: string, data: any) => {
    try {
      const response = await api.put<ApiResponse<Student>>(
        `/students/${id}`,
        data
      );
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const deleteStudent = useCallback(async (id: string) => {
    try {
      await api.delete(`/students/${id}`);
      return true;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    total,
    pages,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}