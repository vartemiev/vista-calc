import { calculate } from './base';
import { roundTwo, workFee, serviceFee, loanFee, loan } from '../utils';
import { AJIO, AVERAGE_RATE } from '../constants';

export const getIncome = (amount, rate) => roundTwo((amount + loan(amount)) * rate / 100);
export const getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount + loan(amount)) - loanFee(loan(amount)));
export const getContractDelta = (amount, contract) => Math.ceil((1.7 * amount -  contract) / 1.119);

export const createRow = (data) => {
    const _loan = loan(data.amount);

    return `
        <tr>
            <td>${data.month}</td>
            <td>${data.renewal.toFixed(2)}</td>
            <td>${data.activation}</td>
            <td>${data.contract.toFixed(2)}</td>
            <td>${data.ajio.toFixed(2)}</td>
            <td>${data.amount.toFixed(2)}</td>
            <td>${_loan}</td>
            <td>${(data.amount + _loan).toFixed(2)}</td>
            <td>${data.rate.toFixed(2)}%</td>
            <td>+${data.income.toFixed(2)}</td>
            <td>-${workFee(data.income).toFixed(2)}</td>
            <td>-${serviceFee(data.amount + _loan).toFixed(2)}</td>
            <td>-${loanFee(_loan).toFixed(2)}</td>
            <td>${(data.amount + data.profit + _loan).toFixed(2)}</td>
            <td>${(data.amount + data.profit).toFixed(2)}</td>
            <td>${data.profit.toFixed(2)}</td>
        </tr>
    `.replace(/[ \t\n]/g, '');
};

export const withLoan = (enteredAmount, monthsCount, monthValue) =>
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