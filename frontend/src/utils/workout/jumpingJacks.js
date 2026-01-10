export default {
  init() {
    return { lastPhase: "down" };
  },

  update({ kp, count, phase, state }) {
    const RS = kp[6]; // right shoulder
    const RW = kp[10]; // right wrist
    const RH = kp[12]; // right hip
    const RA = kp[16]; // right ankle
    const LS = kp[5]; // left shoulder
    const LW = kp[9]; // left wrist
    const LH = kp[11]; // left hip
    const LA = kp[15]; // left ankle

    // check score
    if (
      !RS ||
      !RW ||
      !RH ||
      !RA ||
      !LA ||
      !LS ||
      !LW ||
      !LH ||
      RS.score < 0.4 ||
      RW.score < 0.4 ||
      RH.score < 0.4 ||
      RA.score < 0.4 ||
      LA.score < 0.4 ||
      LS.score < 0.4 ||
      LW.score < 0.4 ||
      LH.score < 0.4
    ) {
      return { count, phase: phase || "idle", state };
    }

    // height of torso
    const torso = Math.abs(RH.y - RS.y) || 1;
    // state "up" if wrist is above shoulder
    const upMarginArms = 0.3 * torso;
    // state "down" if wirst is below shoulder
    const downMarginArms = 0.3 * torso;
    // width of hips
    const widthHips = Math.abs(LH.x - RH.x) || 1;
    // state "connected" if ankles are close together
    const connectedAnkles = Math.abs(RA.x - LA.x) <= widthHips;
    // state "disconnected" if ankles are far apart
    const disconnectedAnkles = Math.abs(RA.x - LA.x) > 1.5 * widthHips;

    const wristAboveShoulder =
      RW.y < RS.y - upMarginArms && LW.y < LS.y - upMarginArms;
    const wristClearlyBelow =
      RW.y > RS.y + downMarginArms && LW.y > LS.y + downMarginArms;
    const anklesConnected = connectedAnkles;
    const anklesDisconnected = disconnectedAnkles;

    let newPhase = state.lastPhase;
    let newCount = count;

    if (
      state.lastPhase === "down" &&
      wristAboveShoulder &&
      anklesDisconnected
    ) {
      newPhase = "up";
    } else if (
      state.lastPhase === "up" &&
      wristClearlyBelow &&
      anklesConnected
    ) {
      newPhase = "down";
      newCount = count + 1;
    }

    return { count: newCount, phase: newPhase, state: { lastPhase: newPhase } };
  },
};
