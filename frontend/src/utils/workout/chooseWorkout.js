import rightArmRaise from "./rightArmRaise";
import jumpingJacks from "./jumpingJacks";
import squat from "./squat";
import sideLunges from "./sideLunges";
import sideBends from "./sideBends";

export const EXERCISES = {
  "right-arm-raise": {
    label: "Podnoszenie prawej ręki",
    strategy: rightArmRaise,
  },
  "jumping-jacks": {
    label: "Pajacyki",
    strategy: jumpingJacks,
  },
  squat: {
    label: "Przysiady",
    strategy: squat,
  },
  "side-lunges": {
    label: "Wykroki w bok",
    strategy: sideLunges,
  },
  "side-bends": {
    label: "Skłony w bok",
    strategy: sideBends,
  },
};
