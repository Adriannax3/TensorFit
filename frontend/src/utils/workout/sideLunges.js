import { angleBetweenPoints } from "../calculations";

export default {
  init() {
    return { lastPhase: "center", activeSide: null }; // 'left' | 'right' | 'center'
  },

  update({ keypoints, count, phase, state }) {
    const LS = keypoints[5],
      RS = keypoints[6]; // shoulders
    const LH = keypoints[11],
      RH = keypoints[12]; // hips
    const LK = keypoints[13],
      RK = keypoints[14]; // knees
    const LA = keypoints[15],
      RA = keypoints[16]; // ankles

    // confidence guard
    const pts = [LS, RS, LH, RH, LK, RK, LA, RA];
    if (pts.some((p) => !p || p.score < 0.5)) {
      return { count, phase: phase || "idle", state };
    }

    // scales
    const shoulderWidth = Math.abs(RS.x - LS.x) || 1;
    const hipsWidth = Math.abs(RH.x - LH.x) || 1;
    const anklesDist = Math.abs(RA.x - LA.x);

    // center of shoulders and hips
    const shoulderCx = (RS.x + LS.x) / 2;
    const hipCx = (RH.x + LH.x) / 2;
    const deltaX = hipCx - shoulderCx;

    // margin
    const shiftEnter = 0.12 * shoulderWidth; // left/rigth
    const shiftExit = 0.06 * shoulderWidth; // center

    // ankles width
    const wideStance = anklesDist > 1.2 * hipsWidth;

    // anglee (hip–knee–ankle)
    const leftKneeAngle = angleBetweenPoints(LH, LK, LA);
    const rightKneeAngle = angleBetweenPoints(RH, RK, RA);

    const bentL = isFinite(leftKneeAngle) && leftKneeAngle < 130;
    const bentR = isFinite(rightKneeAngle) && rightKneeAngle < 130;
    const extL = isFinite(leftKneeAngle) && leftKneeAngle > 155;
    const extR = isFinite(rightKneeAngle) && rightKneeAngle > 155;

    let { lastPhase, activeSide } = state;
    let newPhase = lastPhase;
    let newCount = count;

    // left/right
    const goRight = deltaX > shiftEnter && bentR && extL && wideStance;
    const goLeft = deltaX < -shiftEnter && bentL && extR && wideStance;

    // back to center
    const backCenter = Math.abs(deltaX) < shiftExit && extL && extR;

    if (lastPhase === "center") {
      if (goRight) {
        newPhase = "right";
        activeSide = "right";
      } else if (goLeft) {
        newPhase = "left";
        activeSide = "left";
      }
    } else if (lastPhase === "right") {
      if (backCenter) {
        newPhase = "center";
        if (activeSide === "right") newCount = count + 1;
        activeSide = null;
      }
    } else if (lastPhase === "left") {
      if (backCenter) {
        newPhase = "center";
        if (activeSide === "left") newCount = count + 1;
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
