
const START_GOLD = 20;
export const START_LIVES = 3;
const BENCH_SIZE = 10;      
const BOARD_SIZE = 6;       
const MAX_SPELLS = 6;       
export const MAX_LEVEL = 9;

export const XP_COST = 4;          
const XP_AMOUNT = 4;        


export class Player {

    constructor(name = "Játékos") {
        this.name = name;

        this.lives = START_LIVES;
        this.gold = START_GOLD;
        this.freeRerolls = 0;       // traitel adott + free rollok

        this.level = 1;
        this.xp = 0;

        this.xpTable = {
            1: 2,
            2: 6,
            3: 10,
            4: 20,
            5: 36,
            6: 60,
            7: 68,
            8: 68
        };
        this.maxExp = this.xpTable[this.level];

        // fix helyek tarolasa
        this.bench = new Array(BENCH_SIZE).fill(null);
        this.board = new Array(BOARD_SIZE).fill(null);

        this.spellInventory = new Array(MAX_SPELLS).fill(null);
    }


   // Gold
    addGold(amount) {
        this.gold += amount;
    }

    canAfford(amount) {
        return this.gold >= amount;
    }

    // sikerult e fizetni
    spendGold(amount) {
        if (!this.canAfford(amount)) {
            return false;
        }

        this.gold -= amount;
        return true;
    }

    // CEletek csokkentese
    loseLife(amount = 1) {
        this.lives -= amount;

        if (this.lives < 0) {
            this.lives = 0;
        }
        return this.lives === 0;
    }

    isDead() {
        return this.lives === 0;
    }


    // Free rolls
    addFreeRerolls(amount) {
        this.freeRerolls += amount;
    }

    // Free rollokat elhasznaltuk-e
    useFreeReroll() {
        if (this.freeRerolls <= 0) {
            return false;
        }

        this.freeRerolls--;
        return true;
    }

    // A getRoundIncome() atvetele
    applyIncome(income) {
        this.addGold(income.gold);
        this.gainXp(income.xp);
        this.addFreeRerolls(income.freeRerolls);
    }

    // XP
    buyXp() {
        if (this.level >= MAX_LEVEL) {
            return false;
        }
        if (!this.spendGold(XP_COST)) {
            return false;
        }

        this.gainXp(XP_AMOUNT);
        return true;
    }

    // XP ha tobb vigyuk at kovetkezo szintre
    gainXp(amount) {
        if (this.level >= MAX_LEVEL) {
            return;
        }

        this.xp += amount;

        // Tobb szint lepese
        while (this.level < MAX_LEVEL && this.xp >= this.maxExp) {
            this.xp -= this.maxExp;
            this.levelUp();
        }

        // Max szintnel nincs xp
        if (this.level >= MAX_LEVEL) {
            this.xp = 0;
        }
    }

    levelUp() {
        this.level++;

        if (this.xpTable[this.level]) {
            this.maxExp = this.xpTable[this.level];
        } else {
            this.maxExp = 0;    // max elerese
        }
    }


    // Bench v Board lekerese
    getZone(zoneName) {
        if (zoneName === "bench") {
            return this.bench;
        }
        if (zoneName === "board") {
            return this.board;
        }
        return null;
    }

    // Elso szabad hely lekerese
    findEmptySlot(zone) {
        return zone.indexOf(null);
    }

    hasBenchSpace() {
        return this.findEmptySlot(this.bench) !== -1;
    }

    // Uj Unit elso ures helyre keruljon
    addUnitToBench(unit) {
        let slot = this.findEmptySlot(this.bench);

        if (slot === -1) {
            return false;
        }

        this.bench[slot] = unit;
        return true;
    }

    
    // Egysegek mozgatasa helyek kozott cserevel
    moveUnit(fromZoneName, fromIndex, toZoneName, toIndex) {
        let fromZone = this.getZone(fromZoneName);
        let toZone = this.getZone(toZoneName);

        // Ervenytelen helyek
        if (!fromZone || !toZone) {
            return false;
        }
        if (fromIndex < 0 || fromIndex >= fromZone.length) {
            return false;
        }
        if (toIndex < 0 || toIndex >= toZone.length) {
            return false;
        }

        let movingUnit = fromZone[fromIndex];
        if (movingUnit === null) {
            return false;       // nincs mit mozgatni
        }

        let otherUnit = toZone[toIndex];    // lehet null is

        toZone[toIndex] = movingUnit;
        fromZone[fromIndex] = otherUnit;
        return true;
    }

    // Egyseg kivetele eladashoz
    removeUnit(zoneName, index) {
        let zone = this.getZone(zoneName);

        if (!zone || index < 0 || index >= zone.length) {
            return null;
        }

        let unit = zone[index];
        zone[index] = null;
        return unit;
    }

    // Csataban levo elo egysegek balrol jobbra
    getBoardUnits() {
        return this.board.filter(unit => unit !== null);
    }


   // Unitok level upja 3-nal
    mergeUnits() {
        let mergeCount = 0;

        while (this.mergeOnce()) {
            mergeCount++;
        }
        return mergeCount;
    }

    // Egyesites
    mergeOnce() {
        // Ha 3 van akkor egyesul es a boardon levove
        let entries = [];

        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] !== null) {
                entries.push({ zone: this.board, index: i, unit: this.board[i] });
            }
        }
        for (let i = 0; i < this.bench.length; i++) {
            if (this.bench[i] !== null) {
                entries.push({ zone: this.bench, index: i, unit: this.bench[i] });
            }
        }

        // Csoportositas
        let groups = {};

        for (let entry of entries) {
            let key = entry.unit.id + "_" + entry.unit.tier;

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(entry);
        }

        // Csoport keresese
        for (let key in groups) {
            let group = groups[key];
            let survivor = group[0];

            if (group.length >= 3 && survivor.unit.tier < 3) {

                // elso egyseg megkapja a masik 2 buffjat
                survivor.unit.absorbUnit(group[1].unit);
                survivor.unit.absorbUnit(group[2].unit);

                // masik 2 eltunik
                group[1].zone[group[1].index] = null;
                group[2].zone[group[2].index] = null;

                // elso egyseg upgradelok 
                survivor.unit.upgrade();

                // taunt alapra, kesobb dontsuk el h maradjon e
                survivor.unit.isTaunt = false;
                return true;
            }
        }

        return false;
    }


    // Spell
    hasSpellSpace() {
        return this.findEmptySlot(this.spellInventory) !== -1;
    }

    // Spell hozzaadasa az elso helyre
    addSpell(spell) {
        let slot = this.findEmptySlot(this.spellInventory);

        if (slot === -1) {
            return false;
        }

        this.spellInventory[slot] = spell;
        return true;
    }

    // Spell hasznalat es lefut e
    useSpell(slotIndex, target) {
        if (slotIndex < 0 || slotIndex >= this.spellInventory.length) {
            return false;
        }

        let spell = this.spellInventory[slotIndex];
        if (spell === null) {
            return false;
        }

        let success = spell.use(target);

        if (success) {
            this.spellInventory[slotIndex] = null;
        }
        return success;
    }
}
