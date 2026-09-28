export class Player {
    constructor(name = "Játékos") {
        this.name = name;
        this.hp = 3;            
        this.gold = 10;         
        this.level = 1;         
        this.xp = 0;            // Mindig 0-ról indul az aktuális szinten
        
        // A pontos XP-táblázat a megadott értékek alapján (max 9. szint)
        this.xpTable = {
            1: 2,   // 1 -> 2 szinthez
            2: 6,   // 2 -> 3 szinthez
            3: 10,  // 3 -> 4 szinthez
            4: 20,  // 4 -> 5 szinthez
            5: 36,  // 5 -> 6 szinthez
            6: 60,  // 6 -> 7 szinthez
            7: 68,  // 7 -> 8 szinthez
            8: 68   // 8 -> 9 szinthez (Max szint elérése)
        };
        
        this.maxExp = this.xpTable[this.level] || 2;

        this.bench = [];        
        this.board = [];        
        this.itemInventory = []; 
    }

    addGold(amount) {
        this.gold += amount;
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        console.log("Nincs elég aranyad!");
        return false;
    }

    // XP növelése (pl. vásárláskor vagy kör végén)
    gainXp(amount) {
        if (this.level >= 9) return; // 9 a max szint

        this.xp += amount;
        console.log(`📈 XP növekedés: ${this.xp} / ${this.maxExp} (Szint: ${this.level})`);

        if (this.xp >= this.maxExp) {
            this.levelUp();
        }
    }

    // Szintlépés: XP nullázódik, szint nő, új cél beállítása
    levelUp() {
        if (this.level >= 9) return;

        this.level++;
        this.xp = 0; // Visszaugrik 0-ra, ahogy megbeszéltük!
        
        if (this.xpTable[this.level]) {
            this.maxExp = this.xpTable[this.level];
        } else {
            this.maxExp = 9999; // 9. szint után nincs tovább
            console.log("🏆 Elérted a maximális (9.) szintet!");
        }
        
        console.log(`🎉 Szintlépés! Elérted a ${this.level}. szintet! Következő cél: ${this.maxExp} XP.`);
    }

    addItemToInventory(item) {
        this.itemInventory.push(item);
        return true;
    }

   takeDamage(amount = 1) {
        if (this.hp > 0) {
            this.hp -= amount;
            if (this.hp < 0) {
                this.hp = 0;
            }
            console.log(`💥 ${this.name} sérülést szenvedett! Maradt élet: ${this.hp}`);
        }

        if (this.hp === 0) {
            console.log(`💀 JÁTÉK VÉGE! ${this.name} kiesett a játékból!`);
            // Itt majd meghívhatjuk a játékvége (game over) eseményt is
            return true; // Jelzi, hogy a játékos meghalt
        }
        return false;
    }

    addUnitToBench(unit) {
        if (this.bench.length < 10) {
            this.bench.push(unit);
            return true;
        }
        console.log("A kispad tele van! (Max 10 hely)");
        return false;
    }

    addUnitToBoard(unit) {
        if (this.board.length < 6) {
            this.board.push(unit);
            return true;
        }
        console.log("A harctér tele van! (Max 6 hely)");
        return false;
    }
}