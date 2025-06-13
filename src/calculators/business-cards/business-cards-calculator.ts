// src/calculators/business-cards/business-cards-calculator.ts
import AbstractCalculator from "../../infra/abstract/abstract-calculator";
import BusinessCardsService from "./business-cards-service";
import {CalculatorDataProviderInterface} from "../../infra/interface";
import {buildCalculator} from "../../utils/build-calculator";
import {CalculationFormula} from "../../infra/types";
import CartService from "../../infra/service/cart.service";
import { CartItem } from "../../infra/service/cart.service";

interface BusinessCardsDataProviderInterface extends CalculatorDataProviderInterface {
    printedSide: string;
    paperType: string;
    lamination: string;
    turnaround: number;
}

export class BusinessCardsCalculator extends AbstractCalculator<BusinessCardsDataProviderInterface> {

    constructor(private businessCardsService: BusinessCardsService) {
        super(
            "Business Cards Calculator",
            {
                printedSide: '',
                paperType: '',
                lamination: '',
                turnaround: 0
            }
        );
    }

    validator(container: HTMLElement): boolean {
        return this.form.quantity > 0 &&
            this.form.printedSide !== '' &&
            this.form.paperType !== '' &&
            this.form.lamination !== '' &&
            this.form.turnaround !== 0;
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
                    <label>Вид печат</label>
                    <div class="options-group printedSide-options">
                        <button class="option-btn" data-value="oneSide">Едностранен</button>
                        <button class="option-btn" data-value="doubleSide">Двустранен</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Вид картон</label>
                    <div class="options-group paperType-options">
                        <button class="option-btn" data-value="chrome">Хромов картон 350 гр./кв.м.</button>
                        <button class="option-btn" data-value="structural">Структурен картон 300 гр./кв.м.</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Ламинат</label>
                    <div class="options-group lamination-options">
                        <button class="option-btn" data-value="noLamination">Без ламинат</button>
                        <button class="option-btn one-side-lamination" data-value="oneSideMat">Едностранен ламинат мат 25 мк</button>
                        <button class="option-btn one-side-lamination" data-value="oneSideGloss">Едностранен ламинат гланц 25 мк</button>
                        <button class="option-btn one-side-lamination" data-value="oneSideSatin">Едностранен ламинат сатен</button>
                        <button class="option-btn double-side-lamination" data-value="doubleSideMat">Двустранен ламинат мат 25 мк</button>
                        <button class="option-btn double-side-lamination" data-value="doubleSideGloss">Двустранен ламинат гланц 25 мк</button>
                        <button class="option-btn double-side-lamination" data-value="doubleSideSatin">Двустранен ламинат сатен</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Срок за изработка</label>
                    <div class="options-group turnaround-options">
                        <button class="option-btn" data-value="48">2 дни</button>
                        <button class="option-btn" data-value="24">24 часа</button>
                    </div>
                </div>

                <div class="form-group">
                    <label>Избери количество</label>
                    <div class="options-group quantity-options">
                        <button class="option-btn" data-value="100">100 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="200">200 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="300">300 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="400">400 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="500">500 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="600">600 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="700">700 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="800">800 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="900">900 бр.<span class="price-display">0.00 €</span></button>
                        <button class="option-btn" data-value="1000">1000 бр.<span class="price-display">0.00 €</span></button>
                    </div>
                </div>
                <div class="btn-container">
                    <button class="btn order-btn">Поръчай</button>
                </div>
            </div>
        `;

        const orderButton = shadow.querySelector('.order-btn') as HTMLButtonElement;
        const messageElement = shadow.querySelector('.error-message') as HTMLSpanElement;

        const printedSideOptions = shadow.querySelectorAll('.printedSide-options .option-btn');
        const paperTypeOptions = shadow.querySelectorAll('.paperType-options .option-btn');
        const laminationOptions = shadow.querySelectorAll('.lamination-options .option-btn');
        const turnaroundOptions = shadow.querySelectorAll('.turnaround-options .option-btn');
        const quantityOptions = shadow.querySelectorAll('.quantity-options .option-btn');

        const updateFormDataFromUI = () => {
            const currentPrintedSideButton = shadow.querySelector('.printedSide-options .option-btn.active') as HTMLButtonElement;
            const currentPaperTypeButton = shadow.querySelector('.paperType-options .option-btn.active') as HTMLButtonElement;
            const currentLaminationButton = shadow.querySelector('.lamination-options .option-btn.active') as HTMLButtonElement;
            const currentTurnaroundButton = shadow.querySelector('.turnaround-options .option-btn.active') as HTMLButtonElement;
            const currentQuantityButton = shadow.querySelector('.quantity-options .option-btn.active') as HTMLButtonElement;

            this.form.printedSide = currentPrintedSideButton ? currentPrintedSideButton.dataset.value || '' : '';
            this.form.paperType = currentPaperTypeButton ? currentPaperTypeButton.dataset.value || '' : '';
            this.form.lamination = currentLaminationButton ? currentLaminationButton.dataset.value || '' : '';
            this.form.turnaround = currentTurnaroundButton ? Number(currentTurnaroundButton.dataset.value) || 0 : 0;
            this.form.quantity = currentQuantityButton ? Number(currentQuantityButton.dataset.value) || 0 : 0;
        };

        if (printedSideOptions.length > 0) {
            (printedSideOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (paperTypeOptions.length > 0) {
            (paperTypeOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (turnaroundOptions.length > 0) {
            (turnaroundOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (quantityOptions.length > 0) {
            (quantityOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (laminationOptions.length > 0) {
            const noLaminationBtn = Array.from(laminationOptions).find(btn => (btn as HTMLButtonElement).dataset.value === 'noLamination') as HTMLButtonElement;
            if (noLaminationBtn) {
                noLaminationBtn.classList.add('active');
            } else {
                (laminationOptions[0] as HTMLButtonElement).classList.add('active');
            }
        }

        updateFormDataFromUI();

        this.updateLaminationOptions(shadow);

        this.calculateAllQuantitiesAndDisplayPrices(shadow);


        shadow.querySelectorAll('.options-group .option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const targetButton = event.currentTarget as HTMLButtonElement;

                const parentGroup = targetButton.closest('.options-group');
                if (parentGroup) {
                    parentGroup.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
                    targetButton.classList.add('active');

                    updateFormDataFromUI();

                    if (parentGroup.classList.contains('printedSide-options') || parentGroup.classList.contains('paperType-options')) {
                        this.updateLaminationOptions(shadow);
                    }

                    this.calculateAllQuantitiesAndDisplayPrices(shadow);

                    if (this.validator(container)) {
                        messageElement.textContent = "";
                    } else {
                        messageElement.textContent = "Моля, изберете всички опции (Вид печат, Вид картон, Ламинат, Срок за изработка, Количество).";
                    }
                }
            });
        });

        orderButton.addEventListener('click', () => {
            updateFormDataFromUI();

            if (this.validator(container)) {
                const printedSideText = (shadow.querySelector('.printedSide-options .option-btn.active') as HTMLButtonElement)?.textContent?.trim() || '';
                const paperTypeText = (shadow.querySelector('.paperType-options .option-btn.active') as HTMLButtonElement)?.textContent?.trim() || '';
                const laminationText = (shadow.querySelector('.lamination-options .option-btn.active') as HTMLButtonElement)?.textContent?.trim() || '';
                const turnaroundText = (shadow.querySelector('.turnaround-options .option-btn.active') as HTMLButtonElement)?.textContent?.trim() || '';

                const cartItem: CartItem = {
                    id: Date.now().toString(),
                    productData: {
                        title: `${printedSideText}, ${paperTypeText}, ${laminationText} - ${this.form.quantity} бр.`,
                        printedSide: printedSideText,
                        paperType: paperTypeText,
                        lamination: laminationText,
                        turnaround: turnaroundText,
                        quantity: this.form.quantity,
                        unitPrice: this.form.unitPrice,
                        totalPrice: this.form.totalPrice,
                        total: this.form.total
                    }
                };

                CartService.addToCart(cartItem);
                alert('Продуктът е добавен в количката успешно!');
                this.clearForm(shadow);
            } else {
                messageElement.textContent = "Моля, изберете всички опции преди да поръчате.";
            }
        });
    }

    private updateLaminationOptions = (shadow: ShadowRoot) => {
        const laminationOptions = shadow.querySelectorAll('.lamination-options .option-btn');
        const { paperType, printedSide } = this.form;

        if (paperType === 'structural') {
            const noLaminationBtn = Array.from(laminationOptions).find(btn => (btn as HTMLButtonElement).dataset.value === 'noLamination') as HTMLButtonElement;

            laminationOptions.forEach(button => {
                const btn = button as HTMLButtonElement;
                if (btn !== noLaminationBtn) {
                    btn.style.display = 'none';
                    btn.classList.remove('active');
                } else {
                    btn.style.display = 'inline-block';
                }
            });

            if (noLaminationBtn && !noLaminationBtn.classList.contains('active')) {
                noLaminationBtn.classList.add('active');
            }
        } else {
            laminationOptions.forEach(button => {
                const btn = button as HTMLButtonElement;
                const laminationValue = btn.dataset.value;

                if (laminationValue === 'noLamination') {
                    btn.style.display = 'inline-block';
                } else if (printedSide === 'oneSide') {
                    btn.style.display = btn.classList.contains('one-side-lamination') ? 'inline-block' : 'none';
                } else if (printedSide === 'doubleSide') {
                    btn.style.display = btn.classList.contains('double-side-lamination') ? 'inline-block' : 'none';
                }
            });
        }

        let activeLaminationButton = shadow.querySelector('.lamination-options .option-btn.active') as HTMLButtonElement;
        if (!activeLaminationButton || activeLaminationButton.style.display === 'none') {
            if (activeLaminationButton) {
                activeLaminationButton.classList.remove('active');
            }

            const noLaminationBtn = Array.from(laminationOptions).find(btn => (btn as HTMLButtonElement).dataset.value === 'noLamination') as HTMLButtonElement;
            if (noLaminationBtn) {
                noLaminationBtn.classList.add('active');
            }
        }

        const finalActiveBtn = shadow.querySelector('.lamination-options .option-btn.active') as HTMLButtonElement;
        this.form.lamination = finalActiveBtn ? finalActiveBtn.dataset.value || '' : '';
    };

    private updateMainTotal(shadow: ShadowRoot) {

        const formula: CalculationFormula<{ A: number; B: number; L: number; U: number }> = ({ A, B, L, U }) => (A + B + L + U);

        const params = this.getBaseValuesForQuantity(this.form.quantity);
        params.QUANTITY = this.form.quantity;

        if (Object.values(params).some(val => isNaN(val) || val === null || val === undefined)) {
            this.form.unitPrice = 0;
            this.form.totalPrice = 0;
            this.form.total = 0;
        } else {
            const result = buildCalculator(params, formula);
            this.form.unitPrice = result.unitPrice;
            this.form.totalPrice = result.totalPrice;
            this.form.total = result.totalPrice;
        }
    }

    private calculateAllQuantitiesAndDisplayPrices(shadow: ShadowRoot) {
        const quantityButtons = shadow.querySelectorAll('.quantity-options .option-btn');
        const formula: CalculationFormula<{ A: number; B: number; L: number; U: number }> = ({ A, B, L, U }) => (A + B + L + U);

        const currentSelectedValues = {
            printedSide: this.form.printedSide,
            paperType: this.form.paperType,
            lamination: this.form.lamination,
            turnaround: this.form.turnaround
        };

        quantityButtons.forEach(button => {
            const quantity = Number((button as HTMLButtonElement).dataset.value);
            const priceDisplay = button.querySelector('.price-display') as HTMLSpanElement;

            if (isNaN(quantity) || quantity <= 0) {
                if (priceDisplay) {
                    priceDisplay.textContent = `0.00 €`;
                }
                return;
            }

            const paramsForThisQuantity = {
                A: this.businessCardsService.getPrintedSideCollection()[quantity.toString()]?.[currentSelectedValues.printedSide] ?? 0,
                B: this.businessCardsService.getPaperTypeCollection()[quantity.toString()]?.[currentSelectedValues.paperType] ?? 0,
                L: this.businessCardsService.getLaminationCollection()[quantity.toString()]?.[currentSelectedValues.lamination] ?? 0,
                U: this.businessCardsService.getTurnaroundCollection()[quantity.toString()]?.[currentSelectedValues.turnaround] ?? 0,
                QUANTITY: quantity
            };

            if (Object.values(paramsForThisQuantity).some(val => isNaN(val) || val === null || val === undefined)) {
                if (priceDisplay) {
                    priceDisplay.textContent = `0.00 €`;
                }
                return;
            }

            const result = buildCalculator(paramsForThisQuantity, formula);

            if (priceDisplay) {
                priceDisplay.textContent = `${result.totalPrice.toFixed(2)} €`;
            }
        });

        this.updateMainTotal(shadow);
    }

    private clearForm(shadow: ShadowRoot) {
        shadow.querySelectorAll('.options-group .option-btn').forEach(btn => btn.classList.remove('active'));

        shadow.querySelector('.error-message')!.textContent = "";

        this.form.printedSide = '';
        this.form.paperType = '';
        this.form.lamination = '';
        this.form.turnaround = 0;
        this.form.quantity = 0;
        this.form.unitPrice = 0;
        this.form.totalPrice = 0;
        this.form.total = 0;

        const printedSideOptions = shadow.querySelectorAll('.printedSide-options .option-btn');
        const paperTypeOptions = shadow.querySelectorAll('.paperType-options .option-btn');
        const laminationOptions = shadow.querySelectorAll('.lamination-options .option-btn');
        const turnaroundOptions = shadow.querySelectorAll('.turnaround-options .option-btn');
        const quantityOptions = shadow.querySelectorAll('.quantity-options .option-btn');

        if (printedSideOptions.length > 0) {
            (printedSideOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (paperTypeOptions.length > 0) {
            (paperTypeOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (turnaroundOptions.length > 0) {
            (turnaroundOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (quantityOptions.length > 0) {
            (quantityOptions[0] as HTMLButtonElement).classList.add('active');
        }
        if (laminationOptions.length > 0) {
            const noLaminationBtn = Array.from(laminationOptions).find(btn => (btn as HTMLButtonElement).dataset.value === 'noLamination') as HTMLButtonElement;
            if (noLaminationBtn) {
                noLaminationBtn.classList.add('active');
            } else {
                (laminationOptions[0] as HTMLButtonElement).classList.add('active');
            }
        }

        const currentPrintedSideButton = shadow.querySelector('.printedSide-options .option-btn.active') as HTMLButtonElement;
        const currentPaperTypeButton = shadow.querySelector('.paperType-options .option-btn.active') as HTMLButtonElement;
        const currentLaminationButton = shadow.querySelector('.lamination-options .option-btn.active') as HTMLButtonElement;
        const currentTurnaroundButton = shadow.querySelector('.turnaround-options .option-btn.active') as HTMLButtonElement;
        const currentQuantityButton = shadow.querySelector('.quantity-options .option-btn.active') as HTMLButtonElement;

        this.form.printedSide = currentPrintedSideButton ? currentPrintedSideButton.dataset.value || '' : '';
        this.form.paperType = currentPaperTypeButton ? currentPaperTypeButton.dataset.value || '' : '';
        this.form.lamination = currentLaminationButton ? currentLaminationButton.dataset.value || '' : '';
        this.form.turnaround = currentTurnaroundButton ? Number(currentTurnaroundButton.dataset.value) || 0 : 0;
        this.form.quantity = currentQuantityButton ? Number(currentQuantityButton.dataset.value) || 0 : 0;

        this.updateLaminationOptions(shadow);
        this.calculateAllQuantitiesAndDisplayPrices(shadow);
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

    private getLaminationValue() : number {
        const laminationCollection = this.businessCardsService.getLaminationCollection();
        const quantityStr = this.form.quantity.toString();
        const laminationType = this.form.lamination;
        return laminationCollection[quantityStr]?.[laminationType] ?? 0;
    }

    private getTurnaroundValue() : number {
        const turnaroundCollection = this.businessCardsService.getTurnaroundCollection();
        const quantityStr = this.form.quantity.toString();
        const turnaround = this.form.turnaround;
        return turnaroundCollection[quantityStr]?.[turnaround] ?? 0;
    }

    private getBaseValuesForQuantity(quantity: number): { A: number; B: number; L: number; U: number, QUANTITY?: number } {
        const quantityStr = quantity.toString();
        return {
            A: this.businessCardsService.getPrintedSideCollection()[quantityStr]?.[this.form.printedSide] ?? 0,
            B: this.businessCardsService.getPaperTypeCollection()[quantityStr]?.[this.form.paperType] ?? 0,
            L: this.businessCardsService.getLaminationCollection()[quantityStr]?.[this.form.lamination] ?? 0,
            U: this.businessCardsService.getTurnaroundCollection()[quantityStr]?.[this.form.turnaround] ?? 0,
            QUANTITY: quantity
        };
    }
}