
import { useState } from 'react';
import {
  ClipboardText,
  ForkKnife,
  ChartBar,
  CaretDown,
  CaretUp,
} from '@phosphor-icons/react';

export function HowItWorksCard() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between gap-4">
          <h2 className="card-title text-xl">
            Como funciona o SiNutre?
          </h2>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                Recolher
                <CaretUp size={18} />
              </>
            ) : (
              <>
                Expandir
                <CaretDown size={18} />
              </>
            )}
          </button>
        </div>

        {expanded && (
          <>
            <p className="text-base-content/70 mb-2">
              Organize sua alimentação e acompanhe seus resultados em três passos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3 items-start">
                <ClipboardText size={32} className="text-primary shrink-0" />

                <div>
                  <h3 className="font-semibold">1. Cadastre seus alimentos</h3>
                  <p className="text-sm text-base-content/70">
                    Registre os alimentos e seus valores nutricionais na seção Dieta.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ForkKnife size={32} className="text-primary shrink-0" />

                <div>
                  <h3 className="font-semibold">2. Registre suas refeições</h3>
                  <p className="text-sm text-base-content/70">
                    Escolha os alimentos, informe as quantidades e organize suas refeições.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ChartBar size={32} className="text-primary shrink-0" />

                <div>
                  <h3 className="font-semibold">3. Acompanhe seus resultados</h3>
                  <p className="text-sm text-base-content/70">
                    Visualize calorias, macronutrientes e acompanhe sua meta diária.
                  </p>
                </div>
              </div>
            </div>
                        <p className="text-xs text-base-content/60 mt-4">
              Atenção: alimentos já utilizados em refeições não podem ser
              excluídos, preservando seu histórico alimentar.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
