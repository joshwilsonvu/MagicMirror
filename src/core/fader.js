import React from "react";
import posed, { PoseGroup } from "react-pose";

const defaultSpeed = 750;
const durationFn = ({ speed }) => defaultSpeed; //({ duration: typeof speed === 'number' ? speed : defaultSpeed });

export const FadeTransition = posed.div({
  enter: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  },
  exit: {
    opacity: 0
  },
  initialPose: "exit"
});

export const Fader = ({children, speed, ...rest}) => {
  return (
    <PoseGroup>
      <FadeTransition key={children} speed={speed}>
        {children}
      </FadeTransition>
    </PoseGroup>
  )
};

export const FaderGroup = PoseGroup;