import { AJIO, AVERAGE_RATE, MIN_CONTRACT } from '../../constants';
import {
    generateRates,
    roundTwo,

    loanFee,
    serviceFee,
    workFee,

    createDetailazationTable,
    getMonthYear,
} from '../helpers';

import { getIncome } from '../withoutLoan';
import { createRow } from '../onceLeverage';

const getProfit = (income, amount, loan) =>
    roundTwo(income - workFee(income) - serviceFee(amount + loan) - loanFee(loan));


export const withSixMonth = (enteredAmount, monthsCount, monthValue, getContractDelta, calcLoan, actualContract = MIN_CONTRACT, isNew = true) => {
    let ajio = 0;
    let contract = actualContract;
    let amount = enteredAmount + monthValue;

    if (isNew) {
        contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
        ajio = contract * AJIO;
        amount = Math.round((enteredAmount - 100) - ajio);
    }

    let stepAmount = amount;
    let stepLoan = calcLoan(amount);

    const detalizationTable = createDetailazationTable();
    generateRates(monthsCount).forEach((rate, index) => {
        let additionalAjio = 0;

        if (index % 6 === 0) {
            const contractDelta = getContractDelta(amount, contract, stepAmount + index * monthValue);
            if (contractDelta > 0) {
                contract += contractDelta;
                additionalAjio = contractDelta * AJIO;

                ajio += additionalAjio;

                amount = roundTwo(amount - additionalAjio);
            }
            stepLoan = calcLoan(amount);
        }

        const income = getIncome(amount + stepLoan, rate);
        const profit = getProfit(income, amount, stepLoan);

        const tableRow = createRow({
            month: getMonthYear(monthsCount - index),
            renewal: (index === 0 && isNew) ? enteredAmount : monthValue,
            ajio: (index === 0 && isNew) ? -ajio : -additionalAjio,
            activation: (index === 0 && isNew) ? -100 : 0,
            amount,
            leverage: stepLoan,
            contract,
            rate,
            income,
            profit,
        });
        detalizationTable.querySelector('tbody').innerHTML += tableRow;

        amount = roundTwo(amount + profit + monthValue);
    });

    amount -= monthValue;
    const averageIncome = getIncome(amount + stepLoan, AVERAGE_RATE);
    const averageProfit = getProfit(averageIncome, amount, stepLoan);
    const addedPerMonth = monthValue > 0 ? monthValue : 0;

    return {
        amount: amount,
        initialAjio: ajio,
        selfFunds: addedPerMonth * monthsCount + enteredAmount,
        profit: Math.floor(averageProfit),
        detalizationTable,
    };
}