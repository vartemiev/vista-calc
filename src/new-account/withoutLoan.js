import { calculate } from './base';
import { roundTwo, workFee, serviceFee } from '../utils';
import { AVERAGE_RATE } from '../constants';

export const getIncome = (amount, rate) => roundTwo(amount * rate / 100);
export const getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount));
export const getContractDelta = (_, contract, initialAmount) => initialAmount - contract;

export const createRow = (data) => {
    const balance = (data.amount + data.profit).toFixed(2);

    return `
        <tr>
            <td>${data.month}</td>
            <td>${data.renewal.toFixed(2)}</td>
            <td>${data.activation}</td>
            <td>${data.contract.toFixed(2)}</td>
            <td>${data.ajio.toFixed(2)}</td>
            <td>${data.amount.toFixed(2)}</td>
            <td>0.00</td>
            <td>${data.amount.toFixed(2)}</td>
            <td>${data.rate.toFixed(2)}</td>
            <td>+${data.income.toFixed(2)}</td>
            <td>-${workFee(data.income).toFixed(2)}</td>
            <td>-${serviceFee(data.amount).toFixed(2)}</td>
            <td>0.00</td>
            <td>${balance}</td>
            <td>${balance}</td>
            <td>${data.profit.toFixed(2)}</td>
        </tr>
    `.replace(/[ \t\n]/g, '');
};

export const withoutLoan = (enteredAmount, monthsCount, monthValue) =>
    calculate(enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta, createRow);

export const getMaxWithdraw = amount => {
    const income = getIncome(amount, AVERAGE_RATE);
    const profit = getProfit(income, amount);

    return Math.floor(profit);
}