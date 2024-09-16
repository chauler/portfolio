"use client";
import { motion, useTime } from "framer-motion";
import { useState, useEffect, useLayoutEffect } from "react";
import { clamp } from "~/lib/utils";

export default function BackgroundCanvas() {
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      setWindowDimensions(getWindowDimensions());
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }

  const { width, height } = useWindowDimensions();
  const gridW = 60;
  const gridH = 60;
  const rows = Math.floor(height / gridH);
  const cols = Math.floor(width / gridW);
  const time = useTime();
  time.setCurrent(0);
  const [grid, setGrid] = useState(
    new Array(cols).fill(new Array(rows).fill(Math.random())),
  );

  useLayoutEffect(() => {
    const rows = Math.floor(height / gridH);
    const cols = Math.floor(width / gridW);
    setGrid(new Array(cols).fill(new Array(rows).fill(Math.random())));
  }, [width, height]);

  return (
    <div
      className={`fixed right-0 top-0 z-[-1] grid min-h-full min-w-full overflow-hidden`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((arr: number[], y) => {
        return (
          <>
            {arr.map((val, x) => {
              return (
                <Cell
                  key={`${x},${y}`}
                  x={x}
                  y={y}
                  initial={{
                    activated: Math.random() > 0.98,
                    opacity: Math.random(),
                    scale: Math.random(),
                  }}
                ></Cell>
              );
            })}
          </>
        );
      })}
    </div>
  );
}

function Cell({
  x,
  y,
  initial,
}: {
  x: number;
  y: number;
  initial?: { activated: boolean; scale: number; opacity: number };
}) {
  if (!initial) {
    initial = { activated: false, scale: 0, opacity: 0 };
  }

  const [activated, setActivated] = useState(initial.activated);

  useEffect(() => {
    function RNGActivate() {
      if (!activated && Math.random() > 0.999) {
        setActivated(true);
      }
    }
    const interval = setInterval(RNGActivate, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-white"
      key={`${x},${y}`}
      animate={
        activated ? { scale: 0.9, opacity: 1 } : { scale: 0, opacity: 0 }
      }
      initial={
        initial.activated
          ? { opacity: initial.opacity, scale: initial.scale }
          : { opacity: 0, scale: 0 }
      }
      transition={{ duration: clamp(Math.random() * 20, 7, 20) }}
      onAnimationComplete={() => {
        setActivated(false);
      }}
    ></motion.div>
  );
}
