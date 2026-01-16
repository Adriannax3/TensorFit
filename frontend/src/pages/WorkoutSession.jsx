import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, theme, Modal } from "antd";

import useTensorPose from "../hooks/useTensorPose";
import useSeriesCounter from "../hooks/useSeriesCounter";
import CameraCanvas from "../components/Workout/CameraCanvas";
import { EXERCISES } from "../utils/workout/chooseWorkout";
import Counter from "../components/Counter";
import TimerCounter from "../components/TimeCounter";
import html2canvas from "html2canvas";
import ShareActivityModal from "../components/ShareActivityModal";

import { createWorkout } from "../services/api";

export default function WorkoutSession() {
  const { token } = theme.useToken();
  const { exerciseId } = useParams();
  const [status, setStatus] = useState("idle"); // "idle" | "countdown" | "running"
  const [countdown, setCountdown] = useState(3);
  const countdownRef = useRef(3);
  const [summaryImage, setSummaryImage] = useState(null);
  const [isShareActivityOpen, setIsShareActivityOpen] = useState(false);

  const { videoRef, canvasRef, debug, toggleDebug, keypoints } =
    useTensorPose();

  const exercise = EXERCISES[exerciseId] || EXERCISES["jumping-jacks"];

  const { count, phase, reset } = useSeriesCounter(
    exercise.strategy,
    keypoints
  );

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const resetRef = useRef(reset);
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  const overlayBg = token.colorBgMask;
  const overlayText = token.colorText;

  const handleStart = () => {
    countdownRef.current = 3;
    setCountdown(3);
    setElapsedSeconds(0);
    setStatus("countdown");
  };

  const handleResetAll = () => {
    resetRef.current();
    setElapsedSeconds(0);
    countdownRef.current = 3;
    setCountdown(3);
    setStatus("idle");
  };

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  const captureSummaryImage = async () => {
    const element = document.getElementById("summary-capture");
  
    const canvas = await html2canvas(element, {
      useCORS: true,
      foreignObjectRendering: false,
      removeContainer: true,
      backgroundColor: "#ffffff",
      scale: 2
    });
  
    return canvas.toDataURL("image/png");
  };

  const handleFinish = async () => {
    setStatus("idle");

    try {
      await createWorkout({
        date: new Date().toISOString(),
        exerciseType: exerciseId,
        counter: count,
        time: elapsedSeconds
      });
      setIsShareActivityOpen(true);

      setTimeout(async () => {
        const imageUrl = await captureSummaryImage();
        setSummaryImage(imageUrl);
        
        handleResetAll();
      }, 50);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };


  useEffect(() => {
    if (status !== "countdown") return;
    
    setCountdown(countdownRef.current);

    const intervalId = setInterval(() => {
      countdownRef.current -= 1;
      const c = countdownRef.current;

      if (c > 0) {
        setCountdown(c);
        return;
      }

      clearInterval(intervalId);
      setCountdown(0);

      setTimeout(() => {
        resetRef.current();
        setStatus("running");
      }, 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [status]);

  const showOverlay = status !== "running";

  let overlayContent = null;
  if (status === "idle") {
    overlayContent = (
      <Button
        type="primary"
        size="large"
        onClick={handleStart}
        style={{
          padding: "12px 32px",
          fontSize: "20px",
          fontWeight: 700,
          borderRadius: "999px",
        }}
      >
        START
      </Button>
    );
  } else if (status === "countdown") {
    const isStart = countdown <= 0;
    overlayContent = (
      <div
        style={{
          fontSize: isStart ? "40px" : "64px",
          fontWeight: 900,
          letterSpacing: "4px",
          color: overlayText,
        }}
      >
        {isStart ? "START!!!" : countdown}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "20px",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/menu" state={{ workoutMenu: true }}>
          <Button type="primary">← Powrót</Button>
        </Link>
        <Button onClick={handleResetAll}>Reset treningu</Button>
        <Button onClick={handleFinish} disabled={elapsedSeconds === 0 && count === 0}>
          Zakończ trening
        </Button>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Counter value={count} />
        <h2 style={{ margin: 0 }}>
          {exercise.label || "right-arm-raise"}
        </h2>
        <TimerCounter seconds={elapsedSeconds} />
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <CameraCanvas videoRef={videoRef} canvasRef={canvasRef} />

        {showOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: overlayBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              userSelect: "none",
            }}
          >
            {overlayContent}
          </div>
        )}
      </div>

      {isShareActivityOpen && (
        <div id="summary-capture" style={{ width: 300 }}>
          <div>Liczba serii:</div>
          <Counter value={count} />
          <div>Czas:</div>
          <TimerCounter seconds={elapsedSeconds} />
        </div>
      )}

      <ShareActivityModal 
        open={isShareActivityOpen}
        title={`Podsumowanie treningu: ${exercise.label}`}
        onClose={() => setIsShareActivityOpen(false)}
          image={summaryImage}
          onSubmit={(payload) => {
            setIsShareActivityOpen(false);
        }}
      />
    </div>
  );
}
