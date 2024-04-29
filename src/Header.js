import React from 'react';

const Header = ({ nombreEmpleado, titulo, rol }) => {
    return (
        <div className='w-full'>
            <div className="bg-black h-15 absolute top-0 left-0 flex items-center justify-center rounded-br-15 px-4 py-2">
                <p className="text-2xl italic text-blanco">{rol}</p>
            </div> 
            <div className="bg-amarillo-fuerte h-15 absolute top-0 right-0 flex items-center justify-center rounded-bl-15 px-4 py-2">
                <p className="text-2xl font-regular">{nombreEmpleado}</p>
            </div>

            <header className="flex items-center justify-center text-black mt-14 mb-8">
                <h1 className="text-2xl font-bold">{titulo}</h1>
            </header>
        </div>
    )
}

export default Header;