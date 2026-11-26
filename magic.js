
import {classifyHand,stableGesture} from './gestures.mjs';
'use strict';
(()=>{
const canvas=document.getElementById('scene'), gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
if(!gl){document.getElementById('fallback').hidden=false;return;}
const vs=`precision mediump float;attribute vec3 aPos;attribute vec3 aCol;attribute float aSize;attribute float aKind;attribute float aPhase;
uniform float uTime,uYaw,uPitch,uDistance,uAspect,uScale,uMobile;uniform vec4 uWeights;varying vec3 vCol;varying float vKind;varying float vPhase;
void main(){vec3 p=aPos;float k=aKind;if(k==5.){p.z=mod(p.z-uTime*(.38+aPhase*.05)+8.,20.)-3.;p.x+=sin(uTime*.3+aPhase)*.35;}
if(k==1.||k==2.||k==3.||k==4.){
float q=aPhase*13.71+dot(aPos,vec3(7.13,3.41,9.37));
float h=fract(sin(q*12.9898)*43758.5453);float j=fract(sin(q*4.137)*12345.678);
float theta=aPhase;float tube=(k==2.)?.53:(.26+.43*h);float beta=(k==2.)?theta*9.:q;
vec3 wreath=vec3((3.25+tube*cos(beta))*sin(theta),tube*sin(beta),4.6+(3.25+tube*cos(beta))*cos(theta));
float t=clamp((aPos.z-.88)/8.62,0.,1.);float r=3.72*pow(1.-t,.9);float spiralAngle=t*6.2831853*3.3;float fuzz=(h-.5)*((k==2.)?.10:.38);
vec3 spiral=vec3((r+fuzz)*cos(spiralAngle),(r+fuzz)*sin(spiralAngle),.88+8.62*t+(j-.5)*.18);
float edge=floor(theta/6.2831853*10.);float f=fract(theta/6.2831853*10.);float aa=edge*.62831853;float ab=(edge+1.)*.62831853;float ra=mod(edge,2.)<.5?3.9:1.75;float rb=mod(edge+1.,2.)<.5?3.9:1.75;
vec2 outline=mix(vec2(sin(aa),cos(aa))*ra,vec2(sin(ab),cos(ab))*rb,f);
float fill=(k==2.)?1.:sqrt(.05+.95*h);vec3 star=vec3(outline.x*fill,(j-.5)*.55,4.6+outline.y*fill);
p=aPos*uWeights.x+wreath*uWeights.y+spiral*uWeights.z+star*uWeights.w;
}
float ang=uYaw+((k==0.)?uTime*.008:(uTime*.035*(uWeights.x+uWeights.z)+sin(uTime*.20)*.16*(uWeights.y+uWeights.w)));float c=cos(ang),s=sin(ang);vec2 xy=mat2(c,-s,s,c)*p.xy;p.xy=xy;
float z=p.z-4.1;float depth=uDistance+p.y*cos(uPitch)-z*sin(uPitch);float y=p.y*sin(uPitch)+z*cos(uPitch);
float f=2.35;gl_Position=vec4(p.x*f/uAspect+(1.-uMobile)*depth*.22,y*f-uMobile*depth*.20,depth*.01,depth);
gl_PointSize=clamp(aSize*uScale/depth,1.,k==9.?160.:36.);
vCol=mix(aCol,vec3(1.15,.70,.13),uWeights.w*.85);if(k==9.)vCol*=uWeights.x+uWeights.z;if(k==6.)vCol*=uWeights.y;vKind=k;vPhase=aPhase;}`;
const fs=`precision mediump float;varying vec3 vCol;varying float vKind;varying float vPhase;uniform float uTime;
float star(vec2 p){vec2 a=vec2(0.,.82);float inside=0.;float md=10.;for(int i=1;i<=10;i++){float t=float(i)*.62831853;float r=mod(float(i),2.)<.5?.82:.36;vec2 b=vec2(sin(t),cos(t))*r;vec2 e=b-a;vec2 w=p-a;md=min(md,length(w-e*clamp(dot(w,e)/dot(e,e),0.,1.)));if((a.y>p.y)!=(b.y>p.y)){float x=a.x+(p.y-a.y)*(b.x-a.x)/(b.y-a.y);if(p.x<x)inside=1.-inside;}a=b;}return inside>.5?-md:md;}
void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.)discard;float k=vKind;float pulse=.85+.15*sin(uTime*1.7+vPhase*7.);vec3 col=vCol;float light;
if(k==9.){float d=star(vec2(p.x,-p.y)*1.25);float body=1.-smoothstep(-.015,.015,d);float halo=exp(-max(d,0.)*8.)*.24;col=mix(vec3(1.,.32,.025),vec3(1.,.91,.55),exp(-r*9.))*vCol.r;light=body+halo;}
else{light=exp(-r*(k==4.?10.:15.))+.035*exp(-r*3.);if(k==3.){light=exp(-r*10.)+.08*exp(-r*2.5);col+=vec3(.3,.12,.01)*exp(-r*40.);}if(k==4.)light+=.12*(exp(-abs(p.x)*28.)*exp(-abs(p.y)*3.)+exp(-abs(p.y)*28.)*exp(-abs(p.x)*3.));}
gl_FragColor=vec4(col*light*pulse,1.);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
try{
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
let seed=2026;function rand(){seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;}const mix=(a,b)=>a+(b-a)*rand();const points=[];
function add(x,y,z,col,size,kind){points.push(x,y,z,...col,size,kind,rand()*6.283);}
function helix(t){const a=2*Math.PI*4.85*t+.35,r=3.72*Math.pow(1-t,.9);return[r*Math.cos(a),r*Math.sin(a),.88+8.62*t];}
// Emerald tree volume, independent of the red spiral ribbon.
for(let i=0;i<19000;i++){let t=Math.pow(rand(),1.2)*.97,r=3.72*Math.pow(1-t,.9)*Math.sqrt(rand()),a=rand()*6.283;add(r*Math.cos(a),r*Math.sin(a),.88+8.62*t,[mix(.035,.10),mix(.80,1.65),mix(.12,.35)],mix(.045,.10),1);}
// Ruby-red ribbons, bright fine threads and a soft trailing edge.
for(let i=0;i<22000;i++){let t=rand(),p=helix(t),a=2*Math.PI*4.85*t+.35,w=(rand()-.5)*.65*Math.sqrt(1-t),r=Math.hypot(p[0],p[1])-w*.4;add(r*Math.cos(a),r*Math.sin(a),p[2]+w,[mix(.72,1.35),mix(.012,.055),mix(.025,.075)],mix(.045,.1),2);}
for(let i=0;i<5000;i++){let t=rand()*.94,p=helix(t);add(p[0]+mix(-.12,.12),p[1]+mix(-.12,.12),p[2]-mix(.08,.55),[mix(.3,.65),.015,.035],mix(.03,.075),2);}
// Warm orange ornaments and flares.
for(let i=0;i<730;i++){let t=rand()*.93,r=3.72*Math.pow(1-t,.9)*Math.sqrt(mix(.15,1)),a=rand()*6.283;add(r*Math.cos(a),r*Math.sin(a),.88+8.62*t,[mix(1.3,2.),mix(.35,.72),mix(.025,.09)],mix(.12,.30),i%5?3:4);}
// A wide, feathered galaxy floor with broken orbital rings.
for(let i=0;i<24000;i++){let ring=Math.floor(rand()*12),base=2+ring*1.12,a=rand()*6.283,r=i%3?base+mix(-.18,.18):Math.sqrt(mix(5,260)),fade=Math.max(.08,1-Math.pow(r/18,3)),v=mix(.55,1.65)*fade;add(r*Math.cos(a),r*Math.sin(a),mix(-.03,.06),[v,v*mix(.4,.7),v*.13],mix(.035,.105),0);}
for(let i=0;i<750;i++){let a=rand()*6.283,r=Math.sqrt(mix(9,260));add(r*Math.cos(a),r*Math.sin(a),.08,[1.1,.55,.12],mix(.09,.18),4);}
// Floating stars and falling snow.
for(let i=0;i<1500;i++){add(mix(-32,32),mix(-15,28),mix(-4,28),[mix(.5,1.1),mix(.35,.7),mix(.15,.38)],mix(.06,.15),5);}
// A ruby ribbon bow appears at the top of the wreath.
for(let i=0;i<1800;i++){let a=rand()*6.283,side=i%2?1:-1;add(side*(.14+.88*(1-Math.cos(a))*.5),mix(-.08,.08),7.68+.40*Math.sin(a)+mix(-.06,.06),[1.4,.018,.045],mix(.045,.085),6);}
for(let i=0;i<600;i++){let t=rand(),side=i%2?1:-1;add(side*(.12+t*.5)+mix(-.08,.08),mix(-.09,.09),7.65-t*1.12,[1.2,.015,.035],mix(.04,.075),6);}
add(0,0,9.93,[1.,.65,.15],2.5,9);
const data=new Float32Array(points);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
for(const [name,n,offset]of[['aPos',3,0],['aCol',3,3],['aSize',1,6],['aKind',1,7],['aPhase',1,8]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,9*4,offset*4);}
const uniforms={};for(const n of['uTime','uYaw','uPitch','uDistance','uAspect','uScale','uMobile','uWeights'])uniforms[n]=gl.getUniformLocation(program,n);
gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(.002,.008,.005,1);
let targetShape=0;const shapeWeights=[1,0,0,0];
let yaw=0,pitch=.43,distance=23,time=0,last=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,drag=null;
const button=document.getElementById('motion');function syncButton(){button.textContent=paused?'▶':'Ⅱ';button.setAttribute('aria-label',paused?'Play animation':'Pause animation');button.setAttribute('aria-pressed',String(paused));}syncButton();button.onclick=()=>{paused=!paused;syncButton();};
canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.006;pitch=Math.min(1.05,Math.max(-.05,pitch+(e.clientY-drag[1])*.004));drag=[e.clientX,e.clientY];};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};canvas.addEventListener('wheel',e=>{e.preventDefault();distance=Math.min(34,Math.max(16,distance+e.deltaY*.012));},{passive:false});
const $=id=>document.getElementById(id);
let noticeTimer, stream=null, detector=null, cameraGeneration=0, lastDetection=0, lastVideoTime=-1, gesture='none', gestureSince=0, lastAction=0;
function notice(text){$('notice').textContent=text;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{$('notice').textContent='';},7000);}
const shapeNames=['Tree','Wreath','Spiral','Star'];
const captions=['A little Christmas magic, just for you.','A circle of warmth. A season of wonder.','Let a little magic find its way to you.','You make the season brighter.'];
function setShape(index){targetShape=index;shapeNames.forEach((name,i)=>{const b=$(name.toLowerCase());b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});$('scene-caption').textContent=captions[index];}
shapeNames.forEach((name,i)=>$(name.toLowerCase()).onclick=()=>setShape(i));
function stopCamera(){cameraGeneration++;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('webcam').srcObject=null;$('camera-panel').hidden=true;$('camera').textContent='Enable gestures';$('camera').setAttribute('aria-pressed','false');$('camera').disabled=false;gesture='none';}
$('stop-camera').onclick=stopCamera;
$('camera').onclick=async()=>{if(stream){stopCamera();return;}const generation=++cameraGeneration;$('camera').disabled=true;$('camera').textContent='Loading…';notice('Allow your camera to use gestures: fist for Tree, open palm for Wreath, pinch for Star. Video stays on your device.');try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera unavailable');if(!detector){const {FilesetResolver,HandLandmarker}=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/+esm');const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm');detector=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.55,minTrackingConfidence:.5});}if(generation!==cameraGeneration)return;stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});if(generation!==cameraGeneration){stopCamera();return;}$('webcam').srcObject=stream;await $('webcam').play();lastVideoTime=-1;$('camera-panel').hidden=false;$('camera').textContent='Disable gestures';$('camera').setAttribute('aria-pressed','true');$('hand-status').textContent='Hold your hand in the frame';}catch(error){stopCamera();notice(error.name==='NotAllowedError'?'Camera access was not allowed. Use the shape buttons below.':'Gestures could not start. Check your camera and connection, or use the shape buttons.');console.warn('Gesture initialization:',error.message);}finally{if(generation===cameraGeneration)$('camera').disabled=false;}};
function trackHands(now){if(!stream||!detector||$('webcam').readyState<2||now-lastDetection<100||lastVideoTime===$('webcam').currentTime)return;lastDetection=now;lastVideoTime=$('webcam').currentTime;try{const result=detector.detectForVideo($('webcam'),now),p=result.landmarks[0];drawHand(p);if(!p){$('hand-status').textContent='Hold your whole hand in the frame';gesture='none';return;}const candidate=classifyHand(p),stable=stableGesture(gesture,candidate,now,gestureSince);gesture=stable.gesture;gestureSince=stable.since;$('hand-status').textContent=({open:'Open palm · Wreath',fist:'Fist · Tree',pinch:'Pinch · Star',none:'Open palm / fist / pinch'})[candidate];if(!stable.ready||now-lastAction<900)return;if(candidate==='open'){setShape(1);lastAction=now;}if(candidate==='fist'){setShape(0);lastAction=now;}if(candidate==='pinch'){setShape(3);lastAction=now;}}catch(error){console.warn('Hand tracking paused:',error.message);stopCamera();notice('Hand tracking stopped. The shape buttons are still available.');}}
function drawHand(points){const c=$('hand-overlay');c.width=$('webcam').videoWidth||640;c.height=$('webcam').videoHeight||480;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);if(!points)return;ctx.strokeStyle='#dfc992';ctx.lineWidth=2;for(const chain of[[0,1,2,3,4],[0,5,6,7,8],[5,9,10,11,12],[9,13,14,15,16],[13,17,18,19,20],[0,17]]){ctx.beginPath();chain.forEach((i,j)=>{const p=points[i];if(j)ctx.lineTo(p.x*c.width,p.y*c.height);else ctx.moveTo(p.x*c.width,p.y*c.height);});ctx.stroke();}ctx.fillStyle='#b8ddaf';for(const p of points){ctx.beginPath();ctx.arc(p.x*c.width,p.y*c.height,3,0,Math.PI*2);ctx.fill();}}
addEventListener('pagehide',stopCamera);

function frame(now){const dt=last?Math.min((now-last)/1000,.08):0;last=now;if(!paused)time+=dt;shapeWeights.forEach((v,i)=>shapeWeights[i]=v+((i===targetShape?1:0)-v)*(1-Math.exp(-dt*3.4)));const mobile=innerWidth<760,dpr=Math.min(devicePixelRatio||1,2),w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uYaw,yaw);gl.uniform1f(uniforms.uPitch,pitch);gl.uniform1f(uniforms.uDistance,mobile?distance+16:distance);gl.uniform1f(uniforms.uAspect,w/h);gl.uniform1f(uniforms.uScale,h*1.17);gl.uniform1f(uniforms.uMobile,mobile?1:0);gl.uniform4fv(uniforms.uWeights,shapeWeights);gl.drawArrays(gl.POINTS,0,data.length/9);trackHands(now);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.getElementById('fallback').hidden=false;});
}catch(error){console.error(error);document.getElementById('fallback').hidden=false;}
})();
