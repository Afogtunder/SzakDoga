export class Unit {
    constructor(id, name, cost, hp, damage, image, tier = 1, traits = []) {
        this.id = id;
        this.name = name;
        this.cost = cost;       // 1-5 arany közötti költség
        this.hp = hp;
        this.damage = damage;
        this.image = image;
        this.tier = tier;       // 1, 2, vagy 3 csillag
        this.isFrozen = false;
        this.traits = traits; // további skillek MAJD
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
}