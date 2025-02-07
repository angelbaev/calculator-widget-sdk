import {generateUUID} from "../../utils/generate-uuid";
import { CalculatorAwareInterface } from "../interface/calculator-aware.interface";
import {CalculatorDataProviderInterface} from "../interface";


export default abstract class AbstractCalculator<T extends CalculatorDataProviderInterface> implements CalculatorAwareInterface {
    public uuid: string = generateUUID();
    protected form: T;

    protected constructor(public name: string, defaultForm: Omit<T, keyof CalculatorDataProviderInterface>) {
        this.form = {
            quantity: 0,
            unitPrice: 0,
            totalPrice: 0,
            total: 0,
            ...defaultForm
        } as T;
    }

    protected getShadowRoot(container: HTMLElement) {
        return  container.shadowRoot ?? container.attachShadow({ mode: "open" });
    }

    protected loadStyles(shadow: ShadowRoot, name: string): void {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${process.env.API_URL}/css/src/calculators/${name}/styles.css`;
        shadow.appendChild(link);
    }

    abstract validator(container: HTMLElement): boolean;
    abstract render(container: HTMLElement): void;
}