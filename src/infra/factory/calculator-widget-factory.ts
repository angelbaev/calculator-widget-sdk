// src/widgets/calculator-widget-factory.ts
import { BadgesLabelCalculator } from '../../calculators/badges-label/badges-label-calculator';
import BadgesLabelService from "../../calculators/badges-label/badges-label-service";
import BusinessCardsService from "../../calculators/business-cards/business-cards-service";
import {BusinessCardsCalculator} from "../../calculators/business-cards/business-cards-calculator";

export class CalculatorWidgetFactory {
    static createCalculator(optName: string) {
        switch (optName) {
            case 'badges-label':
                //return new BadgesLabelCalculator();
                const badgesLabelService = new BadgesLabelService();
                return new BadgesLabelCalculator(badgesLabelService);
            case 'business-cards':;
                const businessCardsService = new BusinessCardsService();
                return new BusinessCardsCalculator(businessCardsService);
            default:
                throw new Error('Unknown calculator option');
        }
    }
}
