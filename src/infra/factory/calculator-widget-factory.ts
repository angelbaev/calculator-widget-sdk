// src/widgets/calculator-widget-factory.ts
import { BadgesLabelCalculator } from '../../calculators/badges-label/badges-label-calculator';
import BadgesLabelService from "../../calculators/badges-label/badges-label-service";

export class CalculatorWidgetFactory {
    static createCalculator(optName: string) {
        switch (optName) {
            case 'badges-label':
                //return new BadgesLabelCalculator();
                const badgesLabelService = new BadgesLabelService();
                return new BadgesLabelCalculator(badgesLabelService);
            default:
                throw new Error('Unknown calculator option');
        }
    }
}
