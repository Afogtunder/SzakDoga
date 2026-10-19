import { Unit } from './Unit.js';
import { Spell } from './Spell.js';

const SHOP_SIZE = 6;            
export const REROLL_COST = 2;          
const SPELL_CHANCE = 0.25;      

// Unitok per cost
const HERO_COPIES = { 1: 21, 2: 18, 3: 15, 4: 12, 5: 9 };

// Spellek per cost
const SPELL_COPIES = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 2 };

// Drop chance
const DROP_RATES = {
    1: { 1: 1.00, 2: 0.00, 3: 0.00, 4: 0.00, 5: 0.00 },
    2: { 1: 0.75, 2: 0.25, 3: 0.00, 4: 0.00, 5: 0.00 },
    3: { 1: 0.55, 2: 0.30, 3: 0.15, 4: 0.00, 5: 0.00 },
    4: { 1: 0.40, 2: 0.35, 3: 0.20, 4: 0.05, 5: 0.00 },
    5: { 1: 0.25, 2: 0.35, 3: 0.30, 4: 0.10, 5: 0.00 },
    6: { 1: 0.20, 2: 0.30, 3: 0.35, 4: 0.15, 5: 0.03 },
    7: { 1: 0.15, 2: 0.25, 3: 0.35, 4: 0.20, 5: 0.05 },
    8: { 1: 0.10, 2: 0.20, 3: 0.35, 4: 0.25, 5: 0.10 },
    9: { 1: 0.05, 2: 0.15, 3: 0.30, 4: 0.30, 5: 0.20 }
};


export class Shop {

    constructor(allHeroes, allSpells) {
        this.allHeroes = allHeroes;     
        this.allSpells = allSpells;   

        this.slots = new Array(SHOP_SIZE).fill(null);
        this.isFrozen = false;

        this.heroPoolArray = [];
        this.spellPoolArray = [];

        this.initializeHeroPool();
        this.initializeSpellPool();
    }

    //Shop feltoltese Unit es Spell
    initializeHeroPool() {
        for (let hero of this.allHeroes) {
            let copies = HERO_COPIES[hero.cost];

            for (let i = 0; i < copies; i++) {
                this.heroPoolArray.push(hero);
            }
        }
    }

    initializeSpellPool() {
        for (let spell of this.allSpells) {
            let copies = SPELL_COPIES[spell.cost];

            for (let i = 0; i < copies; i++) {
                this.spellPoolArray.push(spell);
            }
        }
    }

    // Uj kor shop frissitese minden korben
    startNewRound(player) {

        if (this.isFrozen) {
            this.isFrozen = false;
        } else {
            this.returnSlotsToPool();
        }
        this.fillEmptySlots(player);
    }

    // Shop ures reszeit feltolteni
    fillEmptySlots(player) {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = this.generateShopItem(player.level);
            }
        }
    }

    // Reroll nezzuk meg h van e freerollunk elotte
    rerollShop(player, rerollCost = REROLL_COST) {

        if (!player.useFreeReroll()) {
            if (!player.spendGold(rerollCost)) {
                return false;
            }
        }
        // mostani shop kuka uj shop be
        this.returnSlotsToPool();
        this.fillEmptySlots(player);
        return true;
    }

    toggleFreeze() {
        this.isFrozen = !this.isFrozen;
        return this.isFrozen;
    }


    // Teljes shop resz mukodtetese
    buyItem(slotIndex, player, zoneName = null, index = null) {

        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            return false;
        }
        let item = this.slots[slotIndex];
        if (item === null) {
            return false;
        }

        if (!player.canAfford(item.cost)) {
            return false;
        }

        if (item instanceof Unit) {
            
            let destination = this.findHeroDestination(player, zoneName, index);

            if (destination === null) {
                return false;
            }
            player.spendGold(item.cost);
            destination.zone[destination.index] = item;
        } else {
            if (!player.hasSpellSpace()) {
                return false;
            }
            player.spendGold(item.cost);
            player.addSpell(item);
        }

        this.slots[slotIndex] = null;
        return true;
    }

    // Unitok lokaciojanak hely megadasa hova kerulhet
    findHeroDestination(player, zoneName, index) {

        let zone = player.getZone(zoneName);

        if (zone && index !== null && index >= 0 && index < zone.length && zone[index] === null) {
            return { zone: zone, index: index };
        }

        let benchSlot = player.findEmptySlot(player.bench);

        if (benchSlot !== -1) {
            return { zone: player.bench, index: benchSlot };
        }

        return null;
    }

    // Sell unitonkent
    getSellValue(unit) {
        return unit.cost * unit.tier;
    }

    // Egysegek sellelese
    sellUnit(player, zoneName, index) {
        let unit = player.removeUnit(zoneName, index);

        if (unit === null) {
            return false;
        }

        player.addGold(this.getSellValue(unit));

        
        let copies = Math.pow(3, unit.tier - 1);
        this.returnHeroToPool(unit, copies);
        return true;
    }

    // Szinten valo shop generalas, van e meg lap
    generateShopItem(playerLevel) {
        let tier = this.rollTier(playerLevel);
        let item = null;

        if (this.decideItemType() === "hero") {
            item = this.drawFromPool(this.heroPoolArray, tier);

            if (item === null) {
                item = this.drawFromPool(this.spellPoolArray, tier);
            }
        } else {
            item = this.drawFromPool(this.spellPoolArray, tier);

            if (item === null) {
                item = this.drawFromPool(this.heroPoolArray, tier);
            }
        }

        return item;
    }

    // unit v Spell
    decideItemType() {
        if (Math.random() < SPELL_CHANCE) {
            return "spell";
        }
        return "hero";
    }

    // Melyik costbol kap a jatekos szintol fuggoen
    rollTier(playerLevel) {
        let rates = DROP_RATES[playerLevel] || DROP_RATES[1];
        let randomNumber = Math.random();
        let cumulative = 0;

        for (let tier in rates) {
            cumulative += rates[tier];

            if (randomNumber < cumulative) {
                return parseInt(tier);
            }
        }
        return 1;
    }

    // Kartyak huzasa a megfelelo costbol
    drawFromPool(poolArray, tier) {

        let matchingIndices = [];

        for (let i = 0; i < poolArray.length; i++) {
            if (poolArray[i].cost === tier) {
                matchingIndices.push(i);
            }
        }

        if (matchingIndices.length === 0) {
            return null;
        }

        let randomPick = Math.floor(Math.random() * matchingIndices.length);
        let poolIndex = matchingIndices[randomPick];

        let template = poolArray.splice(poolIndex, 1)[0];

        if (template instanceof Unit) {
            return template.clone();
        }
        return template;
    }

    // Bagbe visszakuldjuk a dolgokat
    returnSlotsToPool() {
        for (let i = 0; i < this.slots.length; i++) {
            let item = this.slots[i];

            if (item === null) {
                continue;
            }

            if (item instanceof Unit) {
                this.returnHeroToPool(item, 1);
            } else {
                this.spellPoolArray.push(item);
            }
            this.slots[i] = null;
        }
    }

    // Sablonok visszakerulese
    returnHeroToPool(unit, copies) {
        let template = this.allHeroes.find(hero => hero.id === unit.id);

        if (!template) {
            return;
        }

        for (let i = 0; i < copies; i++) {
            this.heroPoolArray.push(template);
        }
    }
}
