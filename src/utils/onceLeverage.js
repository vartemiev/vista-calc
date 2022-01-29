import { AJIO, AVERAGE_RATE, MIN_CONTRACT } from '../constants';
import {
    roundTwo,
    serviceFee,
    workFee,
    loanFee,
    leverage,
    generateRates,
    getMonthYear,
    createDetailazationTable,
} from './helpers';

import { getProfit as getProfit_WLoan } from './withLoan';
import { getContractDelta as getContractDelta_WLeverage } from './withLeverage';
import {
    getIncome as getIncome_WOLoan,
    getContractDelta as getContractDelta_WOLoan,
} from './withoutLoan';

export const getProfit = (income, amount, leverage) => roundTwo(income - workFee(income) - serviceFee(amount) - loanFee(leverage));

export const createRow = (data) => {
    return `
        <tr>
            <td>${data.month}</td>
            <td>${data.renewal.toFixed(2)}</td>
            <td>${data.activation}</td>
            <td>${data.contract.toFixed(2)}</td>
            <td>${data.ajio.toFixed(2)}</td>
            <td>${data.amount.toFixed(2)}</td>
            <td>${data.leverage.toFixed(2)}</td>
            <td>${(data.amount + data.leverage).toFixed(2)}</td>
            <td>${data.rate.toFixed(2)}%</td>
            <td>+${data.income.toFixed(2)}</td>
            <td>-${workFee(data.income).toFixed(2)}</td>
            <td>-${serviceFee(data.amount + data.leverage).toFixed(2)}</td>
            <td>-${loanFee(data.leverage).toFixed(2)}</td>
            <td>${(data.amount + data.profit + data.leverage).toFixed(2)}</td>
            <td>${(data.amount + data.profit).toFixed(2)}</td>
            <td>${data.profit.toFixed(2)}</td>
        </tr>
    `.replace(/[ \t\n]/g, '');
};

export const onceLeverage = (enteredAmount, monthsCount, monthValue, actualContract = MIN_CONTRACT, isNew = true) => {
    let initialAjio = 0;
    let contract = actualContract;
    let amount = enteredAmount;

    if (isNew) {
        contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
        initialAjio = contract * AJIO;
        amount = Math.round((enteredAmount - 100) - initialAjio);
    }

    const contractDelta = getContractDelta_WLeverage(amount, contract);
    if (contractDelta > 0) {
        contract += contractDelta;
        initialAjio += contractDelta * AJIO;
        amount = roundTwo(amount - contractDelta * AJIO);
    }

    const _leverage = leverage(amount);
    amount += _leverage;
    const initialAmount = amount;

    const detalizationTable = createDetailazationTable();

    generateRates(monthsCount).forEach((rate, i) => {
        let ajio;
        const contractDelta = Math.ceil(getContractDelta_WOLoan(amount, contract, initialAmount + i * monthValue));
        if (contractDelta > 0) {
            contract += contractDelta;
            ajio = contractDelta * AJIO;
            amount = roundTwo(amount - ajio);
        } else {
            ajio = 0
        }

        const income = getIncome_WOLoan(amount, rate);
        const profit = getProfit(income, amount, _leverage);

        const tableRow = createRow({
            month: getMonthYear(monthsCount - i),
            renewal: (i === 0 && isNew) ? enteredAmount : monthValue,
            ajio: (i === 0 && isNew) ? -(contract * AJIO) : -ajio,
            activation: (i === 0 && isNew) ? -100 : 0,
            amount: amount - _leverage,
            leverage: _leverage,
            contract,
            rate,
            income,
            profit,
        });
        detalizationTable.querySelector('tbody').innerHTML += tableRow;

        amount = roundTwo(amount + profit + monthValue);
    });

    amount -= monthValue;
    const averageIncome = getIncome_WOLoan(amount, AVERAGE_RATE);
    const averageProfit = getProfit_WLoan(averageIncome, amount);
    const addedPerMonth = monthValue > 0 ? monthValue : 0;

    return {
        amount: amount - _leverage,
        initialAjio: initialAjio,
        selfFunds: addedPerMonth * monthsCount + enteredAmount,
        profit: Math.floor(averageProfit),
        detalizationTable,
    };
}
