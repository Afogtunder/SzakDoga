import { Unit } from './Unit.js';

export const allHeroes = [

    // ----- 1 cost -----
    new Unit("tank_1",     "Pajzsos Őr",          1, 10,  1, "images/monster1/1cost-six.PNG",   ["tank"]),
    new Unit("warrior_1",  "Újonc Harcos",        1,  6,  3, "images/monster1/1cost-one.PNG",   ["warrior"]),
    new Unit("treasure_1", "Zsebmetsző",          1,  7,  2, "images/monster1/1cost-five.PNG",  ["treasure"]),
    new Unit("sage_1",     "Tanonc",              1,  7,  2, "images/monster1/1cost-three.PNG", ["sage"]),
    new Unit("lucky_1",    "Szerencsés Csavargó", 1,  7,  2, "images/monster1/1cost-two.PNG",   ["lucky"]),

    // ----- 2 cost -----
    new Unit("tank_2",     "Vasfalú",       2, 18,  2, "images/monster2/2cost-five.PNG", ["tank"]),
    new Unit("warrior_2",  "Kardforgató",   2, 11,  4, "images/monster2/2cost-four.PNG", ["warrior"]),
    new Unit("treasure_2", "Kalandor",      2, 13,  3, "images/monster2/2cost-one.PNG",  ["treasure"]),
    new Unit("sage_2",     "Gyógynövényes", 2, 13,  3, "images/monster2/2cost-two.PNG",  ["sage"]),
    new Unit("lucky_2",    "Kockavető",     2, 13,  3, "images/monster2/2cost-zero.PNG", ["lucky"]),

    // ----- 3 cost -----
    new Unit("tank_3",     "Kőbástya",     3, 29,  4, "images/monster3/3cost-five.PNG",  ["tank"]),
    new Unit("warrior_3",  "Vérszomjas",   3, 18,  7, "images/monster3/3cost-four.PNG",  ["warrior"]),
    new Unit("treasure_3", "Kincskereső",  3, 20,  5, "images/monster3/3cost-one.PNG",   ["treasure"]),
    new Unit("sage_3",     "Bölcs Mágus",  3, 20,  5, "images/monster3/3cost-three.PNG", ["sage"]),
    new Unit("lucky_3",    "Lóhere Lovag", 3, 20,  5, "images/monster3/3cost-two.PNG",       ["lucky"]),

    // ----- 4 cost -----
    new Unit("tank_4",     "Hegyi Titán", 4, 42,  5, "images/monster4/4cost-eight.PNG", ["tank"]),
    new Unit("warrior_4",  "Háború Ura",  4, 26,  9, "images/monster4/4cost-four.PNG",  ["warrior"]),
    new Unit("treasure_4", "Ősi Feltáró", 4, 29,  6, "images/monster4/4cost-onet.PNG",  ["treasure"]),
    new Unit("sage_4",     "Nagymester",  4, 29,  6, "images/monster4/4cost-two.PNG",   ["sage"]),
    new Unit("lucky_4",    "Sorsfonó",    4, 29,  6, "images/monster4/4cost-zero.PNG",  ["lucky"]),

    // ----- 5 cost -----
    new Unit("tank_5",     "Mennydörgő Óriás", 5, 59,  7, "images/monster5/5cost-five.PNG", ["tank"]),
    new Unit("warrior_5",  "Csatakirály",      5, 36, 13, "images/monster1/5cost-four.PNG", ["warrior"]),
    new Unit("treasure_5", "Aranykirály",      5, 41,  9, "images/monster5/5cost-one.PNG",  ["treasure"]),
    new Unit("sage_5",     "Ősi Jós",          5, 41,  9, "images/monster5/5cost-two.PNG",  ["sage"]),
    new Unit("lucky_5",    "Szerencsecsillag", 5, 41,  9, "images/monster5/6cost-zero.PNG", ["lucky"])
];
