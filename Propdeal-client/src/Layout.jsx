import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';
import "./"
function Layout() {
    return (
      <div>
        <Header />
        <main className=''>
          <Outlet />
        </main>
      </div>
    );
}

export default Layout;