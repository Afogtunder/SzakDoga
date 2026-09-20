import { Monster } from './Monster.js';

export const campaignMaps = [
    { level: 1, enemy: new Monster("goblin", 60, 10, "goblin.png") },
    { level: 2, enemy: new Monster("orc", 100, 18, "orc.png") },
    { level: 3, enemy: new Monster("mage", 80, 25, "mage.png") },
    { level: 4, enemy: new Monster("beast", 150, 30, "beast.png") },
    { level: 5, enemy: new Monster("golem", 220, 35, "golem.png") },
    { level: 6, enemy: new Monster("boss", 400, 50, "boss.png") }
];