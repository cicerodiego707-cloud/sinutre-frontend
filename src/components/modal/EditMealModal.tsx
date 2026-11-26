
import { useEffect, useMemo, useState } from 'react';

import type { Meal } from '@/types/mealSummary';
import type { FoodItem, MealState, MealCategory } from '@/types/meal';

import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { updateMeal } from '@/services/mealService';

// Retorna a data e o horário no formato local
function getLocalDateTime(date: string | Date) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;

  return new Date(d.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

interface EditMealModalProps {
  meal: Meal | null;
  onClose: () => void;
  onMealUpdated: () => Promise<void>;
}

export function EditMealModal({
  meal,
  onClose,
  onMealUpdated,
}: EditMealModalProps) {
  const [mealData, setMealData] = useState<MealState>({
    description: '',
    type: 'breakfast',
    eatTime: '',
  });
  
  const [items, setItems] = useState<FoodItem[]>([]);

  
  useEffect(() => {
    if (!meal) {
      setItems([]);
      return;
    }

    setMealData({
      description: meal.name,
      type: meal.type as MealCategory,
      eatTime: getLocalDateTime(meal.eatTime),
    });

    setItems(
      meal.items.map((item) => {
        const grams = item.foodG;
        const food = item.food;

        return {
          id: item.foodId,
          foodId: item.foodId,
          name: food.name,
          grams,
          calories: (food.caloriesPer100g * grams) / 100,
          carbs: (food.carbsPer100g * grams) / 100,
          protein: (food.proteinPer100g * grams) / 100,
          fat: (food.fatPer100g * grams) / 100,
        };
      }),
    );
  }, [meal]);

  function handleAddItem(item: FoodItem) {
    setItems((current) => [...current, item]);
  }

  function handleRemoveItem(item: FoodItem) {
    setItems((current) => current.filter((x) => x.id !== item.id));
  }

  const macros = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.carbs += item.carbs;
          acc.proteins += item.protein;
          acc.fats += item.fat;
          acc.calories += item.calories;
          return acc;
        },
        { carbs: 0, proteins: 0, fats: 0, calories: 0, caloriesGoal: 0 },
      ),
    [items],
  );

  async function handleSaveMeal() {
    if (!meal || items.length === 0) return;

    await updateMeal(meal.id, {
      ...mealData,
      items: items.map((item) => ({
        foodId: item.foodId,
        grams: item.grams,
      })),
    });

    await onMealUpdated();
    onClose();
  }

  if (!meal) return null;

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">
          Editar Refeição
        </h2>

        <MealMacrosSummary macros={macros} />

        <MealMetadataForm meal={mealData} setMeal={setMealData} />

        <div className="mb-4">
  <h3 className="text-lg font-semibold mb-3">
    Itens da Refeição
  </h3>

  <div className="alert alert-warning mb-4 flex items-start gap-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6 shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86l-8.1 14.02A2 2 0 0 0 3.92 21h16.16a2 2 0 0 0 1.73-3.12l-8.1-14.02a2 2 0 0 0-3.42 0Z"
      />
    </svg>

    <div>
      <span className="font-semibold">
        Atenção ao editar alimentos
      </span>

      <p className="text-sm mt-1">
        Se desejar alterar a quantidade de um alimento que já foi
        adicionado, remova o item anterior e adicione-o novamente
        com a quantidade desejada.
      </p>
    </div>
  </div>

  <MealItemForm onAdd={handleAddItem} />
</div>

        <MealItemsTable items={items} onRemove={handleRemoveItem} />

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveMeal}
            disabled={items.length === 0}
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
