export default function ImagePopup({ isOpen, onClose, title, children }) {
  return (
    <div className={`image__popup ${isOpen ? "open" : ""}`}>
      <div
        className={`image__popup__content ${
          !title ? "popup__content_content_image" : ""
        }`}
      >
        <button
          aria-label="Close modal"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        {children}
        {title && <p className="image__popup-title">{title}</p>}
      </div>
    </div>
  );
}
