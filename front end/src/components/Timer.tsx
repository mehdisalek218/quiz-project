
import { useEffect, useState } from "react";

interface TimerProps {
  durationSeconds: number;
  onTimeExpired: () => void;
}

export const Timer = ({ durationSeconds, onTimeExpired }: TimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    setSecondsLeft(durationSeconds);
    setIsRunning(true);
  }, [durationSeconds]);
  
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, onTimeExpired]);
  
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  
  const percentageLeft = (secondsLeft / durationSeconds) * 100;
  
  // Determine color based on time left
  let color = "bg-green-500";
  if (percentageLeft < 30) {
    color = "bg-red-500";
  } else if (percentageLeft < 60) {
    color = "bg-orange-500";
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-semibold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${percentageLeft}%` }}
        ></div>
      </div>
    </div>
  );
};
