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
import AerospaceToolsPage from '@/components/pages/AerospaceToolsPage';
import AirfoilDesignerPage from '@/components/pages/AirfoilDesignerPage';
import AirfoilDownloaderPage from '@/components/pages/AirfoilDownloaderPage';
import CFDSimulatorPage from '@/components/pages/CFDSimulatorPage';
import WingCalculatorPage from '@/components/pages/WingCalculatorPage';
import ThrustCalculatorPage from '@/components/pages/ThrustCalculatorPage';
import DragCalculatorPage from '@/components/pages/DragCalculatorPage';

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
        path: "aerospace-tools",
        element: <AerospaceToolsPage />,
        routeMetadata: {
          pageIdentifier: 'aerospace-tools',
        },
      },
      {
        path: "airfoil-designer",
        element: <AirfoilDesignerPage />,
        routeMetadata: {
          pageIdentifier: 'airfoil-designer',
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
        path: "cfd-simulator",
        element: <CFDSimulatorPage />,
        routeMetadata: {
          pageIdentifier: 'cfd-simulator',
        },
      },
      {
        path: "wing-calculator",
        element: <WingCalculatorPage />,
        routeMetadata: {
          pageIdentifier: 'wing-calculator',
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
