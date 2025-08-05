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
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">
              Diagnostic pour {profile.name}
            </h1>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {allQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-danger/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <CardTitle className="text-lg text-danger">
                Question critique - Précisions requises
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium leading-relaxed">
              {currentQuestion.text}
            </div>

            <div className="p-4 bg-danger/5 border border-danger/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-danger" />
                <span className="font-medium text-danger">
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
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handlePrevious}>
                ← Retour
              </Button>
              <Button 
                onClick={handleConfirmation}
                className="bg-danger hover:bg-danger/90"
                disabled={confirmationState.details.trim().length < 10}
              >
                Confirmer et continuer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Alerte d'urgence */}
      {showUrgentAlert && (
        <div className="mb-6 p-4 bg-danger/10 border-2 border-danger rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-danger" />
            <div>
              <h3 className="font-bold text-danger">Symptômes d'urgence détectés</h3>
              <p className="text-sm text-danger/80">
                Continuez le questionnaire mais préparez-vous à contacter un vétérinaire rapidement.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary">
            Diagnostic pour {profile.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {allQuestions.length}
            </Badge>
            <Badge variant="secondary">
              {profile.species === 'chien' ? '🐕' : '🐱'} {profile.species}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {category.charAt(0)}
              </span>
            </div>
            <CardTitle className="text-lg">
              {category}
              {currentQuestion.isCritical && (
                <AlertTriangle className="inline-block ml-2 h-4 w-4 text-danger" />
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium leading-relaxed">
            {currentQuestion.text}
          </div>

          {currentQuestion.isCritical && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
              <div className="flex items-center gap-2 text-danger text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                Question critique - Votre réponse est importante
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAnswer('oui')}
              className="flex items-center gap-3 h-16 justify-start border-2 hover:border-danger hover:bg-danger/5"
            >
              <div className="w-8 h-8 bg-danger/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-danger" />
              </div>
              <span className="text-base font-medium">Oui</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAnswer('non')}
              className="flex items-center gap-3 h-16 justify-start border-2 hover:border-success hover:bg-success/5"
            >
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <span className="text-base font-medium">Non</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAnswer('ne_sais_pas')}
              className="flex items-center gap-3 h-16 justify-start border-2 hover:border-warning hover:bg-warning/5"
            >
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-warning" />
              </div>
              <span className="text-base font-medium">Je ne sais pas</span>
            </Button>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Précédent
            </Button>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="h-3 w-3" />
              {Math.round(progress)}% terminé
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};