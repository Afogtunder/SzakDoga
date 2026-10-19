import { Spell } from './Spell.js';

export const allSpells = [

    // ----- 1 cost -----
    new Spell("dmg_1",    "Szikra",       1, "1 sebzést okoz egy ellenségnek.",       "deal_damage", 1, "images/spells/dmg_1.png"),
    new Spell("hp_1",     "Gyógyital",    1, "+4 HP egy hősödnek, tartósan.",        "buff_hp",     4, "images/spells/hp_1.png"),
    new Spell("atk_1",    "Élesítő Kő",   1, "+1 sebzés egy hősödnek, tartósan.",    "buff_dmg",    1, "images/spells/atk_1.png"),

    // ----- 2 cost -----
    new Spell("dmg_2",    "Tűzgolyó",     2, "3 sebzést okoz egy ellenségnek.",       "deal_damage", 3, "images/spells/dmg_2.png"),
    new Spell("hp_2",     "Vaspáncél",    2, "+9 HP egy hősödnek, tartósan.",        "buff_hp",     9, "images/spells/hp_2.png"),
    new Spell("atk_2",    "Harci Üvöltés",2, "+2 sebzés egy hősödnek, tartósan.",    "buff_dmg",    2, "images/spells/atk_2.png"),

    // ----- 3 cost -----
    new Spell("dmg_3",    "Villámcsapás",  3, "6 sebzést okoz egy ellenségnek.",                  "deal_damage",     6, "images/spells/dmg_3.png"),
    new Spell("freeze_3", "Jégbilincs",    3, "Az ellenség az első körben nem támad.",              "freeze",          0, "images/spells/freeze_3.png"),
    new Spell("nerfdmg_3","Gyengítő Átok", 3, "Az ellenség sebzése 1-re csökken erre a körre.",     "nerf_enemy_dmg_1",0, "images/spells/nerfdmg_3.png"),

    // ----- 4 cost -----
    new Spell("dmg_4",    "Lángoszlop",    4, "10 sebzést okoz egy ellenségnek.",                 "deal_damage",     10, "images/spells/dmg_4.png"),
    new Spell("swap_4",   "Sorscsere",     4, "Egy hősöd HP-ja és sebzése felcserélődik, tartósan.", "swap",          0, "images/spells/swap_4.png"),
    new Spell("nerfhp_4", "Elsorvasztás",  4, "Az ellenség HP-ja 1-re csökken erre a körre.",       "nerf_enemy_hp_1", 0, "images/spells/nerfhp_4.png"),

    // ----- 5 cost -----
    new Spell("dmg_5",    "Meteor",        5, "15 sebzést okoz egy ellenségnek.",                 "deal_damage",     15, "images/spells/dmg_5.png"),
    new Spell("double_5", "Kettős Erő",    5, "Egy hősöd HP-ja és sebzése megduplázódik, tartósan.","buff_double",     0, "images/spells/double_5.png")
];