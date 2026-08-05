import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import VirtualLabPage from '@/components/pages/VirtualLabPage';
import DocumentationPage from '@/components/pages/DocumentationPage';
import AdvancedToolsPage from '@/components/pages/AdvancedToolsPage';
import CompilerPage from '@/components/pages/CompilerPage';
import DashboardPage from '@/components/pages/DashboardPage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ProjectWorkspacePage from '@/components/pages/ProjectWorkspacePage';
import AerodynamicsLabPage from '@/components/pages/AerodynamicsLabPage';

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
        path: "dashboard",
        element: <DashboardPage />,
        routeMetadata: {
          pageIdentifier: 'dashboard',
        },
      },
      {
        path: "projects",
        element: <ProjectsPage />,
        routeMetadata: {
          pageIdentifier: 'projects',
        },
      },
      {
        path: "projects/:projectId",
        element: <ProjectWorkspacePage />,
        routeMetadata: {
          pageIdentifier: 'project-workspace',
        },
      },
      {
        path: "labs/aerodynamics",
        element: <AerodynamicsLabPage />,
        routeMetadata: {
          pageIdentifier: 'aerodynamics-lab',
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
