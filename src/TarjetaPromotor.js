import React, { useState, useEffect } from 'react';
import ResumenReporte from './ResumenReporte';
import axios from 'axios';

const TarjetaPromotor = ({ id_empleado, nombre, idreportesAsignados, listaReportes, id_asignador, actualizarReportesEnCurso, actualizarIdsAsignados }) => {
  const [dropdownAbierto, setDropdownAbierto] = useState(false); // Estado para controlar si el dropdown está abierto o cerrado
  const [resumenes, setResumenes] = useState([]); // Estado para almacenar los resúmenes de reporte generados

  useEffect(() => {
    // Realizar la solicitud a la API para obtener los reportes asignados al promotor
    const obtenerReportesAsignados = async () => {
      try {
        const resumenesAsignados = idreportesAsignados.map(id => {
          const reporte = listaReportes.find(reporte => reporte.id_reporte === id);
          return reporte ? reporte : null;
        }).filter(reporte => reporte !== null);
        setResumenes(resumenesAsignados);
      } catch (error) {
        console.error('Error al obtener los reportes asignados:', error);
      }
    };

    obtenerReportesAsignados();
  }, [idreportesAsignados]);

  

  const eliminarResumen = async (idReporte) => {
    try {
      // Realizar la solicitud PATCH para actualizar el reporte en la API
      await axios.patch(`http://54.86.33.126:8000/reportes/reporte/${idReporte}/`, {
        fecha_asignacion: null, // Borrar la fecha de asignación
        asignador: null, // Asignarador se convierte en null
        promotor: null, // Promotor se convierte en null
        status: 3 // Regresar el estado a 3
      });
      // Cambiar el estado del reporte a "Enviado" en el componente principal
      actualizarReportesEnCurso(idReporte);

      // Filtrar los resúmenes para eliminar el que coincida con el idReporte
      setResumenes(resumenes.filter(reporte => reporte.id_reporte !== idReporte));

      // Actualizar el array de IDs asignados al promotor eliminando el idReporte
      const nuevosIdReportes = idreportesAsignados.filter(id => id !== idReporte);
      // Llamar a la función para actualizar los reportes asignados al promotor
      actualizarIdsAsignados(id_empleado, nuevosIdReportes);
    } catch (error) {
      console.error('Error al asignar reporte al promotor:', error);
    }
  };



  const handleToggleDropdown = () => {
    setDropdownAbierto(!dropdownAbierto); // Cambiar el estado del dropdown (abierto/cerrado)
  };


  return (
    <div
      className={'h-auto shadow-md rounded-15 flex flex-col items-center bg-celeste'}
    >
      <div className="flex flex-col sm:flex-row w-full items-center py-4" onClick={handleToggleDropdown} style={{ cursor: 'pointer' }}>
        <div className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-4 mr-auto">
          <strong className='text-xl font-semibold px-4'>ID: {id_empleado}</strong>
          <h3 className="text-xl font-semibold px-4">{nombre}</h3>
        </div>
        <div className="w-full sm:w-auto ml-auto">
          <p className="text-3xl font-bold px-4">{resumenes.length}</p>
        </div>
      </div>
      {dropdownAbierto && (
        <div className="rounded-b-15 w-full px-3 pt-3">
        {resumenes.map((reporte) => (
          <ResumenReporte
            key={reporte.id_reporte} // Utiliza el id_reporte como clave única
            idReporte={reporte.id_reporte}
            listaReportes={listaReportes}
            onEliminar={() => eliminarResumen(reporte.id_reporte)}
          />
        ))}
        </div>
      )}
    </div>
  );
};

export default TarjetaPromotor;
