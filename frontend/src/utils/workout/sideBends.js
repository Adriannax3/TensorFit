export default {
  init() {
    return { lastPhase: "center", activeSide: null }; // "left" | "right" | "center"
  },

  update({ keypoints, count, phase, state }) {
    const LS = keypoints[5];  // left shoulder
    const RS = keypoints[6];  // right shoulder
    const LH = keypoints[11]; // left hip
    const RH = keypoints[12]; // right hip
    const LK = keypoints[13]; // left knee
    const RK = keypoints[14]; // right knee
    const LW = keypoints[9];  // left wrist
    const RW = keypoints[10]; // right wrist

    const pts = [LS, RS, LH, RH, LK, RK, LW, RW];

    // check score
    if (pts.some((p) => !p || p.score < 0.5)) {
      return { count, phase: phase || "idle", state };
    }

    // scales
    const shoulderWidth = Math.abs(RS.x - LS.x) || 1;
    const torsoHeight = Math.abs(((LH.y + RH.y) / 2) - ((LS.y + RS.y) / 2)) || 1;

    // shoulder height difference
    // > 0 left || < 0 right
    const deltaShouldersY = LS.y - RS.y;

    const tiltEnter = 0.18 * shoulderWidth;
    const tiltExit = 0.08 * shoulderWidth;

    const tiltLeftStrong = deltaShouldersY > tiltEnter;
    const tiltRightStrong = deltaShouldersY < -tiltEnter;
    const backToCenter = Math.abs(deltaShouldersY) < tiltExit;

    const leftHandKneeDy = Math.abs(LW.y - LK.y);
    const rightHandKneeDy = Math.abs(RW.y - RK.y);

    const leftReach =
      LW.y > LS.y &&
      leftHandKneeDy < 0.35 * torsoHeight;

    const rightReach =
      RW.y > RS.y &&
      rightHandKneeDy < 0.35 * torsoHeight;

    let { lastPhase, activeSide } = state;
    let newPhase = lastPhase;
    let newCount = count;

    if (lastPhase === "center") {
      if (tiltLeftStrong && leftReach) {
        newPhase = "left";
        activeSide = "left";
      } else if (tiltRightStrong && rightReach) {
        newPhase = "right";
        activeSide = "right";
      }
    }
    else if (lastPhase === "right") {
      if (backToCenter) {
        newPhase = "center";
        if (activeSide === "right") {
          newCount = count + 1;
        }
        activeSide = null;
      }
    }
    else if (lastPhase === "left") {
      if (backToCenter) {
        newPhase = "center";
        if (activeSide === "left") {
          newCount = count + 1;
        }
        activeSide = null;
      }
    }

    return {
      count: newCount,
      phase: newPhase,
      state: { lastPhase: newPhase, activeSide },
    };
  },
};
