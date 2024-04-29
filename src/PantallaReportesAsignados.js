import React, { useEffect, useState } from 'react';
import TarjetaReporteEnCurso from './TarjetaReporteEnCurso';
import axios from 'axios';
import Header from './Header';
import { useParams } from 'react-router-dom';

const titulo = "Reportes asignados";
const rol = "Promotoría";

const PantallaReportesAsignados = () => {
    const { numEmpleado, nombreEmpleado } = useParams();
    const [reportesAsignados, setReportesAsignados] = useState([]);
    const [listaReportesPendientes, setListaReportesPendientes] = useState([]);
    const [promotores, setPromotores] = useState([]);
    
    useEffect(() => {
        // Obtener los promotores y reportes asignados desde la API
        axios.get('http://54.86.33.126:8000/reportes/reportes_asignados/')
            .then(response => {
                // Actualizar el estado con los datos recibidos
                setPromotores(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los promotores y reportes asignados:', error);
            });
    }, []);

    useEffect(() => {
        // Realizar la solicitud a la API para obtener los reportes pendientes
        axios.get(`http://54.86.33.126:8000/reportes/reportes_pendientes/`)
            .then(response => {
                const reportesPendientes = response.data;
                setListaReportesPendientes(reportesPendientes);
                // Buscar el promotor correspondiente en la lista de promotores
                const promotor = promotores.find(promotor => promotor.id_empleado.toString() === numEmpleado);
                // Filtrar los reportes pendientes asignados a este promotor
                const reportesAsignadosPromotor = reportesPendientes.filter(reporte => promotor.reportes_ids.includes(reporte.id_reporte));
                setReportesAsignados(reportesAsignadosPromotor);
            })
            .catch(error => {
                console.error('Error al obtener los reportes pendientes:', error);
            });
    }, [numEmpleado, promotores]);

    return (
        <div className="w-full px-10">
            <Header nombreEmpleado={nombreEmpleado} titulo={titulo} rol={rol} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
                {reportesAsignados.map(reporte => (
                    <TarjetaReporteEnCurso key={reporte.id_reporte} idReporte={reporte.id_reporte} numEmpleado={numEmpleado} nombreEmpleado={nombreEmpleado} listaReportes={listaReportesPendientes}/>
                ))}
            </div>
        </div>
    );
}

export default PantallaReportesAsignados;
