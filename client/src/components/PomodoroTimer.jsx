import { useState, useEffect, useRef } from "react";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

function PomodoroTimer() {
  const [mode, setMode] = useState("focus"); // "focus" or "break"
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Time's up — switch modes automatically
            const nextMode = mode === "focus" ? "break" : "focus";
            setMode(nextMode);
            return nextMode === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(FOCUS_MINUTES * 60);
  };

  const totalSeconds = mode === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
      <span
        className={`text-xs font-medium px-3 py-1 rounded-full ${
          mode === "focus" ? "bg-gray-900 text-white" : "bg-green-100 text-green-700"
        }`}
      >
        {mode === "focus" ? "Focus Time" : "Break Time"}
      </span>

      <p className="text-5xl font-bold text-gray-900 mt-4 tabular-nums">
        {formatTime(secondsLeft)}
      </p>

      <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-gray-900 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={handleStartPause}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;