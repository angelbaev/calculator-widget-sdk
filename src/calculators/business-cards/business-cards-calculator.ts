// src/calculators/badges-label/badges-label-calculator.ts
import AbstractCalculator from "../../infra/abstract/abstract-calculator";
import BusinessCardsService from "./business-cards-service";
import {CalculatorDataProviderInterface} from "../../infra/interface";
import {buildCalculator} from "../../utils/build-calculator";
import {CalculationFormula} from "../../infra/types";


interface BusinessCardsDataProviderInterface extends CalculatorDataProviderInterface {
    printedSide: string;
    paperType: string;
    turnaround: number;
}

export class  BusinessCardsCalculator extends AbstractCalculator<BusinessCardsDataProviderInterface> {
    private value: number = 0;

    constructor(private businessCardsService: BusinessCardsService) {
        super(
            "Business Cards Calculator",
            {
                printedSide: '',
                paperType: '',
                turnaround: 0
            }
        );
    }

    validator(container: HTMLElement): boolean {
        const shadow = this.getShadowRoot(container);

        const printedSide = shadow.querySelector('#printedSide') as HTMLInputElement;
        const paperType = shadow.querySelector('#paperType') as HTMLInputElement;
        const turnaround = shadow.querySelector('#turnaround') as HTMLInputElement;
        const quantity = shadow.querySelector('#quantity') as HTMLInputElement;

        this.form.printedSide = printedSide.value;
        this.form.paperType = paperType.value;
        this.form.turnaround = Number(turnaround.value);
        this.form.quantity = Number(quantity.value);

        return this.form.quantity > 0;
    }

    render(container: HTMLElement): void {
        const shadow = this.getShadowRoot(container);

        shadow.innerHTML = "";

        this.loadStyles(shadow, 'business-cards');

        shadow.innerHTML += `
            <div class="calculator-container">
                <h2>Стандартни визитки</h2>
                <div class="error-message"></div>
                <div class="form-group">
                    <label for="printedSide">Вид печат</label>
                    <select id="printedSide">
                        <option value="oneSide">Едностранен</option>
                        <option value="oneSide">Двустранен</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="paperType">Вид картон</label>
                    <select id="paperType">
                        <option value="chrome">Хромов картон 350 гр/кв.м.</option>
                        <option value="linen">Ленен картон 300 гр/кв.м.</option>
                        <option value="structural">Структурен картон 300 гр/кв.м.</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="turnaround">Срок за изработка</label>
                    <select id="turnaround">
                        <option value="48">2 дни</option>
                        <option value="24">24 часа</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantity">ЦЕНИ</label>
                    <select id="quantity">
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Ед. цена без ДДС:</label>
                    <div class="result" id="unitPrice">0,00 лв/бр</div>
                </div>
                <div class="form-group">
                    <label>Общо без ДДС:</label>
                    <div class="result" id="totalPrice">0,00 лв</div>
                </div>
                <div class="form-group">
                    <label>ТОТАЛ:</label>
                    <div class="result" id="total">0,00 лв</div>
                </div>
                <div class="btn-container">
                    <button class="btn calculate-btn">Изчисли</button>
                    <button class="btn">Изчисти</button>
                </div>
            </div>
        `;

        const calculateButton = shadow.querySelector('.calculate-btn') as HTMLButtonElement;
        const messageElement = shadow.querySelector('.error-message') as HTMLSpanElement;

        calculateButton.addEventListener('click', () => {
            if (this.validator(container)) {
               // const formula = ({ A, B, U }) => (A + B + U);
                const formula: CalculationFormula<{ A: number; B: number; U: number }> = ({ A, B, U }) => (A + B + U);
                const params = {
                    A: Number(this.getPrintedSideValue()),
                    B: Number(this.getPaperTypeValue()),
                    U: Number(this.getTurnaroundValue()),
                    QUANTITY: this.form.quantity
                };
                const result = buildCalculator(params, formula);
                this.form.totalPrice = result.totalPrice;
                this.form.unitPrice = result.unitPrice;
                this.form.total = result.vatPrice;

                shadow.querySelector('#unitPrice')!.textContent = `${this.form.unitPrice.toFixed(2)} лв/бр`;
                shadow.querySelector('#totalPrice')!.textContent = `${this.form.totalPrice.toFixed(2)} лв`;
                shadow.querySelector('#total')!.textContent = `${this.form.total.toFixed(2)} лв`;
                // console.log('formula', formula);
                // console.log('result', result);
            } else {
                messageElement.textContent = "Невалидни данни";
            }
        });
    }

    private getPrintedSideValue() : number {
        const printedSideCollection = this.businessCardsService.getPrintedSideCollection();
        const quantityStr = this.form.quantity.toString();
        const side = this.form.printedSide;

        return printedSideCollection[quantityStr]?.[side] ?? 0;

    }

    private getPaperTypeValue() : number {
        const paperTypeCollection = this.businessCardsService.getPaperTypeCollection();
        const quantityStr = this.form.quantity.toString();
        const paperType = this.form.paperType;

        return paperTypeCollection[quantityStr]?.[paperType] ?? 0;

    }

    private getTurnaroundValue() : number {
        const turnaroundCollection = this.businessCardsService.getTurnaroundCollection();
        const quantityStr = this.form.quantity.toString();
        const turnaround = this.form.turnaround;

        return turnaroundCollection[quantityStr]?.[turnaround] ?? 0;
    }
}
