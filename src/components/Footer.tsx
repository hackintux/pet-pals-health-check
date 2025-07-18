export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <img 
              src="/lovable-uploads/c4b2f9a1-854c-4005-85f9-12f9848809c5.png" 
              alt="VetoCheck Logo" 
              className="h-4 w-4 object-contain"
            />
            <span className="font-semibold text-primary">VetoCheck</span>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              © 2024 VetoCheck. Tous droits réservés.
            </p>
            <p className="font-medium text-foreground">
              ⚠️ Cette application ne remplace pas une consultation vétérinaire professionnelle.
            </p>
            <p>
              En cas de doute sur la santé de votre animal, consultez toujours un vétérinaire qualifié.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};