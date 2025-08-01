
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Feedback } from '@/types/vetocheck';
import { saveFeedback } from '@/utils/feedback';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackModal = ({ open, onOpenChange }: FeedbackModalProps) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setRating(0);
    setComment('');
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (!name.trim() || rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const feedback: Feedback = {
        name: name.trim(),
        rating,
        comment: comment.trim() || undefined
      };
      
      await saveFeedback(feedback);
      
      toast({
        title: "Merci pour votre avis !",
        description: `Nous apprécions votre retour, ${name}. Votre évaluation nous aide à améliorer VetoCheck.`,
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre avis. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const isValid = name.trim().length > 0 && rating > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            Que pensez-vous de VetoCheck ?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Votre nom *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Entrez votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          {/* Notation avec pattes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Votre évaluation *
            </Label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((paw) => (
                <button
                  key={paw}
                  type="button"
                  onClick={() => setRating(paw)}
                  onMouseEnter={() => setHoveredRating(paw)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="text-3xl transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed"
                >
                  <span
                    className={`
                      ${(hoveredRating >= paw || (hoveredRating === 0 && rating >= paw))
                        ? 'text-primary filter drop-shadow-sm' 
                        : 'text-muted-foreground/40'
                      }
                    `}
                  >
                    🐾
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "Pas satisfait"}
                {rating === 2 && "Peu satisfait"}
                {rating === 3 && "Correct"}
                {rating === 4 && "Satisfait"}
                {rating === 5 && "Très satisfait"}
              </p>
            )}
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Commentaire (optionnel)
            </Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec VetoCheck (optionnel)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Envoi..." : "Envoyer l'avis"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
