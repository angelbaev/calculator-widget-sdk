import { roundNumber } from './round-number';

interface CalculatorParams {
    CNT: number;
}

type CalculationFormula = (params: CalculatorParams) => number;

export const buildCalculator = (params: CalculatorParams, formula: CalculationFormula) => {
    const totalSum = formula(params);
    const singleSum = totalSum / params['CNT'];
    const vatSum = totalSum * 1.20;

    return {
        singleSum: roundNumber(singleSum, 2),
        totalSum: roundNumber(totalSum, 2),
        vatSum: roundNumber(vatSum, 2),
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