import { Link } from "react-router-dom";
import { useState } from "react";
import Popup from "../Popup/Popup";

export default function Register({ onRegister, popup, onClosePopup }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [valids, setValids] = useState({
    email: true,
    password: true,
  });

  const handleChange = (evt) => {
    const { name, value, validity, validationMessage } = evt.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validity.valid ? "" : validationMessage,
    }));

    setValids((prev) => ({
      ...prev,
      [name]: validity.valid,
    }));
  };

  function handleCloseClick() {
    onClosePopup();
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onRegister(data);
  };

  return (
    <>
      <form name="register-form" className="form" onSubmit={handleSubmit}>
        <h1 className="form__title">Regístrate</h1>
        <div className="form__inputs">
          <input
            name="email"
            className={`form__input ${
              valids.email ? "" : "form__input_type_error"
            }`}
            type="email"
            placeholder="Correo electrónico"
            value={data.email}
            onChange={handleChange}
            required
            maxLength="50"
            minLength="5"
          />
          <input
            name="password"
            className={`form__input ${
              valids.password ? "" : "form__input_type_error"
            }`}
            type="password"
            placeholder="Contraseña"
            value={data.password}
            onChange={handleChange}
            required
            maxLength="20"
            minLength="2"
          />
        </div>
        <button className="form__submit-button" type="submit">
          Regístrate
        </button>
        <Link to="/signin" className="form__link">
          ¿Ya eres miembro? Inicia sesión aquí
        </Link>
      </form>
    </>
  );
}
