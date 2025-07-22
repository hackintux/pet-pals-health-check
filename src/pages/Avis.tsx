import { FeedbackList } from '@/components/FeedbackList';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Avis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              
              <div className="flex items-center gap-2 flex-1">
                <img 
                  src="/lovable-uploads/c4b2f9a1-854c-4005-85f9-12f9848809c5.png" 
                  alt="VetoCheck Logo" 
                  className="h-6 w-6 object-contain"
                />
                <h1 className="text-2xl font-bold text-primary">
                  Avis VetoCheck
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="text-sm text-muted-foreground">
            <button
              onClick={() => navigate('/')}
              className="hover:text-foreground transition-colors"
            >
              Accueil
            </button>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Avis</span>
          </nav>
        </div>

        {/* Content */}
        <FeedbackList />
      </div>
      
      <Footer />
    </div>
  );
};

export default Avis;