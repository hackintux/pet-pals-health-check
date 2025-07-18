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
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">VetoCheck</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Commençons par créer le profil de votre compagnon
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            Profil de l'animal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de votre animal</Label>
              <Input
                id="name"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Ex: Médor, Félix..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Espèce</Label>
                <Select 
                  value={profile.species} 
                  onValueChange={(value: Species) => setProfile({ ...profile, species: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir l'espèce" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chien">🐕 Chien</SelectItem>
                    <SelectItem value="chat">🐱 Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <div className="flex gap-2">
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max={ageUnit === 'années' ? "25" : "300"}
                    value={ageValue || ''}
                    onChange={(e) => handleAgeChange(parseInt(e.target.value) || 0)}
                    placeholder={ageUnit === 'années' ? "Ex: 2" : "Ex: 24"}
                    className="flex-1"
                    required
                  />
                  <Select 
                    value={ageUnit} 
                    onValueChange={handleUnitChange}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mois">mois</SelectItem>
                      <SelectItem value="années">ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Sexe</Label>
              <Select 
                value={profile.gender} 
                onValueChange={(value: Gender) => setProfile({ ...profile, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">♂️ Mâle</SelectItem>
                  <SelectItem value="femelle">♀️ Femelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="neutered"
                  checked={profile.isNeutered || false}
                  onCheckedChange={(checked) => setProfile({ ...profile, isNeutered: checked as boolean })}
                />
                <Label htmlFor="neutered" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mon animal est stérilisé/castré
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overweight"
                  checked={profile.isOverweight || false}
                  onCheckedChange={(checked) => setProfile({ ...profile, isOverweight: checked as boolean })}
                />
                <Label htmlFor="overweight" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mon animal est en surpoids
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isProfileComplete()}
            >
              Commencer le diagnostic
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};