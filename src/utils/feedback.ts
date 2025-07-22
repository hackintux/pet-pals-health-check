import { Feedback } from '@/types/vetocheck';

export interface FeedbackWithDate extends Feedback {
  id: string;
  createdAt: string;
}

const FEEDBACK_STORAGE_KEY = 'vetocheck-feedbacks';

export const saveFeedback = (feedback: Feedback): void => {
  try {
    const existingFeedbacks = getFeedbacks();
    const newFeedback: FeedbackWithDate = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedFeedbacks = [newFeedback, ...existingFeedbacks];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedbacks));
  } catch (error) {
    console.error('Error saving feedback:', error);
  }
};

export const getFeedbacks = (): FeedbackWithDate[] => {
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!stored) return [];
    
    const feedbacks = JSON.parse(stored) as FeedbackWithDate[];
    // Sort by date (most recent first)
    return feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return [];
  }
};

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export const getFeedbackStats = (): FeedbackStats => {
  const feedbacks = getFeedbacks();
  
  if (feedbacks.length === 0) {
    return {
      totalFeedbacks: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
  
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  const averageRating = totalRating / feedbacks.length;
  
  const ratingDistribution = feedbacks.reduce((dist, feedback) => {
    dist[feedback.rating] = (dist[feedback.rating] || 0) + 1;
    return dist;
  }, {} as { [key: number]: number });
  
  // Ensure all ratings 1-5 are represented
  for (let i = 1; i <= 5; i++) {
    if (!ratingDistribution[i]) {
      ratingDistribution[i] = 0;
    }
  }
  
  return {
    totalFeedbacks: feedbacks.length,
    averageRating,
    ratingDistribution,
  };
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Date inconnue';
  }
};