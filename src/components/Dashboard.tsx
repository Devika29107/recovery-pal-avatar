import { useState, useEffect } from "react";
import { RecoveryPal } from "./RecoveryPal";
import { MedicationCard } from "./MedicationCard";
import { AddMedicineDialog } from "./AddMedicineDialog";
import { CalendarView } from "./CalendarView";
import { ProgressReport } from "./ProgressReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from an API
const initialMedications = [
  {
    id: "1",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3x daily",
    nextDose: "2:00 PM",
    takenToday: false,
    color: "#3B82F6"
  },
  {
    id: "2", 
    name: "Vitamin D",
    dosage: "1000 IU",
    frequency: "1x daily",
    nextDose: "Morning",
    takenToday: true,
    color: "#F59E0B"
  },
  {
    id: "3",
    name: "Ibuprofen",
    dosage: "200mg", 
    frequency: "As needed",
    nextDose: "Available",
    takenToday: false,
    color: "#EF4444"
  }
];

export const Dashboard = () => {
  const [medications, setMedications] = useState(initialMedications);
  const [adherenceLevel, setAdherenceLevel] = useState(65);
  const [streak, setStreak] = useState(3);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const handleTakeDose = (medicationId: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, takenToday: true }
          : med
      )
    );

    // Update adherence level
    const totalMeds = medications.length;
    const takenMeds = medications.filter(med => med.takenToday || med.id === medicationId).length;
    const newAdherence = Math.round((takenMeds / totalMeds) * 100);
    setAdherenceLevel(newAdherence);

    // Update streak if all medications taken
    if (takenMeds === totalMeds) {
      setStreak(prev => prev + 1);
      toast({
        title: "Perfect day! 🎉",
        description: "All medications taken. Your Recovery Pal is getting stronger!",
      });
    } else {
      toast({
        title: "Great job! 💊",
        description: "Dose logged. Keep up the good work!",
      });
    }
  };

  const handleAddMedicine = (newMedicine: {
    name: string;
    dosage: string;
    frequency: string;
    color: string;
  }) => {
    const medicine = {
      id: Date.now().toString(),
      ...newMedicine,
      nextDose: newMedicine.frequency === "As needed" ? "Available" : "Next dose",
      takenToday: false,
    };
    
    setMedications(prev => [...prev, medicine]);
    
    // Recalculate adherence
    const newTotal = medications.length + 1;
    const currentTaken = medications.filter(med => med.takenToday).length;
    const newAdherence = Math.round((currentTaken / newTotal) * 100);
    setAdherenceLevel(newAdherence);
  };

  const completedToday = medications.filter(med => med.takenToday).length;
  const totalMedications = medications.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Recovery Pal</h1>
              <p className="text-muted-foreground">Your healing journey companion</p>
            </div>
            <Button variant="healing" size="sm" onClick={() => setShowAddMedicine(true)}>
              <Plus className="w-4 h-4" />
              Add Medicine
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Recovery Pal Avatar Section */}
        <Card className="bg-recovery-gradient border-none shadow-healing">
          <CardContent className="pt-8">
            <RecoveryPal 
              adherenceLevel={adherenceLevel}
              streak={streak}
              className="text-center"
            />
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {completedToday}/{totalMedications}
              </div>
              <p className="text-xs text-muted-foreground">medications taken</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{streak}</div>
              <p className="text-xs text-muted-foreground">perfect days</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adherenceLevel}%</div>
              <p className="text-xs text-muted-foreground">overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Medications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Medications</h2>
            <div className="text-sm text-muted-foreground">
              {completedToday} of {totalMedications} completed today
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onTakeDose={handleTakeDose}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col space-y-2"
                onClick={() => setShowCalendar(true)}
              >
                <Calendar className="w-6 h-6" />
                <span>View Calendar</span>
                <span className="text-xs text-muted-foreground">See your schedule</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col space-y-2"
                onClick={() => setShowProgress(true)}
              >
                <TrendingUp className="w-6 h-6" />
                <span>Progress Report</span>
                <span className="text-xs text-muted-foreground">Track your journey</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <AddMedicineDialog 
        open={showAddMedicine}
        onOpenChange={setShowAddMedicine}
        onAddMedicine={handleAddMedicine}
      />
      <CalendarView 
        open={showCalendar}
        onOpenChange={setShowCalendar}
        medications={medications}
      />
      <ProgressReport 
        open={showProgress}
        onOpenChange={setShowProgress}
        medications={medications}
        adherenceLevel={adherenceLevel}
        streak={streak}
      />
    </div>
  );
};