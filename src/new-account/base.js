import { AJIO, AVERAGE_RATE, MIN_CONTRACT } from '../constants';
import { roundTwo, format, elem, show, generateRates, getMonthYear, printResult } from '../utils';

export const calculate = (enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta, createRow) => {
    let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    let amount = Math.round((enteredAmount - 100) - contract * AJIO);

    const initialAmount = amount;
    generateRates(monthsCount).forEach(
        (rate, i) => {
            let ajio;
            const contractDelta = getContractDelta(amount, contract, initialAmount + i * monthValue);
            if (contractDelta > 0) {
                contract += contractDelta;
                ajio = contractDelta * AJIO;
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
                    ajio: i === 0 ? -(contract * AJIO) : -ajio,
                    activation: i === 0 ? -100 : 0,
                    contract,
                    amount,
                    rate,
                    income,
                    profit,
                });
                elem('#detalization tbody').innerHTML += tableRow;
            }

            amount = roundTwo(amount + profit + monthValue);
        }
    );

    amount -= monthValue;
    const averageIncome = getIncome(amount, AVERAGE_RATE);
    const averageProfit = getProfit(averageIncome, amount);
    const addedPerMonth = monthValue > 0 ? monthValue : 0;

    elem('#amount').innerText = `${format(amount)} EUR`;
    elem('#our').innerText = `${format(addedPerMonth * monthsCount + enteredAmount)} EUR`;
    elem('#profit').innerText = `${format(Math.floor(averageProfit))} EUR`;

    elem('#detalization tbody').innerHTML += printResult(
        Math.round(amount),
        Math.round(addedPerMonth * monthsCount + enteredAmount),
        Math.floor(averageProfit)
    );

    show('#new-result');
};
