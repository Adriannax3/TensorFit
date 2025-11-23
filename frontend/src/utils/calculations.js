export function angleBetweenPoints(a, b, c) {
  // to do
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };

  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  const cosine = dot / (mag1 * mag2);
  const angleRad = Math.acos(Math.min(Math.max(cosine, -1), 1));

  return (angleRad * 180) / Math.PI;
}
