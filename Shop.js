export class Shop {
    constructor(allHeroes, allSpells) {
        this.allHeroes = allHeroes;
        this.allSpells = allSpells;
        
        // A bolt helyei (Mostantól fixen 6 slot van)
        this.slots = [null, null, null, null, null, null]; 
        this.isFrozen = false; // Fagyasztás állapota (később használjuk)

        // Itt tároljuk a két "zsákot"
        this.heroPoolArray = [];
        this.spellPoolArray = [];
        
        // Létrehozzuk a zsákokat a kezdéskor
        this.initializeHeroPool();
        this.initializeSpellPool();

        // Játékos szintje szerinti esélyek (Drop Rates)
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

    // ==========================================
    // 1. ZSÁKOK FELTÖLTÉSE (Hősök és Spellek)
    // ==========================================
    
    initializeHeroPool() {
        for (let i = 0; i < this.allHeroes.length; i++) {
            let hero = this.allHeroes[i];
            // A te arányaid: 1-es cost: 21, 2-es: 18, 3-as: 15, 4-es: 12, 5-ös: 9
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
            // A te arányaid: 1-es: 5, 2-es: 4, 3-as: 3, 4-es: 2, 5-ös: 2
            let count = (spell.cost === 1) ? 5 : (spell.cost === 2) ? 4 : (spell.cost === 3) ? 3 : (spell.cost === 4) ? 2 : 2;
            
            for (let c = 0; c < count; c++) { 
                this.spellPoolArray.push(spell); 
            }
        }
        console.log(`Spell zsák feltöltve! Összesen: ${this.spellPoolArray.length} db`);
    }

    // ==========================================
    // 2. FŐVEZÉRLŐ: A bolt frissítése (Gomb hatására)
    // ==========================================
    refreshShop(player) {
        // Végigmegyünk mind a 6 sloton egyenként
        for (let i = 0; i < this.slots.length; i++) {
            // Minden slot megkapja a maga kisorsolt elemét
            this.slots[i] = this.generateShopItem(player.level);
        }
        console.log("🔄 A 6 slotos bolt sikeresen frissült!");
    }

    // ==========================================
    // 3. SEGÉD: Egyetlen slot sorsolásának menete
    // ==========================================
    generateShopItem(playerLevel) {
        // A) Eldöntjük, hogy hős vagy spell legyen ebben a slotban
        let itemType = this.decideItemType(); // Visszaadja: 'hero' vagy 'spell'
        
        // B) Kiszámoljuk a ritkaságot (cost/tier) a játékos szintje alapján
        let tier = this.rollTier(playerLevel); 

        let item = null;

        // C) Megpróbáljuk kihúzni a megfelelő zsákból
        if (itemType === 'hero') {
            item = this.drawFromPool(this.heroPoolArray, tier);
            
            // BIZTONSÁGI HÁLÓ: Ha elfogyott a hős, átváltunk spelles zsákra!
            if (!item) {
                item = this.drawFromPool(this.spellPoolArray, tier);
            }
        } else {
            item = this.drawFromPool(this.spellPoolArray, tier);
            
            // BIZTONSÁGI HÁLÓ: Ha elfogyott a spell, átváltunk hős zsákra!
            if (!item) {
                item = this.drawFromPool(this.heroPoolArray, tier);
            }
        }

        return item; // Visszaadja a kész elemet (vagy null-t, ha minden üres)
    }

    // ==========================================
    // 4. SEGÉD: Eldönti, hogy hős vagy spell legyen
    // ==========================================
    decideItemType() {
        let randomNumber = Math.random();
        // Pl. 25% esély spellre, 75% esély hősre (ezt itt tudod átírni, ha akarod)
        if (randomNumber < 0.25) {
            return 'spell';
        }
        return 'hero';
    }

    // ==========================================
    // 5. SEGÉD: Szint szerinti Tier sorsolás (Drop Rate)
    // ==========================================
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
        return 1; // Biztonsági alapérték
    }

    // ==========================================
    // 6. SEGÉD: Kihúzás a zsákból (Splice + darabszám csökkenés)
    // ==========================================
    drawFromPool(poolArray, tier) {
        let matchingIndices = [];

        // Megkeressük a zsákban az összes olyan elemet, aminek a costja megegyezik a keresett tierrel
        for (let i = 0; i < poolArray.length; i++) {
            if (poolArray[i].cost === tier) {
                matchingIndices.push(i);
            }
        }

        // Ha nincs ebből a costból elem a zsákban, visszatérünk null-lal
        if (matchingIndices.length === 0) {
            return null;
        }

        // Véletlenszerűen választunk egyet a találatok közül
        let randomIndex = Math.floor(Math.random() * matchingIndices.length);
        let bagIndex = matchingIndices[randomIndex];

        // KIVESSZÜK A ZSÁKBÓL (.splice -> ez csökkenti a zsák méretét!)
        let removedItem = poolArray.splice(bagIndex, 1)[0];

        // Klónozzuk, hogy a boltban lévő példány önálló legyen
        let itemCopy = Object.assign(Object.create(Object.getPrototypeOf(removedItem)), removedItem);
        return itemCopy;
    }

    // ==========================================
    // 7. VÁSÁRLÁSI LOGIKA (Buy)
    // ==========================================
    buyItem(slotIndex, player) {
        // 1. Ellenőrzés: Létezik-e az elem az adott slotban (nem null-e)
        let item = this.slots[slotIndex];
        if (!item) {
            console.log("❌ Ez a slot üres!");
            return false;
        }

        // 2. Ellenőrzés: Van-e elég aranya a játékosnak
        if (player.gold < item.cost) {
            console.log("❌ Nincs elég aranyad ehhez a vásárláshoz!");
            return false;
        }

        // 3. Ellenőrzés és áthelyezés típustól függően (Hős vs Spell)
        // Megnézzük, hogy hős-e (van hp tulajdonsága, vagy cost alapján eldönthető, de a Unit példányokat vizsgáljuk)
        let isHero = item.hp !== undefined; // Vagy ellenőrizheted osztály szerint is

        if (isHero) {
            // Hős esetén ellenőrizzük a kispadot (max 10 hely)
            if (player.bench.length >= 10) {
                console.log("❌ A kispad tele van! (Max 10 hely)");
                return false;
            }

            // Levonjuk az aranyat a Player metódusával
            player.spendGold(item.cost);

            // Beletesszük a hősöket a kispadra
            player.addUnitToBench(item);

        } else {
            // Spell / Varázslat esetén az inventory-ba rakjuk
            // Levonjuk az aranyat[cite: 4]
            player.spendGold(item.cost);

            // Beletesszük a varázslat inventoryba[cite: 4]
            player.addItemToInventory(item);
        }

        // 4. A bolt slotjának kiürítése (Mivel elvitték az árut)
        this.slots[slotIndex] = null;

        console.log(`✅ Sikeres vásárlás! Megvetted: ${item.name}`);
        return true;
    }

    // ==========================================
    // 8. ELADÁSI LOGIKA (Sell)
    // ==========================================
    sellUnit(player, benchIndex) {
        // 1. Ellenőrzés: Létezik-e az adott hős a kispadon
        let unitToSell = player.bench[benchIndex];
        if (!unitToSell) {
            console.log("❌ Nincs hős ezen a kispad sloton!");
            return false;
        }

        // 2. Arany visszatérítése a játékosnak
        // (Alap esetben a hős cost-ja jár vissza, de csillagszint szerint is lehet növelni)
        let refundGold = unitToSell.cost * (unitToSell.tier || 1); 
        player.addGold(refundGold);

        // 3. Eltávolítás a játékos kispadjáról (.splice-dzsal)
        player.bench.splice(benchIndex, 1);

        // 4. Visszadobás a hősök zsákjába (Pool management)
        // Létrehozunk egy tiszta példányt vagy magát az objektumot visszatesszük a zsákba
        this.heroPoolArray.push(unitToSell);

        console.log(`💰 Sikeres eladás! Eladtad ezt a hőst: ${unitToSell.name}, visszakaptál ${refundGold} aranyat.`);
        console.log(`📦 A hős visszakerült a zsákba. Jelenlegi hős zsák mérete: ${this.heroPoolArray.length}`);

        return true;
    }

    // ==========================================
    // 9. ÚJRAPÖRGETÉS LOGIKA (Reroll)
    // ==========================================
    rerollShop(player, rerollCost = 2) {
        // 1. Ellenőrzés: Van-e elég aranya a játékosnak a rerollhoz
        if (player.gold < rerollCost) {
            console.log("❌ Nincs elég aranyad az újrapörgetéshez!");
            return false;
        }

        // 2. Az el nem adott elemek visszadobása a zsákokba
        for (let i = 0; i < this.slots.length; i++) {
            let item = this.slots[i];
            if (item !== null) {
                // Megnézzük, hogy hős vagy spell, és visszatesszük a megfelelő zsákba
                let isHero = item.hp !== undefined;
                if (isHero) {
                    this.heroPoolArray.push(item);
                } else {
                    this.spellPoolArray.push(item);
                }
                // Kiürítjük a slotot
                this.slots[i] = null;
            }
        }

        // 3. Levonjuk az aranyat a játékostól[cite: 4]
        player.spendGold(rerollCost);

        // 4. Frissítjük a boltot (új elemek sorsolása mind a 6 slotba)
        this.refreshShop(player);

        console.log("🎲 A bolt újra lett pörgetve!");
        return true;
    }

    // ==========================================
    // 10. FAGYASZTÁS LOGIKA (Freeze)
    // ==========================================
    toggleFreeze() {
        this.isFrozen = !this.isFrozen;
        console.log(`❄️ Bolt fagyasztva: ${this.isFrozen ? "BEKAPCSOLVA" : "KIKAPCSOLVA"}`);
        return this.isFrozen;
    }
}