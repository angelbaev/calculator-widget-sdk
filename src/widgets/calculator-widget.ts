// src/widgets/calculator-widget.ts
import {CalculatorWidgetFactory} from "../infra/factory/calculator-widget-factory";

class CalculatorWidget extends HTMLElement {
    static observedAttributes = ['opt-name'];

    private calculator: any;
    private container: HTMLElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create container, but don't append yet
        this.container = document.createElement('div');
    }

    connectedCallback() {
        const optName = this.getAttribute('opt-name');

        if (this.shadowRoot && this.container) {
            this.shadowRoot.appendChild(this.container);
            this.initializeCalculator(optName);
        } else {
            const observer = new MutationObserver(() => {
                if (this.shadowRoot && this.container) {
                    observer.disconnect();
                    this.shadowRoot.appendChild(this.container);
                    this.initializeCalculator(optName);
                }
            });

            observer.observe(this, { childList: true, subtree: true });
        }
    }

    private initializeCalculator(optName: string | null) {
        if (optName) {
            this.calculator = CalculatorWidgetFactory.createCalculator(optName);
            this.calculator.render(this.container!);
        }
    }


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'opt-name' && oldValue !== newValue && this.container) {
            this.calculator = CalculatorWidgetFactory.createCalculator(newValue);
            this.container.innerHTML = '';
            this.calculator.render(this.container);
        }
    }
}

customElements.define('calculator-widget', CalculatorWidget);