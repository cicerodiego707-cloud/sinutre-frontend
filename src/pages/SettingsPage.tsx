
import { useEffect, useState } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import {
  getHealthData,
  saveHealthData,
  getWeightLogs,
  saveWeightLog,
} from '@/services/healthService';
import { getTheme, applyTheme, type Theme } from '@/utils/theme';

const ACTIVITY_LEVELS = [
  { value: 'SEDENTARIO', label: 'Sedentário' },
  { value: 'LEVEMENTE_ATIVO', label: 'Levemente ativo' },
  { value: 'MODERADAMENTE_ATIVO', label: 'Moderadamente ativo' },
  { value: 'MUITO_ATIVO', label: 'Muito ativo' },
  { value: 'EXTREMAMENTE_ATIVO', label: 'Extremamente ativo' },
];

export function SettingsPage() {
  const [calories, setCalories] = useState('');
  const [activity, setActivity] = useState('SEDENTARIO');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    async function loadData() {
      try {
        const [health, logs] = await Promise.all([
          getHealthData(),
          getWeightLogs(),
        ]);

        if (health) {
          setCalories(String(health.targetDietDaily));
          setActivity(health.levelActivity);
        }

        if (logs.length > 0) {
          setHeight(String(logs[0].height));
          setWeight(String(logs[0].weight));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setMessage('Não foi possível carregar seus dados.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const calorieGoal = Number(calories);
      const heightValue = Number(height);
      const weightValue = Number(weight);

      if (
        !Number.isInteger(calorieGoal) ||
        calorieGoal < 500 ||
        calorieGoal > 10000
      ) {
        setMessage('A meta deve estar entre 500 e 10000 calorias.');
        return;
      }

      if (
        !Number.isFinite(heightValue) ||
        heightValue < 0.5 ||
        heightValue > 2.5
      ) {
        setMessage('Informe uma altura válida em metros.');
        return;
      }

      if (
        !Number.isFinite(weightValue) ||
        weightValue < 20 ||
        weightValue > 500
      ) {
        setMessage('Informe um peso válido em quilogramas.');
        return;
      }

      await saveHealthData({
        targetDietDaily: calorieGoal,
        levelActivity: activity,
      });

      await saveWeightLog({
        height: heightValue,
        weight: weightValue,
      });

      setMessage('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage('Não foi possível salvar suas configurações.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Carregando configurações...</p>;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Configurações"
        subtitle="Gerencie suas metas e dados corporais"
      />

      <form onSubmit={handleSave} className="grid gap-6 mt-6">
        <section className="card bg-base-100 shadow-sm">
  <div className="card-body">
    <h2 className="card-title">Aparência</h2>

    <label className="form-control w-full">
      <span className="label-text mb-2">Escolha o tema do SiNutre</span>

      <select
        className="select select-bordered w-full"
        value={theme}
        onChange={(event) => {
          const selectedTheme = event.target.value as Theme;
          setTheme(selectedTheme);
          applyTheme(selectedTheme);
        }}
      >
        <option value="sinutre">Verde (padrão)</option>
        <option value="sinutre-dark">Escuro</option>
        <option value="sinutre-blue">Azul</option>
      </select>
    </label>
  </div>
</section>
        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Dados nutricionais</h2>

            <label className="form-control w-full">
              <span className="label-text mb-2">
                Meta diária de calorias (kcal)
              </span>
              <input
                type="number"
                min="500"
                max="10000"
                step="1"
                className="input input-bordered w-full"
                value={calories}
                onChange={(event) => setCalories(event.target.value)}
                required
              />
            </label>

            <label className="form-control w-full mt-4">
              <span className="label-text mb-2">
                Nível de atividade física
              </span>
              <select
                className="select select-bordered w-full"
                value={activity}
                onChange={(event) => setActivity(event.target.value)}
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Dados corporais</h2>

            <label className="form-control w-full">
              <span className="label-text mb-2">Altura (metros)</span>
              <input
                type="number"
                min="0.5"
                max="2.5"
                step="0.01"
                placeholder="Ex.: 1.75"
                className="input input-bordered w-full"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                required
              />
            </label>

            <label className="form-control w-full mt-4">
              <span className="label-text mb-2">Peso (kg)</span>
              <input
                type="number"
                min="20"
                max="500"
                step="0.1"
                placeholder="Ex.: 75"
                className="input input-bordered w-full"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                required
              />
            </label>
          </div>
        </section>

        {message && (
          <p className="text-sm font-medium">{message}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>
    </div>
  );
}
