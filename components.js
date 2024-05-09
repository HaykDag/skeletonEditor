const colors = ['blue','teal','orange','pink','gold','red','yellow'];
const keyList = document.getElementById('keyList');
const inputBox = document.getElementById('inputBox');
const plusKey = document.getElementById('plus');
const minusKey = document.getElementById('minus');
const inputMin = document.getElementById('min');
const inputMax = document.getElementById('max');
const inputBtn = document.getElementById('inputBtn');
const speedSlider = document.getElementById('speed');

speedSlider.onchange = (e)=>{
  physics.speed = Number(e.target.value);
}

inputBtn.onclick = ()=>{  
  const pKey = plusKey.value.toLowerCase();
  const mKey = minusKey.value.toLowerCase();
  const min = inputMin.value;
  const max = inputMax.value;
  const index = currentIndex;

  if(!pKey || !mKey || !min || !max) return;
  if(Number(min)>=Number(max) || Number(min)<0) return;
  if(pKey==mKey || pKey.length!==1 || mKey.length!==1) return;
  

  const seg = physics.segments[index];
  seg.minLength = min;
  seg.maxLength = max;
  seg.keys = [mKey,pKey];
  
  const div = listItem(mKey,pKey,index);

  let color = 'black';
  const colorKey = `${mKey},${pKey}`; 
  if(eventKeys[colorKey]){
    color = eventKeys[colorKey];
  }else{
    color = colors[(Object.keys(eventKeys).length%colors.length)];
    eventKeys[colorKey] = color;
  } 
  
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
    selectedSeg = index;
    physics.segments[index].selected = true;
  });
  
  div.addEventListener('dblclick',()=>showInputBox(index));

  keyList.append(div);
  
  currentSegment.color = color;

  plusKey.value = '';
  minusKey.value = '';
  inputMin.value = 0;
  inputMax.value = 0;
  inputBox.style.display = 'none';
  currentSegment = null;
};

function showInputBox(index){
  inputBox.style.display = 'flex';
  const seg = physics.segments[index];

  minusKey.value = seg.keys[0];
  plusKey.value = seg.keys[1];
  inputMin.value = seg.minLength;
  inputMax.value = seg.maxLength;
  inputBox.style.left = seg.pointA.loc.x;
  inputBox.style.top = seg.pointA.loc.y;
  plusKey.focus();
  currentSegment = seg;
  currentIndex = index;
};

function listItem(mKey,pKey,index,seg=null){
  const div = document.createElement('div');
  const spanMin = document.createElement('span');
  const spanMax = document.createElement('span');
  const spanLength = document.createElement('span');
  div.className = 'list-item flex';
  spanMin.className = 'minus';
  spanMax.className = 'plus';
  spanLength.className = 'length';
  spanMin.innerText = mKey;
  spanMax.innerText = pKey;
  if(seg){
    currentSegment = seg;
  }else if(currentSegment.index === index){
    const exSeg = document.getElementById(index);
    keyList.removeChild(exSeg);
  }else{
    currentSegment.index = index;
  }
  spanLength.innerText = Math.floor(currentSegment.length)
  div.appendChild(spanMin);
  div.appendChild(spanMax);
  div.appendChild(spanLength);
  div.id = index;

  return div
}