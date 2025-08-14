export default function RemoveCard({ onConfirm, onCancel, title }) {
  return (
    <div className="removeCard">
      <h3 className="removeCard__title">{title}</h3>

      <div className="removeCard__actions">
        <button
          type="button"
          className="removeCard__button removeCard__button--confirm"
          onClick={() => {
            if (typeof onConfirm === "function") {
              const result = onConfirm();
              if (result && typeof result.then === "function") {
                result.catch(() => {});
              }
            }
          }}
        >
          Si
        </button>
      </div>
    </div>
  );
}
