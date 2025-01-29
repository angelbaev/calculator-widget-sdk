import {generateUUID} from "../../utils/generate-uuid";
import { CalculatorAwareInterface } from "../interface/calculator-aware.interface";


export default abstract class AbstractCalculator implements CalculatorAwareInterface {
    public uuid: string = generateUUID();

    constructor(public name: string) {
    }

    abstract validator(container: HTMLElement): boolean;
    abstract render(container: HTMLElement): void;
}