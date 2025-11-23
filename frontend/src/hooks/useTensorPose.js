import { useEffect, useRef, useState } from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

// 0 - nose
// 1 - left eye
// 2 - right eye
// 3 - left ear
// 4 - right ear
// 5 - left shoulder
// 6 - right shoulder
// 7 - left elbow
// 8 - right elbow
// 9 - left wrist
// 10 - right wrist
// 11 - left hip
// 12 - right hip
// 13 - left knee
// 14 - right knee
// 15 - left ankle
// 16 - right ankle

export default function useTensorPose() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [keypoints, setKeypoints] = useState(null);
  const detectorRef = useRef(null);
  const rafRef = useRef(null);

  const [debug, setDebug] = useState(true);
  const toggleDebug = () => setDebug(!debug);

  useEffect(() => {
    let stream = null;
    let mounted = true;

    async function init() {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        if ("srcObject" in videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          videoRef.current.src = window.URL.createObjectURL(stream);
        }

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay error:", err);
          });
        };
      }
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      await tf.setBackend("webgl");
      await tf.ready();

      detectorRef.current = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        },
      );

      const loop = async () => {
        if (!mounted || !videoRef.current || !detectorRef.current) return;

        try {
          const poses = await detectorRef.current.estimatePoses(
            videoRef.current,
            {
              maxPoses: 1,
              flipHorizontal: true,
            },
          );

          if (poses && poses[0] && poses[0].keypoints) {
            setKeypoints(poses[0].keypoints);

            if (debug && canvasRef.current) {
              const ctx = canvasRef.current.getContext("2d");
              const video = videoRef.current;
              const canvas = canvasRef.current;

              // fit canvas to video
              if (canvas.width !== video.videoWidth)
                canvas.width = video.videoWidth;
              if (canvas.height !== video.videoHeight)
                canvas.height = video.videoHeight;

              ctx.clearRect(0, 0, canvas.width, canvas.height);

              poses[0].keypoints.forEach((kp) => {
                if (kp.score > 0.4) {
                  ctx.beginPath();
                  ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = "limegreen";
                  ctx.fill();
                }
              });
            } else if (canvasRef.current) {
              const ctx = canvasRef.current.getContext("2d");
              ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
              );
            }
          }
        } catch (e) {
          // to do
          console.log(e);
        }

        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    }

    init().catch((e) => console.error("Pose init error:", e));

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (detectorRef.current?.dispose) detectorRef.current.dispose();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [debug]);

  return { videoRef, canvasRef, keypoints, debug, toggleDebug };
}
