import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import VirtualLabPage from '@/components/pages/VirtualLabPage';
import DocumentationPage from '@/components/pages/DocumentationPage';
import AdvancedToolsPage from '@/components/pages/AdvancedToolsPage';
import CompilerPage from '@/components/pages/CompilerPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "documentation",
        element: <DocumentationPage />,
        routeMetadata: {
          pageIdentifier: 'documentation',
        },
      },
      {
        path: "virtual-lab",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'virtual-lab',
        },
      },
      {
        path: "advanced-tools",
        element: <AdvancedToolsPage />,
        routeMetadata: {
          pageIdentifier: 'advanced-tools',
        },
      },
      {
        path: "compiler",
        element: <CompilerPage />,
        routeMetadata: {
          pageIdentifier: 'compiler',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
