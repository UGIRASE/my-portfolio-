
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../services/firebase";
import "../App.css";

function Home() {
  const [profile, setProfile] = useState({
    fullName: "ISARO Adeline UGIRASE",
    title: "Software Developer",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    instagram: "",
    X: "",
    location: "",
    about:
      "I am an Information Technology student interested in web development, programming, databases, and technology."
  });

  const [skills, setSkills] = useState([]);
  const [cv, setCv] = useState({
    downloadURL: "/my-cv.pdf?v=20261121"
  });
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET PROFILE
        const profileSnapshot = await getDoc(
          doc(db, "profiles", "main")
        );

        if (profileSnapshot.exists()) {
          setProfile((previous) => ({
            ...previous,
            ...profileSnapshot.data()
          }));
        }

        // GET SKILLS
        const skillsSnapshot = await getDocs(
          collection(db, "skills")
        );

        setSkills(
          skillsSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );

        // The CV is served directly from the public folder.

      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setCvLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="portfolio">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">MyPortfolio.</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">

        <div className="hero-text">

          <p className="welcome">
            WELCOME TO MY PORTFOLIO
          </p>

          <h1>
            Hello, I'm <span>{profile.fullName}</span>
          </h1>

          <h2>{profile.title}</h2>

          <p className="description">
            {profile.about}
          </p>

          <div className="hero-buttons">

            <a href="#projects" className="btn-primary">
              View My Projects
            </a>

            {cvLoading ? (
              <p>Checking CV...</p>
            ) : cv?.downloadURL ? (
              <>
                {/* VIEW CV */}
                <a
                  href={cv.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  View CV
                </a>

                {/* DOWNLOAD CV */}
                <a
                   href={cv.downloadURL}
                   download="My-CV.pdf"
                   className="btn-secondary"
                >
                  Download CV
                </a>
              </>
            ) : (
              <p className="cv-unavailable">
                CV is currently unavailable.
              </p>
            )}

          </div>
        </div>

        <div className="hero-image">
          <div className="profile-circle">
            <img
              src="/profile.png"
              alt="My profile"
              className="profile-photo"
            />
          </div>
        </div>

      </section>

      {/* ABOUT SECTION */}
      <section className="about" id="about">

        <h2>About Me</h2>

        <p>{profile.about}</p>

        {profile.location && (
          <p>Location: {profile.location}</p>
        )}

        {profile.phone && (
          <p>Phone: {profile.phone}</p>
        )}

      </section>

      {/* SKILLS SECTION */}
      <section className="skills" id="skills">

        <h2>My Skills</h2>

        <div className="skill-list">

          {skills.length > 0 ? (
            skills.map((skill) => (
              <div className="skill-card" key={skill.id}>
                <h3>{skill.name}</h3>
                <p>{skill.level}</p>
              </div>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}

        </div>

      </section>

      {/* PROJECTS SECTION */}
      <section className="projects" id="projects">

        <h2>My Projects</h2>

        <div className="project-list">

          <div className="project-card">
            <h3>Mini Blog App</h3>
            <p>
              A web application where users can create, edit,
              and share blog posts.
            </p>
          </div>

          <div className="project-card">
            <h3>Habit Tracker</h3>
            <p>
              An application that helps users track their
              daily habits and progress.
            </p>
          </div>

          <div className="project-card">
            <h3>Personal Portfolio</h3>
            <p>
              A website that displays my profile, skills,
              projects, and achievements.
            </p>
          </div>

        </div>

      </section>

      {/* CONTACT SECTION */}
      
{/* CONTACT SECTION */}
<section className="contact" id="contact">
  <h2>Contact Me</h2>

  <p>
    Have a project, opportunity, or question?
    Feel free to reach out to me.
  </p>

  <div className="contact-details">

    {profile.email && (
      <p>
        <strong>Email:</strong>{" "}
        <a href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
    )}

    {profile.phone && (
      <p>
        <strong>Phone:</strong>{" "}
        <a href={`tel:${profile.phone}`}>
          {profile.phone}
        </a>
      </p>
    )}

    

    {profile.linkedin && (
      <p>
        <a href={profile.linkedin} target="_blank"
          rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    )}

    {profile.github && (
      <p>
        <a href={profile.github} target="_blank"
          rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    )}

    {profile.instagram && (
      <p>
        <a href={profile.instagram} target="_blank"
          rel="noopener noreferrer">
          Instagram
        </a>
      </p>
    )}
    {profile.phone && (
      <p>
        <a
          href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Contact Me on WhatsApp
        </a>
      </p>
    )}

  </div>
</section>


      {/* FOOTER */}
      <footer>
        <p>© 2026 My Portfolio. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
