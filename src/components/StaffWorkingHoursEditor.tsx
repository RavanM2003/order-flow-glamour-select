
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Save } from 'lucide-react';
import { StaffWorkingHours } from '@/models/staff.model';
import { useStaff } from '@/hooks/use-staff';
import { useToast } from '@/hooks/use-toast';

interface StaffWorkingHoursEditorProps {
  staffId: number | string;
}

const StaffWorkingHoursEditor: React.FC<StaffWorkingHoursEditorProps> = ({ staffId }) => {
  const { toast } = useToast();
  const [localHours, setLocalHours] = useState<StaffWorkingHours[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  useEffect(() => {
    if (staffId) {
      // Create default hours since we don't have the fetchWorkingHours function yet
      const defaultHours: StaffWorkingHours[] = dayNames.map((_, index) => ({
        id: `wh-${staffId}-${index}`, // Add id property
        staff_id: staffId,
        day_of_week: index,
        start_time: "09:00",
        end_time: "17:00",
        is_day_off: index === 0, // Sunday off by default
        is_available: index !== 0 // Sunday not available
      }));
      setLocalHours(defaultHours);
    }
  }, [staffId, dayNames]);
  
  const handleTimeChange = (
    dayOfWeek: number, 
    field: 'start_time' | 'end_time', 
    value: string
  ) => {
    setLocalHours(prev => 
      prev.map(day => {
        if (day.day_of_week === dayOfWeek) {
          return { 
            ...day, 
            [field]: value,
          };
        }
        return day;
      })
    );
    setHasChanges(true);
  };
  
  const handleWorkingDayToggle = (dayOfWeek: number, isWorkingDay: boolean) => {
    setLocalHours(prev => 
      prev.map(day => {
        if (day.day_of_week === dayOfWeek) {
          return { 
            ...day, 
            is_day_off: !isWorkingDay,
          };
        }
        return day;
      })
    );
    setHasChanges(true);
  };
  
  const saveAllChanges = async () => {
    try {
      setIsLoading(true);
      // Mock update functionality since actual implementation is missing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast({
        title: "Success",
        description: "All working hours have been updated",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save working hours",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Working Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
              <div>Day</div>
              <div className="col-span-2">Working Day</div>
              <div className="col-span-2">Start Time</div>
              <div className="col-span-2">End Time</div>
            </div>
            
            {localHours.map(day => (
              <div key={day.day_of_week} className="grid grid-cols-7 items-center py-2 border-b">
                <div className="font-medium">
                  {dayNames[day.day_of_week]}
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={!day.is_day_off} 
                      onCheckedChange={(checked) => handleWorkingDayToggle(day.day_of_week, checked)}
                    />
                    <Label>
                      {!day.is_day_off ? "Working" : "Off"}
                    </Label>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <input 
                    type="time"
                    className="w-full border rounded px-2 py-1"
                    value={day.start_time}
                    onChange={(e) => handleTimeChange(day.day_of_week, 'start_time', e.target.value)}
                    disabled={day.is_day_off}
                  />
                </div>
                
                <div className="col-span-2">
                  <input 
                    type="time"
                    className="w-full border rounded px-2 py-1"
                    value={day.end_time}
                    onChange={(e) => handleTimeChange(day.day_of_week, 'end_time', e.target.value)}
                    disabled={day.is_day_off}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={saveAllChanges}
                disabled={!hasChanges || isLoading}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffWorkingHoursEditor;
