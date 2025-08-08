import React, { useContext, useState } from "react";
import ImagePopup from "../ImagePopup/ImagePopup.jsx";
import RemoveCard from "../RemoveCard/RemoveCard.jsx";
import Popup from "../Popup/Popup.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Card(props) {
  const { _id, name, link, isLiked, owner, likes } = props.card;
  const { onCardLike, onCardDelete } = props;
  const [popup, setPopup] = useState(null);
  const [imagePopup, setImagePopup] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const isOwn = owner === currentUser?._id;

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  const removeCardPopup = {
    title: "¿Estás seguro/a?",
    children: (
      <RemoveCard
        onConfirm={() => {
          onCardDelete(_id);
          closePopup();
        }}
      />
    ),
  };

  function openPopup(config) {
    setPopup(config);
  }

  function closePopup() {
    setPopup(null);
  }

  function handleImageClick() {
    setImagePopup({ title: name, link });
  }

  function handleLikeClick() {
    onCardLike(_id, isLiked);
  }

  function handleDeleteClick() {
    openPopup(removeCardPopup);
  }

  return (
    <>
      <li className="card">
        <img
          className="card__image"
          src={link}
          alt={name}
          onClick={handleImageClick}
        />

        {isOwn && (
          <button
            aria-label="Delete card"
            className="card__delete-button"
            type="button"
            onClick={handleDeleteClick}
          />
        )}

        <div className="card__description">
          <h2 className="card__title">{name}</h2>
          <div className="card__like-container">
            <button
              aria-label="Like card"
              type="button"
              className={cardLikeButtonClassName}
              onClick={handleLikeClick}
            />
          </div>
        </div>
      </li>

      {/* Popup de imagen ampliada */}
      {imagePopup && (
        <ImagePopup
          isOpen={true}
          onClose={() => setImagePopup(null)}
          title={imagePopup.title}
        >
          <img
            src={imagePopup.link}
            alt={imagePopup.title}
            className="image__popup-img"
          />
        </ImagePopup>
      )}

      {/* Popup genérico (borrado) */}
      {popup && (
        <Popup
          onClose={closePopup}
          title={popup.title}
          titleClass="removeCard-popup__title"
        >
          {popup.children}
        </Popup>
      )}
    </>
  );
}
