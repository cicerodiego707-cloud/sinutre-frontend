import { api } from '@/lib/api';

export async function createMeal(
  meal: {
    type: string;
    eatTime: string;
    description?: string;

    items: {
      foodId: number;
      grams: number;
    }[];
  },
) {
  return api.post('/meals', meal);
}

export async function deleteMeal(mealId: number) {
  return api.delete(`/meals/${mealId}`);
}
export async function updateMeal(
  mealId: number,
  meal: {
    type: string;
    eatTime: string;
    description?: string;
    items: {
      foodId: number;
      grams: number;
    }[];
  },
) {
  return api.put(`/meals/${mealId}`, meal);
}
