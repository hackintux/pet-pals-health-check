import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Question, Answer, AnswerValue, AnimalProfile } from '@/types/vetocheck';
import { getFilteredQuestions, getConfirmationQuestions } from '@/data/questions';
import { AlertTriangle, CheckCircle2, HelpCircle, Clock, Info } from 'lucide-react';

interface EnhancedQuestionnaireProps {
  profile: AnimalProfile;
  onComplete: (answers: Answer[]) => void;
}

interface ConfirmationState {
  questionId: string;
  details: string;
}

export const EnhancedQuestionnaire = ({ profile, onComplete }: EnhancedQuestionnaireProps) => {
  const allQuestions = getFilteredQuestions(profile.species);
  const confirmationQuestions = getConfirmationQuestions();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null);
  const [showUrgentAlert, setShowUrgentAlert] = useState(false);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handleAnswer = (value: AnswerValue) => {
    // Si c'est une question critique avec réponse "oui", demander confirmation
    if (currentQuestion.isCritical && value === 'oui' && confirmationQuestions[currentQuestion.id]) {
      setConfirmationState({
        questionId: currentQuestion.id,
        details: ''
      });
      return;
    }

    processAnswer(value);
  };

  const processAnswer = (value: AnswerValue, details?: string) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value,
      timestamp: new Date(),
      ...(details && { details: { circumstances: details } })
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    // Vérification des patterns d'urgence en temps réel
    checkUrgentPatterns(updatedAnswers, value);

    // Passer à la question suivante ou terminer
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(updatedAnswers);
    }

    setConfirmationState(null);
  };

  const checkUrgentPatterns = (currentAnswers: Answer[], lastAnswer: AnswerValue) => {
    if (lastAnswer !== 'oui') return;

    const yesAnswers = currentAnswers.filter(a => a.value === 'oui').map(a => a.questionId);
    
    // Pattern critique détecté
    const criticalCombinations = [
      ['urgence_3', 'digestion_2'], // Torsion gastrique
      ['respiration_1', 'respiration_4'], // Détresse respiratoire
      ['urgence_1'], // Convulsions
      ['urgence_2'] // Hémorragie
    ];

    const hasCriticalPattern = criticalCombinations.some(pattern =>
      pattern.every(id => yesAnswers.includes(id))
    );

    if (hasCriticalPattern && !showUrgentAlert) {
      setShowUrgentAlert(true);
    }
  };

  const handleConfirmation = () => {
    if (confirmationState) {
      processAnswer('oui', confirmationState.details);
    }
  };

  const handlePrevious = () => {
    if (confirmationState) {
      setConfirmationState(null);
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCurrentCategory = () => {
    // Simplification pour cet exemple
    const categoryMap: { [key: string]: string } = {
      'comportement': 'Comportement',
      'digestion': 'Digestion',
      'respiration': 'Respiration',
      'locomotion': 'Locomotion',
      'hydratation': 'Hydratation',
      'peau': 'Peau et Pelage',
      'yeux': 'Yeux',
      'oreilles': 'Oreilles',
      'dents': 'Dents et Bouche',
      'urgence': 'Signes d\'urgence'
    };
    return categoryMap[currentQuestion.category] || 'Général';
  };

  const category = getCurrentCategory();

  // Affichage de la confirmation
  if (confirmationState) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header mobile-optimized */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b px-4 py-3 z-50">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-primary">
              Diagnostic - {profile.name}
            </h1>
            <Badge variant="outline" className="text-xs">
              {currentQuestionIndex + 1}/{allQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </div>

        {/* Content container */}
        <div className="flex-1 p-4 max-w-lg mx-auto w-full">
          <Card className="border-danger/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-danger flex-shrink-0" />
                <CardTitle className="text-base text-danger leading-tight">
                  Question critique - Précisions requises
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-base font-medium leading-relaxed">
                {currentQuestion.text}
              </div>

              <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <Clock className="h-3 w-3 text-danger mt-1 flex-shrink-0" />
                  <span className="font-medium text-danger text-sm leading-tight">
                    {confirmationQuestions[confirmationState.questionId]}
                  </span>
                </div>
                <Textarea
                  placeholder="Décrivez les circonstances, la durée, l'intensité..."
                  value={confirmationState.details}
                  onChange={(e) => setConfirmationState({
                    ...confirmationState,
                    details: e.target.value
                  })}
                  className="min-h-[80px] text-base"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handlePrevious} className="text-sm px-3 py-2">
                  ← Retour
                </Button>
                <Button 
                  onClick={handleConfirmation}
                  className="bg-danger hover:bg-danger/90 text-sm px-4 py-2"
                  disabled={confirmationState.details.trim().length < 10}
                >
                  Confirmer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header mobile-optimized */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary">
            Diagnostic - {profile.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {currentQuestionIndex + 1}/{allQuestions.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {profile.species === 'chien' ? '🐕' : '🐱'}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </div>

      {/* Content container */}
      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        {/* Alerte d'urgence */}
        {showUrgentAlert && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-danger mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-danger text-sm">Symptômes d'urgence détectés</h3>
                <p className="text-xs text-danger/80 mt-1">
                  Continuez mais préparez-vous à contacter un vétérinaire.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {category.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-base leading-tight">
                {category}
                {currentQuestion.isCritical && (
                  <AlertTriangle className="inline-block ml-1 h-3 w-3 text-danger" />
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-base font-medium leading-relaxed">
              {currentQuestion.text}
            </div>

            {currentQuestion.isCritical && (
              <div className="p-2 bg-danger/10 border border-danger/20 rounded-lg">
                <div className="flex items-center gap-2 text-danger text-xs font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Question critique
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => handleAnswer('oui')}
                className="flex items-center gap-3 h-14 justify-start border-2 hover:border-danger hover:bg-danger/5 touch-manipulation"
              >
                <div className="w-6 h-6 bg-danger/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-danger" />
                </div>
                <span className="text-base font-medium">Oui</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAnswer('non')}
                className="flex items-center gap-3 h-14 justify-start border-2 hover:border-success hover:bg-success/5 touch-manipulation"
              >
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                </div>
                <span className="text-base font-medium">Non</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAnswer('ne_sais_pas')}
                className="flex items-center gap-3 h-14 justify-start border-2 hover:border-warning hover:bg-warning/5 touch-manipulation"
              >
                <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-3 w-3 text-warning" />
                </div>
                <span className="text-base font-medium">Je ne sais pas</span>
              </Button>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="text-sm px-3 py-2"
              >
                ← Précédent
              </Button>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {Math.round(progress)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};