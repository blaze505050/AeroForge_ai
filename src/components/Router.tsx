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
import TemplatesPage from '@/components/pages/TemplatesPage';
import CFDDatasetsPage from '@/components/pages/CFDDatasetsPage';
import RoboticsTemplatesPage from '@/components/pages/RoboticsTemplatesPage';
import AboutToolsPage from '@/components/pages/AboutToolsPage';
import CADSystemPage from '@/components/pages/CADSystemPage';
import CADEditorPage from '@/components/pages/CADEditorPage';
import AdvancedAerospaceSuitePage from '@/components/pages/AdvancedAerospaceSuitePage';
import MechanicalCADSuitePage from '@/components/pages/MechanicalCADSuitePage';
import AdvancedCFDPage from '@/components/pages/AdvancedCFDPage';
import AdvancedTurbulenceModelingPage from '@/components/pages/AdvancedTurbulenceModelingPage';
import MultiObjectiveOptimizationPage from '@/components/pages/MultiObjectiveOptimizationPage';
import BatchProcessingPage from '@/components/pages/BatchProcessingPage';
import ResearchHubPage from '@/components/pages/ResearchHubPage';
import KnowledgeBasePage from '@/components/pages/KnowledgeBasePage';
import CertificationsPage from '@/components/pages/CertificationsPage';
import CaseStudiesPage from '@/components/pages/CaseStudiesPage';
import EliteMultiObjectiveOptimizationPage from '@/components/pages/EliteMultiObjectiveOptimizationPage';
import TurbulenceModelingResearchLabPage from '@/components/pages/TurbulenceModelingResearchLabPage';
import AerospaceDesignPatternsLibraryPage from '@/components/pages/AerospaceDesignPatternsLibraryPage';
import AIResearchAssistantPage from '@/components/pages/AIResearchAssistantPage';
import CollaborativeWorkspacePage from '@/components/pages/CollaborativeWorkspacePage';
import DigitalAerospaceResearchLabPage from '@/components/pages/DigitalAerospaceResearchLabPage';
import ResearchLabsHubPage from '@/components/pages/ResearchLabsHubPage';
import VirtualLabPage from '@/components/pages/VirtualLabPage';
import StructuralAnalysisPage from '@/components/pages/StructuralAnalysisPage';
import PropulsionSystemsPage from '@/components/pages/PropulsionSystemsPage';
import AerodynamicsLabPage from '@/components/pages/AerodynamicsLabPage';
import MaterialsLabPage from '@/components/pages/MaterialsLabPage';
import SystemsIntegrationPage from '@/components/pages/SystemsIntegrationPage';

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
        path: "templates",
        element: <TemplatesPage />,
        routeMetadata: {
          pageIdentifier: 'templates',
        },
      },
      {
        path: "cfd-datasets",
        element: <CFDDatasetsPage />,
        routeMetadata: {
          pageIdentifier: 'cfd-datasets',
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
        path: "advanced-aerospace-suite",
        element: <AdvancedAerospaceSuitePage />,
        routeMetadata: {
          pageIdentifier: 'advanced-aerospace-suite',
        },
      },
      {
        path: "mechanical-cad-suite",
        element: <MechanicalCADSuitePage />,
        routeMetadata: {
          pageIdentifier: 'mechanical-cad-suite',
        },
      },
      {
        path: "advanced-cfd",
        element: <AdvancedCFDPage />,
        routeMetadata: {
          pageIdentifier: 'advanced-cfd',
        },
      },
      {
        path: "advanced-turbulence-modeling",
        element: <AdvancedTurbulenceModelingPage />,
        routeMetadata: {
          pageIdentifier: 'advanced-turbulence-modeling',
        },
      },
      {
        path: "multi-objective-optimization",
        element: <MultiObjectiveOptimizationPage />,
        routeMetadata: {
          pageIdentifier: 'multi-objective-optimization',
        },
      },
      {
        path: "batch-processing",
        element: <BatchProcessingPage />,
        routeMetadata: {
          pageIdentifier: 'batch-processing',
        },
      },
      {
        path: "research-hub",
        element: <ResearchHubPage />,
        routeMetadata: {
          pageIdentifier: 'research-hub',
        },
      },
      {
        path: "knowledge-base",
        element: <KnowledgeBasePage />,
        routeMetadata: {
          pageIdentifier: 'knowledge-base',
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
        path: "case-studies",
        element: <CaseStudiesPage />,
        routeMetadata: {
          pageIdentifier: 'case-studies',
        },
      },
      {
        path: "elite-multi-objective-optimization",
        element: <EliteMultiObjectiveOptimizationPage />,
        routeMetadata: {
          pageIdentifier: 'elite-multi-objective-optimization',
        },
      },
      {
        path: "turbulence-modeling-research-lab",
        element: <TurbulenceModelingResearchLabPage />,
        routeMetadata: {
          pageIdentifier: 'turbulence-modeling-research-lab',
        },
      },
      {
        path: "aerospace-design-patterns-library",
        element: <AerospaceDesignPatternsLibraryPage />,
        routeMetadata: {
          pageIdentifier: 'aerospace-design-patterns-library',
        },
      },
      {
        path: "ai-research-assistant",
        element: <AIResearchAssistantPage />,
        routeMetadata: {
          pageIdentifier: 'ai-research-assistant',
        },
      },
      {
        path: "collaborative-workspace",
        element: <CollaborativeWorkspacePage />,
        routeMetadata: {
          pageIdentifier: 'collaborative-workspace',
        },
      },
      {
        path: "digital-aerospace-research-lab",
        element: <DigitalAerospaceResearchLabPage />,
        routeMetadata: {
          pageIdentifier: 'digital-aerospace-research-lab',
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
      {
        path: "structural-analysis",
        element: <StructuralAnalysisPage />,
        routeMetadata: {
          pageIdentifier: 'structural-analysis',
        },
      },
      {
        path: "propulsion-systems",
        element: <PropulsionSystemsPage />,
        routeMetadata: {
          pageIdentifier: 'propulsion-systems',
        },
      },
      {
        path: "aerodynamics-lab",
        element: <AerodynamicsLabPage />,
        routeMetadata: {
          pageIdentifier: 'aerodynamics-lab',
        },
      },
      {
        path: "materials-lab",
        element: <MaterialsLabPage />,
        routeMetadata: {
          pageIdentifier: 'materials-lab',
        },
      },
      {
        path: "systems-integration",
        element: <SystemsIntegrationPage />,
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
