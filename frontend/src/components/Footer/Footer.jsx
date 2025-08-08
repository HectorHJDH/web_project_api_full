import { useState } from "react";

function Footer() {
  const [count, setCount] = useState(0);

  return (
    <>
      <footer className="footer">
        <p className="footer__copyright">© 2025 Around The U.S.</p>
      </footer>
    </>
  );
}

export default Footer;
