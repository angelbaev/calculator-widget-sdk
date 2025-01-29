import {generateUUID} from "../../utils/generate-uuid";
import { CalculatorAwareInterface } from "../interface/calculator-aware.interface";


export default abstract class AbstractCalculator implements CalculatorAwareInterface {
    public uuid: string = generateUUID();

    protected constructor(public name: string) {
    }

    protected getShadowRoot(container: HTMLElement) {
        return  container.shadowRoot ?? container.attachShadow({ mode: "open" });
    }
    protected loadStyles(shadow: ShadowRoot, name: string): void {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `./css/src/calculators/${name}/styles.css`;
        shadow.appendChild(link);
    }

    abstract validator(container: HTMLElement): boolean;
    abstract render(container: HTMLElement): void;
}