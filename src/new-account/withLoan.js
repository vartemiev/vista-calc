import { calculate } from './base';
import { roundTwo, workFee, serviceFee, loanFee, loan } from '../utils';
import { AJIO, AVERAGE_RATE } from '../constants';

export const getIncome = (amount, rate) => roundTwo((amount + loan(amount)) * rate / 100);
export const getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount + loan(amount)) - loanFee(loan(amount)));
export const getContractDelta = (amount, contract) => Math.ceil((1.7 * amount -  contract) / 1.119);

export const withLoan = (enteredAmount, monthsCount, monthValue) =>
    calculate(enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta);

export const getMaxWithdraw = (amount, contract) => {
    const contractDelta = getContractDelta(amount, contract);
    if (contractDelta > 0) {
        amount = roundTwo(amount - contractDelta * AJIO);
    }

    const income = getIncome(amount, AVERAGE_RATE);
    const profit = getProfit(income, amount);

    return Math.floor(profit);
}