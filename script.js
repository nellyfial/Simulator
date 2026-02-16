let baseLevel = 1;

function getPointRequirement(value) {
    if (value < 10) return 2;
    if (value < 20) return 3;
    if (value < 30) return 4;
    if (value < 40) return 5;
    return 6;
}

function updateBaseLevel() {
    baseLevel = parseInt(document.getElementById("baseLevel").value) || 1;
    updateStats();
}

function updateStats() {
    // Read stats from input
    let str = parseInt(document.getElementById("str").value) || 1;
    let agi = parseInt(document.getElementById("agi").value) || 1;
    let vit = parseInt(document.getElementById("vit").value) || 1;
    let intl = parseInt(document.getElementById("int").value) || 1;
    let dex = parseInt(document.getElementById("dex").value) || 1;
    let luk = parseInt(document.getElementById("luk").value) || 1;

    // Calculate used points
    let usedPoints =
        getPointRequirement(str) +
        getPointRequirement(agi) +
        getPointRequirement(vit) +
        getPointRequirement(intl) +
        getPointRequirement(dex) +
        getPointRequirement(luk);

    let totalPoints = (baseLevel - 1) * 3;
    let remainingPoints = totalPoints - usedPoints;
    if (remainingPoints < 0) remainingPoints = 0;

    document.getElementById("statusPoints").innerText = remainingPoints;

    // Update requirements
    document.getElementById("strReq").innerText = getPointRequirement(str);
    document.getElementById("agiReq").innerText = getPointRequirement(agi);
    document.getElementById("vitReq").innerText = getPointRequirement(vit);
    document.getElementById("intReq").innerText = getPointRequirement(intl);
    document.getElementById("dexReq").innerText = getPointRequirement(dex);
    document.getElementById("lukReq").innerText = getPointRequirement(luk);

    // Update derived stats
    document.getElementById("atk").innerText = str;
    document.getElementById("matk").innerText = intl + "~" + (intl * 2);
    document.getElementById("def").innerText = vit;
    document.getElementById("mdef").innerText = intl + Math.floor(vit / 2);
    document.getElementById("hit").innerText = dex * 2;
    document.getElementById("flee").innerText = agi * 2;
    document.getElementById("crit").innerText = Math.floor(luk / 3);
    document.getElementById("aspd").innerText = 150 + Math.floor(agi / 2);
}

// Initial update
updateStats();