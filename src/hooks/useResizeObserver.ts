import { useState, useEffect, RefObject } from "react";

interface Dimensions {
  height: number;
  width: number;
}

export default function useResizeObserver(refToObserve: RefObject<HTMLElement>): Dimensions | null {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { height, width } = entries[0].contentRect;
      setDimensions({ height, width });
    });

    if (refToObserve.current) {
      observer.observe(refToObserve.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [refToObserve]);

  return dimensions;
}
