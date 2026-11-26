import { useState, useEffect, useMemo } from 'react';
import { AddMealCard } from '@/components/cards/AddMealCard';
import { HowItWorksCard } from '@/components/cards/HowItWorksCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsList } from '@/components/meals/MealsList';
import { MealsTable } from '@/components/meals/MealsTable';
import { AddMealModal } from '@/components/modal/AddMealModal';
import { EditMealModal } from '@/components/modal/EditMealModal';
import { useAuth } from '@/context/AuthContext';
import { Meal } from '@/types/mealSummary';
import { api } from '@/lib/api';
import { deleteMeal } from '@/services/mealService';
import { DeleteMealModal } from '@/components/modal/DeleteMealModal';

import {
  //MACRO_SUMMARY,
  //MEALS_SUMMARY,
  // RECENT_MEALS,
  // SAMPLE_MEAL_ITEMS,
} from '@/data/mockData';
import { useMealModal } from '@/hooks/useMealModal';

interface DashboardPageProps {
  drawerId: string;
}

//const MODAL_MACROS = {
//  carbs: 0,
//  proteins: 0,
//  fats: 0,
//  calories: 0,
//};

export function DashboardPage({ drawerId }: DashboardPageProps) {
  const { user } = useAuth();
  const modal = useMealModal();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);

  async function loadMeals() {
  try {
    const response = await api.get('/meals');
    setMeals(response.data);
  } catch (error) {
    setMeals([]);
    console.error('Erro ao carregar refeições:', error);
  } finally {
    setLoading(false);
  }
}

async function handleDeleteMeal() {
  if (!mealToDelete) return;

  try {
    await deleteMeal(mealToDelete.id);
    setMealToDelete(null);
    await loadMeals();
  } catch (error) {
    console.error('Erro ao excluir refeição:', error);
    window.alert('Não foi possível excluir a refeição.');
  }
}

  async function loadHealthData() {
  try {
    const response = await api.get('/healthdata');
    setCalorieGoal(response.data?.targetDietDaily ?? null);
  } catch (error) {
    console.error('Erro ao carregar a meta diária:', error);
  }
}
  useEffect(() => {
  loadMeals();
  loadHealthData();
}, []);

  const mealsSummary = useMemo(() => {
    const today = new Date();

    const total = meals.length;

    const todayCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    const monthCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);

      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      total,
      thisMonth: monthCount,
      today: todayCount,
    };
  }, [meals, calorieGoal]);

  const macroSummary = useMemo(() => {
    const today = new Date();
    return meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).reduce(
      (acc, meal) => {
        acc.carbs += meal.totals.carbs;
        acc.proteins += meal.totals.proteins;
        acc.fats += meal.totals.fats;
        acc.calories += meal.totals.calories;

        return acc;
      },
      {
        carbs: 0,
        proteins: 0,
        fats: 0,
        calories: 0,

        caloriesGoal: calorieGoal,
      },
    );
  }, [meals]);

    if (!user) {
    return <></>;
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header
          drawerId={drawerId}
          userName={user.name}
          avatarUrl={user.avatarUrl}
        />

        <MacroStatsBar summary={macroSummary} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
     <TotalMealsCard summary={mealsSummary} />
     <AddMealCard onSelectCategory={modal.openWith} />
     </div>

     <HowItWorksCard />

     <MealsTable
        meals={meals}
        onActionClick={(meal) => setMealToDelete(meal)}
        onEditClick={(meal) => setMealToEdit(meal)}
       />
     <MealsList
        meals={meals}
        onActionClick={(meal) => setMealToDelete(meal)}
        onEditClick={(meal) => setMealToEdit(meal)}
       />
      </div>

      <MealFab onSelectCategory={modal.openWith} />

      <AddMealModal
        open={modal.open}
        typeMeal={modal.selectedCategory}
        onClose={modal.close}
        onSave={modal.close}
        onMealCreated={loadMeals}
      />
      <DeleteMealModal
        open={mealToDelete !== null}
        mealName={mealToDelete?.name ?? ''}
        onClose={() => setMealToDelete(null)}
        onConfirm={handleDeleteMeal}
      />
      <EditMealModal
        meal={mealToEdit}
        onClose={() => setMealToEdit(null)}
        onMealUpdated={loadMeals}
      />
    </>
  );
}
