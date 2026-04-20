import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SubmitPage from './pages/SubmitPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':   return <HomePage setCurrentPage={setCurrentPage} />;
      case 'submit': return <SubmitPage setCurrentPage={setCurrentPage} />;
      case 'admin':  return <AdminPage setCurrentPage={setCurrentPage} />;
      default:       return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
    </>
  );
};

export default App;
