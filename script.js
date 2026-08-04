// ===============================
// BATCOMPUTER BOOT SEQUENCE
// ===============================

const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const progress = document.getElementById("bar");

const bootSteps = [
"Connecting to Wayne Enterprises...",
"Authenticating Bruce Wayne...",
"Scanning Gotham City...",
"Loading Batcomputer...",
"Decrypting Secret Files...",
"Loading Mission Database...",
"Synchronizing Batmobile...",
"Access Granted"
];

let percent = 0;
let step = 0;

const boot = setInterval(() => {

    percent++;

    progress.style.width = percent + "%";

    if(percent % 12 === 0 && step < bootSteps.length){
        loadingText.innerHTML = bootSteps[step];
        step++;
    }

    if(percent >= 100){

        clearInterval(boot);

        loadingText.innerHTML = "WELCOME BACK BATMAN";

        setTimeout(()=>{

            loading.style.opacity="0";

            loading.style.transition="1.5s";

            setTimeout(()=>{
                loading.style.display="none";
            },1500);

        },800);

    }

},60);


// ===============================
// RAIN SOUND
// ===============================

const rain = document.getElementById("rainSound");

rain.volume = 0.35;

window.addEventListener("load",()=>{

    rain.play().catch(()=>{});

});


// ===============================
// BATMAN THEME
// ===============================

const theme = document.getElementById("theme");

const enter = document.getElementById("enter");

enter.addEventListener("click",()=>{

    theme.volume = 0.6;

    theme.play();

    window.scrollTo({

        top:window.innerHeight,

        behavior:"smooth"

    });

});


// ===============================
// RANDOM LIGHTNING
// ===============================

const flash = document.getElementById("lightning");

const thunder = document.getElementById("thunder");

function lightning(){

    flash.style.opacity=.9;

    setTimeout(()=>{

        flash.style.opacity=0;

    },100);

    thunder.currentTime=0;

    thunder.play().catch(()=>{});

}

setInterval(()=>{

    let chance=Math.random();

    if(chance>0.72){

        lightning();

    }

},2500);


// ===============================
// BUTTON GLOW
// ===============================

document.querySelectorAll("button").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.boxShadow="0 0 40px gold";

});

btn.addEventListener("mouseleave",()=>{

btn.style.boxShadow="";

});

});


// ===============================
// PARALLAX MOON
// ===============================

const moon=document.querySelector(".moon");

document.addEventListener("mousemove",(e)=>{

let x=e.clientX/50;

let y=e.clientY/50;

moon.style.transform=`translate(${x}px,${y}px)`;

});


// ===============================
// CARD ANIMATION
// ===============================

const cards=document.querySelectorAll(".card");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity=1;

entry.target.style.transform="translateY(0px)";

}

});

});

cards.forEach(card=>{

card.style.opacity=0;

card.style.transform="translateY(80px)";

card.style.transition="1s";

observer.observe(card);

});


// ===============================
// RANDOM TERMINAL MESSAGES
// ===============================

const hero=document.querySelector("#hero p");

const messages=[

"GOTHAM IS SAFE.",

"JOKER LOCATION UNKNOWN.",

"BATMOBILE READY.",

"WAYNE SATELLITES ONLINE.",

"MISSION DATABASE UPDATED.",

"ALFRED HAS A MESSAGE."

];

setInterval(()=>{

hero.innerHTML=messages[Math.floor(Math.random()*messages.length)];

},6000);


// ===============================
// TYPEWRITER EFFECT
// ===============================

const title=document.querySelector("#hero h1");

const original=title.innerHTML;

title.innerHTML="";

let i=0;

function typing(){

if(i<original.length){

title.innerHTML+=original.charAt(i);

i++;

setTimeout(typing,150);

}

}

setTimeout(typing,7000);


// ===============================
// ENDING MESSAGE
// ===============================

window.addEventListener("scroll",()=>{

let end=document.querySelector("#ending");

let pos=end.getBoundingClientRect().top;

if(pos<window.innerHeight-200){

end.style.transition="2s";

end.style.opacity=1;

end.style.transform="translateY(0px)";

}

});

document.querySelector("#ending").style.opacity=0;
document.querySelector("#ending").style.transform="translateY(120px)";
