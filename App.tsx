import { useState, useEffect } from 'react';
import './App.css';
import { DASHBOARD } from './dashboard/dash-main';
import { MAIN_WEB } from './website/main-web';
import { MAIN } from './store/store-main';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Update the state based on the URL path
  useEffect(() => {
    const path = window.location.pathname; 
    const pageOptions = ['admin', 'store', 'details'];
    const currentPage = pageOptions.find((page) => path.includes(page)) || 'home';
    setCurrentPage(currentPage);
  }, []);

  return (
    <div className="app-container">
      {/* Page Content */}
      <div className={`content min-h-screen`}>
        {currentPage === 'home' && <MAIN_WEB />}
        {currentPage === 'admin' && <DASHBOARD />}
        {currentPage === 'store' && <MAIN />}

      </div>
    </div>
  );
}

export default App;
