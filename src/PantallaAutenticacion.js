import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PantallaPrincipal = () => {
    const [numEmpleado, setNumEmpleado] = useState('');
    const [idRol, setIdRol] = useState('');
    const [nombreEmpleado, setNombreEmpleado] = useState('');

    const handleChange = (event) => {
        setNumEmpleado(event.target.value);
    };

    const buscarRolDeEmpleado = () => {
        // Realizar la solicitud GET para obtener el rol del empleado
        axios.get(`http://54.86.33.126:8000/reportes/empleado/${numEmpleado}/`)
            .then(response => {
                // Obtener el ID del rol del empleado de la respuesta
                const { rol, nombre } = response.data;

                // Actualizar el estado con el ID del rol y el nombre del empleado
                setIdRol(rol.toString());
                setNombreEmpleado(nombre);
            })
            .catch(error => {
                // Manejar errores si la solicitud falla
                console.error('Error al obtener el rol del empleado:', error);
                alert('Empleado no encontrado.');
            });
    };
    
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400">
            <div className="text-white font-bold text-3xl mt-20">Autenticación</div>
            
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <input
                        type="text"
                        placeholder="Número de empleado"
                        value={numEmpleado}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <button className="mt-6 bg-black hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300" onClick={buscarRolDeEmpleado}>
                    <Link to={idRol === '2' ? null : idRol === '3' ? `/reportes/${numEmpleado}/${nombreEmpleado}` : idRol === '4' ? `/administrador/${numEmpleado}/${nombreEmpleado}` : null}>
                        Acceder
                    </Link>
                </button>
            </div>
        </div>
    );
}

export default PantallaPrincipal;
