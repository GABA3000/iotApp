
import Sidebar from "../components/Sidebar/sidebar"
import Footer from "../components/Footer/footer"
import Header from "../components/Header/header"
import Estadisticas from "../components/Estadisticas/Estadisticas"

export default function EstadisticasPage() {
  return (
    <div className="dashboard-container">

      <Sidebar />
      <div className="main-content">

        <Header title="Gráficas Históricas | IoT App" />
        <Estadisticas />
        <Footer />
      </div>
    </div>
  )
}
