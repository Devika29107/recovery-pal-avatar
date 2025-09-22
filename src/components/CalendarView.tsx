import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  takenToday: boolean;
  color: string;
}

interface CalendarViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medications: Medication[];
}

// Mock schedule data - in real app this would come from backend
const generateSchedule = (medications: Medication[]) => {
  const schedule: { [key: string]: { medication: Medication; time: string }[] } = {};
  
  // Generate schedule for next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    schedule[dateKey] = [];
    
    medications.forEach(med => {
      if (med.frequency === "1x daily") {
        schedule[dateKey].push({ medication: med, time: "09:00 AM" });
      } else if (med.frequency === "2x daily") {
        schedule[dateKey].push(
          { medication: med, time: "09:00 AM" },
          { medication: med, time: "09:00 PM" }
        );
      } else if (med.frequency === "3x daily") {
        schedule[dateKey].push(
          { medication: med, time: "08:00 AM" },
          { medication: med, time: "02:00 PM" },
          { medication: med, time: "08:00 PM" }
        );
      } else if (med.frequency === "4x daily") {
        schedule[dateKey].push(
          { medication: med, time: "08:00 AM" },
          { medication: med, time: "12:00 PM" },
          { medication: med, time: "04:00 PM" },
          { medication: med, time: "08:00 PM" }
        );
      }
    });
  }
  
  return schedule;
};

export const CalendarView = ({ open, onOpenChange, medications }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const schedule = generateSchedule(medications);
  
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateSchedule = schedule[selectedDateKey] || [];
  
  // Get dates that have medications scheduled
  const datesWithMeds = Object.keys(schedule).filter(
    dateKey => schedule[dateKey].length > 0
  ).map(dateKey => new Date(dateKey));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>Medication Calendar</span>
          </DialogTitle>
          <DialogDescription>
            View your medication schedule and track your progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                hasMeds: datesWithMeds,
              }}
              modifiersStyles={{
                hasMeds: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 'bold',
                }
              }}
              className="rounded-md border pointer-events-auto"
            />
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary/10 border border-primary"></div>
                <span>Days with medications</span>
              </div>
            </div>
          </div>
          
          {/* Schedule for selected date */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Schedule for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            {selectedDateSchedule.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No medications scheduled for this day
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {selectedDateSchedule.map((item, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: item.medication.color }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {item.medication.name}
                        </CardTitle>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.medication.dosage}</span>
                        {isSameDay(selectedDate, new Date()) && item.medication.takenToday && (
                          <Badge variant="default" className="bg-success text-success-foreground">
                            ✓ Taken
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};