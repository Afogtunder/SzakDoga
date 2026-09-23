export class Monster {
    constructor(id, hp, damage, image) {
        this.id = id;
        this.hp = hp;        // Az aktuális (és egyben egyetlen) HP
        this.damage = damage; // Az aktuális (és egyben egyetlen) sebzés
        this.image = image;
        
        this.isFrozen = false; // Ha esetleg fagyasztva van
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }
}