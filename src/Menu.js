import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = ({numEmpleado, nombreEmpleado}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative z-20 top-0" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="absolute bg-black block px-4 py-2 text-white hover:bg-gray-300 focus:outline-none">
        Menú
      </button>
      {isOpen && (
        <div
          className="absolute z-10 py-2 w-60 bg-black shadow-md"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul>
            <li>
              <Link to={`/administrador/${numEmpleado}/${nombreEmpleado}`} className="block px-4 py-2 text-white hover:bg-amarillo-claroW hover:text-black">Asignar reportes</Link>
            </li>
            <li>
              <Link to={`/leaderboard/${numEmpleado}/${nombreEmpleado}`} className="block px-4 py-2 text-white hover:bg-amarillo-claroW hover:text-black">Ver leaderboard</Link>
            </li>
            <li>
              <Link to={`/registro/${numEmpleado}/${nombreEmpleado}`} className="block px-4 py-2 text-white hover:bg-amarillo-claroW hover:text-black">Ver registro</Link>
            </li>
          </ul>
          
        </div>
      )}
    </div>
  );
};

export default Menu;
