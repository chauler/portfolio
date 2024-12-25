"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function BackgroundCanvas() {
  return (
    //The encompassing div has its height/width and positions set so that there is space for the svg filters to bleed into. Having the container cut off at the screen affects the blurring

    <div className="fixed -z-10 h-screen w-screen overflow-hidden blur-3xl">
      <div className="h-full w-full bg-black/90">
        <div className="absolute bottom-[10vh] right-[10vw] z-[-1] min-h-[110vh] w-[110vw] overflow-visible [filter:url('#fancy-goo')]">
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell></Cell>
        </div>
      </div>
      <svg className="h-0 w-0">
        <defs>
          <filter id="fancy-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="50"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -20"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function Cell() {
  const [left, setLeft] = useState(Math.random() * 100);
  const [top, setTop] = useState(Math.random() * 100);
  const [duration, setDuration] = useState(Math.random() * 25 + 30);

  return (
    <motion.div
      className="absolute aspect-square w-[max(24rem,25%)] rounded-full bg-white"
      initial={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        left: `${left}%`,
        top: `${top}%`,
        transition: { ease: "easeInOut", duration: duration },
      }}
      onAnimationComplete={() => {
        const newLeft = Math.random() * 100;
        const newTop = Math.random() * 100;
        //All durations are calculated relative to the length travelled during the animation in order to keep velocities equal.
        //Calculate hypotenuse (range of 0-141), divide by 4 (range 0-35), add 30 (range 25-55)
        const newDuration =
          Math.hypot(newLeft - left, newTop - top) / 5.64 + 30;
        setDuration(newDuration);
        setLeft(newLeft);
        setTop(newTop);
      }}
    ></motion.div>
  );
}
