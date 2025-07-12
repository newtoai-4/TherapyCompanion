import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const moodEmojis = [
  { value: "sad", emoji: "😢", label: "Sad", color: "bg-red-100 hover:bg-red-200 border-red-200" },
  { value: "anxious", emoji: "😰", label: "Anxious", color: "bg-orange-100 hover:bg-orange-200 border-orange-200" },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-200" },
  { value: "happy", emoji: "😊", label: "Happy", color: "bg-green-100 hover:bg-green-200 border-green-200" },
  { value: "great", emoji: "😄", label: "Great", color: "bg-therapy-teal bg-opacity-20 hover:bg-therapy-teal border-therapy-teal" },
];

export function MoodTracker() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<number[]>([5]);
  const [notes, setNotes] = useState("");

  const { data: recentMoods } = useQuery({
    queryKey: ["/api/mood"],
    retry: false,
  });

  const saveMoodMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMood) {
        throw new Error("Please select a mood");
      }
      await apiRequest('POST', '/api/mood', {
        mood: selectedMood,
        energyLevel: energyLevel[0],
        notes: notes.trim() || null,
      });
    },
    onSuccess: () => {
      toast({
        title: "Mood Saved",
        description: "Your mood check-in has been recorded successfully.",
      });
      setSelectedMood("");
      setEnergyLevel([5]);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save mood entry",
        variant: "destructive",
      });
    },
  });

  const getTodaysMood = () => {
    if (!recentMoods || recentMoods.length === 0) return null;
    const today = new Date().toDateString();
    return recentMoods.find((entry: any) => {
      const entryDate = new Date(entry.createdAt).toDateString();
      return entryDate === today;
    });
  };

  const getWeeklyAverage = () => {
    if (!recentMoods || recentMoods.length === 0) return 0;
    const lastWeek = recentMoods.slice(0, 7);
    const total = lastWeek.reduce((sum: number, entry: any) => sum + (entry.energyLevel || 5), 0);
    return Math.round(total / lastWeek.length);
  };

  const todaysMood = getTodaysMood();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Today's Check-in
          {todaysMood && (
            <span className="text-sm font-normal text-therapy-gray">
              Completed
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysMood ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">
              {moodEmojis.find(m => m.value === todaysMood.mood)?.emoji || "😐"}
            </div>
            <div className="text-sm text-therapy-gray mb-2">
              You're feeling <strong>{todaysMood.mood}</strong> today
            </div>
            <div className="text-xs text-therapy-gray">
              Energy: {todaysMood.energyLevel}/10
            </div>
            {todaysMood.notes && (
              <div className="text-xs text-therapy-gray mt-2 p-2 bg-gray-50 rounded">
                "{todaysMood.notes}"
              </div>
            )}
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-therapy-gray mb-1">Weekly Average Energy</div>
              <div className="text-lg font-semibold text-therapy-teal">
                {getWeeklyAverage()}/10
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                How are you feeling?
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`
                      w-full aspect-square rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center p-1
                      ${selectedMood === mood.value 
                        ? `${mood.color} ring-2 ring-therapy-teal border-therapy-teal` 
                        : `${mood.color} border-gray-200`
                      }
                    `}
                    title={mood.label}
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="text-[10px] font-medium text-gray-600 mt-1">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Energy Level: {energyLevel[0]}/10
              </Label>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-therapy-gray mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Notes (optional)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional thoughts or feelings..."
                rows={2}
                className="text-sm"
              />
            </div>
            
            <Button 
              onClick={() => saveMoodMutation.mutate()}
              disabled={!selectedMood || saveMoodMutation.isPending}
              className="w-full bg-therapy-teal hover:bg-therapy-teal-light text-white"
            >
              {saveMoodMutation.isPending ? "Saving..." : "Save Check-in"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
