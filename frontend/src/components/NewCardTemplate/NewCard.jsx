import { useState } from "react";

export default function NewCardTemplate() {
  return (
    <form
      style={{ display: "none" }}
      className="popup__form"
      name="card-form"
      id="new-card-form"
      noValidate
    >
      <label className="popup__field">
        <input
          type="text"
          id="card-name"
          name="card-name"
          className="popup__input popup__input_type_card-name"
          placeholder="Title"
          minLength="1"
          maxLength="30"
          required
        />
        <span className="popup__error" id="card-name-error"></span>
      </label>

      <label className="popup__field">
        <input
          type="url"
          id="card-link"
          name="link"
          className="popup__input popup__input_type_card-name"
          placeholder="Image link"
          required
        />
        <span className="cpopup__error" id="card-link-error"></span>
      </label>

      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
}
