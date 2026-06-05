import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  potentialConflicts: number;
  topCourses: Array<{
    code: string;
    name: string;
    students: number;
  }>;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ success: boolean; data: DashboardStats }>(
        '/stats/dashboard'
      );
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}