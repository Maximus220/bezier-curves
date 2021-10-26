//PERSONAL P5.JS ADD-ON
//DRAWS SHAPES FROM VECTOR

function elV(v, r){
  ellipse(v.x, v.y, r, r);
}

function rcV(v, s, b=0){
  rect(v.x,v.y,s.x,s.y,b);
}

function sqV(v,s){
  square(v.x,v.y,s);
}

function liV(v0, v1){
  line(v0.x, v0.y, v1.x, v1.y);
}

function tiV(v0,v1,v2){
  triangle(v0.x,v0.y,v1.x,v1.y,v2.x,v2.y);
}

function txV(txt, v){
  text(txt,v.x,v.y);
}

function imV(img, v, s){
  if(s) image(img,v.x,v.y,s.x,s.y);
  else image(img,v.x,v.y);
}

function copyV(v){
  return createVector(v.x,v.y,v.z);
}

function d(v0, v1){
  return dist(v0.x,v0.y,v1.x,v1.y);
}
