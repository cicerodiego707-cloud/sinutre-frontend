
import { useEffect, useState } from 'react';

import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { api } from '@/lib/api';
import {
  getHealthData,
  getWeightLogs,
} from '@/services/healthService';

import type { Meal } from '@/types/mealSummary';

function getBMIClassification(bmi: number) {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso adequado';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade grau I';
  if (bmi < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

export function StatsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goal, setGoal] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const [mealsResponse, health, logs] = await Promise.all([
          api.get<Meal[]>('/meals'),
          getHealthData(),
          getWeightLogs(),
        ]);

        setMeals(mealsResponse.data);
        setGoal(health?.targetDietDaily ?? null);

        if (logs.length > 0) {
          setHeight(logs[0].height);
          setWeight(logs[0].weight);
        }
      } catch (err) {
        console.error('Erro ao carregar progresso:', err);
        setError('Não foi possível carregar seus dados.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Calcula o consumo dos últimos sete dias
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 6);

  const dailyCalories = Array(7).fill(0);

  meals.forEach((meal) => {
    const date = new Date(meal.eatTime);
    date.setHours(0, 0, 0, 0);

    if (date >= startDate && date <= today) {
      const dayIndex = Math.round(
        (date.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      dailyCalories[dayIndex] += meal.totals.calories;
    }
  });

  const totalCalories = dailyCalories.reduce(
    (total, calories) => total + calories,
    0
  );

  const averageCalories = totalCalories / 7;

  // Calcula o IMC
  const bmi =
    height && weight
      ? weight / (height * height)
      : null;

  if (loading) {
    return <p>Carregando progresso...</p>;
  }

  if (error) {
    return <p className="text-error">{error}</p>;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Progresso"
        subtitle="Acompanhe sua evolução e seus indicadores"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* IMC */}
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Índice de Massa Corporal</h2>

            {bmi !== null ? (
              <>
                <p className="text-4xl font-bold">
                  {bmi.toFixed(1)}
                </p>

                <p className="text-sm text-base-content/70">
                  {getBMIClassification(bmi)}
                </p>

                <p className="text-sm mt-2">
                  Altura: {height?.toFixed(2)} m
                </p>

                <p className="text-sm">
                  Peso: {weight?.toFixed(1)} kg
                </p>
              </>
            ) : (
              <p className="text-sm text-base-content/70">
                Cadastre sua altura e peso nas Configurações
                para calcular seu IMC.
              </p>
            )}
          </div>
        </section>

        {/* Média calórica */}
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              Média calórica dos últimos 7 dias
            </h2>

            <p className="text-4xl font-bold">
              {Math.round(averageCalories).toLocaleString('pt-BR')}
            </p>

            <p className="text-sm text-base-content/70">
              kcal por dia
            </p>

            {goal !== null ? (
              <>
                <p className="text-sm mt-3">
                  Meta diária: {goal.toLocaleString('pt-BR')} kcal
                </p>

                <p className={
                  averageCalories > goal
                    ? 'text-error font-medium'
                    : 'text-success font-medium'
                }>
                  {averageCalories > goal
                    ? 'Média acima da meta diária.'
                    : 'Média dentro da meta diária.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-base-content/70">
                Cadastre sua meta diária nas Configurações.
              </p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
