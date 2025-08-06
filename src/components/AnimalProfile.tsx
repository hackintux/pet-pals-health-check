import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimalProfile as AnimalProfileType, Species, Gender } from '@/types/vetocheck';
import { Heart, PawPrint } from 'lucide-react';

interface AnimalProfileProps {
  onProfileComplete: (profile: AnimalProfileType) => void;
}

export const AnimalProfile = ({ onProfileComplete }: AnimalProfileProps) => {
  const [profile, setProfile] = useState<Partial<AnimalProfileType>>({
    isNeutered: false,
    isOverweight: false
  });
  const [ageUnit, setAgeUnit] = useState<'mois' | 'années'>('mois');
  const [ageValue, setAgeValue] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileComplete()) {
      // Convertir l'âge en mois si nécessaire
      const ageInMonths = ageUnit === 'années' ? ageValue * 12 : ageValue;
      const finalProfile = { ...profile, age: ageInMonths } as AnimalProfileType;
      onProfileComplete(finalProfile);
    }
  };

  const handleAgeChange = (value: number) => {
    setAgeValue(value);
    // Convertir en mois pour le profil
    const ageInMonths = ageUnit === 'années' ? value * 12 : value;
    setProfile({ ...profile, age: ageInMonths });
  };

  const handleUnitChange = (unit: 'mois' | 'années') => {
    setAgeUnit(unit);
    // Reconvertir la valeur actuelle avec la nouvelle unité
    const ageInMonths = unit === 'années' ? ageValue * 12 : ageValue;
    setProfile({ ...profile, age: ageInMonths });
  };

  const isProfileComplete = () => {
    return profile.name && 
           profile.species && 
           profile.age !== undefined && 
           profile.gender && 
           profile.isNeutered !== undefined && 
           profile.isOverweight !== undefined;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header mobile-optimized */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b px-4 py-3 z-50">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/c4b2f9a1-854c-4005-85f9-12f9848809c5.png" 
              alt="VetoCheck Logo" 
              className="h-5 w-5 object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-primary">VetoCheck</h1>
        </div>
      </div>

      {/* Content container */}
      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="text-center mb-6">
          <p className="text-base text-muted-foreground">
            Créons le profil de votre compagnon
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PawPrint className="h-5 w-5 text-primary" />
              Profil de l'animal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">Nom de votre animal</Label>
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Ex: Médor, Félix..."
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="species" className="text-base font-medium">Espèce</Label>
                <Select 
                  value={profile.species} 
                  onValueChange={(value: Species) => setProfile({ ...profile, species: value })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Choisir l'espèce" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chien" className="text-base py-3">🐕 Chien</SelectItem>
                    <SelectItem value="chat" className="text-base py-3">🐱 Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="age" className="text-base font-medium">Âge</Label>
                <div className="flex gap-3">
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max={ageUnit === 'années' ? "25" : "300"}
                    value={ageValue || ''}
                    onChange={(e) => handleAgeChange(parseInt(e.target.value) || 0)}
                    placeholder={ageUnit === 'années' ? "Ex: 2" : "Ex: 24"}
                    className="flex-1 h-12 text-base"
                    required
                  />
                  <Select 
                    value={ageUnit} 
                    onValueChange={handleUnitChange}
                  >
                    <SelectTrigger className="w-20 h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mois" className="text-base">mois</SelectItem>
                      <SelectItem value="années" className="text-base">ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="gender" className="text-base font-medium">Sexe</Label>
                <Select 
                  value={profile.gender} 
                  onValueChange={(value: Gender) => setProfile({ ...profile, gender: value })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Choisir le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className="text-base py-3">♂️ Mâle</SelectItem>
                    <SelectItem value="femelle" className="text-base py-3">♀️ Femelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="neutered"
                    checked={profile.isNeutered || false}
                    onCheckedChange={(checked) => setProfile({ ...profile, isNeutered: checked as boolean })}
                    className="mt-0.5"
                  />
                  <Label htmlFor="neutered" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                    Mon animal est stérilisé/castré
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="overweight"
                    checked={profile.isOverweight || false}
                    onCheckedChange={(checked) => setProfile({ ...profile, isOverweight: checked as boolean })}
                    className="mt-0.5"
                  />
                  <Label htmlFor="overweight" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                    Mon animal est en surpoids
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold" 
                disabled={!isProfileComplete()}
              >
                Commencer le diagnostic
              </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};