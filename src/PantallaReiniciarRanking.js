import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Menu from './Menu';
import { useParams } from 'react-router-dom';

const PantallaReiniciarRanking = () => {
  const { numEmpleado, nombreEmpleado } = useParams();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://54.86.33.126:8000/reportes/empleado')
      .then(response => {
        const sortedEmpleados = response.data.sort((a, b) => b.puntos_trabajo - a.puntos_trabajo);
        setEmpleados(sortedEmpleados);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  const reiniciarPuntos = () => {
    axios.patch('http://54.86.33.126:8000/reportes/restablecer_puntos/')
      .then(response => {
        // Aquí puedes manejar la respuesta si es necesario
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error al reiniciar puntos:', error);
      });
  };

  const titulo = "Leaderboard";
  const rol = "Administración";

  return (
    <div>

      <div className='flex flex-row'>
        <div className='w-1/6'></div>
        <Menu numEmpleado={numEmpleado} nombreEmpleado={nombreEmpleado}/>
      </div>
      <Header nombreEmpleado={nombreEmpleado} titulo={titulo} rol={rol} />
      <button className='absolute bg-black rounded-15 shadow-md text-amarillo-fuerte font-bold p-5 right-0' onClick={reiniciarPuntos}>Reiniciar puntos</button>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white text-black py-12 px-10 xl:px-64">
          <div className="flex justify-center gap-5">

            <div className="flex flex-col items-center">
              <img src={empleados[2]?.foto_perfil} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
              <p className="font-bold">{empleados[2]?.nombre + ' ' + empleados[2]?.apellido}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-xl"><i className="fas fa-star"></i></span>
                <p className="ml-2 font-bold text-xl">{empleados[2]?.puntos_trabajo}</p>
              </div>
              <div className="bg-yellow-500 w-20 h-32 rounded-lg text-center flex justify-center items-center">
                <p className="text-white font-bold text-3xl">3</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img src={empleados[0]?.foto_perfil} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
              <p className="font-bold">{empleados[0]?.nombre + ' ' + empleados[0]?.apellido}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-xl"><i className="fas fa-star"></i></span>
                <p className="ml-2 font-bold text-xl">{empleados[0]?.puntos_trabajo}</p>
              </div>
              <div className="bg-yellow-500 w-20 h-32 rounded-lg text-center flex justify-center items-center">
                <p className="text-white font-bold text-3xl">1</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img src={empleados[1]?.foto_perfil} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
              <p className="font-bold">{empleados[1]?.nombre + ' ' + empleados[1]?.apellido}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-xl"><i className="fas fa-star"></i></span>
                <p className="ml-2 font-bold text-xl">{empleados[1]?.puntos_trabajo}</p>
              </div>
              <div className="bg-amarillo-fuerte w-20 h-32 rounded-lg text-center flex justify-center items-center">
                <p className="text-white font-bold text-3xl">2</p>
              </div>
            </div>
            
          </div>
          <div className="mt-8">
            {empleados.slice(3).map((empleado, index) => (
              <div key={index} className="bg-gris rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <p className="font-bold mr-4">{index + 4}</p>
                    <img src={empleado.foto_perfil} alt="Avatar" className="w-12 h-12 rounded-full" />
                    <p className="ml-4">{empleado.nombre + ' ' + empleado.apellido}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-xl"><i className="fas fa-star"></i></span>
                    <p className="ml-2 font-bold text-xl">{empleado.puntos_trabajo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PantallaReiniciarRanking;
