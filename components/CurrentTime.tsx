"use client";

import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [hours1, setHours1] = useState("0");
  const [hours2, setHours2] = useState("0");
  const [minutes1, setMinutes1] = useState("0");
  const [minutes2, setMinutes2] = useState("0");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      setHours1(hours[0]);
      setHours2(hours[1]);
      setMinutes1(minutes[0]);
      setMinutes2(minutes[1]);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto w-full">
      <div className="text-center">
        <div className="text-4xl lg:text-5xl font-bold font-mono bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          {hours1}
          {hours2}
          <span className="text-muted-foreground">:</span>
          {minutes1}
          {minutes2}
        </div>
      </div>
    </div>
  );
}
