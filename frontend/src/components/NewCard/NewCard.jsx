import { useState, useEffect } from "react";

export default function NewCard({ onAddPlaceSubmit, onClose }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [isValid, setIsValid] = useState(false);

  function isValidUrl(url) {
    const pattern =
      /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    return pattern.test(url);
  }

  useEffect(() => {
    if (name.trim().length > 2 && isValidUrl(link)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [name, link]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onAddPlaceSubmit({ name, link });
    setName("");
    setLink("");
    onClose();
  }

  return (
    <form
      className="createCard__form"
      name="card-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="createCard__field">
        <input
          type="text"
          id="card-name"
          name="card-name"
          className="createCard__input createCard__input_type_card-name"
          placeholder="Title"
          minLength="1"
          maxLength="30"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="createCard__error" id="card-name-error"></span>
      </label>

      <label className="createCard__field">
        <input
          type="url"
          id="card-link"
          name="link"
          className="createCard__input createCard__input_type_card-name"
          placeholder="Image link"
          required
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <span className="createCard__error" id="card-link-error"></span>
      </label>

      <button
        className={`button popup__button ${isValid ? "enabled" : ""}`}
        type="submit"
        disabled={!isValid}
      >
        Guardar
      </button>
    </form>
  );
}
