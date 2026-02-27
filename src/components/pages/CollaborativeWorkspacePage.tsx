import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Settings,
  Share2,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  GitBranch,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  User,
  Calendar,
  Filter,
  Search,
  Zap,
  Layers,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { CADProjects, DesignVersions } from '@/entities';

interface TeamMember {
  id: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar: string;
  joinedDate: Date;
}

interface ProjectVersion {
  id: string;
  versionNumber: string;
  versionName: string;
  changeLog: string;
  createdBy: string;
  createdDate: Date;
  status: 'draft' | 'review' | 'approved' | 'archived';
  downloads: number;
}

interface CollaborativeProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  team: TeamMember[];
  versions: ProjectVersion[];
  createdDate: Date;
  lastModified: Date;
  status: 'active' | 'archived' | 'completed';
  comments: number;
}

export default function CollaborativeWorkspacePage() {
  const [projects, setProjects] = useState<CollaborativeProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<CollaborativeProject | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const [cadResult, versionsResult] = await Promise.all([
          BaseCrudService.getAll<CADProjects>('cadprojects'),
          BaseCrudService.getAll<DesignVersions>('designversions'),
        ]);

        const mockProjects: CollaborativeProject[] = (cadResult.items || []).map((proj, idx) => ({
          id: proj._id,
          name: proj.projectTitle || 'Untitled Project',
          description: proj.description || 'No description',
          owner: proj.owner || 'Unknown',
          team: [
            { id: '1', name: 'You', role: 'owner', avatar: '👤', joinedDate: new Date() },
            { id: '2', name: 'John Smith', role: 'editor', avatar: '👨', joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { id: '3', name: 'Jane Doe', role: 'viewer', avatar: '👩', joinedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          ],
          versions: (versionsResult.items || []).slice(0, 3).map((v, vidx) => ({
            id: v._id,
            versionNumber: v.versionNumber || `1.${vidx}`,
            versionName: v.versionName || `Version ${vidx + 1}`,
            changeLog: v.changeLog || 'Minor updates',
            createdBy: 'Team Member',
            createdDate: v.creationTimestamp ? new Date(v.creationTimestamp) : new Date(),
            status: (['draft', 'review', 'approved', 'archived'][vidx % 4] as any),
            downloads: Math.floor(Math.random() * 50),
          })),
          createdDate: proj.creationDate ? new Date(proj.creationDate) : new Date(),
          lastModified: proj.lastModifiedDate ? new Date(proj.lastModifiedDate) : new Date(),
          status: (['active', 'archived', 'completed'][idx % 3] as any),
          comments: Math.floor(Math.random() * 20),
        }));

        setProjects(mockProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-aerospace-success',
    archived: 'bg-aerospace-warning',
    completed: 'bg-aerospace-blue',
  };

  const roleColors: Record<string, string> = {
    owner: 'bg-aerospace-blue',
    editor: 'bg-aerospace-accent',
    viewer: 'bg-slate-600',
  };

  const versionStatusColors: Record<string, string> = {
    draft: 'bg-slate-600',
    review: 'bg-aerospace-warning',
    approved: 'bg-aerospace-success',
    archived: 'bg-slate-500',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-aerospace-dark">
        {/* Hero Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="text-aerospace-blue" size={32} />
              <h1 className="text-5xl font-heading font-bold text-white">Collaborative Workspace</h1>
            </div>
            <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
              Team projects, design versioning, and peer review for aerospace engineering
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-aerospace-blue/30 rounded-lg text-white placeholder-secondary-foreground focus:outline-none focus:border-aerospace-blue"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewProject(true)}
                className="flex items-center gap-2 px-6 py-3 bg-aerospace-blue hover:bg-aerospace-blue/90 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={20} /> New Project
              </motion.button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-secondary-foreground">Filter:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(null)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  !filterStatus
                    ? 'bg-aerospace-blue text-white'
                    : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                }`}
              >
                All Projects
              </motion.button>
              {['active', 'archived', 'completed'].map(status => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filterStatus === status
                      ? `${statusColors[status]} text-white`
                      : `${statusColors[status]}/10 text-white hover:${statusColors[status]}/20`
                  }`}
                >
                  {status}
                </motion.button>
              ))}

              <div className="ml-auto flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-aerospace-blue text-white'
                      : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                  }`}
                >
                  <Layers size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-aerospace-blue text-white'
                      : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
                  }`}
                >
                  <Filter size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Projects */}
          {isLoading ? (
            <div className="text-center py-16">
              <Zap className="mx-auto mb-4 text-aerospace-blue/50 animate-spin" size={48} />
              <p className="text-secondary-foreground">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className={`group rounded-lg border border-aerospace-blue/30 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden hover:border-aerospace-blue/60 transition-all cursor-pointer ${
                    viewMode === 'list' ? 'p-4' : 'p-6'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-aerospace-blue transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-secondary-foreground mt-1">
                        by {project.owner}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-secondary-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Team */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-aerospace-blue mb-2">Team Members</p>
                    <div className="flex items-center gap-2">
                      {project.team.map((member, midx) => (
                        <motion.div
                          key={member.id}
                          whileHover={{ scale: 1.2 }}
                          className={`w-8 h-8 rounded-full ${roleColors[member.role]} flex items-center justify-center text-sm font-bold text-white border-2 border-slate-800`}
                          title={`${member.name} (${member.role})`}
                        >
                          {member.avatar}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-aerospace-dark rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-secondary-foreground">Versions</p>
                      <p className="text-lg font-bold text-aerospace-blue">{project.versions.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-secondary-foreground">Comments</p>
                      <p className="text-lg font-bold text-aerospace-accent">{project.comments}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-secondary-foreground">Team</p>
                      <p className="text-lg font-bold text-aerospace-success">{project.team.length}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-xs text-secondary-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {project.createdDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {project.lastModified.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setShowVersionHistory(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue rounded-lg text-sm font-medium transition-colors"
                    >
                      <GitBranch size={14} /> Versions
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent rounded-lg text-sm font-medium transition-colors"
                    >
                      <Share2 size={14} /> Share
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Users className="mx-auto mb-4 text-aerospace-blue/50" size={48} />
              <p className="text-lg text-secondary-foreground">No projects found</p>
            </motion.div>
          )}
        </section>

        {/* Version History Modal */}
        {showVersionHistory && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVersionHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-aerospace-dark border border-aerospace-blue/30 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
            >
              <div className="p-6 border-b border-aerospace-blue/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold text-white">
                    Version History - {selectedProject.name}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowVersionHistory(false)}
                    className="text-secondary-foreground hover:text-white"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {selectedProject.versions.map((version, idx) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-slate-900 rounded-lg border border-aerospace-blue/20 hover:border-aerospace-blue/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-white">
                          v{version.versionNumber} - {version.versionName}
                        </h4>
                        <p className="text-xs text-secondary-foreground mt-1">
                          by {version.createdBy} • {version.createdDate.toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${versionStatusColors[version.status]}`}>
                        {version.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-3">{version.changeLog}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-secondary-foreground">
                        {version.downloads} downloads
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue rounded text-xs font-medium transition-colors"
                        >
                          <Eye size={14} className="inline mr-1" /> View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent rounded text-xs font-medium transition-colors"
                        >
                          <Download size={14} className="inline mr-1" /> Download
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
