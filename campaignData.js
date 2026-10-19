import { Monster } from './Monster.js';

export const MAX_ROUNDS = 15;

const ENEMY_IMAGES = {
    goblin: "images/enemy/monster1.PNG",
    orc:    "images/enemy/monster3.PNG",
    mage:   "images/enemy/monster4.PNG",
    beast:  "images/enemy/monster2.PNG",
    golem:  "images/enemy/monster5.PNG",
    boss:   "images/enemy/boss.PNG"
};

const roundTable = [

    // ----- 1. kör -----
    { round: 1, monsters: [
        { type: "goblin", hp: 14, damage: 3 }
    ]},

    // ----- 2. kör -----
    { round: 2, monsters: [
        { type: "goblin", hp: 12, damage: 4,taunt:true},
        { type: "orc", hp: 16, damage: 4 }
    ]},

    // ----- 3. kör -----
    { round: 3, monsters: [
        { type: "goblin", hp: 17, damage: 5 },
        { type: "orc", hp: 22, damage: 5 }
    ]},

    // ----- 4. kör -----
    { round: 4, monsters: [
        { type: "goblin", hp: 17, damage: 4 },
        { type: "orc", hp: 21, damage: 4,taunt:true },
        { type: "mage", hp: 15, damage: 6 }
    ]},

    // ----- 5. kör -----
    { round: 5, monsters: [
        { type: "goblin", hp: 22, damage: 5 },
        { type: "orc", hp: 28, damage: 5 },
        { type: "mage", hp: 20, damage: 8 }
    ]},

    // ----- 6. kör -----
    { round: 6, monsters: [
        { type: "goblin", hp: 19, damage: 6 },
        { type: "orc", hp: 24, damage: 6 },
        { type: "mage", hp: 17, damage: 9 },
        { type: "beast", hp: 31, damage: 5 }
    ]},

    // ----- 7. kör -----
    { round: 7, monsters: [
        { type: "goblin", hp: 25, damage: 7, },
        { type: "orc", hp: 31, damage: 7,taunt:true },
        { type: "mage", hp: 22, damage: 11 },
        { type: "beast", hp: 41, damage: 7 }
    ]},

    // ----- 8. kör -----
    { round: 8, monsters: [
        { type: "goblin", hp: 22, damage: 8 },
        { type: "orc", hp: 28, damage: 8,taunt:true },
        { type: "mage", hp: 20, damage: 12,taunt:true},
        { type: "beast", hp: 36, damage: 7 },
        { type: "golem", hp: 45, damage: 5 }
    ]},

    // ----- 9. kör -----
    { round: 9, monsters: [
        { type: "goblin", hp: 28, damage: 10 },
        { type: "orc", hp: 35, damage: 10 },
        { type: "mage", hp: 24, damage: 15 },
        { type: "beast", hp: 46, damage: 9 },
        { type: "golem", hp: 56, damage: 6 }
    ]},

    // ----- 10. kör -----
    { round: 10, monsters: [
        { type: "goblin", hp: 30, damage: 10 },
        { type: "goblin", hp: 30, damage: 10 },
        { type: "orc", hp: 37, damage: 10 },
        { type: "mage", hp: 26, damage: 15 },
        { type: "beast", hp: 48, damage: 9 },
        { type: "golem", hp: 60, damage: 6 }
    ]},

    // ----- 11. kör -----
    { round: 11, monsters: [
        { type: "goblin", hp: 36, damage: 12 },
        { type: "goblin", hp: 36, damage: 12,taunt:true },
        { type: "orc", hp: 45, damage: 12 },
        { type: "mage", hp: 32, damage: 18 },
        { type: "beast", hp: 59, damage: 10 },
        { type: "golem", hp: 72, damage: 7 }
    ]},

    // ----- 12. kör -----
    { round: 12, monsters: [
        { type: "goblin", hp: 40, damage: 14 },
        { type: "orc", hp: 50, damage: 14 },
        { type: "mage", hp: 35, damage: 21 },
        { type: "beast", hp: 65, damage: 13 },
        { type: "beast", hp: 65, damage: 13 },
        { type: "golem", hp: 80, damage: 8 }
    ]},

    // ----- 13. kör -----
    { round: 13, monsters: [
        { type: "orc", hp: 55, damage: 17 },
        { type: "orc", hp: 55, damage: 17 },
        { type: "mage", hp: 39, damage: 26 },
        { type: "beast", hp: 72, damage: 16 },
        { type: "golem", hp: 89, damage: 10 },
        { type: "golem", hp: 89, damage: 10 }
    ]},

    // ----- 14. kör -----
    { round: 14, monsters: [
        { type: "orc", hp: 68, damage: 18 },
        { type: "mage", hp: 48, damage: 28 },
        { type: "mage", hp: 48, damage: 28 },
        { type: "beast", hp: 88, damage: 17 },
        { type: "golem", hp: 109, damage: 11 },
        { type: "golem", hp: 109, damage: 11 }
    ]},

    // ----- 15. kör: BOSS + 5 csatlós -----
    { round: 15, monsters: [
        { type: "golem", hp: 148, damage: 6 },
        { type: "beast", hp: 120, damage: 9 },
        { type: "boss", hp: 800, damage: 45, isBoss: true },
        { type: "orc", hp: 93, damage: 10 },
        { type: "mage", hp: 65, damage: 15 },
        { type: "goblin", hp: 74, damage: 10 }
    ]}
];

// Round adatok
export function getRoundData(round) {
    for (let entry of roundTable) {
        if (entry.round === round) {
            return entry;
        }
    }
    return null;
}

// Boss-e
export function isBossRound(round) {
    return round === MAX_ROUNDS;
}

// Monsterek lekerese
export function createRoundMonsters(round) {
    let data = getRoundData(round);

    if (data === null) {
        return [];
    }

    let monsters = [];

    for (let m of data.monsters) {
        let image = ENEMY_IMAGES[m.type];
        let isBoss = m.isBoss === true;

        monsters.push(new Monster(m.type, m.hp, m.damage, image, isBoss, m.taunt === true));
    }
    return monsters;
}

// Monsterek adatai
export function getRoundPower(round) {
    let data = getRoundData(round);
    let power = { count: 0, totalHp: 0, totalDamage: 0 };

    if (data === null) {
        return power;
    }

    for (let m of data.monsters) {
        power.count++;
        power.totalHp += m.hp;
        power.totalDamage += m.damage;
    }
    return power;
}