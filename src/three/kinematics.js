export const strokeNames = ['Intake', 'Compression', 'Power', 'Exhaust'];
export function sliderCrank(angle, r = 0.65, l = 2) {
  return {
    pinX: r * Math.sin(angle),
    pinY: -1.5 + r * Math.cos(angle),
    pistonY: -1.5 + r * Math.cos(angle) + Math.sqrt(l * l - r * r * Math.sin(angle) ** 2),
  };
}
export function strokeIndex(angle) {
  return Math.floor((((angle % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI)) / Math.PI);
}
