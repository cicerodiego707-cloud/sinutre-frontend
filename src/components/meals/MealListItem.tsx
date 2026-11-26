
import { useState } from 'react';
import {
  DotsThreeVertical,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import type { Meal } from '@/types/mealSummary';
import { formatDate } from '@/utils/date';

interface MealListItemProps {
  meal: Meal;
  onActionClick?: (meal: Meal) => void;
  onEditClick?: (meal: Meal) => void;
}

export function MealListItem({
  meal,
  onActionClick,
  onEditClick,
}: MealListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const category = MEAL_CATEGORY_BY_ID[meal.type];
  const Icon = category.Icon;

  return (
    <article className="card card-side bg-base-100 shadow-sm">
      <div className="card-body p-4 flex-row items-center gap-4">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{category.label}</p>
          <p className="font-semibold text-sm">{meal.name}</p>
          <p className="text-xs text-base-content/50">
            {formatDate(meal.eatTime)}
          </p>
        </div>

        <span className="badge badge-primary badge-outline badge-sm whitespace-nowrap shrink-0">
            {Number(meal.totals.calories.toFixed(2))} kcal
        </span>

        <div className="dropdown dropdown-end">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Mais ações"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            <DotsThreeVertical size={18} />
          </button>

          {menuOpen && (
            <ul className="dropdown-content menu bg-base-100 rounded-box z-50 w-48 p-2 shadow-lg border border-base-300">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEditClick?.(meal);
                  }}
                >
                  <PencilSimple size={18} />
                  Editar refeição
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="text-error"
                  onClick={() => {
                    setMenuOpen(false);
                    onActionClick?.(meal);
                  }}
                >
                  <Trash size={18} />
                  Excluir refeição
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
