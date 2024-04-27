import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Reports from './pages/Reports';
import LicensePlateScanner from './pages/scans';
import DataDisplay from './pages/History';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/scans' element={<LicensePlateScanner />} />
        <Route path='/History' element={<DataDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;