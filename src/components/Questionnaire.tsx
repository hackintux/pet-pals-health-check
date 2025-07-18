import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Question, Answer, AnswerValue, AnimalProfile } from '@/types/vetocheck';
import { questionCategories } from '@/data/questions';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuestionnaireProps {
  profile: AnimalProfile;
  onComplete: (answers: Answer[]) => void;
}

export const Questionnaire = ({ profile, onComplete }: QuestionnaireProps) => {
  const allQuestions = questionCategories.flatMap(cat => cat.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handleAnswer = (value: AnswerValue) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCurrentCategory = () => {
    return questionCategories.find(cat => 
      cat.questions.some(q => q.id === currentQuestion.id)
    );
  };

  const category = getCurrentCategory();

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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {category?.name.charAt(0)}
              </span>
            </div>
            <CardTitle className="text-lg">
              {category?.name}
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
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% terminé
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};