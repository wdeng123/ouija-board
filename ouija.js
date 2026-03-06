const board=document.getElementById("board")
const planchette=document.getElementById("planchette")

let nodes={}
let busy=false

let startX=420
let startY=420

const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function add(char,x,y){

let d=document.createElement("div")
d.className="letter"
d.innerText=char

d.style.left=x+"px"
d.style.top=y+"px"

board.appendChild(d)

nodes[char]={x:x+10,y:y+18}

}

function createBoard(){

let space=60

add("YES",80,30)
add("NO",720,30)

for(let i=0;i<13;i++)
add(alphabet[i],40+i*space,140)

for(let i=13;i<26;i++)
add(alphabet[i],40+(i-13)*space,210)

add("GOODBYE",380,360)

}

createBoard()

planchette.style.left=startX+"px"
planchette.style.top=startY+"px"

function askText(){

if(busy) return

let q=document.getElementById("question").value.toLowerCase()

let answer=decideAnswer(q)

spell(answer)

}

let recognition
let micOn=false

function initMic(){

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition

if(!SpeechRecognition){

alert("Speech recognition not supported")

return

}

recognition=new SpeechRecognition()

recognition.lang="en-US"

recognition.continuous=true
recognition.interimResults=true

recognition.onstart=function(){

console.log("Listening")

}

recognition.onend=function(){

console.log("Restart mic")

if(micOn){
recognition.start()
}

}

recognition.onresult=function(event){

let text=""

for(let i=event.resultIndex;i<event.results.length;i++){

text+=event.results[i][0].transcript

}

document.getElementById("question").value=text

if(event.results[event.results.length-1].isFinal){

askText()

}

}

}

initMic()

function toggleMic(){

if(!micOn){

recognition.start()
micOn=true

document.body.style.boxShadow="0 0 50px red inset"

}else{

recognition.stop()
micOn=false

document.body.style.boxShadow=""

}

}

function decideAnswer(q){

if(q.includes("hello")) return "HELLO"

if(q.includes("are you here")) return "YES"

if(q.includes("should i leave"))
return Math.random()>0.5?"YES":"NO"

let random=["RUN","LEAVE","HIDE","STAY","NO","YES","DANGER"]

return random[Math.floor(Math.random()*random.length)]

}

async function spell(word){

busy=true

await sleep(1000)

for(let i=0;i<word.length;i++){

let target=nodes[word[i]]

if(!target) continue

await move(target.x,target.y)

await sleep(400)

}

await move(startX,startY)

busy=false

}

function move(targetX,targetY){

return new Promise(resolve=>{

let speed=4

function step(){

let px=planchette.offsetLeft
let py=planchette.offsetTop

let cx=px+planchette.offsetWidth/2
let cy=py+planchette.offsetHeight/2

let dx=targetX-cx
let dy=targetY-cy

let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<speed){

planchette.style.left=(targetX-planchette.offsetWidth/2)+"px"
planchette.style.top=(targetY-planchette.offsetHeight/2)+"px"

resolve()
return

}

let vx=dx/dist*speed
let vy=dy/dist*speed

planchette.style.left=px+vx+"px"
planchette.style.top=py+vy+"px"

requestAnimationFrame(step)

}

step()

})

}

function sleep(ms){
return new Promise(r=>setTimeout(r,ms))
}