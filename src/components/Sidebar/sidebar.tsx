import type React from "react"
import "./sidebar.css"

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h1 className="logo-text">Dashboard</h1>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item active">
            <a href="#" className="nav-link">
              <span className="nav-icon dashboard-icon"></span>
              <span className="nav-text">Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon map-icon"></span>
              <span className="nav-text">Mapas</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon chart-icon"></span>
              <span className="nav-text">Estadísticas</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon settings-icon"></span>
              <span className="nav-text">Configuración</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

