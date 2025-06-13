import AbstractCalculator from "../../infra/abstract/abstract-calculator";
import BadgesLabelService from "./badges-label-service";
import { CalculatorDataProviderInterface } from "../../infra/interface";
import CartService from "../../infra/service/cart.service";
import { CartItem } from "../../infra/service/cart.service";
import { createOrderModal } from "../../widgets/modal";

interface BadgesLabelDataProviderInterface extends CalculatorDataProviderInterface {
    test: string;
}

export class BadgesLabelCalculator extends AbstractCalculator<BadgesLabelDataProviderInterface> {
    private value: number = 0;

    constructor(private badgesLabelService: BadgesLabelService) {
        super("Badges Label Calculator", { test: '' });
    }

    validator(container: HTMLElement): boolean {
        const shadow = this.getShadowRoot(container);
        const quantity = shadow.querySelector('input[name="quantity"]') as HTMLInputElement;
        return !!quantity && !isNaN(parseInt(quantity.value));
    }

    render(container: HTMLElement): void {
        const shadow = this.getShadowRoot(container);
        shadow.innerHTML = "";
        this.loadStyles(shadow, 'badges-label');

        shadow.innerHTML = `
            <style>
                .calculator-container {
                    max-width: 400px;
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }        
            .calculator-container .option-group {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .calculator-container .option {
                padding: 10px 15px;
                border: 2px solid #ccc;
                border-radius: 5px;
                cursor: pointer;
                user-select: none;
            }

            .calculator-container .option.selected {
                border-color: #ff6f0f;
                background-color: #e7f1ff;
            }            
            
            </style>
            <div class="calculator-container">
                <form id="calculatorForm">

                    <!-- Вид печат -->
                    <div class="mb-3">
                        <label class="form-label">Вид печат</label>
                        <div class="option-group" data-name="printType">
                            <div class="option selected" data-value="Едностранен">Едностранен</div>
                            <div class="option" data-value="Двустранен">Двустранен</div>
                        </div>
                        <input type="hidden" name="printType" value="Едностранен">
                    </div>

                    <!-- Вид картон -->
                    <div class="mb-3">
                        <label class="form-label">Вид картон</label>
                        <div class="option-group" data-name="cardType">
                            <div class="option selected" data-value="Хромов картон 350 гр.">Хромов картон 350 гр.</div>
                            <div class="option" data-value="Ленен картон 300 гр.">Ленен картон 300 гр.</div>
                            <div class="option" data-value="Структуриран картон 300 гр.">Структуриран картон 300 гр.</div>
                        </div>
                        <input type="hidden" name="cardType" value="Хромов картон 350 гр.">
                    </div>

                    <!-- Срок -->
                    <div class="mb-3">
                        <label class="form-label">Срок за изработка</label>
                        <div class="option-group" data-name="deadline">
                            <div class="option selected" data-value="2 дни">2 дни</div>
                            <div class="option" data-value="24 часа">24 часа</div>
                        </div>
                        <input type="hidden" name="deadline" value="2 дни">
                    </div>

                    <!-- Количество -->
                    <div class="mb-3">
                        <label class="form-label">Избери количество</label>
                        <div class="option-group" data-name="quantity">
                            <div class="option selected" data-value="100">100 бр.</div>
                            <div class="option" data-value="200">200 бр.</div>
                            <div class="option" data-value="300">300 бр.</div>
                        </div>
                        <input type="hidden" name="quantity" value="100">
                    </div>

                    <!-- Действия -->
                    <div class="mb-3">
                        <button type="button" class="btn btn-primary me-2" id="calculateBtn">Калкулирай</button>
                        <button type="button" class="btn btn-outline" id="orderBtn">Поръчай</button>
                    </div>

                    <div class="mt-3">
                        <strong>Цена: <span id="priceOutput">--</span> лв.</strong>
                    </div>
                </form>
            </div>
        `;

        const form = shadow.querySelector('#calculatorForm') as HTMLFormElement;
        const priceOutput = shadow.querySelector('#priceOutput') as HTMLElement;
        const calculateBtn = shadow.querySelector('#calculateBtn') as HTMLButtonElement;
        const orderBtn = shadow.querySelector('#orderBtn') as HTMLButtonElement;

        shadow.querySelectorAll('.option-group').forEach(group => {
            group.addEventListener('click', e => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('option')) {
                    group.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                    target.classList.add('selected');
                    const hiddenInput = form.querySelector(`input[name="${group.getAttribute('data-name')}"]`) as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = target.getAttribute('data-value') || '';
                }
            });
        });

        calculateBtn.addEventListener('click', () => {
            const quantity = parseInt((form.querySelector('input[name="quantity"]') as HTMLInputElement).value);
            let pricePerUnit = quantity === 100 ? 2 : quantity === 200 ? 1.8 : 1.6;
            const total = (quantity * pricePerUnit).toFixed(2);
            this.value = parseFloat(total);
            priceOutput.textContent = `${this.value}`;
        });

        orderBtn.addEventListener('click', () => {
            const modal = createOrderModal({
                title: 'Поръчка',
                onSubmit: (formData) => {
                    const calculatorData: Record<string, any> = {};
                    form.querySelectorAll('input').forEach(input => {
                        const inputValue = input.type === 'hidden' ? input.getAttribute('value') : input.value;
                        if (input.name) {
                            calculatorData[input.name] = inputValue;
                        }
                    });
                    calculatorData.price = this.value;  // добавяме цената

                    const name = formData.get('name') as string;
                    const phone = formData.get('phone') as string;
                    const email = formData.get('email') as string;
                    const file = formData.get('file') as File;

                    const cartItem: CartItem = {
                        id: Date.now().toString(),
                        productData: calculatorData,
                        customerData: {
                            name,
                            phone,
                            email,
                            fileName: file?.name,
                        }
                    };

                    CartService.addToCart(cartItem);
                }
            });

            modal.open();
        });

    }
}
