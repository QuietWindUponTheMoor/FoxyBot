import { AnimalTypes } from "../Enums/AnimalTypes";
import { FoxxoOrNotFoxxo } from "../Enums/FoxxoOrNotFoxxo";

export interface FoxxoIntervalOptions {
    interval: number;
    guildID: string;
    channelID: string;
    animalType: AnimalTypes;
    foxxoOrNotFoxxo: FoxxoOrNotFoxxo;
}