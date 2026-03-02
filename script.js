function getPointsForLevel(level){
    if(level<=4) return 3;
    if(level>=95) return 22;
    return Math.floor((level-1)/5)+3;
}

function getTotalStatPoints(level){
    let total=48;
    for(let i=2;i<=level;i++) total+=getPointsForLevel(i);
    return total;
}

function getStatCost(value){
    return Math.min(Math.floor((value-1)/10)+2,11);
}

const jobData={Novice:{hpFactor:5,spFactor:3},Swordsman:{hpFactor:12,spFactor:2},Mage:{hpFactor:3,spFactor:10},Archer:{hpFactor:8,spFactor:4},Thief:{hpFactor:7,spFactor:3},Acolyte:{hpFactor:6,spFactor:8},Merchant:{hpFactor:9,spFactor:3}};
const weaponAspdPenalty={Hand:0,Sword:5,Bow:3,Staff:7,Dagger:1};

function getTotalCost(statValue){
    let total=0;
    for(let i=1;i<statValue;i++) total+=getStatCost(i);
    return total;
}

function updateStats(){
    let level=parseInt(document.getElementById("baseLevel").value)||1;
    let str=parseInt(document.getElementById("str").value)||1;
    let agi=parseInt(document.getElementById("agi").value)||1;
    let vit=parseInt(document.getElementById("vit").value)||1;
    let intStat=parseInt(document.getElementById("int").value)||1;
    let dex=parseInt(document.getElementById("dex").value)||1;
    let luk=parseInt(document.getElementById("luk").value)||1;
    let job=document.getElementById("job").value;
    let weapon=document.getElementById("weapon").value;

    // Req per stat
    document.getElementById("strReq").innerText=getStatCost(str);
    document.getElementById("agiReq").innerText=getStatCost(agi);
    document.getElementById("vitReq").innerText=getStatCost(vit);
    document.getElementById("intReq").innerText=getStatCost(intStat);
    document.getElementById("dexReq").innerText=getStatCost(dex);
    document.getElementById("lukReq").innerText=getStatCost(luk);

    // Job bonus (just example 0 for now)
    document.getElementById("strBonus").innerText=0;
    document.getElementById("agiBonus").innerText=0;
    document.getElementById("vitBonus").innerText=0;
    document.getElementById("intBonus").innerText=0;
    document.getElementById("dexBonus").innerText=0;
    document.getElementById("lukBonus").innerText=0;

    // Remaining points
    let totalPoints=getTotalStatPoints(level);
    let spentPoints=getTotalCost(str)+getTotalCost(agi)+getTotalCost(vit)+getTotalCost(intStat)+getTotalCost(dex)+getTotalCost(luk);
    document.getElementById("statusPoints").innerText=Math.max(totalPoints-spentPoints,0);

    // Status formulas
    let atk=str+Math.floor(str/10)**2;
    let atkBonus=Math.floor(dex/5)+Math.floor(luk/5);
    document.getElementById("atk").innerText=atk+" + "+atkBonus;

    let matkMin=intStat+Math.floor(intStat/7)**2;
    let matkMax=intStat+Math.floor(intStat/5)**2;
    document.getElementById("matk").innerText=matkMin+"~"+matkMax;

    document.getElementById("hit").innerText=level+dex;
    document.getElementById("critical").innerText=Math.floor(luk/3)+1;

    document.getElementById("def").innerText=vit+" + "+Math.floor(agi/5);
    document.getElementById("mdef").innerText=intStat+" + "+Math.floor(vit/5);
    document.getElementById("flee").innerText=(level+agi)+" + "+(Math.floor(luk/10)+1);

    let baseAspd=160;
    document.getElementById("aspd").innerText=baseAspd+Math.floor(agi/4)+Math.floor(dex/20)-(weaponAspdPenalty[weapon]||0);

    let jobInfo=jobData[job]||jobData["Novice"];
    document.getElementById("hp").value=Math.floor(35+(level*jobInfo.hpFactor)+(vit*level*0.8));
    document.getElementById("sp").value=Math.floor(10+(level*jobInfo.spFactor)+(intStat*level*0.3));
}

// Add event listeners
document.querySelectorAll("input, select").forEach(el=>el.addEventListener("change",updateStats));
window.onload=updateStats;