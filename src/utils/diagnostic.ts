import { Answer, AnimalProfile, DiagnosticResult, RiskLevel, DangerousPattern } from '@/types/vetocheck';
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

  // Détection de patterns dangereux
  const dangerousPatterns = detectDangerousPatterns(answers, questions);

  // Actions de suivi
  const followUpActions = generateFollowUpActions(riskLevel, mainCategory, profile);

  // Niveau de confiance
  const confidenceLevel = calculateConfidenceLevel(answers, uncertaintyRate);

  // Temps recommandé pour consultation
  const timeToVet = getTimeToVet(riskLevel, dangerousPatterns);

  return {
    riskLevel,
    score: Math.round(scorePercentage),
    uncertaintyRate,
    mainCategory,
    recommendations,
    emergencyAlert,
    sterilizationMessage,
    criticalSymptoms,
    dangerousPatterns,
    timeToVet,
    vetContact: getEmergencyVetContact(),
    followUpActions,
    confidenceLevel
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

const detectDangerousPatterns = (answers: Answer[], questions: any[]): DangerousPattern[] => {
  const patterns: DangerousPattern[] = [];
  const yesAnswers = answers.filter(a => a.value === 'oui').map(a => a.questionId);

  // Pattern: Torsion gastrique (urgence vitale)
  if (yesAnswers.includes('urgence_3') && yesAnswers.includes('digestion_2')) {
    patterns.push({
      name: 'Suspicion de torsion gastrique',
      symptoms: ['Ventre gonflé et dur', 'Vomissements'],
      urgencyLevel: 'immediate',
      description: 'Urgence vétérinaire absolue - risque vital'
    });
  }

  // Pattern: Détresse respiratoire
  if (yesAnswers.includes('respiration_1') && yesAnswers.includes('respiration_4')) {
    patterns.push({
      name: 'Détresse respiratoire sévère',
      symptoms: ['Respiration difficile', 'Gencives bleues/violettes'],
      urgencyLevel: 'immediate',
      description: 'Urgence respiratoire - transport immédiat requis'
    });
  }

  // Pattern: Syndrome hémorragique
  if (yesAnswers.filter(id => ['digestion_4', 'hydratation_4', 'urgence_2'].includes(id)).length >= 2) {
    patterns.push({
      name: 'Syndrome hémorragique',
      symptoms: ['Saignements multiples'],
      urgencyLevel: 'immediate',
      description: 'Risque de choc hémorragique'
    });
  }

  // Pattern: Douleur abdominale sévère
  if (yesAnswers.includes('urgence_3') && yesAnswers.includes('locomotion_3')) {
    patterns.push({
      name: 'Douleur abdominale aiguë',
      symptoms: ['Ventre dur', 'Douleur au toucher'],
      urgencyLevel: 'urgent',
      description: 'Peut indiquer une urgence abdominale'
    });
  }

  return patterns;
};

const generateFollowUpActions = (riskLevel: RiskLevel, mainCategory: string, profile: AnimalProfile): string[] => {
  const actions: string[] = [];

  switch (riskLevel) {
    case 'red':
      actions.push('📞 Contactez immédiatement un vétérinaire');
      actions.push('🚗 Préparez le transport de votre animal');
      actions.push('📋 Notez l\'heure de début des symptômes');
      break;
    case 'orange':
      actions.push('📅 Prenez rendez-vous dans les 24-48h');
      actions.push('📝 Surveillez l\'évolution des symptômes');
      actions.push('📸 Prenez des photos si symptômes visibles');
      break;
    case 'green':
      actions.push('👀 Surveillez votre animal');
      actions.push('📅 Maintenez les visites de routine');
      break;
  }

  // Actions spécifiques par catégorie
  if (mainCategory === 'digestion' && riskLevel !== 'green') {
    actions.push('💧 Surveillez l\'hydratation');
    actions.push('🍽️ Notez ce qu\'il a mangé récemment');
  }

  if (mainCategory === 'respiration' && riskLevel !== 'green') {
    actions.push('🌡️ Surveillez la température');
    actions.push('⏱️ Comptez la fréquence respiratoire');
  }

  return actions;
};

const calculateConfidenceLevel = (answers: Answer[], uncertaintyRate: number): number => {
  // Plus il y a de réponses incertaines, moins le diagnostic est fiable
  const baseConfidence = 100 - uncertaintyRate;
  
  // Réduction si beaucoup de "je ne sais pas"
  const uncertainAnswers = answers.filter(a => a.value === 'ne_sais_pas').length;
  const penalty = Math.min(uncertainAnswers * 5, 30);
  
  return Math.max(baseConfidence - penalty, 40);
};

const getTimeToVet = (riskLevel: RiskLevel, patterns: DangerousPattern[]): string | undefined => {
  if (patterns.some(p => p.urgencyLevel === 'immediate')) {
    return 'Immédiatement - Ne pas attendre';
  }
  
  switch (riskLevel) {
    case 'red':
      return 'Dans les 2-4 heures';
    case 'orange':
      return 'Dans les 24-48 heures';
    case 'green':
      return undefined;
  }
};

const getEmergencyVetContact = () => ({
  phone: '3115',
  isEmergency: true
});