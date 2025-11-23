import { angleBetweenPoints } from "../calculations";

export default {
  init() {
    return { lastPhase: "down" };
  },

  update({ keypoints, count, phase, state }) {
    const LH = keypoints[11]; // left hip
    const LK = keypoints[13]; // left knee
    const LA = keypoints[15]; // left ankle
    const RH = keypoints[12]; // right hip
    const RK = keypoints[14]; // right knee
    const RA = keypoints[16]; // right ankle

    // check score
    if (
      !LH ||
      !LK ||
      !LA ||
      !RH ||
      !RK ||
      !RA ||
      LH.score < 0.4 ||
      LK.score < 0.4 ||
      LA.score < 0.4 ||
      RH.score < 0.4 ||
      RK.score < 0.4 ||
      RA.score < 0.4
    ) {
      return { count, phase: phase || "idle", state };
    }

    const ankleeKneeHipAngle_left = angleBetweenPoints(LH, LK, LA);
    const ankleeKneeHipAngle_right = angleBetweenPoints(RH, RK, RA);

    let newPhase = state.lastPhase;
    let newCount = count;

    if (
      state.lastPhase === "down" &&
      (ankleeKneeHipAngle_left > 150 || ankleeKneeHipAngle_right > 150)
    ) {
      newPhase = "up";
    } else if (
      state.lastPhase === "up" &&
      ankleeKneeHipAngle_left < 110 &&
      ankleeKneeHipAngle_right < 110
    ) {
      newPhase = "down";
      newCount = count + 1;
    }

    return { count: newCount, phase: newPhase, state: { lastPhase: newPhase } };
  },
};
