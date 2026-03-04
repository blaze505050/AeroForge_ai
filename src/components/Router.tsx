import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import CompilerPage from '@/components/pages/CompilerPage';
import CompilerSplitPage from '@/components/pages/CompilerSplitPage';
import ResultsPage from '@/components/pages/ResultsPage';
import ArchitecturePage from '@/components/pages/ArchitecturePage';
import DSLDocsPage from '@/components/pages/DSLDocsPage';
import APIDocPage from '@/components/pages/APIDocPage';
import AirfoilDownloaderPage from '@/components/pages/AirfoilDownloaderPage';
import ThrustCalculatorPage from '@/components/pages/ThrustCalculatorPage';
import DragCalculatorPage from '@/components/pages/DragCalculatorPage';
import RoboticsTemplatesPage from '@/components/pages/RoboticsTemplatesPage';
import AboutToolsPage from '@/components/pages/AboutToolsPage';
import CADSystemPage from '@/components/pages/CADSystemPage';
import CADEditorPage from '@/components/pages/CADEditorPage';
import CertificationsPage from '@/components/pages/CertificationsPage';
import ResearchLabsHubPage from '@/components/pages/ResearchLabsHubPage';
import VirtualLabPage from '@/components/pages/VirtualLabPage';

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
        path: "compiler",
        element: <CompilerSplitPage />,
        routeMetadata: {
          pageIdentifier: 'compiler',
        },
      },
      {
        path: "compiler-classic",
        element: <CompilerPage />,
        routeMetadata: {
          pageIdentifier: 'compiler-classic',
        },
      },
      {
        path: "results",
        element: <ResultsPage />,
        routeMetadata: {
          pageIdentifier: 'results',
        },
      },
      {
        path: "architecture",
        element: <ArchitecturePage />,
        routeMetadata: {
          pageIdentifier: 'architecture',
        },
      },
      {
        path: "dsl-docs",
        element: <DSLDocsPage />,
        routeMetadata: {
          pageIdentifier: 'dsl-docs',
        },
      },
      {
        path: "api",
        element: <APIDocPage />,
        routeMetadata: {
          pageIdentifier: 'api',
        },
      },
      {
        path: "airfoil-downloader",
        element: <AirfoilDownloaderPage />,
        routeMetadata: {
          pageIdentifier: 'airfoil-downloader',
        },
      },
      {
        path: "thrust-calculator",
        element: <ThrustCalculatorPage />,
        routeMetadata: {
          pageIdentifier: 'thrust-calculator',
        },
      },
      {
        path: "drag-calculator",
        element: <DragCalculatorPage />,
        routeMetadata: {
          pageIdentifier: 'drag-calculator',
        },
      },
      {
        path: "robotics-templates",
        element: <RoboticsTemplatesPage />,
        routeMetadata: {
          pageIdentifier: 'robotics-templates',
        },
      },
      {
        path: "about-tools",
        element: <AboutToolsPage />,
        routeMetadata: {
          pageIdentifier: 'about-tools',
        },
      },
      {
        path: "cad-system",
        element: <CADSystemPage />,
        routeMetadata: {
          pageIdentifier: 'cad-system',
        },
      },
      {
        path: "cad-editor",
        element: <CADEditorPage />,
        routeMetadata: {
          pageIdentifier: 'cad-editor',
        },
      },
      {
        path: "certifications",
        element: <CertificationsPage />,
        routeMetadata: {
          pageIdentifier: 'certifications',
        },
      },
      {
        path: "research-labs-hub",
        element: <ResearchLabsHubPage />,
        routeMetadata: {
          pageIdentifier: 'research-labs-hub',
        },
      },
      {
        path: "virtual-lab",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'virtual-lab',
        },
      },
      // All other tools are now accessible through virtual-lab
      {
        path: "airfoil-designer",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'airfoil-designer',
        },
      },
      {
        path: "cfd-simulator",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'cfd-simulator',
        },
      },
      {
        path: "wing-calculator",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'wing-calculator',
        },
      },
      {
        path: "aerospace-tools",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'aerospace-tools',
        },
      },
      {
        path: "advanced-aerospace-suite",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'advanced-aerospace-suite',
        },
      },
      {
        path: "mechanical-cad-suite",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'mechanical-cad-suite',
        },
      },
      {
        path: "advanced-cfd",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'advanced-cfd',
        },
      },
      {
        path: "advanced-turbulence-modeling",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'advanced-turbulence-modeling',
        },
      },
      {
        path: "multi-objective-optimization",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'multi-objective-optimization',
        },
      },
      {
        path: "batch-processing",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'batch-processing',
        },
      },
      {
        path: "research-hub",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'research-hub',
        },
      },
      {
        path: "knowledge-base",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'knowledge-base',
        },
      },
      {
        path: "case-studies",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'case-studies',
        },
      },
      {
        path: "templates",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'templates',
        },
      },
      {
        path: "cfd-datasets",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'cfd-datasets',
        },
      },
      {
        path: "elite-multi-objective-optimization",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'elite-multi-objective-optimization',
        },
      },
      {
        path: "turbulence-modeling-research-lab",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'turbulence-modeling-research-lab',
        },
      },
      {
        path: "aerospace-design-patterns-library",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'aerospace-design-patterns-library',
        },
      },
      {
        path: "ai-research-assistant",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'ai-research-assistant',
        },
      },
      {
        path: "collaborative-workspace",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'collaborative-workspace',
        },
      },
      {
        path: "digital-aerospace-research-lab",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'digital-aerospace-research-lab',
        },
      },
      {
        path: "structural-analysis",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'structural-analysis',
        },
      },
      {
        path: "propulsion-systems",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'propulsion-systems',
        },
      },
      {
        path: "aerodynamics-lab",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'aerodynamics-lab',
        },
      },
      {
        path: "materials-lab",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'materials-lab',
        },
      },
      {
        path: "systems-integration",
        element: <VirtualLabPage />,
        routeMetadata: {
          pageIdentifier: 'systems-integration',
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
