import type React from "react"
import "./header.css"

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="dashboard-header">
      <div className="logo">
        <div className="logo-icon"></div>
      </div>
      <h1 className="header-title">{title}</h1>
      <div className="user-profile">
        <div className="user-avatar">AG</div>
      </div>
    </header>
  )
}

export default Header

