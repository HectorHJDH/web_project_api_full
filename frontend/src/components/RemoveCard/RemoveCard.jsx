export default function RemoveCard({ isOpen, title }) {
  return (
    <form
      className="removeCard__form"
      name="removeCard-form"
      id="removeCard-form"
      noValidate
    >
      {title && <h3 className="removeCard__title">Estas seguro/a?</h3>}
      <button className="removeCard__button popup__button" type="submit">
        Si
      </button>
    </form>
  );
}
