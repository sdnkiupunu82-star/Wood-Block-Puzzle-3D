const COLS=10, ROWS=20;
const SHAPES=[
 {m:[[1,1,1,1]],c:0},{m:[[1,1],[1,1]],c:1},{m:[[0,1,0],[1,1,1]],c:2},
 {m:[[0,1,1],[1,1,0]],c:3},{m:[[1,1,0],[0,1,1]],c:4},{m:[[1,0,0],[1,1,1]],c:5},{m:[[0,0,1],[1,1,1]],c:6}
];
let board,piece,nextPiece,score=0,best=Number(localStorage.getItem('wood3d-best')||0),lines=0,combo=0,level=1,dropTimer=null,paused=false,over=false,soundOn=true,audioCtx=null;
const $=id=>document.getElementById(id); const clone=x=>JSON.parse(JSON.stringify(x));
function newBoard(){return Array.from({length:ROWS},()=>Array(COLS).fill(0))}
function rotate(m){const h=m.length,w=m[0].length;return Array.from({length:w},(_,x)=>Array.from({length:h},(_,y)=>m[h-1-y][x]))}
function makePiece(data=SHAPES[Math.floor(Math.random()*SHAPES.length)]){return {m:clone(data.m),c:data.c,x:Math.floor((COLS-data.m[0].length)/2),y:0}}
function init(){board=newBoard();score=0;lines=0;combo=0;level=1;paused=false;over=false;nextPiece=makePiece();spawn();update();startTimer();$('modal').classList.add('hidden');$('status').textContent='PLAYING'}
function spawn(){piece=nextPiece;piece.x=Math.floor((COLS-piece.m[0].length)/2);piece.y=0;nextPiece=makePiece();if(collides(piece,0,0)){gameOver()}}
function collides(p,dx,dy,m=p.m){for(let y=0;y<m.length;y++)for(let x=0;x<m[y].length;x++)if(m[y][x]){let nx=p.x+x+dx,ny=p.y+y+dy;if(nx<0||nx>=COLS||ny>=ROWS||ny>=0&&board[ny][nx])return true}return false}
function merge(){piece.m.forEach((row,y)=>row.forEach((v,x)=>{if(v&&piece.y+y>=0)board[piece.y+y][piece.x+x]=1}))}
function clearLines(){let full=[];for(let y=0;y<ROWS;y++)if(board[y].every(Boolean))full.push(y);if(!full.length){combo=0;return 0}full.forEach(y=>board.splice(y,1));while(board.length<ROWS)board.unshift(Array(COLS).fill(0));lines+=full.length;combo++;score+=([0,100,300,500,800][full.length]||1000)*level+(combo>1?combo*50:0);level=1+Math.floor(lines/10);$('lineFlash').classList.remove('flash');void $('lineFlash').offsetWidth;$('lineFlash').classList.add('flash');tone(520,.07);return full.length}
function lock(){merge();let n=clearLines();if(n)tone(720+n*80,.12);else tone(180,.045);score+=10*level;if(score>best){best=score;localStorage.setItem('wood3d-best',best)}spawn();update();if(!over)startTimer()}
function tick(){if(paused||over)return;if(!collides(piece,0,1))piece.y++;else lock();update()}
function move(dx){if(paused||over)return;if(!collides(piece,dx,0)){piece.x+=dx;tone(250,.025);update()}}
function softDrop(){if(paused||over)return;if(!collides(piece,0,1)){piece.y++;score+=1;tone(300,.018);update()}else lock()}
function hardDrop(){if(paused||over)return;let d=0;while(!collides(piece,0,1)){piece.y++;d++}score+=d*2;tone(640,.08);lock()}
function doRotate(){if(paused||over)return;let old=piece.m,n=rotate(piece.m),kicks=[0,-1,1,-2,2];for(const dx of kicks){if(!collides(piece,dx,0,n)){piece.m=n;piece.x+=dx;tone(480,.05);update();return}}}
function ghostY(){let y=piece.y;while(!collides({...piece,y},0,1))y++;return y}
function render(){let b=$('board');b.innerHTML='';let cells=Array.from({length:ROWS},()=>Array(COLS).fill(0));board.forEach((r,y)=>r.forEach((v,x)=>cells[y][x]=v?2:0));let gy=ghostY();piece.m.forEach((row,y)=>row.forEach((v,x)=>{if(v){if(gy+y>=0)cells[gy+y][piece.x+x]=3;if(piece.y+y>=0)cells[piece.y+y][piece.x+x]=1}}));for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){let e=document.createElement('div');e.className='cell '+(cells[y][x]===1?'active':cells[y][x]===2?'locked':cells[y][x]===3?'ghost':'');b.appendChild(e)}renderNext()}
function renderNext(){let n=$('next');n.innerHTML='';let sh=nextPiece.m,wrap=document.createElement('div');wrap.className='mini-grid';wrap.style.gridTemplateColumns=`repeat(${sh[0].length},13px)`;sh.forEach(r=>r.forEach(v=>{let e=document.createElement('div');e.className='mini-block';e.style.visibility=v?'visible':'hidden';wrap.appendChild(e)}));n.appendChild(wrap)}
function update(){render();$('score').textContent=score;$('best').textContent=best;$('lines').textContent=lines;$('combo').textContent=combo;$('level').textContent=level}
function startTimer(){clearInterval(dropTimer);dropTimer=setInterval(tick,Math.max(120,850-(level-1)*55))}
function togglePause(){if(over)return;paused=!paused;$('pauseBtn').textContent=paused?'▶ Lanjut':'Ⅱ Pause';$('status').textContent=paused?'PAUSED':'PLAYING'}
function gameOver(){over=true;clearInterval(dropTimer);$('status').textContent='GAME OVER';$('finalScore').textContent=score;$('finalLines').textContent=lines;$('modal').classList.remove('hidden');tone(120,.3)}
function tone(freq,dur){if(!soundOn)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch(e){}}
function action(a){if(a==='left')move(-1);if(a==='right')move(1);if(a==='rotate')doRotate();if(a==='drop')hardDrop()}
document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')move(-1);else if(e.key==='ArrowRight')move(1);else if(e.key==='ArrowUp')doRotate();else if(e.key==='ArrowDown')softDrop();else if(e.key===' ')hardDrop();else if(e.key.toLowerCase()==='p')togglePause()});
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerdown',()=>action(b.dataset.action)));$('pauseBtn').onclick=togglePause;$('soundBtn').onclick=()=>{soundOn=!soundOn;$('soundBtn').textContent=soundOn?'🔊 Suara':'🔇 Suara';if(soundOn)tone(520,.06)};$('newBtn').onclick=()=>{tone(380,.05);init()};$('restartBtn').onclick=()=>{tone(500,.06);init()};init();
