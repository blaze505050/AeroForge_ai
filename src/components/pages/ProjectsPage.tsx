import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Folder,
  Calendar,
  User,
  Tag,
  Archive,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';

interface ProjectItem {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  createdDate: Date;
  updatedDate: Date;
  owner?: string;
  tags?: string[];
}

export default function ProjectsPage() {
  const { setCurrentProject, projects, setProjects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'completed'>('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // In production, fetch from CMS collection
        // const result = await BaseCrudService.getAll<ProjectItem>('projects');
        // setProjects(result.items);
        
        // Mock data for now
        setProjects([
          {
            _id: '1',
            name: 'UAV Aerodynamics Study',
            description: 'Comprehensive aerodynamic analysis of a small UAV design',
            status: 'active',
            createdDate: new Date('2024-01-15'),
            updatedDate: new Date('2024-02-20'),
            owner: 'John Doe',
            tags: ['aerodynamics', 'uav', 'cfd'],
          },
          {
            _id: '2',
            name: 'Wing Optimization',
            description: 'Multi-objective optimization for wing design',
            status: 'active',
            createdDate: new Date('2024-02-01'),
            updatedDate: new Date('2024-02-25'),
            owner: 'Jane Smith',
            tags: ['optimization', 'structures'],
          },
          {
            _id: '3',
            name: 'Fuselage FEA',
            description: 'Finite element analysis of fuselage structure',
            status: 'completed',
            createdDate: new Date('2023-12-01'),
            updatedDate: new Date('2024-01-30'),
            owner: 'John Doe',
            tags: ['fea', 'structures'],
          },
        ]);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [setProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const newProject: ProjectItem = {
        _id: crypto.randomUUID(),
        name: newProjectName,
        status: 'active',
        createdDate: new Date(),
        updatedDate: new Date(),
      };

      // In production: await BaseCrudService.create('projects', newProject);
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setShowNewProjectModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleSelectProject = (project: ProjectItem) => {
    setCurrentProject(project);
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-aerospace-success/10 text-aerospace-success';
      case 'completed':
        return 'bg-aerospace-blue/10 text-aerospace-blue';
      case 'archived':
        return 'bg-secondary/10 text-secondary-foreground';
      default:
        return 'bg-secondary/10 text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-aerospace-dark flex flex-col">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground font-heading mb-2">
                    Projects
                  </h1>
                  <p className="text-secondary-foreground">
                    Manage your engineering projects and workspaces
                  </p>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-secondary-foreground" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-primary border border-secondary/20 rounded-lg text-foreground placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-aerospace-blue text-white'
                          : 'bg-primary border border-secondary/20 text-secondary-foreground hover:border-aerospace-blue/50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-secondary-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-primary border border-secondary/20 rounded-lg"
              >
                <Folder className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
                <p className="text-secondary-foreground mb-4">No projects found</p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-6 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg font-medium transition-colors"
                >
                  Create Your First Project
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-primary border border-secondary/20 rounded-lg p-6 hover:border-aerospace-blue/50 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-aerospace-blue/10 rounded-lg group-hover:bg-aerospace-blue/20 transition-colors">
                          <Folder className="w-6 h-6 text-aerospace-blue" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-aerospace-blue transition-colors">
                            {project.name}
                          </h3>
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded mt-1 ${statusBadgeColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-5 h-5 text-secondary-foreground" />
                      </button>
                    </div>

                    {project.description && (
                      <p className="text-secondary-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-aerospace-blue/10 text-aerospace-blue rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary-foreground rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-secondary-foreground pt-4 border-t border-secondary/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.updatedDate).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/projects/${project._id}`}
                        className="flex items-center gap-1 text-aerospace-blue hover:text-aerospace-accent transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Open
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowNewProjectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-primary border border-secondary/20 rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-4 py-2 bg-aerospace-dark border border-secondary/20 rounded-lg text-foreground placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2 bg-primary border border-secondary/20 text-secondary-foreground rounded-lg hover:border-secondary/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
