import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PantallaAutenticacion from './PantallaAutenticacion';
import PantallaAsignarReporte from './PantallaAsignarReporte';
import PantallaReiniciarRanking from './PantallaReiniciarRanking';
import PantallaRegistroReportes from './PantallaRegistroReportes';
import PantallaReportesAsignados from './PantallaReportesAsignados';
import PantallaFinalizarReporte from './PantallaFinalizarReporte';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PantallaAutenticacion />} />
      <Route path="/administrador/:numEmpleado/:nombreEmpleado" element={<PantallaAsignarReporte />} />
      <Route path='/leaderboard/:numEmpleado/:nombreEmpleado' element={<PantallaReiniciarRanking />} />  
      <Route path='/registro/:numEmpleado/:nombreEmpleado' element={<PantallaRegistroReportes />} /> 
      <Route path='/finalizar/:numEmpleado/:nombreEmpleado/:id_reporte' element={<PantallaFinalizarReporte />} />
      <Route path='/reportes/:numEmpleado/:nombreEmpleado' element={<PantallaReportesAsignados />} />    
    </Routes>
  </Router>
);

export default App;
