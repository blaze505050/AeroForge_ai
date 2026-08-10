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
import AstroLabExoplanetHabitabilityPage from '@/components/pages/AstroLabExoplanetHabitabilityPage';
import AstroLabOrbitalMechanicsEnhancedPage from '@/components/pages/AstroLabOrbitalMechanicsEnhancedPage';
import AstroLabStellarEvolutionPage from '@/components/pages/AstroLabStellarEvolutionPage';
import AstroLabHubPage from '@/components/pages/AstroLabHubPage';
import AstroLabMainPage from '@/components/pages/AstroLabMainPage';
import VirtualObservatoryPage from '@/components/pages/VirtualObservatoryPage';
import RadioAstronomyPage from '@/components/pages/RadioAstronomyPage';
import SpaceflightDynamicsPage from '@/components/pages/SpaceflightDynamicsPage';
import AstrobiologyLabPage from '@/components/pages/AstrobiologyLabPage';
import CosmologyExplorerPage from '@/components/pages/CosmologyExplorerPage';
import ExoplanetImagingPage from '@/components/pages/ExoplanetImagingPage';
import CelestialMechanicsPage from '@/components/pages/CelestialMechanicsPage';
import AtmosphericSciencePage from '@/components/pages/AtmosphericSciencePage';
import QuantumAstrophysicsPage from '@/components/pages/QuantumAstrophysicsPage';
import MissionControlPage from '@/components/pages/MissionControlPage';
import AstroLabAcademyPage from '@/components/pages/AstroLabAcademyPage';
import AstroLabProfessionalPage from '@/components/pages/AstroLabProfessionalPage';
import InvestorDemoPage from '@/components/pages/InvestorDemoPage';
import ProductionStatusPage from '@/components/pages/ProductionStatusPage';
import AstroLabP0OrbitalPage from '@/components/pages/AstroLabP0OrbitalPage';
import AstroLabP0GravityPage from '@/components/pages/AstroLabP0GravityPage';
import AstroLabP0TransitPage from '@/components/pages/AstroLabP0TransitPage';
import AstroLabP0StellarPage from '@/components/pages/AstroLabP0StellarPage';
import MyLabPage from '@/components/pages/MyLabPage';
import SpaceProblemsPage from '@/components/pages/SpaceProblemsPage';
import AstroLabInvestorDemoPage from '@/components/pages/AstroLabInvestorDemoPage';
import AstroLabP0HubPage from '@/components/pages/AstroLabP0HubPage';
import AstroLabExplorerPage from '@/components/pages/AstroLabExplorerPage';
import AstroLabSimulationsPage from '@/components/pages/AstroLabSimulationsPage';
import AstroLabReportsPage from '@/components/pages/AstroLabReportsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

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
        path: "astrolab",
        element: <AstroLabMainPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-main',
        },
      },
      {
        path: "astrolab/hub",
        element: <AstroLabHubPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-hub',
        },
      },
      {
        path: "astrolab/virtual-observatory",
        element: <VirtualObservatoryPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-observatory',
        },
      },
      {
        path: "astrolab/radio-astronomy",
        element: <RadioAstronomyPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-radio',
        },
      },
      {
        path: "astrolab/spaceflight-dynamics",
        element: <SpaceflightDynamicsPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-spaceflight',
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
        path: "astrolab/exoplanet-habitability",
        element: <AstroLabExoplanetHabitabilityPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-exoplanet',
        },
      },
      {
        path: "astrolab/orbital-mechanics-enhanced",
        element: <AstroLabOrbitalMechanicsEnhancedPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-orbital-enhanced',
        },
      },
      {
        path: "astrolab/astrobiology-lab",
        element: <AstrobiologyLabPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-astrobiology',
        },
      },
      {
        path: "astrolab/cosmology-explorer",
        element: <CosmologyExplorerPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-cosmology',
        },
      },
      {
        path: "astrolab/exoplanet-imaging",
        element: <ExoplanetImagingPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-imaging',
        },
      },
      {
        path: "astrolab/celestial-mechanics",
        element: <CelestialMechanicsPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-celestial-mechanics',
        },
      },
      {
        path: "astrolab/atmospheric-science",
        element: <AtmosphericSciencePage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-atmospheric',
        },
      },
      {
        path: "astrolab/quantum-astrophysics",
        element: <QuantumAstrophysicsPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-quantum',
        },
      },
      {
        path: "astrolab/mission-control",
        element: <MissionControlPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-mission-control',
        },
      },
      {
        path: "astrolab/academy",
        element: <AstroLabAcademyPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-academy',
        },
      },
      {
        path: "astrolab/professional",
        element: <AstroLabProfessionalPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-professional',
        },
      },
      {
        path: "astrolab/investor-demo",
        element: <InvestorDemoPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-investor-demo',
        },
      },
      {
        path: "production-status",
        element: <ProductionStatusPage />,
        routeMetadata: {
          pageIdentifier: 'production-status',
        },
      },
      {
        path: "astrolab/p0/orbital",
        element: <AstroLabP0OrbitalPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-p0-orbital',
        },
      },
      {
        path: "astrolab/p0/gravity",
        element: <AstroLabP0GravityPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-p0-gravity',
        },
      },
      {
        path: "astrolab/p0/transit",
        element: <AstroLabP0TransitPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-p0-transit',
        },
      },
      {
        path: "astrolab/p0/stellar",
        element: <AstroLabP0StellarPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-p0-stellar',
        },
      },
      {
        path: "my-lab",
        element: <MyLabPage />,
        routeMetadata: {
          pageIdentifier: 'my-lab',
        },
      },
      {
        path: "space-problems",
        element: <SpaceProblemsPage />,
        routeMetadata: {
          pageIdentifier: 'space-problems',
        },
      },
      {
        path: "astrolab/investor-demo",
        element: <AstroLabInvestorDemoPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-investor-demo-p0',
        },
      },
      {
        path: "astrolab/p0-hub",
        element: <AstroLabP0HubPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-p0-hub',
        },
      },
      {
        path: "astrolab/explorer",
        element: <AstroLabExplorerPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-explorer',
        },
      },
      {
        path: "astrolab/simulations",
        element: <AstroLabSimulationsPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-simulations',
        },
      },
      {
        path: "astrolab/reports",
        element: <AstroLabReportsPage />,
        routeMetadata: {
          pageIdentifier: 'astrolab-reports',
        },
      },
      {
        path: "*",
        element: <NotFoundPage />,
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
