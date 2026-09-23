export class Spell {
    constructor(id, name, cost, description, type, value = 0) {
        this.id = id;
        this.name = name;               
        this.cost = cost;               
        this.description = description; 
        this.type = type;               // A kártya típusa (címkéje)
        this.value = value;             
    }

    // Az isEnemy eldönti, hogy saját vagy ellenfél lapot célozz meg
    use(target, isEnemy = false) {
        
        // --- HA AZ ELLENFÉL LAPJÁRA DOBOD ---
        if (isEnemy) {
            switch (this.type) {
                case "freeze":
                    target.isFrozen = true;
                    console.log(`❄️ [ELLENFÉL] ${target.name} meg lett fagyasztva!`);
                    break;

                case "nerf_enemy_hp_1":
                    target.hp = 1;
                    console.log(`📉 [ELLENFÉL] ${target.name} HP-ja le lett csökkentve 1-re!`);
                    break;

                case "nerf_enemy_dmg_1":
                    target.damage = 1;
                    console.log(`📉 [ELLENFÉL] ${target.name} DMG-je le lett csökkentve 1-re!`);
                    break;

                default:
                    console.log("Ez a varázslat nem használható az ellenfélen!");
            }
            return;
        }

        // --- HA A SAJÁT LAPODRA DOBOD ---
        switch (this.type) {
            case "buff_hp":
                target.hp += this.value;
                console.log(`💚 ${target.name} kapott +${this.value} HP-t!`);
                break;

            case "buff_dmg":
                target.damage += this.value;
                console.log(`⚔️ ${target.name} kapott +${this.value} sebzést!`);
                break;

            case "buff_double":
                target.hp *= 2;
                target.damage *= 2;
                console.log(`✨ ${target.name} HP-ja és DMG-je megduplázódott!`);
                break;

            case "swap":
                let temp = target.damage;
                target.damage = target.hp;
                target.hp = temp;
                console.log(`🔄 ${target.name} felcserélte a HP-ját és DMG-jét!`);
                break;

            default:
                console.log("Ismeretlen saját varázslat típus!");
        }
    }
}