import React, { useState, useEffect } from 'react';
import ResumenReporte from './ResumenReporte';

const CopiaDeTarjetaPromotor = ({ id_empleado, nombre, idreportesAsignados, actualizarReportesEnCurso, listaReportes, id_asignador }) => {
  const [iluminado, setIluminado] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false); // Estado para controlar si el dropdown está abierto o cerrado
  const [resumenes, setResumenes] = useState([]); // Estado para almacenar los resúmenes de reporte generados

  useEffect(() => {
    // Realizar la solicitud a la API para obtener los reportes asignados al promotor
    const obtenerReportesAsignados = async () => {
      try {
        console.log(idreportesAsignados);
        const resumenesAsignados = idreportesAsignados.map(id => {
          const reporte = listaReportes.find(reporte => reporte.id_reporte === id);
          console.log(reporte);
          return reporte ? reporte : null;
        }).filter(reporte => reporte !== null);
        console.log(resumenesAsignados);
        setResumenes(resumenesAsignados);
      } catch (error) {
        console.error('Error al obtener los reportes asignados:', error);
      }
    };

    obtenerReportesAsignados();
  }, [idreportesAsignados]);

  const eliminarResumen = (idReporte) => {
    // Filtrar los resumenes para eliminar el que coincida con el idReporte
    setResumenes(resumenes.filter(reporte => {
      if (reporte.id_reporte === idReporte) {
        // Cambiar el estado del reporte a "Enviado"
        reporte.status = "Enviado";
        console.log("reporte a sido cambiado a enviado")
      }
      return reporte.id_reporte !== idReporte;
    }));
    // Actualizar el estado de los reportes para volver a renderizarlos
    actualizarReportesEnCurso([...resumenes]);
  };

  /*
  const eliminarResumen = async (idReporte) => {
    try {
        // Realizar la solicitud PATCH al servidor para revertir los cambios
        await axios.patch(`http://54.86.33.126:8000/reportes/reportes_pendientes/${idReporte}`, {
            promotor: null,
            asignador: null,
            fecha_asignacion: null,
            status: 3
        });

        // Actualizar el estado local de los reportes pendientes para reflejar los cambios
        setResumenes(resumenes.filter(reporte => reporte.id_reporte !== idReporte));
        actualizarReportesEnCurso([...resumenes.filter(reporte => reporte.id_reporte !== idReporte)]);

        console.log(`Cambios revertidos para el reporte ${idReporte}`);
    } catch (error) {
        console.error(`Error al revertir los cambios para el reporte ${idReporte}:`, error);
        // Manejar el error apropiadamente (por ejemplo, mostrar un mensaje al usuario)
    }
  };
  */

  /*
  const asignarResumen = async (idReporte) => {
    try {
      // Realizar la solicitud PATCH al servidor para asignar el resumen al promotor
      await axios.patch(`http://54.86.33.126:8000/reportes/reportes_pendientes/${idReporte}`, {
        promotor: id_empleado,
        asignador: id_asignador, // Asignar el asignador (número de empleado)
        fecha_asignacion: new Date().toISOString(), // Asignar la fecha de asignación actual
        status: 4 // Cambiar el estado a 4
      });
      console.log(`Resumen asignado al promotor ${nombre}`);
    } catch (error) {
      console.error('Error al asignar el resumen al promotor:', error);
      // Manejar el error apropiadamente (por ejemplo, mostrar un mensaje al usuario)
    }
  };
  */

  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    console.log({resumenes})
    try {
        const jsonData = JSON.parse(data);
        console.log(data);
        if (jsonData.idReporte !== undefined) {
            // Buscar el objeto de reporte correspondiente al ID
            const reporte = resumenes.find(reporte => reporte.id_reporte === jsonData.idReporte);
            if (reporte) {
                // Cambiar el estado del reporte a "Asignado"
                reporte.status = "Asignado";
                console.log("reporte cambiado a asignado")
                // Agregar el objeto de reporte al estado resumenes
                actualizarReportesEnCurso([...resumenes, reporte]);
                setResumenes([...resumenes, reporte]);
                //asignarResumen(reporte.id_reporte); // Llama a la función para asignar el resumen al promotor
            } else {
                console.log('El elemento arrastrado no corresponde a un reporte válido.');
            }
        } else {
            console.log('El elemento arrastrado no contiene la información necesaria para crear un ResumenReporte.');
        }
    } catch (error) {
        console.log('Error al analizar los datos del elemento arrastrado:', error);
    }
    setIluminado(false);
};  

  const handleDragOver = (event) => {
    event.preventDefault();
    setIluminado(true); // Cuando el cursor está sobre la tarjeta, iluminarla
  };

  const handleDragLeave = () => {
    setIluminado(false); // Cuando el cursor sale de la tarjeta, apagar la iluminación
  };

  const handleToggleDropdown = () => {
    setDropdownAbierto(!dropdownAbierto); // Cambiar el estado del dropdown (abierto/cerrado)
  };

  const tarjetaClass = iluminado ? "bg-amarillo-fuerte" : "bg-celeste";

  return (
    <div
      className={`h-auto shadow-md rounded-15 flex flex-col items-center ${tarjetaClass}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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

export default CopiaDeTarjetaPromotor;
