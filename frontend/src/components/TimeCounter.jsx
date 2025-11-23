export default function TimerCounter({ seconds = 0 }) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  const mmStr = String(mm).padStart(2, "0");
  const ssStr = String(ss).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Digit digit={mmStr[0]} />
      <Digit digit={mmStr[1]} />

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#7cacf8",
          marginBottom: "6px",
          userSelect: "none",
        }}
      >
        :
      </div>

      <Digit digit={ssStr[0]} />
      <Digit digit={ssStr[1]} />
    </div>
  );
}

function Segment({ on, style }) {
  return (
    <div
      style={{
        position: "absolute",
        background: on ? "#7cacf8" : "#222",
        opacity: on ? 1 : 0.15,
        boxShadow: on ? "0 0 5px #7cacf8" : "none",
        borderRadius: "3px",
        transition: "0.15s",
        ...style,
      }}
    />
  );
}

const DIGITS = {
  "0": [1, 1, 1, 1, 1, 1, 0],
  "1": [0, 1, 1, 0, 0, 0, 0],
  "2": [1, 1, 0, 1, 1, 0, 1],
  "3": [1, 1, 1, 1, 0, 0, 1],
  "4": [0, 1, 1, 0, 0, 1, 1],
  "5": [1, 0, 1, 1, 0, 1, 1],
  "6": [1, 0, 1, 1, 1, 1, 1],
  "7": [1, 1, 1, 0, 0, 0, 0],
  "8": [1, 1, 1, 1, 1, 1, 1],
  "9": [1, 1, 1, 1, 0, 1, 1],
};

function Digit({ digit }) {
  const seg = DIGITS[digit] || DIGITS["0"];

  return (
    <div
      style={{
        position: "relative",
        width: "28px",
        height: "52px",
      }}
    >
      <Segment on={seg[0]} style={{ top: 0, left: "5px", width: "18px", height: "4px" }} />
      <Segment on={seg[1]} style={{ top: "4px", right: 0, width: "4px", height: "18px" }} />
      <Segment on={seg[2]} style={{ bottom: "4px", right: 0, width: "4px", height: "18px" }} />
      <Segment on={seg[3]} style={{ bottom: 0, left: "5px", width: "18px", height: "4px" }} />
      <Segment on={seg[4]} style={{ bottom: "4px", left: 0, width: "4px", height: "18px" }} />
      <Segment on={seg[5]} style={{ top: "4px", left: 0, width: "4px", height: "18px" }} />
      <Segment on={seg[6]} style={{ top: "24px", left: "5px", width: "18px", height: "4px" }} />
    </div>
  );
}
