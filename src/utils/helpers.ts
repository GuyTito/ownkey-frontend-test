export const throttle = (func: (...args: any) => void, limit: number) => {
  let lastFunc: number;
  let lastRan: number;
  return (...args: any) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

interface Coordinate {
  lat: number;
  lng: number;
}
export function convertCoordinates(coords: Coordinate[]): string[] {
  return coords.map((coord) => `${coord.lat},${coord.lng}`);
}
