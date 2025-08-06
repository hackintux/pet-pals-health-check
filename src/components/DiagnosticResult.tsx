import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DiagnosticResult as DiagnosticResultType, AnimalProfile } from '@/types/vetocheck';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Heart,
  RotateCcw,
  ExternalLink,
  Star
} from 'lucide-react';
import { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';

interface DiagnosticResultProps {
  result: DiagnosticResultType;
  profile: AnimalProfile;
  onRestart: () => void;
}

export const DiagnosticResult = ({ result, profile, onRestart }: DiagnosticResultProps) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const getRiskLevelConfig = () => {
    switch (result.riskLevel) {
      case 'green':
        return {
          icon: CheckCircle2,
          title: 'Situation rassurante',
          color: 'success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20'
        };
      case 'orange':
        return {
          icon: AlertCircle,
          title: 'Surveillance recommandée',
          color: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20'
        };
      case 'red':
        return {
          icon: AlertTriangle,
          title: 'Attention requise',
          color: 'danger',
          bgColor: 'bg-danger/10',
          borderColor: 'border-danger/20'
        };
    }
  };

  const config = getRiskLevelConfig();
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen">
      {/* Header mobile-optimized */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b px-4 py-3 z-50">
        <div className="text-center">
          <h1 className="text-lg font-bold text-primary">
            Résultat - {profile.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {profile.species === 'chien' ? '🐕' : '🐱'} {profile.gender === 'male' ? 'Mâle' : 'Femelle'} • {profile.age} mois
          </p>
        </div>
      </div>

      {/* Content container */}
      <div className="p-4 max-w-lg mx-auto w-full space-y-4">

        {/* Alerte d'urgence */}
        {result.emergencyAlert && (
          <Card className={`${config.bgColor} ${config.borderColor} border-2 shadow-sm`}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-danger flex-shrink-0" />
                <span className="text-base font-bold text-danger">URGENCE</span>
              </div>
              <p className="text-sm mb-3 leading-relaxed">{result.emergencyAlert}</p>
              {result.riskLevel === 'red' && result.criticalSymptoms.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-danger/5 rounded-lg">
                  <Phone className="h-3 w-3 text-danger flex-shrink-0" />
                  <span className="font-medium text-danger text-sm">
                    Urgences vétérinaires : 3115
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      <div className="space-y-4">
          {/* Niveau de risque */}
          <Card className={`${config.bgColor} ${config.borderColor} border shadow-sm`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconComponent className={`h-4 w-4 text-${config.color} flex-shrink-0`} />
                {config.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score de risque</span>
                <Badge variant="outline" className="text-xs">{result.score}%</Badge>
              </div>
              <Progress value={result.score} className="h-1.5" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taux d'incertitude</span>
                <Badge variant="outline" className="text-xs">{result.uncertaintyRate}%</Badge>
              </div>
              <Progress value={result.uncertaintyRate} className="h-1.5" />

              {result.uncertaintyRate > 40 && (
                <div className="p-2 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-xs text-warning leading-tight">
                    ⚠️ Taux d'incertitude élevé - Consultez un professionnel
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Symptômes critiques détectés */}
          {result.criticalSymptoms.length > 0 && (
            <Card className="bg-danger/10 border-danger/20 border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-danger text-base">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  Symptômes critiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {result.criticalSymptoms.map((symptom, index) => (
                    <li key={index} className="text-xs flex items-start gap-2">
                      <span className="text-danger mt-0.5">•</span>
                      <span className="leading-tight">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommandations */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-primary flex-shrink-0" />
              Recommandations personnalisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                  <span className="text-sm leading-tight">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Patterns dangereux détectés */}
      {result.dangerousPatterns.length > 0 && (
        <Card className="bg-danger/10 border-danger/20 border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Combinaisons de symptômes à surveiller
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.dangerousPatterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-danger/5 rounded-lg border border-danger/10">
                  <h4 className="font-bold text-danger mb-2">{pattern.name}</h4>
                  <p className="text-sm text-danger/80 mb-3">{pattern.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {pattern.urgencyLevel === 'immediate' ? 'IMMÉDIAT' : 
                       pattern.urgencyLevel === 'urgent' ? 'URGENT' : 'BIENTÔT'}
                    </Badge>
                    <span className="text-xs text-danger/60">
                      Symptômes: {pattern.symptoms.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions de suivi */}
      {result.followUpActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Actions à réaliser maintenant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {result.followUpActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-primary mt-1">📋</span>
                  <span className="text-sm font-medium">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message de stérilisation */}
      {result.sterilizationMessage && (
        <Card className="bg-primary/10 border-primary/20 border">
          <CardContent className="pt-6">
            <p className="text-sm">{result.sterilizationMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Ressources utiles */}
      <Card>
        <CardHeader>
          <CardTitle>Ressources utiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="https://extranet.veterinaire.fr/annuaires/veterinaires"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
          >
            <span className="text-sm font-medium">Trouver un vétérinaire proche</span>
            <ExternalLink className="h-4 w-4 text-primary" />
          </a>
          <a
            href="tel:3115"
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
          >
            <span className="text-sm font-medium">Urgences vétérinaires 24h/24</span>
            <Phone className="h-4 w-4 text-danger" />
          </a>
          <a
            href="https://www.maxizoo.fr/c/vet-regime/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
          >
            <span className="text-sm font-medium">Conseils nutrition et soins</span>
            <ExternalLink className="h-4 w-4 text-primary" />
          </a>
        </CardContent>
      </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onRestart} variant="outline" className="w-full h-12 gap-2">
            <RotateCcw className="h-4 w-4" />
            Nouveau diagnostic
          </Button>
          <Button 
            onClick={() => setFeedbackModalOpen(true)} 
            variant="default" 
            className="w-full h-12 gap-2"
          >
            <Star className="h-4 w-4" />
            Donnez votre avis
          </Button>
        </div>
      </div>

      <FeedbackModal 
        open={feedbackModalOpen} 
        onOpenChange={setFeedbackModalOpen} 
      />
    </div>
  );
};
