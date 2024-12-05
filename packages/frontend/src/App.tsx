import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';
import { Error } from './components/errors/error';
import { Loader } from './components/ui/loader';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<Error />}>
        <Suspense
          fallback={
            <div className="bg-extra-light-gray flex h-screen items-center justify-center">
              <Loader className="h-64 w-64 items-center" />
            </div>
          }
        >
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
