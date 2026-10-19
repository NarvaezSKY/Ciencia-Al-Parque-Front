import { useEffect, useRef, useState } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface Props {
  value: number;
  className?: string;
}

function DigitColumn({ digit }: { digit: number }) {
  return (
    <span className="inline-block overflow-hidden" style={{ height: "1em" }}>
      <span
        className="digit-roll flex flex-col"
        style={{ transform: `translateY(-${digit * 10}%)` }}
      >
        {DIGITS.map((item) => (
          <span
            key={item}
            className="flex items-center justify-center"
            style={{ height: "1em", lineHeight: 1 }}
          >
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function AnimatedNumber({ value, className }: Props) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const chars = safe.toString().split("");
  const prev = useRef(safe);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (safe !== prev.current) {
      prev.current = safe;
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 700);
      return () => window.clearTimeout(timer);
    }
  }, [safe]);

  return (
    <span
      className={`inline-flex tabular-nums leading-none ${
        pulse ? "animate-pop" : ""
      } ${className ?? ""}`}
    >
      {chars.map((char, index) => (
        <DigitColumn key={chars.length - index} digit={Number(char)} />
      ))}
    </span>
  );
}
