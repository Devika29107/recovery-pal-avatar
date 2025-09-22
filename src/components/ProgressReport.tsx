import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  takenToday: boolean;
  color: string;
}

interface ProgressReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medications: Medication[];
  adherenceLevel: number;
  streak: number;
}

export const ProgressReport = ({ 
  open, 
  onOpenChange, 
  medications, 
  adherenceLevel, 
  streak 
}: ProgressReportProps) => {
  const completedToday = medications.filter(med => med.takenToday).length;
  const totalMedications = medications.length;
  
  // Mock historical data - in real app this would come from backend
  const weeklyAdherence = [95, 87, 92, 89, 96, 85, adherenceLevel];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const averageAdherence = Math.round(weeklyAdherence.reduce((a, b) => a + b, 0) / weeklyAdherence.length);
  
  // Calculate improvement trend
  const lastWeekAvg = Math.round(weeklyAdherence.slice(0, 6).reduce((a, b) => a + b, 0) / 6);
  const improvement = adherenceLevel - lastWeekAvg;
  
  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { text: "Recovery Champion", variant: "default" as const, icon: "🏆" };
    if (streak >= 14) return { text: "Healing Hero", variant: "secondary" as const, icon: "🌟" };
    if (streak >= 7) return { text: "Wellness Warrior", variant: "outline" as const, icon: "⚡" };
    return { text: "Getting Started", variant: "outline" as const, icon: "🌱" };
  };
  
  const streakBadge = getStreakBadge(streak);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Progress Report</span>
          </DialogTitle>
          <DialogDescription>
            Track your recovery journey and medication adherence
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {completedToday}/{totalMedications}
                </div>
                <Progress value={(completedToday / totalMedications) * 100} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{streak}</div>
                <p className="text-xs text-muted-foreground mt-1">perfect days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Weekly Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{averageAdherence}%</div>
                <div className="flex items-center mt-1">
                  {improvement >= 0 ? (
                    <span className="text-xs text-success">↑ +{improvement}%</span>
                  ) : (
                    <span className="text-xs text-destructive">↓ {improvement}%</span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={streakBadge.variant} className="text-xs">
                  {streakBadge.icon} {streakBadge.text}
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Weekly Adherence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekDays.map((day, index) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                    <div className="flex-1">
                      <Progress value={weeklyAdherence[index]} className="h-2" />
                    </div>
                    <div className="w-12 text-sm font-medium text-right">
                      {weeklyAdherence[index]}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Medication Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Medication Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: medication.color }}
                      />
                      <div>
                        <div className="font-medium">{medication.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {medication.dosage} • {medication.frequency}
                        </div>
                      </div>
                    </div>
                    <Badge variant={medication.takenToday ? "default" : "outline"}>
                      {medication.takenToday ? "✓ Taken Today" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Motivational Section */}
          <Card className="bg-recovery-gradient border-none text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Award className="w-8 h-8 mx-auto" />
                <h3 className="text-lg font-semibold">Keep Going Strong!</h3>
                <p className="text-sm opacity-90">
                  {streak >= 7 
                    ? `Amazing! You've maintained your streak for ${streak} days. Your Recovery Pal is getting stronger!`
                    : `You're doing great! Every dose brings you closer to full recovery.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};