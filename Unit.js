export class Unit {

    // ID index
    static #nextUid = 1;

    constructor(id, name, cost, hp, damage, image, traits = []) {

        this.uid = Unit.#nextUid;  
        Unit.#nextUid++;
        this.id = id;               // level up-hoz kell
        this.name = name;

        this.cost = cost;           
        this.image = image;
        this.traits = traits;       
        this.tier = 1;             

        // alap stat
        this.cardHp = hp;
        this.cardDamage = damage;

        // buffolni valo statok
        this.buffHp = 0;
        this.buffDamage = 0;

        // traittel valo statok
        this.traitBonusHp = 0;
        this.traitBonusDamage = 0;

        this.isTaunt = false;
    }

    // trait es taunt nelkuli hp + spellek buffal
    get permanentHp() {
        return this.cardHp + this.buffHp;
    }

    // trait es taunt nelkuli dmg + spellek buffal
    get permanentDamage() {
        return this.cardDamage + this.buffDamage;
    }

    // taunt hp-dmg konvertalas
    get tauntShift() {
        if (!this.isTaunt) {
            return 0;
        }

        let shift = Math.round(this.permanentDamage * 0.20);
        if (shift < 1) {
            shift = 1;
        }

        let maxShift = this.permanentDamage - 1;
        if (shift > maxShift) {
            shift = maxShift;
        }
        if (shift < 0) {
            shift = 0;
        }

        return shift;
    }

    // minden spell + traut + taunt hp-ra
    get hp() {
        let total = this.permanentHp + this.traitBonusHp + this.tauntShift;

        if (total < 1) {
            total = 1;
        }
        return total;
    }

    // minden spell + traut + taunt dmg-re
    get damage() {
        let total = this.permanentDamage + this.traitBonusDamage - this.tauntShift;

        if (total < 1) {
            total = 1;
        }
        return total;
    }

    // taunt be-ki kapcsolas
    toggleTaunt() {
        this.isTaunt = !this.isTaunt;
        return this.isTaunt;
    }


    // spellek castolasa innentol
    addPermanentHp(amount) {
        this.buffHp += amount;
    }

    addPermanentDamage(amount) {
        this.buffDamage += amount;
    }

    doubleStats() {
        let newHp = this.permanentHp * 2;
        let newDamage = this.permanentDamage * 2;

        this.buffHp = newHp - this.cardHp;
        this.buffDamage = newDamage - this.cardDamage;
    }

    swapStats() {
        let oldHp = this.permanentHp;
        let oldDamage = this.permanentDamage;

        this.buffHp = oldDamage - this.cardHp;
        this.buffDamage = oldHp - this.cardDamage;
    }

    // Unitok levelesenek upgradeolasa csak statokban
    upgrade() {
        if (this.tier >= 3) {
            return false;
        }

        this.tier++;
        this.cardHp = Math.round(this.cardHp * 1.8);
        this.cardDamage = Math.round(this.cardDamage * 1.8);
        return true;
    }

    //  Levelupnal atvesszuk a buffokat
    absorbUnit(other) {
        if (other.buffHp > 0) {
            this.buffHp += other.buffHp;
        }
        if (other.buffDamage > 0) {
            this.buffDamage += other.buffDamage;
        }
    }


   // Shopba klonozas ugyan azokkal az adatokkal
    clone() {
        let copy = new Unit(
            this.id,
            this.name,
            this.cost,
            this.cardHp,
            this.cardDamage,
            this.image,
            [...this.traits]
        );

        copy.tier = this.tier;
        copy.buffHp = this.buffHp;
        copy.buffDamage = this.buffDamage;

        return copy;
    }

    // Copyk tamadnak a csataba eredeti sertetlen maradjon
    createBattleCopy() {
        let battleUnit = {
            uid: this.uid,
            name: this.name,
            image: this.image,
            hp: this.hp,            // aktualis hp amit csokkentunk
            maxHp: this.hp,         // amivel kezd hp 
            damage: this.damage,
            isTaunt: this.isTaunt
        };

        return battleUnit;
    }
}
