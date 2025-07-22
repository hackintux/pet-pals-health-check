import { Card, CardContent } from '@/components/ui/card';
import { FeedbackWithDate, formatDate } from '@/utils/feedback';

interface FeedbackCardProps {
  feedback: FeedbackWithDate;
}

export const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const renderPaws = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((paw) => (
          <span
            key={paw}
            className={`text-lg ${
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

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Pas satisfait";
      case 2: return "Peu satisfait";
      case 3: return "Correct";
      case 4: return "Satisfait";
      case 5: return "Très satisfait";
      default: return "";
    }
  };

  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with name and date */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground text-lg">
              {feedback.name}
            </h3>
            <span className="text-sm text-muted-foreground">
              {formatDate(feedback.createdAt)}
            </span>
          </div>
          
          {/* Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {renderPaws(feedback.rating)}
              <span className="text-sm font-medium text-muted-foreground">
                {getRatingLabel(feedback.rating)}
              </span>
            </div>
          </div>
          
          {/* Comment */}
          {feedback.comment && (
            <div className="pt-2 border-t border-border">
              <p className="text-muted-foreground leading-relaxed">
                "{feedback.comment}"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};