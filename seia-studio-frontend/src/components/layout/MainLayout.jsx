import React from 'react';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-barber-dark flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto mb-20 lg:mb-0 lg:ml-64">
        {children}
      </main>
      <BottomBar />
    </div>
  );
};

export default MainLayout;