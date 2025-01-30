import { roundNumber } from './round-number';
import {CalculationFormula} from "../infra/types";

interface CalculatorParams {
    QUANTITY: number;
}

//type CalculationFormula = (params: CalculatorParams) => number;


//export const buildCalculator = (params: CalculatorParams, formula: CalculationFormula) => {
export const buildCalculator = <T extends object>(params: T, formula: CalculationFormula<T>) => {
    const { QUANTITY } = params as CalculatorParams;
    const totalPrice = formula(params);
    const unitPrice = totalPrice / QUANTITY;
    const vatPrice = totalPrice * 1.20;

    return {
        unitPrice: roundNumber(unitPrice, 2),
        totalPrice: roundNumber(totalPrice, 2),
        vatPrice: roundNumber(vatPrice, 2),
    };
};

/*
// Формулата за изчисление
const formula = ({ A, F, E }) => (A * F) + E;

// Параметри за калкулацията
const params = {
    A: 10,  // Примерна стойност
    CNT: 5,   // Примерна стойност
    E: 15   // Примерна стойност
};

// Извикване на buildCalculator
const result = buildCalculator(params, formula);
console.log(result); // { singleSum: ..., totalSum: ..., vatSum: ... }
*/