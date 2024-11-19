import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* TODO:react query devtools 설치 */}
    </QueryClientProvider>
  );
};

export default App;
