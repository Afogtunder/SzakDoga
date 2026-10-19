export class Monster {

    // ID index
    static #nextUid = 1;

    constructor(type, hp, damage, image, isBoss = false, isTaunt = false) {

        
        this.uid = Monster.#nextUid;    
        Monster.#nextUid++;
        this.type = type;               
        this.image = image;
        this.isBoss = isBoss;
        this.isTaunt = isTaunt;        

        
        this.hp = hp;
        this.damage = damage;

        this.isFrozen = false;          
    }


    // Allapot lekeres
    isAlive() {
        return this.hp > 0;
    }

    // Targetelheto-e
    canBeTargeted() {
        return !this.isBoss;
    }

    // Dmg spellek
    takeDamage(amount) {
        if (!this.canBeTargeted()) {
            return false;
        }

        this.hp -= amount;

        if (this.hp < 0) {
            this.hp = 0;
        }
        return true;
    }

    // HP 1-re
    setHpToOne() {
        if (!this.canBeTargeted()) {
            return false;
        }

        if (this.hp > 1) {
            this.hp = 1;
        }
        return true;
    }

    // DMG 1-re
    setDamageToOne() {
        if (!this.canBeTargeted()) {
            return false;
        }

        if (this.damage > 1) {
            this.damage = 1;
        }
        return true;
    }

    // Freeze
    freeze() {
        if (!this.canBeTargeted()) {
            return false;
        }

        this.isFrozen = true;
        return true;
    }
    
    // Copyk tamadnak a csataba eredeti sertetlen maradjon
    createBattleCopy() {
        let battleUnit = {
            uid: this.uid,
            name: this.type,
            image: this.image,
            hp: this.hp,            // aktualis hp amit csokkentunk
            maxHp: this.hp,         // amivel kezd hp 
            damage: this.damage,
            isTaunt: this.isTaunt,
            isFrozen: this.isFrozen
        };

        return battleUnit;
    }
}
