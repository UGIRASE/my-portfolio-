import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>My Portfolio</h2>

      <div>
        <Link to="/">Home</Link>

        <a href="/#about">About</a>
        <a href="/#skills">Skills</a>
        <a href="/#projects">Projects</a>
        <a href="/#contact">Contact</a>

        <Link to="/Login">Login</Link>
        <Link to="/Dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;