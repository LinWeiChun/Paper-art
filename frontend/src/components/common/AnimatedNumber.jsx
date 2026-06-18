import { useEffect, useState } from 'react';

function AnimatedNumber({ value = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let current = 0;

    const step = Math.max(1, Math.ceil(value / 30));

    const timer = setInterval(() => {
      current += step;

      if (current >= value) {
        current = value;
        clearInterval(timer);
      }

      setDisplay(current);
    }, 40);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="rolling-number" key={display}>
      {display}
    </span>
  );
}

export default AnimatedNumber;
