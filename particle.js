class Particle {
  constructor(loc) {
    this.loc = loc,
    this.oldLoc = { x: loc.x, y: loc.y }; 
  }

  update(canvas={}) {
    const vel = subtract(this.loc, this.oldLoc);
    
    
    const newLoc = events.keyDown ? add(this.loc, vel) : add(add(this.loc, vel), Physics.G);
    
    if(newLoc.x<0) newLoc.x = 0;
    if(newLoc.x>canvas.width) newLoc.x = canvas.width;
    this.oldLoc = this.loc;
    this.loc = newLoc;
    if(this.loc.y>=canvas.height*0.95) {
      this.loc = {x:this.loc.x,y:canvas.height*0.98}
      this.oldLoc = this.loc
    };
  }

  draw(ctx, color = "grey") {
    ctx.beginPath();
    ctx.arc(this.loc.x, this.loc.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  equal(p){
    return (this.loc.x === p.loc.x && this.loc.y === p.loc.y) || 
           (this.loc.x === p.loc.y && this.loc.y === p.loc.x); 
  }
}
