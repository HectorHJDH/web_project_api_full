import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import { api } from "../utils/api.js";
import "../../src/index.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import Popup from "./Popup/Popup.jsx";
import { auth } from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [loggedin, setLoggedin] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setLoggedin(false);
    setCurrentUser(null);
    navigate("/signin", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      initializeApp(token);
    } else {
      setIsCheckingToken(false);
    }
  }, []);

  if (isCheckingToken) {
    return <div>Cargando...</div>;
  }

  // async function initializeApp(token) {
  //   try {
  //     const { data: user } = await auth.checkToken(token);
  //     const fullUser = await api.getInitialUser();

  //     const mergedUser = { ...fullUser, email: user.email };

  //     setLoggedin(true);
  //     setCurrentUser(mergedUser);

  //     const fetchedCards = await api.getInitialCards();
  //     setCards(fetchedCards);
  //   } catch (err) {
  //     console.error("Error durante initializeApp:", err);
  //     localStorage.removeItem("jwt");
  //     setLoggedin(false);
  //     setCurrentUser(null);
  //   } finally {
  //     setIsCheckingToken(false);
  //   }
  // }

  function extractEmailFromAuthResponse(resp) {
    if (!resp) return null;

    const maybeData = resp.data ?? resp;

    if (maybeData.email) return maybeData.email;
    if (maybeData.user && maybeData.user.email) return maybeData.user.email;
    if (maybeData.payload && maybeData.payload.email)
      return maybeData.payload.email;

    return null;
  }

  async function initializeApp(token) {
    if (!token) {
      localStorage.removeItem("jwt");
      setLoggedin(false);
      setCurrentUser(null);
      setCards([]);
      setIsCheckingToken(false);
      return;
    }

    try {
      const authResp = await auth.checkToken(token);

      const emailFromAuth = extractEmailFromAuthResponse(authResp);

      const [fullUser, fetchedCards] = await Promise.all([
        api.getInitialUser(),
        api.getInitialCards(),
      ]);

      const finalEmail = emailFromAuth ?? (fullUser && fullUser.email) ?? null;
      const mergedUser = {
        ...(fullUser || {}),
        ...(finalEmail ? { email: finalEmail } : {}),
      };

      setLoggedin(true);
      setCurrentUser(mergedUser);
      setCards(Array.isArray(fetchedCards) ? fetchedCards : []);
    } catch (err) {
      console.error("Error durante initializeApp:", err);
      localStorage.removeItem("jwt");
      setLoggedin(false);
      setCurrentUser(null);
      setCards([]);
    } finally {
      setIsCheckingToken(false);
    }
  }

  // Like / Dislike
  const handleCardLike = (cardId, isCurrentlyLiked) => {
    const likePromise = isCurrentlyLiked
      ? api.removeLikeCard(cardId)
      : api.likeCard(cardId);

    likePromise
      .then((updatedCard) => {
        setCards((cards) =>
          cards.map((c) =>
            c._id === cardId
              ? {
                  ...c,
                  isLiked: !isCurrentlyLiked,
                  likes: updatedCard.likes,
                }
              : c
          )
        );
      })
      .catch((err) => console.error("Error al cambiar like:", err));
  };

  const handleCardDelete = (cardId) => {
    return api
      .deleteCard(cardId)
      .then((res) => {
        setCards((cards) => cards.filter((c) => c._id !== cardId));
        return res; 
      })
      .catch((err) => {
        console.error("App: api.deleteCard error", err);
        throw err; 
      });
  };

  const handleUpdateUser = ({ name, about }) => {
    api
      .editProfileCredentials({ name, about })
      .then((newData) => {
        setCurrentUser((prev) => ({
          ...prev,
          ...newData,
        }));
      })
      .catch((err) => {
        console.error("Error al actualizar usuario:", err);
      });
  };

  // Actualizar avatar
  const handleUpdateAvatar = ({ avatar }) => {
    api
      .editProfileImage({ avatar })
      .then((newData) => {
        setCurrentUser((prev) => ({
          ...prev,
          ...newData,
        }));
      })
      .catch((err) => {
        console.error("Error al actualizar avatar:", err);
      });
  };

  const handleAddPlaceSubmit = (newCardData) => {
    api
      .createCard(newCardData)
      .then((newCard) => {
        setCards((prevCards) => [newCard, ...prevCards]);
      })
      .catch((err) => {
        console.error("Error al crear una nueva card:", err);
      });
  };

  async function handleUserSignup(data) {
    await auth
      .signup(data)
      .then((userInfo) => {
        if (userInfo) {
          const infoTooltipTrue = {
            children: <InfoTooltip registerStatus={true} />,
          };
          setPopup(infoTooltipTrue);
          navigate("/signin");
        }
      })
      .catch((err) => {
        if (err) {
          const infoTooltipFalse = {
            children: <InfoTooltip registerStatus={false} />,
          };
          setPopup(infoTooltipFalse);
        }
      });
  }

  async function handleUserSignin(credentials) {
    try {
      const { token } = await auth.signIn(credentials);
      localStorage.setItem("jwt", token);

      await initializeApp(token);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 300);

      setPopup({
        title: "",
        children: <InfoTooltip registerStatus={true} />,
      });
    } catch (err) {
      console.error("Error en login:", err);
      setPopup({
        title: "",
        children: <InfoTooltip registerStatus={false} />,
      });
    }
  }

  function handleClosePopup() {
    setPopup(null);
  }

  return (
    <div className="page__content">
      <Header
        isLoggedIn={loggedin}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={loggedin}>
              <CurrentUserContext.Provider
                value={{
                  currentUser,
                  setCurrentUser,
                  handleUpdateUser,
                  handleUpdateAvatar,
                  handleAddPlaceSubmit,
                }}
              >
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                />
                <Footer />
              </CurrentUserContext.Provider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <Register
              onRegister={handleUserSignup}
              popup={popup}
              onClosePopup={handleClosePopup}
            />
          }
        />

        <Route
          path="/signin"
          element={
            <Login
              onLogin={handleUserSignin}
              popup={popup}
              onClosePopup={handleClosePopup}
            />
          }
        />
      </Routes>

      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </div>
  );
}

export default App;
