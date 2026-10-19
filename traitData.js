export const TRAIT_THRESHOLD = 3;       // ennyi kell a trait aktivalasahoz

const TANK_HP_PERCENT = 0.25;           // +25% HP
const WARRIOR_DAMAGE_PERCENT = 0.25;    // +25% DMG
const TREASURE_GOLD = 2;                // +2arany koronkent
const SAGE_XP = 2;                      // +2XP koronkent
const LUCKY_FREE_REROLLS = 1;           // +1reroll koronkent


// Traitek leirasa
export const traitData = {
    tank: {
        name: "Tank",
        description: `A harctéren lévő összes lapod +${Math.round(TANK_HP_PERCENT * 100)}% HP-t kap.`
    },
    warrior: {
        name: "Harcos",
        description: `A harctéren lévő összes lapod +${Math.round(WARRIOR_DAMAGE_PERCENT * 100)}% sebzést kap.`
    },
    treasure: {
        name: "Kincsvadász",
        description: `Minden kör végén +${TREASURE_GOLD} arany.`
    },
    sage: {
        name: "Bölcs",
        description: `Minden kör végén +${SAGE_XP} XP.`
    },
    lucky: {
        name: "Szerencsés",
        description: `Minden kör elején +${LUCKY_FREE_REROLLS} ingyen újrapörgetés.`
    }
};

// Traitek mennyiseget szamolja meg es adja vissza
export function countTraits(boardUnits) {
    let counts = {};
    let seenHeroes = {};        //traitekhez unitokat csatolunk

    for (let traitId in traitData) {
        counts[traitId] = 0;
        seenHeroes[traitId] = [];
    }

    for (let unit of boardUnits) {
        for (let traitId of unit.traits) {
            if (!(traitId in counts)) {
                continue;       
            }

            // 1 Unit 1x szerepel hiaba van a boardon 2x
            if (!seenHeroes[traitId].includes(unit.id)) {
                seenHeroes[traitId].push(unit.id);
                counts[traitId]++;
            }
        }
    }

    return counts;
}

// Aktiv traitek
export function getActiveTraits(boardUnits) {
    let counts = countTraits(boardUnits);
    let active = [];

    for (let traitId in counts) {
        if (counts[traitId] >= TRAIT_THRESHOLD) {
            active.push(traitId);
        }
    }
    return active;
}

// Bonus kiszamolasa
function percentBonus(value, percent) {
    let bonus = Math.round(value * percent);

    if (bonus < 1) {
        bonus = 1;
    }
    return bonus;
}

// Minden jelenetre megkell hivni ami a jatekban tortenik
export function updateTraitBonuses(player) {

    let allUnits = [...player.bench, ...player.board];

    for (let unit of allUnits) {
        if (unit !== null) {
            unit.traitBonusHp = 0;
            unit.traitBonusDamage = 0;
        }
    }

    // Mik az aktivok
    let boardUnits = player.getBoardUnits();
    let active = getActiveTraits(boardUnits);

    // Boadon levo Unitoknak atadni a traitek buffjait
    for (let unit of boardUnits) {

        if (active.includes("tank")) {
            unit.traitBonusHp = percentBonus(unit.permanentHp, TANK_HP_PERCENT);
        }

        if (active.includes("warrior")) {
            unit.traitBonusDamage = percentBonus(unit.permanentDamage, WARRIOR_DAMAGE_PERCENT);
        }
    }
}


// Trait bonusok osszeszede
export function getRoundIncome(boardUnits) {
    let active = getActiveTraits(boardUnits);
    let income = { gold: 0, xp: 0, freeRerolls: 0 };

    if (active.includes("treasure")) {
        income.gold = TREASURE_GOLD;
    }
    if (active.includes("sage")) {
        income.xp = SAGE_XP;
    }
    if (active.includes("lucky")) {
        income.freeRerolls = LUCKY_FREE_REROLLS;
    }
    return income;
}
