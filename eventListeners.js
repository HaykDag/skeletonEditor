const events = {
  mouseDown:false,
  keyDown: false,
  canvas:{
    mouse:{x:0,y:0},
  },
  doc:{
    mouse:{x:0,y:0},
  }
}

document.addEventListener('mousemove',(e)=>{
  events.doc.mouse.x = e.clientX;
  events.doc.mouse.y = e.clientY;
});

canvas.addEventListener('mousemove',(e)=>{
  const {offsetX,offsetY} = e;
  events.canvas.mouse = {x:offsetX,y:offsetY};
  //physics
  if(physics.particles.length>0){
    //show info about the length of the seg that is being hovered
    for(const seg of physics.segments){
      const dist = distFromPointToSeg({x:offsetX,y:offsetY},seg);
      info = null;
      if(dist<=5){
        const center = seg.getCenterPoint();
        info = {text:Math.round(seg.length),x:center.x,y:center.y};
        return;
      }
    };
    return;
  } 
    

  editor.hovering = null;
  if(events.mouseDown){ 
    editor.selected.loc = {x:offsetX,y:offsetY};
    editor.selected.oldLoc = {x:offsetX,y:offsetY};
    for(const s of editor.segments){
      if(s.includes(editor.selected)){
        const otherPoint = s.otherPoint(editor.selected);
        const newLength = distance(editor.selected.loc,otherPoint.loc);
        s.length = newLength;
      }
    }
  }else if(editor.selected){
    let point = new Particle({x:offsetX,y:offsetY});
    for(const p of editor.particles){
      const dist = distance(p.loc,point.loc);
      if(dist<=6){
        point = p;
      }
    }
    editor.tempSeg = new Segment(editor.selected,point);
  }else{
    //check if point is being hovered
    for(let i=0;i<editor.particles.length;i++){
      const dist = distance(editor.particles[i].loc,{x:offsetX,y:offsetY});
      if(dist<=6){
        editor.hovering = i;
      }
    }
  }

});

canvas.addEventListener('mousedown',(e)=>{
  if(e.button===2) return;
    
  //left click
  const {offsetX,offsetY} = e;
  events.mouseDown = true;

  //physics
  if(physics.particles.length>0){
    physics.selectSegment(offsetX,offsetY);
  }else{ 
  //editor
  editor.addParticle(offsetX,offsetY);
  }
});

canvas.addEventListener('contextmenu',(e)=>{
  e.preventDefault();
  if(editor.selected) editor.selected = null;
  if(editor.tempSeg)  editor.tempSeg = null;
  if(editor.hovering!==null) {
    for(let i = 0;i<editor.segments.length;i++){
      if(editor.segments[i].includes(editor.particles[editor.hovering])){
        const divItem = document.getElementById(i);
        if(divItem) divItem.parentNode.removeChild(divItem);
        //I shouldn't remove the segment because it will mess up the ids of the corresponding div.
        editor.segments.splice(i,1);
        //decrement ids of all the other divs by one so they correspond their segment
        for(const child of document.getElementById('keyList').children){
          const id = Number(child.id);
          if(id>i){
            //decrement inexes of all segments one so they correspond their divs
            editor.segments[id-1].index = id-1;
            child.id = id-1;
          }
        }
        i--;
      }
    }
    editor.particles.splice(editor.hovering,1);
  }
}); 

canvas.addEventListener('dblclick',(e)=>{
  const {offsetX,offsetY} = e;
  if(!physics.segments.length) return;  
  if(inputBox.style.display==='flex') return;

  inputBox.style.display = 'flex';
  const {closest,closestIndex} = physics.getClosestSeg({x:offsetX,y:offsetY});

  if(closest.keys.length>0){
    minusKey.value = closest.keys[0];
    plusKey.value = closest.keys[1];
  }
  inputMin.value = Math.max(Math.round(closest.length)-10,0);
  inputMax.value = Math.round(closest.length)+10;
  inputBox.style.left = `${events.doc.mouse.x}px`;
  inputBox.style.top = `${events.doc.mouse.y}px`;
  
  plusKey.focus();

  currentSegment = closest;
  currentIndex = closestIndex;
});

document.addEventListener('mouseup',()=>{
  events.mouseDown = false;
});


document.addEventListener('keydown',(e)=>{
  events.keyDown = true;
  if(e.key =='Escape'){
    inputBox.style.display = 'none';
    return;
  } 
  if(inputBox.style.display === 'flex') return;
  
  for(const seg of physics.segments){
    if(seg.keys.length>0){
      if(seg.keys[0] == e.key.toLowerCase()) seg.minOn = true;
      if(seg.keys[1] == e.key.toLowerCase()) seg.maxOn = true;
    }
  }
});

document.addEventListener('keyup',(e)=>{
  events.keyDown = false;
  for(const seg of physics.segments){
    if(seg.keys){
      if(seg.keys[0] === e.key.toLowerCase()) seg.minOn = false;
      if(seg.keys[1] === e.key.toLowerCase()) seg.maxOn = false;
    }
  }
});

//mouseDown - Editor
/*
1.takes coords
2.sets its mouseDown attr to true
3.creates a new Particle with that coords
4.loops through all the particles and if dist is less than 6
  if it is that new particle just assigns to the existing close 
  particle.
  4.1. if there is a temporary segment
    4.1.1 - loops through the segments to see if there is a
            seg with the same points if yes we assign to a
            segExist variable true.
    4.1.2 - checks if segExist is false and the last selected
            point is not the same as new point, then we make a
            new segment with that points and push in the segments.
    4.1.3 - set the tempSeg to null.
  4.2 - set the selectedPoint to be the new point and return;
5.if we didn't return so far that means that there isn't close
  point to the new Point.
  5.1. we push the point to the particles array.
  5.2 - if there is a selected point then we make a new segment
      with that points and push into the segments arr.
  5.3. set the the selected point to be the new point.

*/