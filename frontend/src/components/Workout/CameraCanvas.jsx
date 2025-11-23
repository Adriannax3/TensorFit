export default function CameraCanvas({ videoRef, canvasRef }) {
  return (
    <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          height: "70vh",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "70vh",
          width: "auto",
        }}
      />
    </div>
  );
}
