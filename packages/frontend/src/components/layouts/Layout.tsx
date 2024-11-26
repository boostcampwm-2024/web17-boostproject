import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-20 flex-1">
        <div className="h-full overflow-auto px-48 py-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
