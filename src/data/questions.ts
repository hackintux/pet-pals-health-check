import { QuestionCategory, Question } from '@/types/vetocheck';

export const questionCategories: QuestionCategory[] = [
  {
    id: 'comportement',
    name: 'Comportement',
    questions: [
      {
        id: 'comportement_1',
        category: 'comportement',
        text: 'Votre animal semble-t-il abattu ou moins actif que d\'habitude ?',
        weight: 3
      },
      {
        id: 'comportement_2',
        category: 'comportement',
        text: 'Se cache-t-il ou évite-t-il le contact ?',
        weight: 4
      },
      {
        id: 'comportement_3',
        category: 'comportement',
        text: 'A-t-il des troubles du sommeil (dort beaucoup plus ou moins) ?',
        weight: 2
      },
      {
        id: 'comportement_4',
        category: 'comportement',
        text: 'Présente-t-il des signes d\'agressivité inhabituelle ?',
        weight: 5
      }
    ]
  },
  {
    id: 'digestion',
    name: 'Digestion',
    questions: [
      {
        id: 'digestion_1',
        category: 'digestion',
        text: 'Votre animal a-t-il perdu l\'appétit ?',
        weight: 4
      },
      {
        id: 'digestion_2',
        category: 'digestion',
        text: 'A-t-il des vomissements ?',
        weight: 6
      },
      {
        id: 'digestion_3',
        category: 'digestion',
        text: 'Ses selles sont-elles molles ou liquides ?',
        weight: 4
      },
      {
        id: 'digestion_4',
        category: 'digestion',
        text: 'Y a-t-il du sang dans les vomissures ou les selles ?',
        weight: 10,
        isCritical: true
      },
      {
        id: 'digestion_5',
        category: 'digestion',
        text: 'N\'a-t-il pas fait ses besoins depuis plus de 24h ?',
        weight: 8
      }
    ]
  },
  {
    id: 'respiration',
    name: 'Respiration',
    questions: [
      {
        id: 'respiration_1',
        category: 'respiration',
        text: 'Sa respiration vous semble-t-elle rapide ou difficile ?',
        weight: 8,
        isCritical: true
      },
      {
        id: 'respiration_2',
        category: 'respiration',
        text: 'Tousse-t-il de manière persistante ?',
        weight: 5
      },
      {
        id: 'respiration_3',
        category: 'respiration',
        text: 'Fait-il des bruits anormaux en respirant ?',
        weight: 7
      },
      {
        id: 'respiration_4',
        category: 'respiration',
        text: 'Sa langue ou ses gencives sont-elles bleues/violettes ?',
        weight: 10,
        isCritical: true
      }
    ]
  },
  {
    id: 'locomotion',
    name: 'Locomotion',
    questions: [
      {
        id: 'locomotion_1',
        category: 'locomotion',
        text: 'Boite-t-il ou évite-t-il de poser une patte ?',
        weight: 6
      },
      {
        id: 'locomotion_2',
        category: 'locomotion',
        text: 'A-t-il des difficultés à se lever ou se coucher ?',
        weight: 4
      },
      {
        id: 'locomotion_3',
        category: 'locomotion',
        text: 'Semble-t-il avoir mal quand on le touche ?',
        weight: 5
      },
      {
        id: 'locomotion_4',
        category: 'locomotion',
        text: 'Ne peut-il plus se déplacer normalement ?',
        weight: 9,
        isCritical: true
      }
    ]
  },
  {
    id: 'hydratation',
    name: 'Hydratation',
    questions: [
      {
        id: 'hydratation_1',
        category: 'hydratation',
        text: 'Boit-il beaucoup plus que d\'habitude ?',
        weight: 4
      },
      {
        id: 'hydratation_2',
        category: 'hydratation',
        text: 'Refuse-t-il de boire ?',
        weight: 6
      },
      {
        id: 'hydratation_3',
        category: 'hydratation',
        text: 'Urine-t-il plus fréquemment ?',
        weight: 3
      },
      {
        id: 'hydratation_4',
        category: 'hydratation',
        text: 'Y a-t-il du sang dans les urines ?',
        weight: 8,
        isCritical: true
      }
    ]
  },
  {
    id: 'peau',
    name: 'Peau et Pelage',
    questions: [
      {
        id: 'peau_1',
        category: 'peau',
        text: 'Se gratte-t-il de manière excessive ?',
        weight: 3
      },
      {
        id: 'peau_2',
        category: 'peau',
        text: 'A-t-il des zones sans poils ou des plaies ?',
        weight: 4
      },
      {
        id: 'peau_3',
        category: 'peau',
        text: 'Sa peau présente-t-elle des rougeurs ou des boutons ?',
        weight: 3
      },
      {
        id: 'peau_4',
        category: 'peau',
        text: 'Son pelage est-il terne ou gras ?',
        weight: 2
      }
    ]
  },
  {
    id: 'yeux',
    name: 'Yeux',
    questions: [
      {
        id: 'yeux_1',
        category: 'yeux',
        text: 'Ses yeux coulent-ils ou sont-ils rouges ?',
        weight: 3
      },
      {
        id: 'yeux_2',
        category: 'yeux',
        text: 'Garde-t-il un œil fermé ?',
        weight: 5
      },
      {
        id: 'yeux_3',
        category: 'yeux',
        text: 'Voyez-vous une tache blanche sur l\'œil ?',
        weight: 6
      },
      {
        id: 'yeux_4',
        category: 'yeux',
        text: 'Semble-t-il voir moins bien ?',
        weight: 4
      }
    ]
  },
  {
    id: 'oreilles',
    name: 'Oreilles',
    questions: [
      {
        id: 'oreilles_1',
        category: 'oreilles',
        text: 'Secoue-t-il souvent la tête ?',
        weight: 3
      },
      {
        id: 'oreilles_2',
        category: 'oreilles',
        text: 'Ses oreilles dégagent-elles une odeur désagréable ?',
        weight: 4
      },
      {
        id: 'oreilles_3',
        category: 'oreilles',
        text: 'Y a-t-il un écoulement dans les oreilles ?',
        weight: 5
      },
      {
        id: 'oreilles_4',
        category: 'oreilles',
        text: 'Semble-t-il entendre moins bien ?',
        weight: 3
      }
    ]
  },
  {
    id: 'dents',
    name: 'Dents et Bouche',
    questions: [
      {
        id: 'dents_1',
        category: 'dents',
        text: 'A-t-il mauvaise haleine ?',
        weight: 2
      },
      {
        id: 'dents_2',
        category: 'dents',
        text: 'Ses gencives sont-elles rouges ou gonflées ?',
        weight: 4
      },
      {
        id: 'dents_3',
        category: 'dents',
        text: 'A-t-il du mal à manger des croquettes dures ?',
        weight: 3
      },
      {
        id: 'dents_4',
        category: 'dents',
        text: 'Bave-t-il de manière excessive ?',
        weight: 4
      }
    ]
  },
  {
    id: 'urgence',
    name: 'Signes d\'urgence',
    questions: [
      {
        id: 'urgence_1',
        category: 'urgence',
        text: 'A-t-il perdu connaissance ou fait des convulsions ?',
        weight: 10,
        isCritical: true
      },
      {
        id: 'urgence_2',
        category: 'urgence',
        text: 'Saigne-t-il abondamment ?',
        weight: 10,
        isCritical: true
      },
      {
        id: 'urgence_3',
        category: 'urgence',
        text: 'Son ventre est-il gonflé et dur ?',
        weight: 9,
        isCritical: true
      },
      {
        id: 'urgence_4',
        category: 'urgence',
        text: 'Sa température corporelle vous semble-t-elle très élevée ?',
        weight: 7
      }
    ]
  }
];

export const getAllQuestions = (): Question[] => {
  return questionCategories.flatMap(category => category.questions);
};