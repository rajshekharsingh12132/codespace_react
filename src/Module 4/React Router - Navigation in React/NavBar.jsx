import { NavLink } from 'react-router-dom';
import './NavBar.css'; // optional for styles

function NavBar() {
  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>About</NavLink>
      <NavLink to="/about/subpage" className={({ isActive }) => isActive ? "active-link" : ""}>SubPage</NavLink>
      <NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : ""}>Contact</NavLink>
    </nav>
  );
}
export default NavBar;
