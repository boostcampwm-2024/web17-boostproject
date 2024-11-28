import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-20 flex-1">
        <div className="h-full overflow-auto px-16 py-16 md:px-32 lg:px-48">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
