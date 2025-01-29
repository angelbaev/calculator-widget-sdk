// src/calculators/badges-label/badges-label-calculator.ts
import AbstractCalculator from "../../infra/abstract/abstract-calculator";
import BadgesLabelService from "./badges-label-service";

export class BadgesLabelCalculator extends AbstractCalculator {
    private value: number = 0;

    constructor(private badgesLabelService: BadgesLabelService) {
        super("Badges Label Calculator");
    }


    validator(container: HTMLElement): boolean {
        const inputElement = container.querySelector('input') as HTMLInputElement;
        if (!inputElement) return false;

        const inputValue = parseFloat(inputElement.value);
        return !isNaN(inputValue) && inputValue > 0;
    }

    render(container: HTMLElement): void {
        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.placeholder = 'Enter badge value';

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate';

        const resultElement = document.createElement('span');
        resultElement.textContent = `Calculated result: ${this.value}`;

        // Изпълняваме калкулацията при натискане на бутона
        calculateButton.addEventListener('click', () => {
            if (this.validator(container)) {
                this.value = parseFloat(inputElement.value) * 1.25;
                resultElement.textContent = `Calculated result: ${this.value}`;
            } else {
                resultElement.textContent = "Invalid input";
            }
        });

        container.appendChild(inputElement);
        container.appendChild(calculateButton);
        container.appendChild(resultElement);
    }
}
