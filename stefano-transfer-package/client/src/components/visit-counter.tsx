import { useEffect, useState } from "react";

export default function VisitCounter() {
  const [count, setCount] = useState(0);
  const targetCount = 12847;

  useEffect(() => {
    const increment = targetCount / 100;
    let currentCount = 0;

    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentCount));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [targetCount]);

  return (
    <div className="fixed bottom-8 right-8 bg-stefano-gray/80 backdrop-blur-sm px-6 py-4 rounded-lg animate-counter z-40">
      <div className="text-center">
        <div className="stefano-gold text-2xl font-bold">
          {count.toLocaleString()}
        </div>
        <div className="text-sm opacity-80">Odwiedziny dzisiaj</div>
      </div>
    </div>
  );
}
