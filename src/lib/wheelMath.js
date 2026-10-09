/**
 * Mathematical utilities for SVG circular sector rendering and rotation physics.
 */

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  // SVG 0 degrees is at 12 o'clock (subtract 90 degrees)
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

export function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
  // Handle full circle or near-full circle
  const angleDiff = endAngle - startAngle;
  if (angleDiff >= 360) {
    // Return two halves to avoid SVG arc glitch
    const mid = startAngle + 180;
    return `${describeArc(x, y, innerRadius, outerRadius, startAngle, mid)} ${describeArc(x, y, innerRadius, outerRadius, mid, endAngle)}`;
  }

  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const largeArcFlag = angleDiff <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    'Z'
  ].join(' ');
}

export function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

export function calculateSnapDelta(currentRotation, midAngle, targetAngle = 90) {
  const targetRotation = targetAngle - midAngle;
  let delta = targetRotation - currentRotation;
  // Normalize delta to -180..180
  delta = ((delta + 180) % 360 + 360) % 360 - 180;
  return delta;
}

export function describeCurvedTextArc(centerX, centerY, radius, startAngle, endAngle) {
  const midAngle = startAngle + (endAngle - startAngle) / 2;
  const isBottom = midAngle > 90 && midAngle < 270;

  if (isBottom) {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArc = (endAngle - startAngle) <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  } else {
    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, endAngle);
    const largeArc = (endAngle - startAngle) <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }
}
