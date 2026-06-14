import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';
function Layout() {
    return (
      <div>
        <Header />
        <main className='pt-[72px]'>
          <Outlet />
        </main>
      </div>
    );
}

export default Layout;