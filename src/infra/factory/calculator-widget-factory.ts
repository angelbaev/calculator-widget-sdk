// src/widgets/calculator-widget-factory.ts
import { BadgesLabelCalculator } from '../../calculators/badges-label/badges-label-calculator';
import BadgesLabelService from "../../calculators/badges-label/badges-label-service";

export class CalculatorWidgetFactory {
    static createCalculator(optName: string) {
        switch (optName) {
            case 'badges-label':
                //return new BadgesLabelCalculator();
                const badgesLabelService = new BadgesLabelService(); // Създаване на инстанция на сервиза
                return new BadgesLabelCalculator(badgesLabelService); // Предаване на сервиза в конструктора на калкулатора

            // Добавете други калкулатори тук при нужда
            default:
                throw new Error('Unknown calculator option');
        }
    }
}
