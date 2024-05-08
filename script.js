const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;

let currentSegment = null;
let currentIndex = -1;
let selectedSeg = null; // index of the selected segment
let selectedDiv = null;
let info = null;//info about the length and center of the segment that is being hovered
const eventKeys = {};//{key: color}


/*
const dog = new Image();
dog.src = '/img/dog.jpg';

const person1 = new Image();
person1.src = '/img/person_1.png';
*/
const person2 = new Image();
person2.src = 'img/person_2.png';


const editor = new Editor(canvas);
const physics = new Physics(ctx);

loop();

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //const center = getSkeletonCenter(physics.particles);
  //ctx.drawImage(dog,0,0);
  //ctx.drawImage(person2,10,20,251-40,431-80,0,0,canvas.width,canvas.height);
  
  physics.update(canvas);
  editor.draw();
  if(info){
    const {text,x,y} = info;
    drawText(ctx,text,x,y);
  }

  requestAnimationFrame(loop);
};


function removeSelected(){
  if(selectedSeg===null || !selectedDiv) return;
  selectedDiv.parentNode.removeChild(selectedDiv);
  const seg = physics.segments[selectedSeg];
  seg.color = null;
  seg.keys = null;
  seg.selected = false;
  seg.index = null;
  selectedSeg = null;
  selectedDiv = null;
}

function drawText(ctx,text,x,y){
  // ctx.textAlign='align';
  // ctx.textBaseline='vAlign';
  ctx.font='bold 12px Courier';
  ctx.fillStyle = 'white';
  ctx.fillText(text,x,y);
}
// function getSkeletonCenter(points){
//   if(points.length<=2) return 0;
//   const xCoords = points.map(p=>p.loc.x).sort((a,b)=>a-b);
//   return (xCoords[0]+xCoords[xCoords.length-1])/2;
// }