import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-20 flex-1">
        <div className="h-full overflow-auto px-16 py-16 md:px-24 lg:px-28 xl:px-44">
          <Outlet />
        </div>
    </div>
  );
};
