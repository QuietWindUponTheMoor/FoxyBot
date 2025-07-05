"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animals = void 0;
exports.GetRandomAnimal = GetRandomAnimal;
var Animals;
(function (Animals) {
    Animals[Animals["fox"] = 0] = "fox";
    Animals[Animals["cat"] = 1] = "cat";
    Animals[Animals["birb"] = 2] = "birb";
    Animals[Animals["panda"] = 3] = "panda";
    Animals[Animals["red_panda"] = 4] = "red_panda";
    Animals[Animals["racoon"] = 5] = "racoon";
    Animals[Animals["kangaroo"] = 6] = "kangaroo";
    Animals[Animals["whale"] = 7] = "whale";
    Animals[Animals["dog"] = 8] = "dog";
    Animals[Animals["bird"] = 9] = "bird";
    Animals[Animals["koala"] = 10] = "koala";
})(Animals || (exports.Animals = Animals = {}));
function GetRandomAnimal() {
    let values = Object.values(Animals).filter(value => typeof value === "number");
    let randIndex = values[Math.floor(Math.random() * values.length)];
    return Animals[randIndex];
}
