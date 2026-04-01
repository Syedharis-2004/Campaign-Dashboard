import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import CreativeBuilder from './views/CreativeBuilder';

function Placeholder({ name }) {
  return <div className="p-8"><h1 className="text-3xl font-bold dark:text-white">{name} Coming Soon</h1></div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Placeholder name="Campaigns Data" />} />
          <Route path="builder" element={<CreativeBuilder />} />
          <Route path="settings" element={<Placeholder name="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
