import { AJIO, MIN_CONTRACT, AVERAGE_RATE } from '../constants';
import {
    format,
    roundTwo,
    getMonthYear,
    generateRates,
    detalizationResult,
    createDetailazationTable
} from './helpers';

export const calculate = (
    enteredAmount,
    monthsCount,
    monthValue,

    getIncome,
    getProfit,
    getContractDelta,
    createRow,

    actualContract = MIN_CONTRACT,
    isNew = true,
) => {
    let initialAjio = 0;
    let contract = actualContract;
    let amount = enteredAmount;

    if (isNew) {
        contract = enteredAmount - 100 > actualContract ? enteredAmount - 100 : actualContract;
        initialAjio = contract * AJIO;
        amount = Math.round((enteredAmount - 100) - initialAjio);
    }

    const initialAmount = amount;

    const detalizationTable = createDetailazationTable();

    generateRates(monthsCount).forEach(
        (rate, i) => {
            let ajio;
            const contractDelta = getContractDelta(amount, contract, initialAmount + i * monthValue);
            if (contractDelta > 0) {
                contract += contractDelta;
                ajio = contractDelta * AJIO;

                initialAjio += ajio;

                amount = roundTwo(amount - ajio);
            } else {
                ajio = 0;
            }

            const income = getIncome(amount, rate);
            const profit = getProfit(income, amount);

            if (createRow) {
                const tableRow = createRow({
                    month: getMonthYear(monthsCount - i),
                    renewal: i === 0 ? enteredAmount : monthValue,
                    ajio: (i === 0 && isNew) ? -(contract * AJIO) : -ajio,
                    activation: (i === 0 && isNew) ? -100 : 0,
                    contract,
                    amount,
                    rate,
                    income,
                    profit,
                });
                detalizationTable.querySelector('tbody').innerHTML += tableRow;
            }

            amount = roundTwo(amount + profit + monthValue);
        }
    );

    amount -= monthValue;
    const averageIncome = getIncome(amount, AVERAGE_RATE);
    const averageProfit = getProfit(averageIncome, amount);
    const addedPerMonth = monthValue > 0 ? monthValue : 0;

    detalizationTable.querySelector('tbody').innerHTML += detalizationResult(
        Math.round(amount),
        Math.round(addedPerMonth * monthsCount + enteredAmount),
        Math.floor(averageProfit)
    );

    return {
        amount: format(amount),
        initialAjio: format(initialAjio),
        selfFunds: format(addedPerMonth * monthsCount + enteredAmount),
        profit: format(Math.floor(averageProfit)),
        detalizationTable,
    };
};
