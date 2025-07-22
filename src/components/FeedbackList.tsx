import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackCard } from './FeedbackCard';
import { getFeedbacks, getFeedbackStats } from '@/utils/feedback';
import { useNavigate } from 'react-router-dom';

export const FeedbackList = () => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
  const feedbacks = useMemo(() => getFeedbacks(), []);
  const stats = useMemo(() => getFeedbackStats(), [feedbacks]);
  
  const filteredFeedbacks = useMemo(() => {
    if (selectedRating === null) return feedbacks;
    return feedbacks.filter(feedback => feedback.rating === selectedRating);
  }, [feedbacks, selectedRating]);

  const renderStatsPaws = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((paw) => (
          <span
            key={paw}
            className={`text-xl ${
              paw <= rating 
                ? 'text-primary filter drop-shadow-sm' 
                : 'text-muted-foreground/30'
            }`}
          >
            🐾
          </span>
        ))}
      </div>
    );
  };

  if (feedbacks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-6">
              <div className="text-6xl">🐾</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Aucun avis pour le moment
                </h2>
                <p className="text-muted-foreground">
                  Soyez le premier à partager votre expérience avec VetoCheck !
                </p>
              </div>
              <Button 
                onClick={() => navigate('/')}
                size="lg"
                className="mt-6"
              >
                Laisser le premier avis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Statistics */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Statistiques des avis
            </h2>
            
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalFeedbacks}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avis total{stats.totalFeedbacks > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {renderStatsPaws(Math.round(stats.averageRating))}
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {stats.averageRating.toFixed(1)}/5
                </div>
                <div className="text-sm text-muted-foreground">
                  Note moyenne
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter buttons */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Button
            variant={selectedRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRating(null)}
          >
            Tous ({feedbacks.length})
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={selectedRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRating(rating)}
              className="flex items-center gap-1"
            >
              <span className="text-sm">🐾</span>
              {rating} ({stats.ratingDistribution[rating] || 0})
            </Button>
          ))}
        </div>
      </div>

      {/* Feedback list */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </div>

      {filteredFeedbacks.length === 0 && selectedRating !== null && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">
              Aucun avis avec {selectedRating} patte{selectedRating > 1 ? 's' : ''} pour le moment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Call to action */}
      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="gap-2"
        >
          <span>🐾</span>
          Laisser un avis
        </Button>
      </div>
    </div>
  );
};