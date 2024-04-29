import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TarjetaCalidad = ({numEmpleado, nombreEmpleado, idReporte}) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [gradereport, setGradeReport] = useState(null);
    const [comment, setComment] = useState('');
    const [idRol, setIdRol] = useState('');

    useEffect(() => {
        const obtenerRolEmpleado = async () => {
            try {
                const response = await axios.get(`http://54.86.33.126:8000/reportes/empleado/${numEmpleado}/`);
                const idRolEmpleado = response.data.rol;
                setIdRol(idRolEmpleado.toString());
            } catch (error) {
                console.error('Error al obtener el rol del empleado:', error);
                alert('Empleado no encontrado.');
            }
        };

        obtenerRolEmpleado();
    }, [numEmpleado]);

    const handleButtonClick = (value) => {
        setSelectedButton(value);
        setGradeReport(value);
    }

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    }

    const handleEnviarClick = async () => {
        try {
            const formattedDate = new Date().toISOString().split('T')[0];
            await axios.patch(`http://54.86.33.126:8000/reportes/reporte/${idReporte}/`, {
                comentario: comment,
                fecha_asignacion: formattedDate,
                puntaje: gradereport,
                status: 5
            });
            console.log('Reporte actualizado con éxito');
            // Aquí podrías agregar lógica adicional, como redirigir al usuario a otra página
        } catch (error) {
            console.error('Error al enviar la evaluación:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const buttons = [];
    for (let i = 1; i <= 10; i++) {
        const buttonColor = selectedButton === i ? "bg-amarillo-medio" : "bg-gris";
        buttons.push(
            <button key={i} className={`w-8 h-8 rounded-full ${buttonColor} mr-2`} onClick={() => handleButtonClick(i)}>{i}</button>
        );
    }

    return (
        <div className='card'>
            <div className="bg-white flex text-black relative shadow-md rounded-b-15 flex-col px-5 py-2 items-center justify-center gap-5">
                <div className="text-md text-black text-end w-full">{new Date().toLocaleDateString()}</div>
                <div className="text-md text-black flex items-center justify-start w-full">
                    <p className="text-start">Calidad del reporte: </p>
                    <strong className="ml-1 text-start">{gradereport}</strong>
                </div>
                <div className="text-center flex flex-row w-full flex justify-center items-center">{buttons}</div>
                <div className="text-center w-full items-center justify-start">
                    <p>Comentario (opcional)</p>
                    <textarea className="w-full h-20 bg-gris p-2 rounded-15 shadow-md" value={comment} onChange={handleCommentChange}></textarea>
                </div>
                <div className="flex justify-center items-center w-full">
                    <Link to={idRol === '3' ? `/reportes/${numEmpleado}/${nombreEmpleado}` : idRol === '4' ? `/administrador/${numEmpleado}/${nombreEmpleado}` : null}>
                        <button className="px-4 py-2 rounded-md bg-amarillo-fuerte text-black ml-4 font-bold" onClick={handleEnviarClick}>Enviar</button>
                    </Link>
                </div>
                <div className="flex justify-center items-center w-full">
                    <Link to={idRol === '3' ? `/reportes/${numEmpleado}/${nombreEmpleado}` : idRol === '4' ? `/administrador/${numEmpleado}/${nombreEmpleado}` : null}>
                        <button className="px-4 py-2 rounded-md bg-black text-amarillo-fuerte ml-4 font-bold">Regresar</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TarjetaCalidad;
