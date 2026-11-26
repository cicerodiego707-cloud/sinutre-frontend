
interface DeleteMealModalProps {
  open: boolean;
  mealName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteMealModal({
  open,
  mealName,
  onClose,
  onConfirm,
}: DeleteMealModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 text-error">
            <span className="text-2xl">!</span>
          </div>

          <h2 className="text-xl font-semibold">
            Excluir refeição
          </h2>
        </div>

        <p className="text-base-content/70 mb-4">
          Tem certeza de que deseja excluir esta refeição?
        </p>

        <div className="bg-base-200 rounded-lg p-4 mb-3">
          <p className="font-semibold text-base-content">
            {mealName}
          </p>
        </div>

        <p className="text-sm text-base-content/60">
          Esta ação não poderá ser desfeita.
        </p>

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
            className="btn btn-error"
            onClick={onConfirm}
          >
            Excluir refeição
          </button>
        </div>
      </div>
    </div>
  );
}
