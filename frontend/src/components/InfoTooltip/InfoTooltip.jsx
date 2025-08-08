import checkIcon from "../../images/Check_Icon.svg";
import errorIcon from "../../images/Error_Icon.svg";

export default function InfoTooltip({ registerStatus }) {
  console.log("registerStatus:", registerStatus);

  let textMessage = registerStatus
    ? "¡Correcto! Ya estás registrado."
    : "Uy, algo salió mal. Por favor, inténtalo de nuevo.";
  return (
    <div className="popup__tooltip">
      <img
        className="popup__image"
        alt="Imagen estatus"
        src={registerStatus ? checkIcon : errorIcon}
      />
      <p className="popup__tooltip_title">{textMessage}</p>
    </div>
  );
}
