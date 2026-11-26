// Procedural evergreen branches, satin ribbons and metallic ornaments.
// Reference photos inform the design; no reference photo is uploaded or embedded.
export function createBotanicalRenderer(gl) {
  let seed=27112026;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
  const range=(a,b)=>a+(b-a)*random();
  const plus=(a,b)=>a.map((v,i)=>v+b[i]),scale=(a,n)=>a.map(v=>v*n),sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const unit=a=>{const n=Math.hypot(...a)||1;return scale(a,1/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const pine=[[.030,.105,.045],[.045,.155,.063],[.063,.205,.080],[.10,.255,.095],[.16,.31,.12]];
  let vertices=[];
  function triangle(a,b,c,color,shine=.04){const normal=unit(cross(sub(b,a),sub(c,a)));for(const p of[a,b,c])vertices.push(...p,...normal,...color,shine);}
  function quad(a,b,c,d,color,shine=.04){triangle(a,b,c,color,shine);triangle(a,c,d,color,shine);}
  function needle(start,end,width,color){let side=unit(cross(sub(end,start),[0,1,.3]));if(Math.hypot(...side)<.1)side=[1,0,0];const root=plus(start,scale(side,width));triangle(root,plus(start,scale(side,-width)),end,color,.08);}
  function cylinder(a,b,r,color,sides=5){const dir=unit(sub(b,a)),u=unit(cross(dir,Math.abs(dir[2])<.9?[0,0,1]:[0,1,0])),v=cross(dir,u);for(let i=0;i<sides;i++){const q=i/sides*Math.PI*2,w=(i+1)/sides*Math.PI*2;const p=plus(scale(u,Math.cos(q)*r),scale(v,Math.sin(q)*r)),n=plus(scale(u,Math.cos(w)*r),scale(v,Math.sin(w)*r));quad(plus(a,p),plus(a,n),plus(b,scale(n,.45)),plus(b,scale(p,.45)),color);}}
  function ball(center,radius,color,shine=.75,stretch=[1,1,1]){const lat=8,lon=12;function point(a,b){return plus(center,[Math.sin(a)*Math.cos(b)*radius*stretch[0],Math.sin(a)*Math.sin(b)*radius*stretch[1],Math.cos(a)*radius*stretch[2]]);}for(let j=0;j<lat;j++)for(let i=0;i<lon;i++){const a=j/lat*Math.PI,b=(j+1)/lat*Math.PI,c=i/lon*Math.PI*2,d=(i+1)/lon*Math.PI*2;quad(point(a,c),point(b,c),point(b,d),point(a,d),color,shine);}}
  function ribbon(path,width,color,steps=48){let old=null;for(let i=0;i<=steps;i++){const t=i/steps,p=path(t),next=path(Math.min(1,t+.002)),prev=path(Math.max(0,t-.002));const tangent=unit(sub(next,prev)),side=unit(cross(tangent,[0,1,0]));const half=typeof width==='function'?width(t):width;const a=plus(p,scale(side,half)),b=plus(p,scale(side,-half));if(old)quad(old[0],old[1],b,a,color,.55);old=[a,b];}}
  function bow(center,size,color,tilt=0){const place=v=>plus(center,[v[0]*Math.cos(tilt)+v[2]*Math.sin(tilt),v[1],-v[0]*Math.sin(tilt)+v[2]*Math.cos(tilt)]);for(const side of[-1,1]){ribbon(t=>place([side*size*(.10+.37*(1-Math.cos(t*Math.PI*2))),-.06+size*.12*Math.sin(t*Math.PI*2),size*.28*Math.sin(t*Math.PI*2)]),t=>size*(.045+.04*Math.sin(t*Math.PI)**2),color,44);ribbon(t=>place([size*side*(.08+.26*t+.08*Math.sin(t*6)),size*(.02+.08*Math.sin(t*7)),size*(-.05-.95*t)]),t=>size*(.055+.025*t),color,32);}ball(plus(center,[0,-.09,0]),size*.115,color,.45,[1,.7,.75]);}
  function metalStar(center,r,color=[.73,.52,.19]){const front=plus(center,[0,-r*.22,0]),back=plus(center,[0,r*.08,0]);const ring=Array.from({length:10},(_,i)=>plus(center,[Math.sin(i*Math.PI/5)*(i%2?r*.43:r),0,Math.cos(i*Math.PI/5)*(i%2?r*.43:r)]));for(let i=0;i<10;i++){const c=scale(color,i%2?.86:1.18);triangle(front,ring[i],ring[(i+1)%10],c,.9);triangle(back,ring[(i+1)%10],ring[i],scale(c,.8),.8);}}
  function box(center,size){const [x,y,z]=center,[w,d,h]=size,c=[.68,.63,.45];const p=[[-w,-d,0],[w,-d,0],[w,d,0],[-w,d,0],[-w,-d,h],[w,-d,h],[w,d,h],[-w,d,h]].map(v=>plus([x,y,z],v));for(const [a,b,c1,d1]of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])quad(p[a],p[b],p[c1],p[d1],c,.15);ribbon(t=>[x,y-d-.006,z+h*t],.045,[.78,.73,.56],4);ribbon(t=>[x,y-d+2*d*t,z+h+.005],.045,[.78,.73,.56],4);bow([x,y,z+h+.07],.45,[.72,.65,.45]);}
  function buildTree(){vertices=[];cylinder([0,0,.2],[0,0,9.05],.12,[.15,.095,.045],8);
    for(let level=0;level<23;level++){const z=.55+level*.365,t=level/23,radius=3.2*Math.pow(1-t,.87);const branches=level>18?6:11;
      for(let b=0;b<branches;b++){const theta=b/branches*Math.PI*2+level*1.87+range(-.15,.15),dir=[Math.cos(theta),Math.sin(theta),0],side=[-dir[1],dir[0],0],reach=radius*range(.83,1.08);const root=[0,0,z],tip=plus(scale(dir,reach),[0,0,z+.26]);cylinder(root,tip,.022,[.15,.105,.047]);
        for(let j=0;j<17;j++){const along=.18+j/20,base=plus(scale(dir,reach*along),[0,0,z+.26*along]);for(const sign of[-1,1]){const length=(1-along)*.57+.20,twig=plus(scale(dir,.24),plus(scale(side,sign*length),[0,0,range(.03,.20)]));const end=plus(base,twig);cylinder(base,end,.006,[.12,.11,.055],3);
          for(let n=0;n<14;n++){const u=range(.08,1),start=plus(base,scale(twig,u)),fan=(n%2?1:-1);const needleDir=plus(scale(dir,range(.10,.20)),plus(scale(side,sign*range(.06,.16)+fan*.08),[0,range(-.09,.09),range(.04,.14)]));const c=pine[Math.floor(random()*pine.length)];needle(start,plus(start,needleDir),range(.008,.016),c);}
        }}
      }
    }
    const pearl=[.68,.64,.52],silver=[.51,.56,.57],gold=[.64,.51,.27];
    for(let i=0;i<56;i++){const t=range(.08,.85),angle=i*2.399,r=3.2*Math.pow(1-t,.87)*.94;const p=[r*Math.cos(angle),r*Math.sin(angle),.55+t*8.4];ball(p,range(.12,.22),[pearl,silver,gold][i%3],.9,i%4===0?[.8,.8,1.5]:[1,1,1]);cylinder(plus(p,[0,0,.13]),plus(p,[0,0,.25]),.012,gold,4);}
    // Loose champagne mesh ribbons spiral between the natural branches.
    for(let strand=0;strand<1;strand++)ribbon(t=>{const a=t*Math.PI*2*2.8+strand*Math.PI,r=3.35*Math.pow(1-t,.88);return[r*Math.cos(a),r*Math.sin(a),.75+8.1*t];},t=>.045+.045*Math.sin(t*Math.PI),[.55,.52,.38],260);
    for(let i=0;i<10;i++){const t=.15+i*.066,a=i*2.4,r=3.2*Math.pow(1-t,.87);bow([r*Math.cos(a),r*Math.sin(a)-.10,.55+t*8.4],.6,[.64,.61,.48]);}
    metalStar([0,0,9.45],.63,[.74,.60,.30]);
    box([-1.75,-.9,.12],[.43,.36,.66]);box([1.8,-.7,.12],[.52,.42,.88]);box([1.05,-1.25,.1],[.32,.30,.45]);
    return new Float32Array(vertices);
  }
  function buildWreath(){vertices=[];const radius=2.85,centerZ=4.6;
    for(let sprig=0;sprig<640;sprig++){const a=sprig/640*Math.PI*2,R=[Math.sin(a),0,Math.cos(a)],T=[Math.cos(a),0,-Math.sin(a)],base=plus(scale(R,radius+range(-.55,.55)),[0,range(-.42,.42),centerZ]);const direction=plus(scale(T,range(.45,.85)),plus(scale(R,range(.10,.44)),[0,range(-.2,.2),0]));cylinder(base,plus(base,direction),.012,[.16,.115,.05],4);
      for(let twig=0;twig<3;twig++){const root=plus(base,scale(direction,twig*.23)),out=plus(scale(direction,.55),plus(scale(R,range(-.4,.4)),[0,range(-.38,.38),0]));
        for(let n=0;n<32;n++){const u=range(0,1),start=plus(root,scale(out,u)),side=n%2?1:-1;const ray=plus(scale(T,range(.10,.24)),plus(scale(R,side*range(.08,.23)),[0,range(-.18,.18),0]));needle(start,plus(start,ray),range(.009,.018),pine[Math.floor(random()*pine.length)]);}
      }
    }
    const red=[.64,.012,.028],pink=[.81,.43,.47],blue=[.38,.65,.71];
    for(let i=0;i<11;i++){const a=i/11*Math.PI*2+.10,r=radius+Math.sin(i*2)*.16;bow([Math.sin(a)*r,-.64,centerZ+Math.cos(a)*r],i%3===0?.90:.72,[red,pink,blue][i%3],Math.sin(i*2.1)*.28);}
    for(let i=0;i<13;i++){const a=i/13*Math.PI*2+.35;metalStar([Math.sin(a)*(radius+range(-.18,.18)),-.59,centerZ+Math.cos(a)*radius],range(.15,.26),[.78,.59,.20]);}
    metalStar([0,-.1,8.6],.62,[.76,.59,.26]);
    return new Float32Array(vertices);
  }
  const sourceVS=`precision highp float;attribute vec3 aPosition,aNormal,aColor;attribute float aShine;uniform float uYaw,uPitch,uDistance,uAspect,uMobile,uTime,uMode;varying vec3 vColor,vNormal;varying float vShine;
  void main(){float angle=uYaw+(uMode<.5?sin(uTime*.09)*.16:sin(uTime*.13)*.11);float c=cos(angle),s=sin(angle);vec3 p=aPosition;p.xy=mat2(c,-s,s,c)*p.xy;vec3 n=aNormal;n.xy=mat2(c,-s,s,c)*n.xy;vNormal=n;vColor=aColor;vShine=aShine;float z=p.z-4.1,depth=uDistance+p.y*cos(uPitch)-z*sin(uPitch),y=p.y*sin(uPitch)+z*cos(uPitch);gl_Position=vec4(p.x*2.35/uAspect+(1.-uMobile)*depth*.22,y*2.35-uMobile*depth*.20,depth-.2,depth);}`;
  const sourceFS=`precision mediump float;varying vec3 vColor,vNormal;varying float vShine;uniform float uOpacity;void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-.5,-.8,1.3));float diffuse=abs(dot(n,light));float spec=pow(max(dot(n,normalize(light+vec3(0.,-1.,.2))),0.),22.);vec3 c=vColor*(.48+diffuse*1.05)+vec3(1.,.90,.67)*spec*vShine*.58;gl_FragColor=vec4(pow(c,vec3(.92)),uOpacity);}`;
  function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,sourceVS));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,sourceFS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  const buffers=[buildTree(),buildWreath()].map(data=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return {buffer:b,count:data.length/10};});
  const attrs=[['aPosition',3,0],['aNormal',3,3],['aColor',3,6],['aShine',1,9]].map(([name,n,offset])=>({loc:gl.getAttribLocation(program,name),n,offset}));
  const uniforms=Object.fromEntries(['uYaw','uPitch','uDistance','uAspect','uMobile','uTime','uMode','uOpacity'].map(n=>[n,gl.getUniformLocation(program,n)]));
  return {draw({yaw,pitch,distance,aspect,mobile,time,weights}){for(let i=0;i<8;i++)gl.disableVertexAttribArray(i);gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);for(const [key,value]of Object.entries({uYaw:yaw,uPitch:pitch,uDistance:distance,uAspect:aspect,uMobile:mobile?1:0,uTime:time}))gl.uniform1f(uniforms[key],value);for(let i=0;i<2;i++){if(weights[i]<.01)continue;gl.uniform1f(uniforms.uMode,i);gl.uniform1f(uniforms.uOpacity,weights[i]);gl.bindBuffer(gl.ARRAY_BUFFER,buffers[i].buffer);for(const a of attrs){gl.enableVertexAttribArray(a.loc);gl.vertexAttribPointer(a.loc,a.n,gl.FLOAT,false,40,a.offset*4);}gl.drawArrays(gl.TRIANGLES,0,buffers[i].count);}gl.disable(gl.DEPTH_TEST);gl.blendFunc(gl.ONE,gl.ONE);}};
}
