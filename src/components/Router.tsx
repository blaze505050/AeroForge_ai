import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import HomePage from '@/components/pages/HomePage';
import VirtualLabPage from '@/components/pages/VirtualLabPage';
import DocumentationPage from '@/components/pages/DocumentationPage';
import DashboardPage from '@/components/pages/DashboardPage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ProjectWorkspacePage from '@/components/pages/ProjectWorkspacePage';
import AerodynamicsLabPage from '@/components/pages/AerodynamicsLabPage';
import AstroLabSpatialGlobeToolPage from '@/components/pages/AstroLabSpatialGlobeToolPage';
import AstroLabSatelliteConstellationPage from '@/components/pages/AstroLabSatelliteConstellationPage';
import AstroLabOrbitalMechanicsPage from '@/components/pages/AstroLabOrbitalMechanicsPage';

// Layout component that includes ScrollToTop and Error Boundary
function Layout() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Outlet />
    </ErrorBoundary>
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
        path: "astrolab/spatial-globe",
        element: <AstroLabSpatialGlobeToolPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-spatial-globe',
        },
      },
      {
        path: "astrolab/satellite-constellation",
        element: <AstroLabSatelliteConstellationPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-satellite',
        },
      },
      {
        path: "astrolab/orbital-mechanics",
        element: <AstroLabOrbitalMechanicsPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-orbital',
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
