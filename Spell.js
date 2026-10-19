import { Unit } from './Unit.js';
import { Monster } from './Monster.js';


// Spellek tipusai, egyszerubb kitalalni kire castolhato
const ALLY_TYPES = ["buff_hp", "buff_dmg", "buff_double", "swap"];
const ENEMY_TYPES = ["deal_damage", "freeze", "nerf_enemy_hp_1", "nerf_enemy_dmg_1"];


export class Spell {

    constructor(id, name, cost, description, type, value = 0, image = "") {

        this.id = id;
        this.name = name;
        this.cost = cost;               
        this.description = description;
        this.type = type;               // kire castolhato
        this.value = value;             // mit csinal
        this.image = image;             

        if (ALLY_TYPES.includes(type)) {
            this.target = "ally";
        } else if (ENEMY_TYPES.includes(type)) {
            this.target = "enemy";
        } else {
            throw new Error("Ismeretlen spell típus: " + type);
        }
    }


    // Target kivalasztasa
    canTarget(target) {

        if (this.target === "ally") {
            return target instanceof Unit;
        }

        if (this.target === "enemy") {
            if (!(target instanceof Monster)) {
                return false;
            }
            if (!target.isAlive()) {
                return false;
            }
            return target.canBeTargeted();
        }

        return false;
    }

    // Spell hasznalat sikerul-e
    use(target) {

        if (!this.canTarget(target)) {
            return false;
        }

        switch (this.type) {

            // Unitokra tartos spellek jatek vegeig

            case "buff_hp":
                target.addPermanentHp(this.value);
                return true;

            case "buff_dmg":
                target.addPermanentDamage(this.value);
                return true;

            case "buff_double":
                target.doubleStats();
                return true;

            case "swap":
                target.swapStats();
                return true;

            // Monsterre csak 1 korre hat
            case "deal_damage":
                return target.takeDamage(this.value);

            case "freeze":
                return target.freeze();

            case "nerf_enemy_hp_1":
                return target.setHpToOne();

            case "nerf_enemy_dmg_1":
                return target.setDamageToOne();
        }

        return false;
    }
}
