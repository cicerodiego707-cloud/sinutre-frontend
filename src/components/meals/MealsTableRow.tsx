
import { useState } from 'react';
import { DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import type { Meal } from '@/types/mealSummary';
import { formatDate } from '@/utils/date';

interface MealsTableRowProps {
  meal: Meal;
  onActionClick?: (meal: Meal) => void;
  onEditClick?: (meal: Meal) => void;
}

export function MealsTableRow({
  meal,
  onActionClick,
  onEditClick,
}: MealsTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const category = MEAL_CATEGORY_BY_ID[meal.type];

  return (
    <tr className="hover">
      <td className="text-center font-bold text-base-content/60">
        {meal.id}
      </td>

      <td className="font-medium">{meal.name}</td>

      <td className="font-medium">{formatDate(meal.eatTime)}</td>

      <td className="font-semibold">{category.label}</td>

      <td>
       <span className="badge badge-primary badge-outline whitespace-nowrap">
         {Number(meal.totals.calories.toFixed(2))} kcal
       </span>
      </td>

      <td className="text-center">
        <div className="dropdown dropdown-end">
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            aria-label="Mais ações"
            onClick={() => {
              console.log('Botão de ações clicado');
              setMenuOpen((previous) => !previous);
           }}
          >
            <DotsThree size={20} />
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
      </td>
    </tr>
  );
}
