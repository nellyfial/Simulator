// ===============================
// RAGNAROK SIMPLE STAT SYSTEM
// ===============================

// --------- HARD LIMIT FUNCTION (1–99 ONLY) ---------
function enforceLimit(input) {

    // Remove non-numbers
    let value = input.value.replace(/\D/g, "");

    // Limit to 2 digits only
    if (value.length > 2) {
        value = value.slice(0, 2);
    }

    // Convert to number
    value = parseInt(value);

    if (isNaN(value) || value < 1) value = 1;
    if (value > 99) value = 99;

    input.value = value;
}

// --------- STAT POINT SYSTEM ---------

function getPointsForLevel(level) {
    if (level <= 4) return 3;
    if (level >= 95) return 22;
    return Math.floor((level - 1) / 5) + 3;
}

function getTotalStatPoints(level) {
    let total = 48;

    for (let i = 2; i <= level; i++) {
        total += getPointsForLevel(i);
    }

    return total;
}

function getStatCost(value) {
    return Math.min(Math.floor((value - 1) / 10) + 2, 11);
}

// --------- MAIN UPDATE FUNCTION ---------

function updateStats() {

    let level = parseInt(document.getElementById("baseLevel").value) || 1;
    let str = parseInt(document.getElementById("str").value) || 1;
    let agi = parseInt(document.getElementById("agi").value) || 1;
    let vit = parseInt(document.getElementById("vit").value) || 1;
    let intStat = parseInt(document.getElementById("int").value) || 1;
    let dex = parseInt(document.getElementById("dex").value) || 1;
    let luk = parseInt(document.getElementById("luk").value) || 1;

    // ===== STAT POINT CALCULATION =====
    let totalPoints = getTotalStatPoints(level);

    let spentPoints =
        getTotalCost(str) +
        getTotalCost(agi) +
        getTotalCost(vit) +
        getTotalCost(intStat) +
        getTotalCost(dex) +
        getTotalCost(luk);

    let remaining = totalPoints - spentPoints;
    if (remaining < 0) remaining = 0;

    document.getElementById("statusPoints").innerText = remaining;

    // ===== UPDATE PTS REQUIRED =====
    document.getElementById("strReq").innerText = getStatCost(str);
    document.getElementById("agiReq").innerText = getStatCost(agi);
    document.getElementById("vitReq").innerText = getStatCost(vit);
    document.getElementById("intReq").innerText = getStatCost(intStat);
    document.getElementById("dexReq").innerText = getStatCost(dex);
    document.getElementById("lukReq").innerText = getStatCost(luk);

    // ===============================
    // COMBAT CALCULATIONS
    // ===============================

    let atkBase = str + Math.floor(str / 10) ** 2;
    let atkBonus = Math.floor(dex / 5) + Math.floor(luk / 5);
    document.getElementById("atk").innerText = (atkBase + atkBonus) + " + 0";

    let matkMin = intStat + Math.floor(intStat / 7) ** 2;
    let matkMax = intStat + Math.floor(intStat / 5) ** 2;
    document.getElementById("matk").innerText = matkMin + "~" + matkMax;

    let defBonus = vit + Math.floor(agi / 5);
    document.getElementById("def").innerText = "0 + " + defBonus;

    let mdefBonus = intStat + Math.floor(vit / 5);
    document.getElementById("mdef").innerText = "0 + " + mdefBonus;

    let hit = level + dex;
    document.getElementById("hit").innerText = hit;

    let fleeBase = level + agi;
    let fleeBonus = Math.floor(luk / 10);
    document.getElementById("flee").innerText = fleeBase + " + " + (fleeBonus + 1);

    let aspd = 150 + Math.floor(agi / 5) + Math.floor(dex / 20);
    document.getElementById("aspd").innerText = aspd;

    let critical = Math.max(1, Math.floor(luk * 0.3) + 1);
    document.getElementById("critical").innerText = critical;
}

// --------- TOTAL COST HELPER ---------

function getTotalCost(statValue) {
    let total = 0;
    for (let i = 1; i < statValue; i++) {
        total += getStatCost(i);
    }
    return total;
}

// --------- AUTO ATTACH LIMITERS ---------

window.onload = function () {

    const ids = ["baseLevel", "str", "agi", "vit", "int", "dex", "luk"];

    ids.forEach(id => {
        const input = document.getElementById(id);

        input.addEventListener("input", function () {
            enforceLimit(this);
            updateStats();
        });
    });

    updateStats();
};
