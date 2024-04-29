import React, { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const titulo = "Registro de reportes";
const rol = "Administración";

const PantallaRegistroReportes = () => {
  const { numEmpleado, nombreEmpleado } = useParams();
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro] = useState({
    idReporte: "",
    idEmpleado: "",
    idPromotor: "",
    estatus: "",
    motivo: "",
    sucursal: "",
    fechaInicio: "",
    fechaFin: ""
  });
  const [sucursales, setSucursales] = useState([]); // Estado para almacenar las opciones de sucursal
  const [motivos, setMotivos] = useState([]); // Estado para almacenar los motivos desde la API
  
  // Función para obtener las opciones de sucursal desde la API
  useEffect(() => {
    const obtenerSucursales = async () => {
      try {
        const response = await axios.get('http://54.86.33.126:8000/reportes/sucursal');
        // Extraer solo los nombres de las sucursales del objeto de respuesta
        const nombresSucursales = response.data.map(sucursal => sucursal.nombre_sucursal);
        // Establecer los nombres de las sucursales en el estado sucursales
        setSucursales(nombresSucursales);
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };
  
    obtenerSucursales();
  }, []);

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        const response = await axios.get('http://54.86.33.126:8000/reportes/obtener_registro/');
        setReportes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los reportes:', error);
      }
    };

    obtenerReportes();
  }, []);


  useEffect(() => {
    // Extraer los motivos únicos de los reportes
    const motivosUnicos = Array.from(new Set(reportes.map(reporte => reporte.motivo)));
    setMotivos(motivosUnicos);
  }, [reportes]);

  const handleFiltro = (event) => {
    const { name, value } = event.target;
    setFiltro({ ...filtro, [name]: value });
  };
  const reportesFiltrados = reportes.filter((reporte) => {
    // Verificar si las propiedades reportador, promotor y status están definidas
    const reportador = reporte.reportador ? reporte.reportador.toString() : '';
    const promotor = reporte.promotor ? reporte.promotor.toString() : '';
    const status = reporte.status ? reporte.status.toString() : '';
    
    // Convertir la cadena del filtro a minúsculas
    const filtroSucursalLower = filtro.sucursal.toLowerCase();

    // Convertir las cadenas de sucursal y motivo a minúsculas para comparar de manera insensible a mayúsculas y minúsculas
    const sucursalLower = reporte.sucursal ? reporte.sucursal.toLowerCase() : '';
    const motivoLower = reporte.motivo ? reporte.motivo.toLowerCase() : '';

    // Convertir las fechas del filtro y del reporte a objetos Date
    const filtroFechaInicio = filtro.fechaInicio ? new Date(filtro.fechaInicio) : null;
    const filtroFechaFin = filtro.fechaFin ? new Date(filtro.fechaFin) : null;
    const reporteFecha = new Date(reporte.fecha_reporte);

    // Función para comparar fechas sin tener en cuenta la hora
    const sameDate = (date1, date2) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    // Verificar si las propiedades cumplen con los criterios de filtrado
    const idReporteMatches = reporte.id_reporte.toString().includes(filtro.idReporte);
    const idEmpleadoMatches = reportador.includes(filtro.idEmpleado);
    const idPromotorMatches = promotor.includes(filtro.idPromotor);
    const estatusMatches = filtro.estatus === "" || status.toLowerCase() === filtro.estatus.toLowerCase();
    const motivoMatches = motivoLower.includes(filtro.motivo.toLowerCase());
    const sucursalMatches = sucursalLower.includes(filtroSucursalLower); // Comparación de sucursal en minúsculas

    // Verificar si la fecha del reporte está dentro del rango especificado por el filtro
    const fechaInRange = (
      (!filtroFechaInicio || reporteFecha >= filtroFechaInicio) &&
      (!filtroFechaFin || reporteFecha <= filtroFechaFin)
    );

    // Retornar true solo si todos los criterios coinciden
    return (
      idReporteMatches &&
      idEmpleadoMatches &&
      idPromotorMatches &&
      estatusMatches &&
      motivoMatches &&
      sucursalMatches &&
      fechaInRange
    );
  });
  
  
  const formatDate = (fechaString) => {
    // Crear un objeto Date a partir de la cadena de fecha
    const fecha = new Date(fechaString);

    // Extraer los componentes de la fecha
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();

    // Formatear la fecha en el formato deseado
    return `${dia}/${mes}/${año}`;
  };
  

  return (
    <div className="w-full">
      <div className='flex flex-row'>
        <div className='w-1/6'></div>
        <Menu numEmpleado={numEmpleado} nombreEmpleado={nombreEmpleado}/>
      </div>
      <Header nombreEmpleado={nombreEmpleado} titulo={titulo} rol={rol} />
      
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="mt-8">        
          <div className="mb-4 ml-10">
            <label className="mr-2">Filtrar por:</label>
            <input
              type="text"
              name="idReporte"
              value={filtro.idReporte}
              onChange={handleFiltro}
              className="border border-gray-300 rounded px-4 py-2 mr-2"
              placeholder="ID Reporte"
            />
            <input
              type="text"
              name="idEmpleado"
              value={filtro.idEmpleado}
              onChange={handleFiltro}
              className="border border-gray-300 rounded px-4 py-2 mr-2"
              placeholder="ID Empleado"
            />
            <input
              type="text"
              name="idPromotor"
              value={filtro.idPromotor}
              onChange={handleFiltro}
              className="border border-gray-300 rounded px-4 py-2 mr-2"
              placeholder="ID Promotor"
            />
            <select className="py-2 mr-2 border border-gray-300 rounded" name="estatus" value={filtro.estatus} onChange={handleFiltro}>
              <option value="">Estatus</option>
              <option value="Enviado">Enviado</option>
              <option value="Asignado">Asignado</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <select className="py-2 mr-2 border border-gray-300 rounded" name="motivo" value={filtro.motivo} onChange={handleFiltro}>
              <option value="">Motivo</option>
              {motivos.map((motivo, index) => (
                <option key={index} value={motivo}>{motivo}</option>
              ))}
            </select>

            <select className="py-2 mr-2 border border-gray-300 rounded" name="sucursal" value={filtro.sucursal} onChange={handleFiltro}>
              <option value="">Sucursal</option>
              {sucursales.map((nombreSucursal, index) => (
                <option key={index} value={nombreSucursal}>{nombreSucursal}</option>
              ))}
            </select>


            <input
              type="date"
              name="fechaInicio"
              value={filtro.fechaInicio}
              onChange={handleFiltro}
              className="border border-gray-300 rounded px-4 py-2 mr-2"
            />
            <input
              type="date"
              name="fechaFin"
              value={filtro.fechaFin}
              onChange={handleFiltro}
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>
          
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">ID Reporte</th>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">ID Empleado</th>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">ID Promotor</th>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">Estatus</th>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">Motivo</th>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">Sucursal</th>
                <th className="px-4 py-2 bg-negro text-amarillo-claroW">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map((reporte) => (
                <tr key={reporte.id_reporte}>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{reporte.id_reporte}</td>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{reporte.reportador ? reporte.reportador.toString() : ''}</td>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{reporte.promotor ? reporte.promotor.toString() : ''}</td>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{reporte.status ? reporte.status.toString() : ''}</td>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{reporte.motivo ? reporte.motivo.toString() : ''}</td>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{reporte.sucursal ? reporte.sucursal.toString() : ''}</td>
                  <td className="border px-4 py-2 bg-amarillo-claroW">{formatDate(reporte.fecha_reporte)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PantallaRegistroReportes;
