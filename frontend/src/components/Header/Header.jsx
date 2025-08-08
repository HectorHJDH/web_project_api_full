import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DropdownIcon from "../../images/DropdownBtn.svg";
import CloseIcon from "../../images/Close_Icon.png";

export default function Header({ isLoggedIn, userEmail, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 480 : false
  );

  const toggleMenu = () => setMenuOpen((open) => !open);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobile(mobile);
      if (!mobile && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
    navigate("/signin");
  };

  if (!isLoggedIn) {
    const onSignin = location.pathname === "/signin";
    const onSignup = location.pathname === "/signup";
    const buttonText = onSignin ? "Regístrate" : "Iniciar sesión";
    const buttonLink = onSignin ? "/signup" : "/signin";

    return (
      <header className="header">
        <div className="header__pageName">
          <h1 className="header__title">Around</h1>
          <span className="header__span">The U.S.</span>
        </div>
        <Link to={buttonLink} className="header__button">
          {buttonText}
        </Link>
      </header>
    );
  }

  return (
    <header
      className={`header header--logged-in ${menuOpen ? "menu--open" : ""}`}
    >
      <div className="header__pageName">
        <h1 className="header__title">Around</h1>
        <span className="header__span">The U.S.</span>
      </div>

      {/** Si es móvil, mostramos toggle + dropdown */}
      {isMobile ? (
        <>
          <button
            className="header__dropdown-toggle"
            onClick={toggleMenu}
            aria-label="Menú de usuario"
          >
            <img
              src={menuOpen ? CloseIcon : DropdownIcon}
              alt={menuOpen ? "Cerrar" : "Abrir"}
            />
          </button>

          {menuOpen && (
            <div className="header__dropdown-menu">
              <span className="header__email--dropdown">{userEmail}</span>
              <button
                className="header__button--dropdown"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </>
      ) : (
        /** Si NO es móvil, mostramos el email + botón */
        <div className="header__auth-info">
          <span className="header__email">{userEmail}</span>
          <button className="header__button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
