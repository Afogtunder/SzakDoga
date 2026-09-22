export class Player {
    constructor(name = "Játékos") {
        this.name = name;
        this.hp = 3;            // 3 életcsík
        this.gold = 10;         // Kezdő arany
        this.level = 1;
        this.xp = 0;
        this.bench = [];        // Kispad: max 10 férőhely
        this.board = [];        // Harctér: max 6 férőhely
    }

    // Arany növelése
    addGold(amount) {
        this.gold += amount;
    }

    // Arany elköltése (vásárláshoz)
    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        console.log("Nincs elég aranyad!");
        return false;
    }

    // Élet csökkentése vereségkor: fixen 1-gyel csökken
    takeDamage() {
        if (this.hp > 0) {
            this.hp -= 1;
        }
    }

    // Hős hozzáadása a kispadhoz (max 10)
    addUnitToBench(unit) {
        if (this.bench.length < 10) {
            this.bench.push(unit);
            return true;
        }
        console.log("A kispad tele van! (Max 10 hely)");
        return false;
    }

    // Hős áttétele a harctérre (max 6)
    addUnitToBoard(unit) {
        if (this.board.length < 6) {
            this.board.push(unit);
            return true;
        }
        console.log("A harctér tele van! (Max 6 hely)");
        return false;
    }
}