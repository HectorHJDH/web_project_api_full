export default function Popup({ onClose, title, children, titleClass }) {
  return (
    <div className="popup">
      <div className="popup__content">
        <button
          aria-label="Close modal"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        {title !== "tooltip" ? (
          <h3 className={`popup__title ${titleClass ? titleClass : ""}`}>
            {title}
          </h3>
        ) : null}
        {children}
      </div>
    </div>
  );
}
