import { Feedback } from '@/types/vetocheck';
import { supabase } from '@/lib/supabase';

export interface FeedbackWithDate extends Feedback {
  id: string;
  createdAt: string;
}

export const saveFeedback = async (feedback: Feedback): Promise<void> => {
  try {
    const { error } = await supabase
      .from('feedbacks')
      .insert({
        name: feedback.name,
        rating: feedback.rating,
        comment: feedback.comment || null,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

export const getFeedbacks = async (): Promise<FeedbackWithDate[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    }));
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

export const getFeedbackStats = async (): Promise<FeedbackStats> => {
  const feedbacks = await getFeedbacks();
  
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