import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-20 flex-1 px-48 py-16">
        <Outlet />
      </main>
    </div>
  );
};
