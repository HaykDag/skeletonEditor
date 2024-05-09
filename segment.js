class Segment{
  constructor(pointA,pointB){
    this.pointA = pointA;
    this.pointB = pointB;
    this.length = distance(pointA.loc,pointB.loc);
    this.color = null;
    this.keys = []; //structure [mKey,pKey];
    this.minLength = this.length-10;
    this.maxLength = this.length+10;
    this.minOn = false;
    this.maxOn = false;
    this.index = null;
    this.selected = false;
  }

  update(){
    if(this.maxOn && this.length<this.maxLength) this.length += physics.speed;
    if(this.minOn && this.length>this.minLength) this.length -= physics.speed;
    if(this.maxOn || this.minOn) {
      const lengthSpan = document.getElementById(this.index).lastChild
      lengthSpan.innerText = Math.floor(this.length);
    }
    const sub = subtract(this.pointA.loc,this.pointB.loc);
    const mag = magnitute(sub);
    const diff = mag-this.length;
    const norm = normalize(sub);

    this.pointA.loc = add(this.pointA.loc,scale(norm,-diff/2));
    this.pointB.loc = add(this.pointB.loc,scale(norm,diff/2));

  }

  draw(ctx,color='white'){
    ctx.beginPath();
    ctx.moveTo(this.pointA.loc.x,this.pointA.loc.y);
    ctx.lineTo(this.pointB.loc.x,this.pointB.loc.y);
    if(this.selected){
      ctx.lineWidth = 5;
    }
    ctx.strokeStyle = this.color ? this.color :color;
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  getCenterPoint(){
    return average(this.pointA.loc,this.pointB.loc);
  }

  equal(seg){
    return (this.pointA.equal(seg.pointA) && this.pointB.equal(seg.pointB)) ||
           (this.pointA.equal(seg.pointB) && this.pointB.equal(seg.pointA)) 
  }

  includes(point){
    return this.pointA===point || this.pointB===point;
  }

  otherPoint(point){
    if(this.pointA===point){
      return this.pointB;
    }else if(this.pointB===point){
      return this.pointA;
    }
  }
}