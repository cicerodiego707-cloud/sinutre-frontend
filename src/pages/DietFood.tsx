
import { useEffect, useState } from 'react';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
import { EditFoodModal } from '@/components/modal/EditFoodModal';
import { getFoods, deleteFood } from '@/services/foodService';
import type { Food } from '@/types/food';

const CREATE_MODAL_ID = 'create-food-modal';
const EDIT_MODAL_ID = 'edit-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadFoods() {
    try {
      const data = await getFoods();
      setFoods(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  function openEditModal(food: Food) {
    setSelectedFood(food);

    setTimeout(() => {
      (
        document.getElementById(
          EDIT_MODAL_ID,
        ) as HTMLDialogElement
      )?.showModal();
    }, 0);
  }
  async function handleDelete(food: Food) {
  const confirmed = window.confirm(
    `Deseja realmente excluir o alimento "${food.name}"?`
  );

  if (!confirmed) return;

  try {
    await deleteFood(food.id);
    await loadFoods();
  } catch (error) {
    console.error('Erro ao excluir alimento:', error);
    alert('Não foi possível excluir o alimento.');
  }
}

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body">
                <div className="flex justify-between items-center gap-3">
                  <h2 className="card-title">
                    {food.name}
                  </h2>

                  <div className="flex gap-2">
  <button
    className="btn btn-outline btn-sm"
    onClick={() => openEditModal(food)}
  >
    <PencilSimple size={18} />
    Editar
  </button>

  <button
    className="btn btn-outline btn-error btn-sm"
    onClick={() => handleDelete(food)}
  >
    <Trash size={18} />
    Excluir
  </button>
</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>🔥 {food.caloriesPer100g} kcal</span>
                  <span>🍞 {food.carbsPer100g} g</span>
                  <span>🍗 {food.proteinPer100g} g</span>
                  <span>🥑 {food.fatPer100g} g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (
            document.getElementById(
              CREATE_MODAL_ID,
            ) as HTMLDialogElement
          )?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      <AddFoodModal
        modalId={CREATE_MODAL_ID}
        onCreated={loadFoods}
      />

      <EditFoodModal
        modalId={EDIT_MODAL_ID}
        food={selectedFood}
        onUpdated={loadFoods}
      />
    </div>
  );
}
