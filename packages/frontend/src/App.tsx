import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';
import { Error } from './components/errors/error';
import { Loader } from './components/ui/loader';
import { router } from './routes';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader className="h-64 w-64 items-center" />}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
