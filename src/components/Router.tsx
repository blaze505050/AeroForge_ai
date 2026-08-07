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
import AstroLabSpatialGlobeToolPage from '@/components/pages/AstroLabSpatialGlobeToolPage';
import AstroLabDeepSpaceObservationPage from '@/components/pages/AstroLabDeepSpaceObservationPage';
import AstroLabPhotometrySuitePage from '@/components/pages/AstroLabPhotometrySuitePage';
import AstroLabAstrodynamicsSandboxPage from '@/components/pages/AstroLabAstrodynamicsSandboxPage';
import AstroLabDualModeExperiencePage from '@/components/pages/AstroLabDualModeExperiencePage';
import AstroLabSatelliteConstellationPage from '@/components/pages/AstroLabSatelliteConstellationPage';
import AstroLabCelestialCoordinatePage from '@/components/pages/AstroLabCelestialCoordinatePage';
import AstroLabOrbitalMechanicsPage from '@/components/pages/AstroLabOrbitalMechanicsPage';
import AstroLabComplete from '@/components/AstroLabComplete';
import AstroLabPage from '@/components/pages/AstroLabPage';
import PremiumAstroLabSuite from '@/components/PremiumAstroLabSuite';

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
        path: "astrolab/spatial-globe",
        element: <AstroLabSpatialGlobeToolPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-spatial-globe',
        },
      },
      {
        path: "astrolab/deep-space-observation",
        element: <AstroLabDeepSpaceObservationPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-deep-space',
        },
      },
      {
        path: "astrolab/photometry-suite",
        element: <AstroLabPhotometrySuitePage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-photometry',
        },
      },
      {
        path: "astrolab/astrodynamics-sandbox",
        element: <AstroLabAstrodynamicsSandboxPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-astrodynamics',
        },
      },
      {
        path: "astrolab/dual-mode",
        element: <AstroLabDualModeExperiencePage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-dual-mode',
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
        path: "astrolab/celestial-coordinate",
        element: <AstroLabCelestialCoordinatePage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-celestial',
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
        path: "astrolab-suite",
        element: <AstroLabComplete />,
        routeMetadata: {
          pageIdentifier: 'astrolab-suite',
        },
      },
      {
        path: "astrolab",
        element: <AstroLabPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-main',
        },
      },
      {
        path: "premium-astrolab",
        element: <PremiumAstroLabSuite />,
        routeMetadata: {
          pageIdentifier: 'premium-astrolab',
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
