import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

interface Certification {
  _id: string;
  certificationName?: string;
  description?: string;
  complianceStandard?: string;
  status?: string;
  expiryDate?: Date | string;
  auditTrailLink?: string;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Certification>('certifications', [], { limit: 50 });
      setCertifications(result.items || []);
    } catch (error) {
      console.error('Failed to load certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="text-aerospace-success" size={24} />;
      case 'Expired':
        return <AlertCircle className="text-aerospace-danger" size={24} />;
      case 'Pending':
        return <Clock className="text-aerospace-warning" size={24} />;
      default:
        return <CheckCircle className="text-aerospace-accent" size={24} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-aerospace-success/20 text-aerospace-success';
      case 'Expired':
        return 'bg-aerospace-danger/20 text-aerospace-danger';
      case 'Pending':
        return 'bg-aerospace-warning/20 text-aerospace-warning';
      default:
        return 'bg-aerospace-accent/20 text-aerospace-accent';
    }
  };

  const isExpiringSoon = (expiryDate?: Date | string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
  };

  const activeCerts = certifications.filter(c => c.status === 'Active');
  const expiredCerts = certifications.filter(c => c.status === 'Expired');
  const pendingCerts = certifications.filter(c => c.status === 'Pending');

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="font-heading text-6xl font-bold mb-4 text-aerospace-blue">Industry Certifications</h1>
          <p className="font-paragraph text-xl text-secondary-foreground max-w-2xl">
            Our commitment to industry standards and compliance. View our certifications, audit trails, and compliance documentation.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-primary border border-aerospace-success/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-3xl font-bold text-aerospace-success">{activeCerts.length}</p>
              <CheckCircle className="text-aerospace-success" size={32} />
            </div>
            <p className="font-paragraph text-secondary-foreground">Active Certifications</p>
          </div>

          <div className="bg-primary border border-aerospace-warning/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-3xl font-bold text-aerospace-warning">{pendingCerts.length}</p>
              <Clock className="text-aerospace-warning" size={32} />
            </div>
            <p className="font-paragraph text-secondary-foreground">Pending Certifications</p>
          </div>

          <div className="bg-primary border border-aerospace-danger/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading text-3xl font-bold text-aerospace-danger">{expiredCerts.length}</p>
              <AlertCircle className="text-aerospace-danger" size={32} />
            </div>
            <p className="font-paragraph text-secondary-foreground">Expired Certifications</p>
          </div>
        </div>

        {/* Certifications List */}
        <div className="min-h-96">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <LoadingSpinner />
            </div>
          ) : certifications.length > 0 ? (
            <div className="space-y-6">
              {certifications.map(cert => (
                <div
                  key={cert._id}
                  className={`bg-primary border rounded-lg p-6 transition-all ${
                    cert.status === 'Active'
                      ? 'border-aerospace-success/30 hover:border-aerospace-success/60'
                      : cert.status === 'Expired'
                      ? 'border-aerospace-danger/30 hover:border-aerospace-danger/60'
                      : 'border-aerospace-warning/30 hover:border-aerospace-warning/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(cert.status)}
                      <div className="flex-1">
                        <h3 className="font-heading text-2xl font-bold text-aerospace-blue mb-2">
                          {cert.certificationName || 'Unnamed Certification'}
                        </h3>
                        {cert.complianceStandard && (
                          <p className="font-paragraph text-sm text-aerospace-accent mb-2">
                            Standard: <span className="font-semibold">{cert.complianceStandard}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(cert.status)}`}>
                        {cert.status || 'Unknown'}
                      </Badge>
                      {isExpiringSoon(cert.expiryDate) && (
                        <Badge className="bg-aerospace-warning/20 text-aerospace-warning">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>

                  {cert.description && (
                    <p className="font-paragraph text-secondary-foreground mb-4">
                      {cert.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {cert.expiryDate && (
                      <div className="bg-aerospace-dark/50 rounded p-3">
                        <p className="font-paragraph text-xs text-secondary-foreground mb-1">Expiry Date</p>
                        <p className="font-heading text-lg font-semibold text-foreground">
                          {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {cert.auditTrailLink && (
                      <div className="bg-aerospace-dark/50 rounded p-3">
                        <p className="font-paragraph text-xs text-secondary-foreground mb-1">Audit Documentation</p>
                        <a
                          href={cert.auditTrailLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-aerospace-blue hover:text-aerospace-accent transition-colors"
                        >
                          <span className="font-heading font-semibold">View Audit Trail</span>
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    )}
                  </div>

                  {cert.auditTrailLink && (
                    <Button
                      asChild
                      className="w-full bg-aerospace-blue hover:bg-aerospace-accent"
                    >
                      <a href={cert.auditTrailLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        View Full Audit Trail
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-paragraph text-secondary-foreground text-lg">
                No certifications found.
              </p>
            </div>
          )}
        </div>

        {/* Compliance Info Section */}
        <div className="mt-16 bg-primary border border-aerospace-accent/20 rounded-lg p-8">
          <h2 className="font-heading text-2xl font-bold text-aerospace-blue mb-4">Compliance Commitment</h2>
          <p className="font-paragraph text-secondary-foreground mb-4">
            We maintain rigorous compliance with industry standards including AS9100 (aerospace quality management), 
            ISO 9001 (quality management), and other relevant certifications. Our audit trails provide complete 
            traceability and documentation of all compliance activities.
          </p>
          <p className="font-paragraph text-secondary-foreground">
            For detailed information about our compliance programs and audit documentation, please contact our 
            compliance team or review the audit trail links above.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
