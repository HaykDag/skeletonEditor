class Physics {
  static G = {x:0,y:0.08};
  constructor(ctx) {
    this.particles = [];
    this.segments = [];
    this.ctx = ctx;
    this.speed = 2;
  }

  update(canvas) {
    for (const p of this.particles) {
      p.update(canvas);
      p.draw(this.ctx);
    }
    for (const s of this.segments) {
      s.update();
      s.draw(this.ctx);
    }
  }

  selectSegment(x,y){
    const {closest} = this.getClosestSeg({x,y});
    if(selectedSeg!==null) this.segments[selectedSeg].selected = false;
    if(selectedDiv) selectedDiv.classList.remove('selected');
    
    if(closest && closest.keys.length>0){
      const listItem = document.getElementById(closest.index);
      listItem.classList.add('selected');
      closest.selected = true;
      selectedDiv = listItem;
      selectedSeg = closest.index;
    }
  }

  getClosestSeg(point){
    let minDist = 10000;
    let closest = null;
    let closestIndex = -1;
  
    for(let i = 0;i<this.segments.length;i++){
      if(this.segments[i].selected) this.segments[i].selected = false;
      const dist = distFromPointToSeg(point,this.segments[i]);
      if(dist<minDist){
        minDist = dist;
        closest = this.segments[i];
        closestIndex = i;
      }
    }
    return {closest,closestIndex};
  }
  
  reset(){
    this.particles = [];
    this.segments = [];
    currentSegment = null;
    currentIndex = -1;
    selectedSeg = null;
    selectedDiv = null;
  }

}
