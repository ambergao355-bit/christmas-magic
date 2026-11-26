/** Classify normalized MediaPipe hand landmarks without using camera data outside the browser. */
export function classifyHand(points) {
  if (!points || points.length < 21) return 'none';
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const palm=Math.max(distance(points[0],points[9]),.001);
  if(distance(points[4],points[8])/palm<.32)return 'pinch';
  const fingers=[[8,6],[12,10],[16,14],[20,18]];
  const extended=fingers.filter(([tip,pip])=>distance(points[tip],points[0])>distance(points[pip],points[0])*1.17).length;
  if(extended>=3)return 'open';
  if(extended<=1)return 'fist';
  return 'none';
}
export function stableGesture(previous, candidate, now, since, delay=200) {
  return {gesture:candidate, since:previous===candidate?since:now, ready:previous===candidate && now-since>=delay};
}
