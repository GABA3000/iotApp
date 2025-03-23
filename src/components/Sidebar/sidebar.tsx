import { Link, useLocation } from "react-router-dom"
import "./sidebar.css"

export default function Sidebar() {


  const location = useLocation()

  return (

    <div className="sidebar">

  <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h1 className="logo-text">IoT Parcelas</h1>
        </div>
      </div>
      <ul className="nav-list">

        <li className="nav-item">

          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>

            <span className="nav-icon dashboard-icon"></span>
            <span className="nav-text">Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">


          <Link to="/mapas" className={`nav-link ${location.pathname === "/mapas" ? "active" : ""}`}>
            <span className="nav-icon map-icon"></span>

            <span className="nav-text">Mapas</span>

          </Link>
        </li>
        <li className="nav-item">
          <Link to="/estadisticas" className={`nav-link ${location.pathname === "/estadisticas" ? "active" : ""}`}>
            <span className="nav-icon chart-icon"></span>

            <span className="nav-text">Estadísticas</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/configuracion" className={`nav-link ${location.pathname === "/configuracion" ? "active" : ""}`}>

            <span className="nav-icon settings-icon"></span>


            <span className="nav-text">Configuración</span>

          </Link>


        </li>


      </ul>


    </div>
  )
}
