import React, { useState, useEffect } from 'react';

const ResumenReporte = ({idReporte, onEliminar, dragging, listaReportes }) => {
  const [hovered, setHovered] = useState(false);
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    // Filtrar la lista de reportes para encontrar el reporte con el ID proporcionado
    const reporteEncontrado = listaReportes.find(reporte => reporte.id_reporte === idReporte);
    // Actualizar el estado con el reporte encontrado
    setReporte(reporteEncontrado);
  }, [idReporte, listaReportes]);

  // Verificar si reporte es undefined
  if (!reporte) {
    return <div>Cargando...</div>;
  }

  // Desestructurar propiedades del reporte
  const { id_reporte, reportador, foto_perfil, fotos_reporte, fecha_reporte, sucursal, motivo, descripcion } = reporte;
  // Obtener solo el primer elemento de fotos_reporte
  const fotos_reporte_primera = fotos_reporte.length > 0 ? fotos_reporte[0] : null;


  const handleMouseEnter = () => {
    if (!dragging) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center bg-amarillo-claro p-3 shadow-md rounded-b-15 mb-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-4 mr-auto">
        <p className="font-light text-xs">{id_reporte}</p>
        <p className="font-semibold text-xs">{motivo}</p>
        <p className="font-light italic text-xs">{reportador}</p>
      </div>

      <div className="w-full sm:w-auto ml-auto">
        <div className="text-right">
          <p className="font-regular text-xs">{fecha_reporte}</p>
          <p className="font-regular text-xs">{sucursal}</p>
          {hovered && !dragging && (
            <button className="w-full bg-rojo text-white px-3 py-1 rounded-md" onClick={onEliminar}>Quitar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumenReporte;
