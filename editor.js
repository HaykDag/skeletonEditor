class Editor{
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.segments = [];
    this.selected = null;
    this.tempSeg = null;
    this.hovering = null;
  }

  draw(){
    for(const p of this.particles){
      if(p == this.selected){
        p.draw(this.ctx,'green');
      }else{
        p.draw(this.ctx);
      }
    }
    for(const s of this.segments){
      s.draw(this.ctx);
    }
    if(this.tempSeg){
      this.tempSeg.draw(this.ctx,'yellow')
    }
  }

  addParticle(x,y){
    let point = new Particle({x,y});
    for(const p of this.particles){
      const dist = distance(p.loc,point.loc);
      if(dist<=6){
        point = p;
        if(this.tempSeg){
          let segExist = false;
          for(const s of this.segments){
            if(s.equal(this.tempSeg)){
              segExist = true;
            } 
          }
          if(!segExist && this.selected!==point){
            this.segments.push(new Segment(this.selected,point));
          }
          this.tempSeg = null;
        }
        this.selected = point;
        return;
      } 
    };

    this.particles.push(point);
    if(this.selected){
      this.segments.push(new Segment(this.selected,point));
    };

    this.selected = point;
  }

  reset(){
    this.particles = [];
    this.segments = [];
    this.selected = null;
    this.tempSeg = null;
  }

  animate(){
    /*if I want to keep the particles and segments in the physics
    physics.particles = physics.particles.concat(this.particles);
    physics.segments = physics.segments.concat(this.segments);
    */
   const animateBnt = document.getElementById('animate');
   if(physics.particles.length>0){
    this.particles = physics.particles;
    this.segments = physics.segments;
    animateBnt.innerText = 'Animate';
    physics.reset();
   }else{
    physics.particles = this.particles;
    physics.segments = this.segments;
    animateBnt.innerText = 'Edit'
    editor.reset();
   }
    
  }

  save(){
    const data = JSON.stringify({particles:this.particles,segments:this.segments});
    localStorage.setItem('skeleton',data);
    this.reset();
  }
  load(){
    physics.particles = [];
    physics.segments = [];
    this.reset();
    keyList.innerHTML = ''; 
    const animateBnt = document.getElementById('animate');
    animateBnt.innerText = 'Animate';
    const data = localStorage.getItem('skeleton');
    if(data){
      const {particles,segments} = JSON.parse(data);
      for(const p of particles){
        const particle = new Particle(p.loc);
        this.particles.push(particle);
      }
      for(const s of segments){
        const seg = new Segment(s.pointA,s.pointB);
        seg.keys = s.keys || [];
        seg.minLength = s.minLength;
        seg.maxLength = s.maxLength;
        seg.index = s.index;
        seg.color = s.color;
        
        if(seg.keys.length>0){
          const div = listItem(seg.keys[0],seg.keys[1],seg.index,seg);
          let color = seg.color;
          const colorKey = `${seg.keys[0]},${seg.keys[1]}`; 
          if(eventKeys[colorKey]){
            color = eventKeys[colorKey];
          }else{
            color = colors[(Object.keys(eventKeys).length%colors.length)];
            eventKeys[colorKey] = color;
          } 
          seg.color = color;
          div.style.color = color;
          
          div.addEventListener('click',()=>{
            if(physics.particles.length===0) return;
            if(selectedSeg!==null) physics.segments[selectedSeg].selected = false;
            if(selectedDiv) selectedDiv.classList.remove('selected');
            if(div===selectedDiv) { 
              selectedDiv=null; 
              return;
            };
            div.classList.add('selected');
            selectedDiv = div;
            selectedSeg = seg.index;
            physics.segments[selectedSeg].selected = true;
          });

          div.addEventListener('dblclick',()=>showInputBox(selectedSeg));

          keyList.append(div);
        }

        for(const p of this.particles){
          if(p.equal(seg.pointA)){
            seg.pointA = p;
          }else if(p.equal(seg.pointB)){
            seg.pointB = p;
          }
        }
        this.segments.push(seg);
      }
    }
  }
}