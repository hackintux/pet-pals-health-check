import { Answer, AnimalProfile, DiagnosticResult, RiskLevel } from '@/types/vetocheck';
import { getAllQuestions } from '@/data/questions';

export const calculateDiagnostic = (
  answers: Answer[],
  profile: AnimalProfile
): DiagnosticResult => {
  const questions = getAllQuestions();
  let totalScore = 0;
  let maxPossibleScore = 0;
  let uncertainAnswers = 0;
  const criticalSymptoms: string[] = [];
  const categoryScores: { [key: string]: number } = {};

  // Analyse des réponses
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    maxPossibleScore += question.weight;

    if (answer.value === 'ne_sais_pas') {
      uncertainAnswers++;
      // Pour l'incertitude, on compte 50% du poids
      totalScore += question.weight * 0.5;
    } else if (answer.value === 'oui') {
      totalScore += question.weight;
      
      // Détection des symptômes critiques
      if (question.isCritical) {
        criticalSymptoms.push(question.text);
      }
    }

    // Score par catégorie
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = 0;
    }
    if (answer.value === 'oui') {
      categoryScores[question.category] += question.weight;
    }
  });

  // Calcul du taux d'incertitude
  const uncertaintyRate = Math.round((uncertainAnswers / answers.length) * 100);

  // Détermination du niveau de risque
  let riskLevel: RiskLevel = 'green';
  const scorePercentage = (totalScore / maxPossibleScore) * 100;

  // Urgence immédiate si symptômes critiques
  if (criticalSymptoms.length > 0) {
    riskLevel = 'red';
  } else if (scorePercentage >= 40) {
    riskLevel = 'red';
  } else if (scorePercentage >= 20 || uncertaintyRate >= 40) {
    riskLevel = 'orange';
  }

  // Catégorie principale de symptômes
  const mainCategory = Object.entries(categoryScores)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

  // Génération des recommandations
  const recommendations = generateRecommendations(riskLevel, mainCategory, profile);

  // Message d'urgence
  let emergencyAlert: string | undefined;
  if (riskLevel === 'red') {
    emergencyAlert = criticalSymptoms.length > 0 
      ? "⚠️ URGENCE VÉTÉRINAIRE - Contactez immédiatement un vétérinaire ou appelez le 3115 (urgences vétérinaires)"
      : "🚨 Consultation vétérinaire recommandée rapidement";
  }

  // Message de stérilisation
  const sterilizationMessage = generateSterilizationMessage(profile);

  return {
    riskLevel,
    score: Math.round(scorePercentage),
    uncertaintyRate,
    mainCategory,
    recommendations,
    emergencyAlert,
    sterilizationMessage,
    criticalSymptoms
  };
};

const generateRecommendations = (
  riskLevel: RiskLevel,
  mainCategory: string,
  profile: AnimalProfile
): string[] => {
  const recommendations: string[] = [];

  switch (riskLevel) {
    case 'green':
      recommendations.push("✅ Aucun signe inquiétant détecté");
      recommendations.push("🏥 Continuez les visites de contrôle annuelles");
      recommendations.push("🍽️ Maintenez une alimentation équilibrée");
      break;

    case 'orange':
      recommendations.push("⚠️ Surveillance recommandée");
      recommendations.push("🏥 Consultez votre vétérinaire dans les prochains jours");
      recommendations.push("📝 Notez l'évolution des symptômes");
      break;

    case 'red':
      recommendations.push("🚨 Consultation vétérinaire urgente recommandée");
      recommendations.push("📞 N'attendez pas - contactez un vétérinaire");
      break;
  }

  // Recommandations spécifiques par catégorie
  switch (mainCategory) {
    case 'digestion':
      recommendations.push("💧 Surveillez l'hydratation");
      recommendations.push("🍽️ Proposez une alimentation digestible");
      break;
    case 'comportement':
      recommendations.push("🏠 Offrez un environnement calme");
      recommendations.push("👥 Limitez les stimulations");
      break;
    case 'peau':
      recommendations.push("🧴 Utilisez un shampooing adapté");
      recommendations.push("🐛 Vérifiez la protection antiparasitaire");
      break;
    case 'dents':
      recommendations.push("🦷 Brossage dentaire régulier recommandé");
      recommendations.push("🍖 Proposez des jouets à mâcher");
      break;
  }

  // Recommandations pour surpoids
  if (profile.isOverweight) {
    recommendations.push("⚖️ Discutez d'un régime alimentaire avec votre vétérinaire");
    recommendations.push("🏃‍♂️ Augmentez progressivement l'activité physique");
  }

  return recommendations;
};

const generateSterilizationMessage = (profile: AnimalProfile): string | undefined => {
  if (profile.isNeutered || profile.age < 6) {
    return undefined;
  }

  const animalGender = profile.gender === 'male' ? 'mâle' : 'femelle';
  const operation = profile.gender === 'male' ? 'castration' : 'stérilisation';
  
  return `💡 ${profile.name} est un ${profile.species} ${animalGender} non stérilisé de ${profile.age} mois. La ${operation} présente de nombreux bénéfices pour la santé et le comportement. Discutez-en avec votre vétérinaire.`;
};