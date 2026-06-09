import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { ApiResponse } from '@/types';

interface TimetablesResponse extends ApiResponse<any[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useTimetables() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchTimetables = useCallback(
    async (page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<TimetablesResponse>('/timetables', {
          params: { page, limit },
        });
        setTimetables(response.data.data || []);
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

  const createTimetable = useCallback(async (data: any) => {
    try {
      const response = await api.post<ApiResponse<any>>('/timetables', data);
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const getTimetableById = useCallback(async (id: string) => {
    try {
      const response = await api.get<ApiResponse<any>>(`/timetables/${id}`);
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const updateSlots = useCallback(
    async (id: string, slots: any[], stats: any) => {
      try {
        const response = await api.put<ApiResponse<any>>(
          `/timetables/${id}/slots`,
          { slots, stats }
        );
        return response.data.data;
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    []
  );

  const deleteTimetable = useCallback(async (id: string) => {
    const response = await api.delete(`/timetables/${id}`);
    if (response.data?.success) {
      return true;
    }
    throw new Error(response.data?.error || 'Deletion failed');
  }, []);

  const finalizeTimetable = useCallback(async (id: string) => {
    try {
      const response = await api.put<ApiResponse<any>>(
        `/timetables/${id}/finalize`
      );
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const getConflicts = useCallback(async (id: string) => {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/timetables/${id}/conflicts`
      );
      return response.data.data || [];
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const getStatistics = useCallback(async (id: string) => {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/timetables/${id}/statistics`
      );
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  const generateTimetable = useCallback(async (id: string) => {
    try {
      const response = await api.post<ApiResponse<any>>(
        `/timetables/${id}/generate`
      );
      return response.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }, []);

  // ❌ REMOVED auto-fetch — let pages call fetchTimetables() explicitly
  // useEffect(() => {
  //   fetchTimetables();
  // }, [fetchTimetables]);

  return {
    timetables,
    setTimetables,
    loading,
    error,
    total,
    pages,
    fetchTimetables,
    createTimetable,
    getTimetableById,
    updateSlots,
    deleteTimetable,
    finalizeTimetable,
    getConflicts,
    getStatistics,
    generateTimetable,
  };
}