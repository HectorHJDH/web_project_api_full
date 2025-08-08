import React, { useState, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function EditAvatar({ onClose }) {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleUrlChange = (event) => {
    setAvatarUrl(event.target.value);
  };

  const isValidUrl = (url) => {
    try {
      const pattern =
        /^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+([\/?=&%:.~\w\-]*)?$/i;
      return pattern.test(url);
    } catch (e) {
      return false;
    }
  };

  const isFormValid = isValidUrl(avatarUrl);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      handleUpdateAvatar({ avatar: avatarUrl });
      onClose(); 
    } else {
      console.error("La URL no es válida o no es una imagen.");
    }
  };

  return (
    <form
      className="editAvatar__form"
      name="editAvatar-form"
      id="editAvatar-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="editAvatar__field">
        <input
          type="url"
          id="editAvatar-url"
          name="editAvatar-url"
          className="editAvatar__input"
          placeholder="Ingrese la URL de la imagen"
          value={avatarUrl}
          onChange={handleUrlChange}
          required
        />
        <span className="editAvatar__error" id="editAvatar-input-error"></span>
      </label>

      <button
        className={`button popup__button ${isFormValid ? "enabled" : ""}`}
        type="submit"
        disabled={!isFormValid} 
      >
        Guardar
      </button>
    </form>
  );
}
