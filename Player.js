export class Player {
    constructor(name = "Játékos") {
        this.name = name;
        this.hp = 3;            
        this.gold = 10;        
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

    gainXp(amount) {
        if (this.level >= 9) return;

        this.xp += amount;
        console.log(`📈 XP növekedés: ${this.xp} / ${this.maxExp} (Szint: ${this.level})`);

        if (this.xp >= this.maxExp) {
            this.levelUp();
        }
    }

    levelUp() {
        if (this.level >= 9) return;

        this.level++;
        this.xp = 0; 
        
        if (this.xpTable[this.level]) {
            this.maxExp = this.xpTable[this.level];
        } else {
            this.maxExp = 0; 
            console.log("🏆 Elérted a maximális (9.) szintet!");
        }
        
        console.log(`🎉 Szintlépés! Elérted a ${this.level}. szintet! Következő cél: ${this.maxExp} XP.`);
    }

    addItemToInventory(item) {
        let emptyIndex = this.itemInventory.indexOf(null);
        
        if (emptyIndex !== -1) {
            this.itemInventory[emptyIndex] = item;
            return true;
        } else if (this.itemInventory.length < 6) { 
            this.itemInventory.push(item);
            return true;
        }
        
        console.log("A spell raktár tele van!");
        return false;
    }

    useItemFromInventory(index) {
        if (index >= 0 && index < this.itemInventory.length) {
            const usedItem = this.itemInventory[index];
            
            if (usedItem === null) {
                console.log("Ez a hely már üres!");
                return false;
            }

            this.itemInventory[index] = null; 
            console.log(`✨ Felhasznált tárgy/spell a(z) ${index}. slotról:`, usedItem);
            return true;
        }
        console.log("Nincs ilyen indexű hely a raktárban!");
        return false;
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
            return true; 
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

    moveUnitBenchToBoard(unit) {
        let benchIndex = this.bench.indexOf(unit);

        if (benchIndex !== -1) {
            if (this.board.length < 6) {
                this.bench.splice(benchIndex, 1);
                this.board.push(unit);
                console.log(`⚔️ ${unit.name} átkerült a padról a harctérre.`);
                return true;
            } else {
                console.log("A harctér tele van! (Max 6 hely)");
                return false;
            }
        }
        console.log("Ez az egység nincs rajta a kispadon!");
        return false;
    }

    moveUnitBoardToBench(unit) {
        let boardIndex = this.board.indexOf(unit);

        if (boardIndex !== -1) {
            if (this.bench.length < 10) {
                this.board.splice(boardIndex, 1);
                this.bench.push(unit);
                console.log(`🛡️ ${unit.name} visszakerült a harctérről a kispadra.`);
                return true;
            } else {
                console.log("A kispad tele van! (Max 10 hely)");
                return false;
            }
        }
        console.log("Ez az egység nincs rajta a harctéren!");
        return false;
    }
}