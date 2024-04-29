import React, { useState } from 'react';
import ResumenReporte from './ResumenReporte';
import TarjetaReporteEnCurso from './TarjetaReporteEnCurso';


const ElementoArrastrable = ({ idReporte, numEmpleado, listaReportes, nombreEmpleado }) => {
  const [posicionInicial, setPosicionInicial] = useState({ x: 0, y: 0 });
  const [posicionActual, setPosicionActual] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (event) => {
    setDragging(true);
    event.dataTransfer.setData('text/plain', JSON.stringify({idReporte})); // Aquí pasamos toda la información de la tarjeta
    event.dataTransfer.effectAllowed = 'move';
    const offsetX = event.clientX - posicionActual.x;
    const offsetY = event.clientY - posicionActual.y;
    setPosicionInicial({ x: offsetX, y: offsetY });
  };

  const handleDrag = (event) => {
    const newX = event.clientX - posicionInicial.x;
    const newY = event.clientY - posicionInicial.y;
    setPosicionActual({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setDragging(false);
    setPosicionInicial({ x: 0, y: 0 });
    setPosicionActual({ x: 0, y: 0 });
  };

  const handleDrop = (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
    // Lógica adicional para manejar el evento de soltar, si es necesario
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
  };

  return (
    <div

      className="relative"
      style={{
        cursor: 'grab',
        left: posicionActual.x,
        top: posicionActual.y,
        zIndex: 1000,
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {dragging ? (
        <ResumenReporte
          idReporte = {idReporte}
          listaReportes = {listaReportes}
        />

      ) : (
        <TarjetaReporteEnCurso
          idReporte = {idReporte}
          numEmpleado={numEmpleado}
          listaReportes={listaReportes}
          nombreEmpleado={nombreEmpleado}
        />
      )}
    </div>
  );
}

export default ElementoArrastrable;
