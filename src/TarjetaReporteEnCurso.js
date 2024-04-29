import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TarjetaReporteEnCurso = ({numEmpleado, idReporte, listaReportes, nombreEmpleado}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rejected, setRejected] = useState(false);
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

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  }

  const rejectCard = async () => {
    try {
      // Realizar la solicitud PATCH al servidor para rechazar el reporte
      console.log(idReporte)
      await axios.patch(`http://54.86.33.126:8000/reportes/reporte/${idReporte}/`, {
        status: 6 // Cambiar el estado a 6 (rechazado)
      });
      console.log(`Reporte ${idReporte} rechazado.`);
      setRejected(true);
    } catch (error) {
      console.error('Error al rechazar el reporte:', error);
      // Manejar el error apropiadamente (por ejemplo, mostrar un mensaje al usuario)
    }
  }

  if (rejected) {
    return null;
  }

  return (
    <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>
      <div className='card'>
        <div className="w-full h-auto bg-white text-black rounded-15 shadow-md">
          <div className="h-auto w-full rounded-t-15 bg-amarillo-claro flex justify-center items-center flex-col py-4">
            <p className="text-md font-bold text-left w-full m-4 absolute top-0 left-0">{id_reporte}</p>
            <img src={foto_perfil} alt="" className="h-48 w-48 object-cover rounded-full border-4 border-amarillo-fuerte"/>
            <p className="text-xl font-bold text-center">{reportador}</p>
          </div>
          <div className="flex flex-col justify-center items-center h-full py-4 px-2 text-center font-regular gap-2">
            <p>{fecha_reporte}</p>
            <p>{motivo}</p>
            <p>{sucursal}</p>
            <button className="bg-black text-amarillo-fuerte text-md p-3 rounded-15 font-bold mt-4" onClick={flipCard}>Más Información</button>
          </div>
        </div>
      </div>
      <div className='card card-back'>
        <div className="bg-white h-auto text-black rounded-15 shadow-md">
          <div className="h-auto rounded-t-15 bg-amarillo-claro flex justify-center items-center">
            <img src={fotos_reporte_primera} alt="" className="h-full object-cover rounded-t-15"/>
          </div>
          <div className="flex flex-col justify-center items-center py-4 px-2 w-full text-center gap-2">
            <p>{fecha_reporte}</p>
            <p>{descripcion}</p>

            <div className='flex w-full justify-center gap-2 flex-col'>
              <Link to={`/finalizar/${numEmpleado}/${nombreEmpleado}/${idReporte}`}>
                <button className='w-full bg-amarillo-fuerte text-black text-md p-3 rounded-15 font-bold mt-1'>
                  Enviar evidencia y finalizar
                </button>
              </Link>

              <button className="bg-rojo text-white text-sm rounded-15 p-3" onClick={rejectCard}>Rechazar</button>
            </div>
            
            <button className="bg-black text-amarillo-fuerte text-md p-3 rounded-15 font-bold mt-4" onClick={flipCard}>Volver</button>
          </div>
        </div>
      </div>
    </ReactCardFlip>
  );
}

export default TarjetaReporteEnCurso;
