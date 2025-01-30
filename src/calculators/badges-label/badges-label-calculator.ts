// src/calculators/badges-label/badges-label-calculator.ts
import AbstractCalculator from "../../infra/abstract/abstract-calculator";
import BadgesLabelService from "./badges-label-service";
import {CalculatorDataProviderInterface} from "../../infra/interface";

interface BadgesLabelDataProviderInterface extends CalculatorDataProviderInterface {
    test: string;
}
export class BadgesLabelCalculator extends AbstractCalculator<BadgesLabelDataProviderInterface> {
    private value: number = 0;

    constructor(private badgesLabelService: BadgesLabelService) {
        super("Badges Label Calculator", {test: ''});
    }

    validator(container: HTMLElement): boolean {
        const shadow = this.getShadowRoot(container);

        const inputElement = shadow.querySelector('input') as HTMLInputElement;
        console.log('inputElement', inputElement)
        if (!inputElement) return false;

        const inputValue = parseFloat(inputElement.value);
        return !isNaN(inputValue) && inputValue > 0;
    }

    render(container: HTMLElement): void {
        const shadow = this.getShadowRoot(container);

        shadow.innerHTML = "";

        this.loadStyles(shadow, 'badges-label');


        shadow.innerHTML += `
        <div class="badge-calculator">
            <input type="number" class="badge-input" placeholder="Enter badge value" />
            <button class="calculate-btn">Calculate</button>
            <span class="result">Calculated result: 0</span>
        </div>
    `;

        const inputElement = shadow.querySelector('.badge-input') as HTMLInputElement;
        const resultElement = shadow.querySelector('.result') as HTMLSpanElement;
        const calculateButton = shadow.querySelector('.calculate-btn') as HTMLButtonElement;

        calculateButton.addEventListener('click', () => {
            if (this.validator(container)) {
                this.value = parseFloat(inputElement.value) * 1.25;
                resultElement.textContent = `Calculated result: ${this.value}`;
            } else {
                resultElement.textContent = "Invalid input";
            }
        });
    }
}
