export class Shop {
    constructor(allHeroes, allSpells) {
        this.allHeroes = allHeroes;
        this.allSpells = allSpells;
        
        this.slots = [null, null, null, null, null, null]; 
        this.isFrozen = false; 

        this.heroPoolArray = [];
        this.spellPoolArray = [];
        
        this.initializeHeroPool();
        this.initializeSpellPool();

        this.dropRates = {
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
    }

    initializeHeroPool() {
        for (let i = 0; i < this.allHeroes.length; i++) {
            let hero = this.allHeroes[i];
            let count = (hero.cost === 1) ? 21 : (hero.cost === 2) ? 18 : (hero.cost === 3) ? 15 : (hero.cost === 4) ? 12 : 9;
            
            for (let c = 0; c < count; c++) { 
                this.heroPoolArray.push(hero); 
            }
        }
        console.log(`Hős zsák feltöltve! Összesen: ${this.heroPoolArray.length} db`);
    }

    initializeSpellPool() {
        for (let i = 0; i < this.allSpells.length; i++) {
            let spell = this.allSpells[i];
            let count = (spell.cost === 1) ? 5 : (spell.cost === 2) ? 4 : (spell.cost === 3) ? 3 : (spell.cost === 4) ? 2 : 2;
            
            for (let c = 0; c < count; c++) { 
                this.spellPoolArray.push(spell); 
            }
        }
        console.log(`Spell zsák feltöltve! Összesen: ${this.spellPoolArray.length} db`);
    }

    refreshShop(player) {
        // Ha fagyasztva van, nem frissül a bolt
        if (this.isFrozen) {
            console.log("❄️ A bolt fagyasztva van, nem frissült ebben a körben!");
            return;
        }

        for (let i = 0; i < this.slots.length; i++) {
            this.slots[i] = this.generateShopItem(player.level);
        }
        console.log("🔄 A 6 slotos bolt sikeresen frissült!");
    }

    generateShopItem(playerLevel) {
        let itemType = this.decideItemType(); 
        let tier = this.rollTier(playerLevel); 
        let item = null;

        if (itemType === 'hero') {
            item = this.drawFromPool(this.heroPoolArray, tier);
            if (!item) {
                item = this.drawFromPool(this.spellPoolArray, tier);
            }
        } else {
            item = this.drawFromPool(this.spellPoolArray, tier);
            if (!item) {
                item = this.drawFromPool(this.heroPoolArray, tier);
            }
        }

        return item; 
    }

    decideItemType() {
        let randomNumber = Math.random();
        if (randomNumber < 0.25) {
            return 'spell';
        }
        return 'hero';
    }

    rollTier(playerLevel) {
        let rates = this.dropRates[playerLevel] || this.dropRates[1];
        let randomNumber = Math.random();
        let cumulative = 0;

        for (let tier in rates) {
            cumulative += rates[tier];
            if (randomNumber <= cumulative) {
                return parseInt(tier);
            }
        }
        return 1; 
    }

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

        let randomIndex = Math.floor(Math.random() * matchingIndices.length);
        let bagIndex = matchingIndices[randomIndex];

        let removedItem = poolArray.splice(bagIndex, 1)[0];
        let itemCopy = Object.assign(Object.create(Object.getPrototypeOf(removedItem)), removedItem);
        return itemCopy;
    }

    buyItem(slotIndex, player) {
        let item = this.slots[slotIndex];
        if (!item) {
            console.log("❌ Ez a slot üres!");
            return false;
        }

        if (player.gold < item.cost) {
            console.log("❌ Nincs elég aranyad ehhez a vásárláshoz!");
            return false;
        }

        let isHero = item.hp !== undefined; 

        if (isHero) {
            if (player.bench.length >= 10) {
                console.log("❌ A kispad tele van! (Max 10 hely)");
                return false;
            }

            player.spendGold(item.cost);
            player.addUnitToBench(item);

        } else {
            player.spendGold(item.cost);
            player.addItemToInventory(item);
        }

        this.slots[slotIndex] = null;

        console.log(`✅ Sikeres vásárlás! Megvetted: ${item.name}`);
        return true;
    }

    // Az eladás teljes kezelése (Kiszedi a padról, ad pénzt, visszadobja a zsákba)
    sellUnit(player, benchIndex) {
        let unitToSell = player.bench[benchIndex];
        if (!unitToSell) {
            console.log("❌ Nincs hős ezen a kispad sloton!");
            return false;
        }

        let refundGold = unitToSell.cost * (unitToSell.tier || 1); 
        player.addGold(refundGold);

        player.bench.splice(benchIndex, 1);

        this.heroPoolArray.push(unitToSell);

        console.log(`💰 Sikeres eladás: Eladtad őt: ${unitToSell.name}, visszakaptál ${refundGold} aranyat.`);
        return true;
    }

    rerollShop(player, rerollCost = 2) {
        if (player.gold < rerollCost) {
            console.log("❌ Nincs elég aranyad az újrapörgetéshez!");
            return false;
        }

        for (let i = 0; i < this.slots.length; i++) {
            let item = this.slots[i];
            if (item !== null) {
                let isHero = item.hp !== undefined;
                if (isHero) {
                    this.heroPoolArray.push(item);
                } else {
                    this.spellPoolArray.push(item);
                }
                this.slots[i] = null;
            }
        }

        player.spendGold(rerollCost);

        // A reroll független a fagyasztástól (kifejezett szándék az újrasorsolás)
        let tempFreeze = this.isFrozen;
        this.isFrozen = false;
        this.refreshShop(player);
        this.isFrozen = tempFreeze;

        console.log("🎲 A bolt újra lett pörgetve!");
        return true;
    }

    toggleFreeze() {
        this.isFrozen = !this.isFrozen;
        console.log(`❄️ Bolt fagyasztva: ${this.isFrozen ? "BEKAPCSOLVA" : "KIKAPCSOLVA"}`);
        return this.isFrozen;
    }
}