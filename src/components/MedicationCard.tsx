import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  takenToday: boolean;
  color: string;
}

interface MedicationCardProps {
  medication: Medication;
  onTakeDose: (id: string) => void;
}

export const MedicationCard = ({ medication, onTakeDose }: MedicationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTakeDose = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    onTakeDose(medication.id);
    setIsLoading(false);
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-healing hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{medication.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
          </div>
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: medication.color }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Next: {medication.nextDose}
            </span>
          </div>
          <Badge variant={medication.takenToday ? "default" : "secondary"}>
            {medication.frequency}
          </Badge>
        </div>

        {medication.takenToday ? (
          <div className="flex items-center space-x-2 text-success">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Taken today!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-accent">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Due now</span>
          </div>
        )}

        <Button
          onClick={handleTakeDose}
          disabled={medication.takenToday || isLoading}
          variant={medication.takenToday ? "secondary" : "default"}
          className="w-full transition-all duration-300"
        >
          {isLoading ? (
            <span className="animate-pulse">Logging dose...</span>
          ) : medication.takenToday ? (
            "✓ Dose completed"
          ) : (
            "Take now"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};