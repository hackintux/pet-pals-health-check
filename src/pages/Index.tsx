import { useState } from 'react';
import { AnimalProfile as AnimalProfileComponent } from '@/components/AnimalProfile';
import { Questionnaire } from '@/components/Questionnaire';
import { DiagnosticResult as DiagnosticResultComponent } from '@/components/DiagnosticResult';
import { AnimalProfile, Answer, DiagnosticResult } from '@/types/vetocheck';
import { calculateDiagnostic } from '@/utils/diagnostic';

type AppStep = 'profile' | 'questionnaire' | 'result';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('profile');
  const [animalProfile, setAnimalProfile] = useState<AnimalProfile | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const handleProfileComplete = (profile: AnimalProfile) => {
    setAnimalProfile(profile);
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: Answer[]) => {
    if (animalProfile) {
      const result = calculateDiagnostic(answers, animalProfile);
      setDiagnosticResult(result);
      setCurrentStep('result');
    }
  };

  const handleRestart = () => {
    setCurrentStep('profile');
    setAnimalProfile(null);
    setDiagnosticResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {currentStep === 'profile' && (
        <AnimalProfileComponent onProfileComplete={handleProfileComplete} />
      )}
      
      {currentStep === 'questionnaire' && animalProfile && (
        <Questionnaire 
          profile={animalProfile} 
          onComplete={handleQuestionnaireComplete} 
        />
      )}
      
      {currentStep === 'result' && animalProfile && diagnosticResult && (
        <DiagnosticResultComponent 
          result={diagnosticResult} 
          profile={animalProfile} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default Index;
