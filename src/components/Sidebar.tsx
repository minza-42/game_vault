import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/games" end>
          My Games
        </NavLink>

        <NavLink to="/games/add" end>
          Add Game
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
