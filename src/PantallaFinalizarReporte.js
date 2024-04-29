import React, {useState, useEffect} from 'react';
import Header from './Header';
import TarjetaCalidad from './TarjetaCalidad';
import TarjetaEnvioReporte from './TarjetaEnvioReporte';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const titulo = "Finalizar reporte";
const rol = "Promotoría";

const PantallaFinalizarReporte = () => {
  // Obtener el ID del parámetro de la URL
  const { numEmpleado, nombreEmpleado, id_reporte } = useParams();
  const [listaReportes, setListaReportes] = useState([]);

  useEffect(() => {
      // Realizar la solicitud a la API utilizando Axios
      axios.get('http://54.86.33.126:8000/reportes/reportes_pendientes/')
          .then(response => {
              // Actualizar el estado con los reportes pendientes recibidos de la API
              setListaReportes(response.data);
              console.log(response.data);
          })
          .catch(error => {
              console.error('Error al obtener los reportes pendientes:', error);
          });
  }, []);

  return (
    <div className="flex flex-col h-screen relative px-5">
      <Header nombreEmpleado={nombreEmpleado} titulo={titulo} rol={rol} />
        
      <div className='flex flex-col items-center justify-start h-screen'>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-10 w-full pb-5  md:px-24">
          <TarjetaEnvioReporte idReporte={id_reporte} listaReportes={listaReportes} nombreEmpleado={nombreEmpleado}/>
          <TarjetaCalidad numEmpleado={numEmpleado} idReporte={id_reporte} nombreEmpleado={nombreEmpleado}/>
        </div>  
      </div>
     
    </div>
  );
}

export default PantallaFinalizarReporte;
