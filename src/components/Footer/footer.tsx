import type React from "react"
import "./footer.css"

const Footer: React.FC = () => {
  
  return (

    <footer className="dashboard-footer">
      <div className="footer-content">
        <p className="footer-text">© 2024 Dashboard de Cultivos</p>
        <div className="footer-links">
          <a href="#" className="footer-link">
            Términos
          </a>
          <a href="#" className="footer-link">
            Privacidad
          </a>
          <a href="#" className="footer-link">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

