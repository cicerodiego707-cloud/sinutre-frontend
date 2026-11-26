
import { useEffect, useState } from 'react';
import { updateFood } from '@/services/foodService';
import type { Food } from '@/types/food';

interface EditFoodModalProps {
  modalId: string;
  food: Food | null;
  onUpdated: () => Promise<void> | void;
}

export function EditFoodModal({
  modalId,
  food,
  onUpdated,
}: EditFoodModalProps) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (food) {
      setName(food.name);
      setCaloriesPer100g(String(food.caloriesPer100g));
      setCarbsPer100g(String(food.carbsPer100g));
      setProteinPer100g(String(food.proteinPer100g));
      setFatPer100g(String(food.fatPer100g));
      setError('');
    }
  }, [food]);

  async function handleSave() {
    if (!food) return;

    const values = [
      caloriesPer100g,
      carbsPer100g,
      proteinPer100g,
      fatPer100g,
    ];

    if (!name.trim()) {
      setError('Informe o nome do alimento.');
      return;
    }

    if (values.some((value) => value.trim() === '')) {
      setError('Preencha todos os valores nutricionais.');
      return;
    }

    if (values.some((value) => !Number.isFinite(Number(value)))) {
      setError('Informe valores nutricionais válidos.');
      return;
    }

    if (values.some((value) => Number(value) < 0)) {
      setError('Os valores nutricionais não podem ser negativos.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await updateFood(food.id, {
        name: name.trim(),
        caloriesPer100g: Number(caloriesPer100g),
        carbsPer100g: Number(carbsPer100g),
        proteinPer100g: Number(proteinPer100g),
        fatPer100g: Number(fatPer100g),
      });

      await onUpdated();

      (
        document.getElementById(modalId) as HTMLDialogElement
      )?.close();
    } catch (error) {
      console.error('Erro ao atualizar alimento:', error);
      setError('Não foi possível atualizar o alimento. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Editar alimento
        </h3>

        <div className="space-y-3 mt-4">
          <input
            className="input input-bordered w-full"
            placeholder="Nome"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
          />

          <input
            type="number"
            min="0"
            className="input input-bordered w-full"
            placeholder="Calorias por 100g"
            value={caloriesPer100g}
            onChange={(e) => {
              setCaloriesPer100g(e.target.value);
              setError('');
            }}
          />

          <input
            type="number"
            min="0"
            className="input input-bordered w-full"
            placeholder="Carboidratos por 100g"
            value={carbsPer100g}
            onChange={(e) => {
              setCarbsPer100g(e.target.value);
              setError('');
            }}
          />

          <input
            type="number"
            min="0"
            className="input input-bordered w-full"
            placeholder="Proteínas por 100g"
            value={proteinPer100g}
            onChange={(e) => {
              setProteinPer100g(e.target.value);
              setError('');
            }}
          />

          <input
            type="number"
            min="0"
            className="input input-bordered w-full"
            placeholder="Gorduras por 100g"
            value={fatPer100g}
            onChange={(e) => {
              setFatPer100g(e.target.value);
              setError('');
            }}
          />
        </div>

        {error && (
          <div className="alert alert-error mt-4" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Cancelar</button>
          </form>

          <button
            className="btn btn-primary"
            disabled={loading || !food}
            onClick={handleSave}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </dialog>
  );
}
