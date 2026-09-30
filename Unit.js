export class Unit {
    constructor(id, name, cost, hp, damage, image, tier = 1, traits = [], hasTaunt = false) {
        this.id = id;
        this.name = name;
        this.cost = cost;       // 1-5 arany közötti költség
        this.hp = hp;
        this.damage = damage;
        this.image = image;
        this.tier = tier;       // 1, 2, vagy 3 csillag
        this.isFrozen = false;
        this.traits = traits;   // további skillek MAJD
        this.hasTaunt = hasTaunt; // Ha true, őt kell először támadni
    }

    // Ha 3 azonos összevonásra kerül, ez a metódus lefut
    upgrade() {
        if (this.tier < 3) {
            this.tier++;
            this.hp = Math.round(this.hp * 1.8);
            this.damage = Math.round(this.damage * 1.8);
            console.log(`✨ ${this.name} sikeresen fejlődött ${this.tier}-csillagosra! ✨`);
        } else {
            console.log(`${this.name} már maximális (3-as) csillagszinten van!`);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    applyTaunt() {
        if (this.isTaunt) return; // Ha már tauntos, ne alkalmazzuk újra

        this.isTaunt = true;

        // Kiszámoljuk a DMG 20%-át és egészre kerekítjük
        let amount = Math.round(this.damage * 0.20);

        // A HP-t növeljük a kerekített értékkel
        this.hp += amount;

        // A DMG-t csökkentjük ugyanezzel az értékkel (biztosítva, hogy min. 1 maradjon)
        this.damage = Math.max(1, this.damage - amount);

        console.log(`🛡️ ${this.name} Tauntot kapott! (+${amount} HP, -${amount} DMG) -> Új HP: ${this.hp}, Új DMG: ${this.damage}`);
    }
}