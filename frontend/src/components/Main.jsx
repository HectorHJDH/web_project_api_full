import React, { useState, useContext } from "react";
import profilePicture from "../../src/images/Profile_photo.jpg";
import Popup from "./Popup/Popup";
import NewCard from "./NewCard/NewCard";
import EditAvatar from "./EditAvatar/EditAvatar";
import EditProfile from "./EditProfile/EditProfile";
import Card from "./Card/Card";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
}) {
  const [popup, setPopup] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = {
    title: "Nuevo lugar",
    children: (
      <NewCard onAddPlaceSubmit={onAddPlaceSubmit} onClose={handleClosePopup} />
    ),
  };

  const editAvatarPopup = {
    title: "Editar foto",
    children: <EditAvatar onClose={handleClosePopup} />,
  };
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile onClose={handleClosePopup} />,
  };

  function handleOpenPopup(cfg) {
    setPopup(cfg);
  }
  function handleClosePopup() {
    setPopup(null);
  }

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__spacing">
          <button
            aria-label="Edit avatar"
            className="profile__picture-container profile__picture-button"
            type="button"
            onClick={() => handleOpenPopup(editAvatarPopup)}
          >
            <img
              src={currentUser?.avatar || profilePicture}
              className="profile__picture"
              alt="profile avatar"
            />
            <div className="edit__icon"></div>
          </button>

          <div className="profile__container" id="profile-data">
            <div className="profile__container profile__content">
              <h2 className="profile__content profile__name">
                {currentUser?.name || "Cargando..."}
              </h2>
              <button
                aria-label="Edit profile"
                className="profile__content profile__editButton"
                type="button"
                onClick={() => handleOpenPopup(editProfilePopup)}
              />
            </div>
            <p className="profile__container profile__dedication">
              {currentUser?.about || "—"}
            </p>
          </div>
        </div>

        <button
          aria-label="Add card"
          className="profile__button createPlace__button profile__add-button"
          type="button"
          onClick={() => handleOpenPopup(newCardPopup)}
        />
      </section>

      {/* Vista ampliada de imagen */}
      <div className="image__view">
        <div className="image__view-column">
          <div className="image__view-order">
            <img className="image__view-img" alt="Expanded image" />
            <button className="image__view-button" />
          </div>
          <p className="image__view-title">Image Title Here</p>
        </div>
      </div>

      {/* Popup de confirmación de borrado */}
      <div className="deleteCard__background deleteCard__popup">
        <section className="deleteCard__section">
          <div className="form__container">
            <button className="deleteCard__button-close close_button" />
            <div id="deleteCard__form" className="deleteCard__form">
              <h3 className="deleteCardForm__title">¿Estás seguro/a?</h3>
              <button className="deleteCard__form-submit">Sí</button>
            </div>
          </div>
        </section>
      </div>

      {/* Lista dinámica de cards */}
      <ul className="cards__list">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>

      {/* Popup genérico */}
      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
