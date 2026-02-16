let baseLevel = 1;

// Calculate total status points available at current base level
function getTotalPoints() {
    return (baseLevel - 1) * 3 + 6;  // +6 because each stat starts at 1
}

function updateBaseLevel() {
    baseLevel = Math.min(99, Math.max(1, parseInt(document.getElementById("baseLevel").value) || 1));
    document.getElementById("baseLevel").value = baseLevel;
    // Adjust stats if total points changed
    updateStats();
}

// Sum of all stats (Str, Agi, Vit, Int, Dex, Luk)
function getStatsSum() {
    let str = parseInt(document.getElementById("str").value) || 1;
    let agi = parseInt(document.getElementById("agi").value) || 1;
    let vit = parseInt(document.getElementById("vit").value) || 1;
    let intl = parseInt(document.getElementById("int").value) || 1;
    let dex = parseInt(document.getElementById("dex").value) || 1;
    let luk = parseInt(document.getElementById("luk").value) || 1;
    return str + agi + vit + intl + dex + luk;
}

function updateStats() {
    // Clamp base level
    baseLevel = Math.min(99, Math.max(1, baseLevel));

    // Get current stat values and clamp min 1
    let stats = {
        str: Math.max(1, parseInt(document.getElementById("str").value) || 1),
        agi: Math.max(1, parseInt(document.getElementById("agi").value) || 1),
        vit: Math.max(1, parseInt(document.getElementById("vit").value) || 1),
        intl: Math.max(1, parseInt(document.getElementById("int").value) || 1),
        dex: Math.max(1, parseInt(document.getElementById("dex").value) || 1),
        luk: Math.max(1, parseInt(document.getElementById("luk").value) || 1)
    };

    // Calculate sum of stat points
    let sumStats = stats.str + stats.agi + stats.vit + stats.intl + stats.dex + stats.luk;

    // Calculate total points allowed
    let totalPoints = getTotalPoints();

    // If sum exceeds total, reduce excess starting from last changed stat (or proportionally)
    if (sumStats > totalPoints) {
        let excess = sumStats - totalPoints;

        // We'll reduce stats one by one (except minimum 1) until excess is zero
        // Start from Luk, Dex, Int, Vit, Agi, Str order for fairness
        const order = ['luk', 'dex', 'intl', 'vit', 'agi', 'str'];

        while (excess > 0) {
            let reducedThisRound = false;
            for (let statName of order) {
                if (stats[statName] > 1 && excess > 0) {
                    stats[statName]--;
                    excess--;
                    reducedThisRound = true;
                }
            }
            // Safety break if no reduction possible
            if (!reducedThisRound) break;
        }
    }

    // Update inputs with corrected stats
    document.getElementById("str").value = stats.str;
    document.getElementById("agi").value = stats.agi;
    document.getElementById("vit").value = stats.vit;
    document.getElementById("int").value = stats.intl;
    document.getElementById("dex").value = stats.dex;
    document.getElementById("luk").value = stats.luk;

    // Update Status Points Remaining display
    let usedPoints = stats.str + stats.agi + stats.vit + stats.intl + stats.dex + stats.luk - 6; // subtract base 1 each stat
    let remainingPoints = totalPoints - (usedPoints + 6); // base 6 included already, so simplify:
    remainingPoints = totalPoints - (usedPoints + 6);
    // Correction: Actually remaining points = totalPoints - usedPoints - 6 leads to negative. So better:
    remainingPoints = totalPoints - (sumStats);

    document.getElementById("statusPoints").innerText = remainingPoints >= 0 ? remainingPoints : 0;

    // Update derived stats with current values

    // ATK: STR + extra from DEX and LUK per classic RO rules
    let atkFromStr = stats.str;
    let extraAtk = Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5);
    document.getElementById("atk").innerText = atkFromStr + extraAtk;

    // MATK: min = INT + floor((INT/7)^2), max = INT + floor((INT/5)^2)
    let minMatk = stats.intl + Math.pow(Math.floor(stats.intl / 7), 2);
    let maxMatk = stats.intl + Math.pow(Math.floor(stats.intl / 5), 2);
    document.getElementById("matk").innerText = `${minMatk}~${maxMatk}`;

    // DEF & MDEF proxies (simple)
    document.getElementById("def").innerText = stats.vit;
    document.getElementById("mdef").innerText = stats.intl + Math.floor(stats.vit / 2);

    // HIT: DEX + bonus from LUK
    let hit = stats.dex + Math.floor(stats.luk / 3);
    document.getElementById("hit").innerText = hit;

    // FLEE: AGI + bonus from LUK
    let flee = stats.agi + Math.floor(stats.luk / 5);
    document.getElementById("flee").innerText = flee;

    // ASPD proxy (not full real calc)
    let aspd = 100 + (stats.agi * 1.2) + (stats.dex * 0.6);
    document.getElementById("aspd").innerText = Math.floor(aspd);
}

// Initial update and add event listeners for all inputs to trigger updateStats on change
document.getElementById("baseLevel").addEventListener("change", updateBaseLevel);
["str", "agi", "vit", "int", "dex", "luk"].forEach(id => {
    document.getElementById(id).addEventListener("change", updateStats);
});

// Run initial stats calculation
updateStats();
