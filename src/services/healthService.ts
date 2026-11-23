
import { api } from '@/lib/api';

export interface HealthData {
  id: number;
  targetDietDaily: number;
  levelActivity: string;
  createdAt: string;
}

export interface WeightLog {
  id: number;
  height: number;
  weight: number;
  createdAt: string;
}

export async function getHealthData() {
  const response = await api.get<HealthData | null>('/healthdata');
  return response.data;
}

export async function saveHealthData(data: {
  targetDietDaily: number;
  levelActivity: string;
}) {
  const response = await api.post('/healthdata', data);
  return response.data;
}

export async function getWeightLogs() {
  const response = await api.get<WeightLog[]>('/healthdata/weight');
  return response.data;
}

export async function saveWeightLog(data: {
  height: number;
  weight: number;
}) {
  const response = await api.post('/healthdata/weight', data);
  return response.data;
}
