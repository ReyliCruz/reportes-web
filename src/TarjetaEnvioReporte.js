import React from 'react';

const TarjetaEnvioReporte = ({idReporte, listaReportes}) => {
    console.log('idReporte:', idReporte);

    const reporte = listaReportes.find(reporte => reporte.id_reporte === parseInt(idReporte));
    console.log('Reporte encontrado:', reporte);

    // Verificar si reporte es undefined
    if (!reporte) {
        return null; // O podrías mostrar un mensaje de error
    }

    const { reportador, foto_perfil, foto_reporte, fecha_reporte, sucursal, motivo, descripcion } = reporte;

    return (
        <div className='card'>
            <div className="bg-white text-black shadow-md rounded-t-15 flex flex-col md:flex-row items-start justify-center">
                <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                    <div className="bg-amarillo-fuerte rounded-full h-36 w-36 xl:h-40 xl:w-40 flex items-center justify-center mx-2">
                        <img src={foto_perfil} alt="" className="h-full w-full object-cover rounded-full border-4 border-amarillo-fuerte" />
                    </div>
                    <p className="text-md font-bold text-center">{reportador}</p>
                </div>
                <div className='flex flex-col justify-center items-center w-full md:w-2/3 gap-4 my-5'>
                    <p className='text-regular text-center'>{fecha_reporte}</p>
                    <p className='text-regular text-center'>{motivo}</p>
                    <p className='text-regular text-center'>{sucursal}</p>
                </div>
                <div className='bg-amarillo-claro flex justify-center items-center shadow-md w-full h-full'>
                    <p className='py-10 px-2 w-full text-center'>{descripcion}</p>
                </div>
            </div>
            <img src={foto_reporte} alt="" className="h-auto w-full shadow-md" />
        </div>
    );
}

export default TarjetaEnvioReporte;
