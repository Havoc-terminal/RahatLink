import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import MapPage from '@/pages/MapPage';
import WarehousePanel from '@/pages/WarehousePanel';
import NGOPanel from '@/pages/NGOPanel';
import OptimizationPage from '@/pages/OptimizationPage';
import NewsPage from '@/pages/NewsPage';

function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/warehouse" element={<WarehousePanel />} />
            <Route path="/ngo" element={<NGOPanel />} />
            <Route path="/optimization" element={<OptimizationPage />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
