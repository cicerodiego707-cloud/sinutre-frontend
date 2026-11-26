
import type { Meal } from '@/types/mealSummary';
import { MealListItem } from './MealListItem';

interface MealsListProps {
  meals: Meal[];
  onActionClick?: (meal: Meal) => void;
  onEditClick?: (meal: Meal) => void;
}

export function MealsList({
  meals,
  onActionClick,
  onEditClick,
}: MealsListProps) {
  return (
    <section className="flex flex-col gap-3 lg:hidden">
      {meals.map(meal => (
        <MealListItem
          key={meal.id}
          meal={meal}
          onActionClick={onActionClick}
          onEditClick={onEditClick}
        />
      ))}
    </section>
  );
}
