
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

import ProfileManagement from "./ProfileManagement";
import SkillManagement from "./SkillManagement";
import ProjectsManagement from "./ProjectManagement";
import EducationManagement from "./EducationManagement";
import CertificateManagement from "./CertificateManagement";
import CVManagement from "./CVManagement";
import MessageManagement from "./MessageManagement";

function Dashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Overview");

  const sections = [
    "Overview",
    "Profile",
    "Skills",
    "Projects",
    "Education",
    "Certificates",
    "CV Management",
    "Messages"
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2>MyPortfolio.</h2>
        <p className="admin-label">ADMIN PANEL</p>

        {sections.map((section) => (
          <button
            key={section}
            className={
              activePage === section ? "active-menu" : "menu-item"
            }
            onClick={() => setActivePage(section)}
          >
            {section}
          </button>
        ))}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>{activePage}</h1>
            <p>Welcome to your portfolio administration panel.</p>
          </div>
        </header>

        {activePage === "Overview" && (
          <div>
            <h2>Dashboard Overview</h2>

            <div className="dashboard-cards">
              {sections.slice(1).map((section) => (
                <div className="dashboard-card" key={section}>
                  <h3>{section}</h3>
                  <p>Manage your {section.toLowerCase()}.</p>
                  <button onClick={() => setActivePage(section)}>
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === "Profile" && <ProfileManagement />}
        {activePage === "Skills" && <SkillManagement />}
        {activePage === "Projects" && <ProjectsManagement />}
        {activePage === "Education" && <EducationManagement />}

        {activePage === "Certificates" && <CertificateManagement />}
        {activePage === "CV Management" && <CVManagement />}
        {activePage === "Messages" && <MessageManagement />}

      </main>
    </div>
  );
}

export default Dashboard;
