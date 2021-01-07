import { calculate } from './base';
import { roundTwo, workFee, serviceFee } from '../utils';
import { AVERAGE_RATE } from '../constants';

export const getIncome = (amount, rate) => roundTwo(amount * rate / 100);
export const getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount));
export const getContractDelta = (amount, contract) => amount - contract;

export const withoutLoan = (enteredAmount, monthsCount, monthValue) =>
    calculate(enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta);

export const getMaxWithdraw = amount => {
    const income = getIncome(amount, AVERAGE_RATE);
    const profit = getProfit(income, amount);

    return Math.floor(profit);
}