export function angleBetweenPoints(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  const cosine = dot / (mag1 * mag2);
  const angleRad = Math.acos(Math.min(Math.max(cosine, -1), 1));

  return (angleRad * 180) / Math.PI;
}

export function decodeImage(image) {
  if (!image) return null;

  if (typeof image === "string") {
    if (image.startsWith("data:")) {
      return image;
    }
    return `data:image/png;base64,${image}`;
  }

  if (image?.data && Array.isArray(image.data)) {
    const uint8 = new Uint8Array(image.data);
    const binary = uint8.reduce((s, b) => s + String.fromCharCode(b), "");
    const base64 = btoa(binary);
    return `data:image/png;base64,${base64}`;
  }

  return null;
}