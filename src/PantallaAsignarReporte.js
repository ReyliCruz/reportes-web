import React, {useState, useEffect} from 'react';
import TarjetaPromotor from './TarjetaPromotor';
import ElementoArrastrable from './ElementoArrastrable';
import Header from './Header';
import Menu from './Menu';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TarjetaReporteEnCurso from './TarjetaReporteEnCurso';

const titulo = "Solicitudes de reporte";
const rol = "Administración";

const PantallaAsignarReporte = () => {
    const [reportesPendientes, setReportesPendientes] = useState([]);
    const { numEmpleado, nombreEmpleado } = useParams();
    const [promotores, setPromotores] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroIdReporte, setFiltroIdReporte] = useState('');
    
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
        // Realizar la solicitud a la API utilizando Axios
        axios.get('http://54.86.33.126:8000/reportes/reportes_pendientes/')
            .then(response => {
                // Actualizar el estado con los reportes pendientes recibidos de la API
                setReportesPendientes(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los reportes pendientes:', error);
            });
    }, []);
    
    const promotoresFiltrados = promotores.filter(promotor =>
        promotor.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    const handleFiltroNombreChange = (event) => {
        setFiltroNombre(event.target.value);
    };

    const handleFiltroIdReporteChange = (event) => {
        setFiltroIdReporte(event.target.value);
    };

    const obtenerIds = () => {
        // Verificar si el filtro está vacío
        if (!filtroIdReporte.trim()) return [];

        // Separar los id_reporte por comas
        const partesComa = filtroIdReporte.split(/[,]/).map(parte => parte.trim());

        // Verificar si hay varios id_reporte separados por comas
        if (partesComa.length > 1) {
            return partesComa.map(parte => parseInt(parte, 10));
        }

        // Si hay un solo id_reporte, devolverlo
        if (!isNaN(filtroIdReporte)) return [parseInt(filtroIdReporte, 10)];

        // Si no coincide ninguno de los formatos esperados, devolver un array vacío
        return [];
    };

    const idsFiltrados = obtenerIds();

    const actualizarReportesEnCurso = (idReporte) => {
        // Cambiar el estado del reporte a "Enviado" en la lista de reportes pendientes
        const reportesActualizados = reportesPendientes.map(reporte => {
            if (reporte.id_reporte === idReporte) {
                return { ...reporte, status: "Enviado" };
            }
            return reporte;
        });
        // Actualizar el estado de reportes pendientes
        setReportesPendientes(reportesActualizados);
    };


    const asignarReportePromotor = async () => {
        if (idsFiltrados.length === 0 || promotoresFiltrados.length === 0) {
            return;
        }
    
        const primerPromotor = promotoresFiltrados[0];
    
        for (const reporte of reportesPendientes) {
            if (idsFiltrados.includes(reporte.id_reporte)) {
                reporte.status = "Asignado"; // Cambiar el estado del reporte a "Asignado"
            }
        }
    
        primerPromotor.reportes_ids = [...(primerPromotor.reportes_ids || []), ...idsFiltrados];
        setFiltroIdReporte('');
        setFiltroNombre('');
    
        try {
            // Obtener la fecha actual en el formato deseado (yyyy-MM-dd)
            const fechaActual = new Date().toISOString().split('T')[0];
    
            // Iterar sobre los reportes pendientes
            for (const reporte of reportesPendientes) {
                if (idsFiltrados.includes(reporte.id_reporte)) {
                    // Construir el cuerpo de la solicitud PATCH
                    const body = {
                        fecha_asignacion: fechaActual, // Asignar la fecha actual
                        asignador: numEmpleado, // Asignar el numEmpleado del supervisor
                        promotor: primerPromotor.id_empleado, // Asignar el id_empleado del promotor
                        status: 4 // Cambiar el status a 4
                    };
                    console.log(body);
    
                    // Enviar la solicitud PATCH a la API para actualizar el reporte
                    await axios.patch(`http://54.86.33.126:8000/reportes/reporte/${reporte.id_reporte}/`, body);
                }
            }
        } catch (error) {
            console.error('Error al asignar reporte al promotor:', error);
        }
    };
    

    const actualizarIdsAsignados = (idEmpleado, nuevosIds) => {
        // Buscar el promotor por su ID
        const promotorIndex = promotores.findIndex(promotor => promotor.id_empleado === idEmpleado);
        if (promotorIndex !== -1) {
            // Crear una copia del promotor actual
            const promotorActualizado = { ...promotores[promotorIndex] };
            // Actualizar los IDs asignados
            promotorActualizado.reportes_ids = nuevosIds;
            // Crear una nueva lista de promotores con el promotor actualizado
            const promotoresActualizados = [...promotores];
            promotoresActualizados[promotorIndex] = promotorActualizado;
            // Actualizar el estado de promotores
            setPromotores(promotoresActualizados);
        }
    };
    
    



    return (
    <div className="flex flex-col h-screen w-full relative">
        <div className='flex flex-row'>
            <div className='w-1/6'></div>
            <Menu numEmpleado={numEmpleado} nombreEmpleado={nombreEmpleado}/>
        </div>

        <Header nombreEmpleado={nombreEmpleado} titulo={titulo} rol={rol} />
        
        {/* Contenedores con cuadros flexibles */}
        <div className="flex flex-1 overflow-hidden mt-4">
            
         {/* Contenedor izquierdo */}
            <div className="w-3/4 ml-4 flex flex-col items-center mr-14">
                
                <div className="w-full flex flex-col lg:flex-row justify-between items-center pl-14">
                    <h2 className="text-xl font-semibold">Pendientes</h2>

                    <div className="w-full flex flex-row items-center justify-between mx-3">
                        <p className="text-sm font-semibold">Asignar reporte(s)</p>
                        <input type="text" placeholder="Id 1 o 1,4,7 o 1-3" className="h-8 w-1/4 bg-gris rounded-15 px-4 py-2" value={filtroIdReporte} onChange={handleFiltroIdReporteChange}/>
                        <p className="text-sm font-semibold">a</p>
                        <input type="text" placeholder="Nombre de un promotor" className="h-8 w-1/2 bg-gris rounded-15 px-4 py-2" value={filtroNombre} onChange={handleFiltroNombreChange}/>
                        <button className="bg-amarillo-fuerte text-white px-3 py-1 rounded-md" onClick={asignarReportePromotor}>Aceptar</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 overflow-auto w-full py-4 pl-14 mx-0">
                    {filtroIdReporte ? (
                        // Verificar si hay algo ingresado en los inputs
                        idsFiltrados.map(idReporte => {
                            const reporte = reportesPendientes.filter(reporte => reporte.status === "Enviado").find(r => r.id_reporte === idReporte);
                            // Renderizar el componente ElementoArrastrable solo si se encuentra el reporte
                            return reporte ? <TarjetaReporteEnCurso key={reporte.id_reporte} idReporte={reporte.id_reporte} numEmpleado={numEmpleado} listaReportes={reportesPendientes} nombreEmpleado={nombreEmpleado}/> : null;
                        })
                    ) : (
                        // Renderizar solo los reportes en curso con estado "Enviado"
                        reportesPendientes.filter(reporte => reporte.status === "Enviado").map((reporte, index) => (
                            <TarjetaReporteEnCurso key={index} idReporte={reporte.id_reporte} numEmpleado={numEmpleado} listaReportes={reportesPendientes} nombreEmpleado={nombreEmpleado}/>
                        ))
                    )}
                </div>


            </div>

            {/* Contenedor derecho */}
            <div className="w-1/4 p-0 flex flex-col items-center px-0 lg:pr-14">
                <div className="w-full flex flex-col lg:flex-row justify-between items-center pr-3">
                    <h2 className="text-xl font-semibold">Promotores</h2>
                    <input
                    type="text"
                    placeholder="Buscar por nombre"
                    className="h-8 w-full bg-gris rounded-15 px-4 py-2 ml-3"
                    value={filtroNombre}
                    onChange={handleFiltroNombreChange}
                    />
                </div>

                <div className="w-full flex flex-col gap-4 overflow-auto py-4">
                    {/* Renderizar las tarjetas de promotores filtrados */}
                    {promotoresFiltrados.map((promotor, index) => (
                        <TarjetaPromotor
                            key={index}
                            id_empleado={promotor.id_empleado}
                            nombre={promotor.nombre}
                            idreportesAsignados={promotor.reportes_ids}
                            id_asignador={numEmpleado}
                            listaReportes={reportesPendientes}
                            actualizarReportesEnCurso={actualizarReportesEnCurso}
                            actualizarIdsAsignados={actualizarIdsAsignados}
                        />
                    ))}
                </div>
                
            </div>
            
        </div>
        
    </div>
  );
}

export default PantallaAsignarReporte;