export enum Animals {
    fox,
    cat,
    birb,
    panda,
    red_panda,
    racoon,
    kangaroo,
    whale,
    dog,
    bird,
    koala
}

export function GetRandomAnimal() {
    let values = Object.values(Animals).filter(value => typeof value === "number") as Animals[];
    let randIndex = values[Math.floor(Math.random() * values.length)];
    
    return Animals[randIndex];
}