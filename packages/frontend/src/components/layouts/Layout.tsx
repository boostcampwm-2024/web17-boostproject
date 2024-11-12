import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="ml-20 flex-1 px-48 py-12">
        <Outlet />
      </main>
    </div>
  );
};
