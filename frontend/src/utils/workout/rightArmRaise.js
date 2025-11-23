export default {
  init() {
    return { lastPhase: "down" };
  },

  update({ keypoints, count, phase, state }) {
    const RS = keypoints[6]; // right shoulder
    const RW = keypoints[10]; // right wrist
    const RH = keypoints[12]; // right hip

    // check score
    if (
      !RS ||
      !RW ||
      !RH ||
      RS.score < 0.4 ||
      RW.score < 0.4 ||
      RH.score < 0.4
    ) {
      return { count, phase: phase || "idle", state };
    }

    // height of torso
    const torso = Math.abs(RH.y - RS.y) || 1;
    // state "up" if wrist is above shoulder
    const upMargin = 0.05 * torso;
    // state "down" if wirst is below shoulder
    const downMargin = 0.1 * torso;

    const wristAboveShoulder = RW.y < RS.y - upMargin;
    const wristClearlyBelow = RW.y > RS.y + downMargin;

    let newPhase = state.lastPhase;
    let newCount = count;

    if (state.lastPhase === "down" && wristAboveShoulder) {
      newPhase = "up";
    } else if (state.lastPhase === "up" && wristClearlyBelow) {
      newPhase = "down";
      newCount = count + 1;
    }

    return { count: newCount, phase: newPhase, state: { lastPhase: newPhase } };
  },
};
