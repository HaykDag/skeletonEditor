function subtract(A, B) {
  return {
    x: A.x - B.x,
    y: A.y - B.y,
  };
}
function add(A, B) {
  return {
    x: A.x + B.x,
    y: A.y + B.y,
  };
}

function distance(A,B){
  return Math.sqrt((A.x-B.x)**2+(A.y-B.y)**2);
}

function average(p1,p2){
  return {
    x:(p1.x+p2.x)/2,
    y:(p1.y+p2.y)/2
  }
}

function magnitute(A){
  //return distance(A,{x:0,y:0});
  return Math.sqrt(A.x**2 + A.y**2);
}

function scale(V,scalar){
  return {
    x: V.x*scalar,
    y: V.y*scalar
  }
}

function normalize(V){
  const mag = magnitute(V);
  return scale(V,1/mag);
}

function dot(A,B){
  return A.x*B.x+A.y*B.y
}

function lerp(A,B,t){
  return A+(B-A)*t;
}
function lerp2D(A,B,t){
  return {x:lerp(A.x,B.x,t),y:lerp(A.y,B.y,t)}
}

function distFromPointToSeg(p, seg) {
  const A = seg.pointA.loc;
  const B = seg.pointB.loc;

  const AB = subtract(B, A);
  const AP = subtract(p, A);
  const nAB = normalize(AB);

  const t = dot(AP, nAB) / distance(A, B);

  const M = lerp2D(A, B, t);

  let dist = distance(p, M);
  if (t <= 0) {
    dist = distance(A, p);
  } else if (t >= 1) {
    dist = distance(B, p);
  }
  return dist;
}
