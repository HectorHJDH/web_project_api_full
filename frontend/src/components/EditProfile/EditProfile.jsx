import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function EditProfile({ onClose }) {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await handleUpdateUser({ name, about: description });
      onClose();
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    }
  };

  const isFormValid = name.trim().length > 1 && description.trim().length > 1;

  return (
    <form
      className="editProfile__form"
      name="editProfile-form"
      id="editProfile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="editProfile__field">
        <input
          type="text"
          id="profile-name"
          name="profile-name"
          className="editProfile__input editProfile__input_type_card-name"
          placeholder="Name"
          minLength="1"
          maxLength="30"
          required
          value={name}
          onChange={handleNameChange}
        />
        <span className="editProfile__error" id="editProfile-input-error" />
      </label>

      <label className="editProfile__field">
        <input
          type="text"
          id="profile-occupation"
          name="profile-occupation"
          className="editProfile__input editProfile__input_type_card-name"
          placeholder="Occupation"
          required
          maxLength="200"
          minLength="2"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="editProfile__error" id="editProfile-input-error" />
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
