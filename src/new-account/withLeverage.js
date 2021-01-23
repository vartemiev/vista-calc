import { calculate } from './base';
import { AJIO, AVERAGE_RATE } from '../constants';
import { roundTwo, workFee, serviceFee, leverage, loanFee } from '../utils';

export const getIncome = (amount, rate) => roundTwo((amount + leverage(amount)) * rate / 100);
export const getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount + leverage(amount)) - loanFee(leverage(amount)));
export const getContractDelta = (amount, contract) => Math.ceil((10 * amount - 3 * contract) / 3.7);


export const createRow = (data) => {
    const _leverage = leverage(data.amount);

    return `
        <tr>
            <td>${data.month}</td>
            <td>${data.renewal.toFixed(2)}</td>
            <td>${data.activation}</td>
            <td>${data.contract.toFixed(2)}</td>
            <td>${data.ajio.toFixed(2)}</td>
            <td>${data.amount.toFixed(2)}</td>
            <td>${_leverage.toFixed(2)}</td>
            <td>${(data.amount + _leverage).toFixed(2)}</td>
            <td>${data.rate.toFixed(2)}%</td>
            <td>+${data.income.toFixed(2)}</td>
            <td>-${workFee(data.income).toFixed(2)}</td>
            <td>-${serviceFee(data.amount + _leverage).toFixed(2)}</td>
            <td>-${loanFee(_leverage).toFixed(2)}</td>
            <td>${(data.amount + data.profit + _leverage).toFixed(2)}</td>
            <td>${(data.amount + data.profit).toFixed(2)}</td>
            <td>${data.profit.toFixed(2)}</td>
        </tr>
    `.replace(/[ \t\n]/g, '');
};

export const withLeverage = (enteredAmount, monthsCount, monthValue) =>
    calculate(enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta, createRow);

export const getMaxWithdraw = (amount, contract) => {
    const contractDelta = getContractDelta(amount, contract);
    if (contractDelta > 0) {
        amount = roundTwo(amount - contractDelta * AJIO);
    }

    const income = getIncome(amount, AVERAGE_RATE);
    const profit = getProfit(income, amount);

    return Math.floor(profit);
}
