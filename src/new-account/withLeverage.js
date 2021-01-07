import { calculate } from './base';
import { AJIO, AVERAGE_RATE } from '../constants';
import { roundTwo, workFee, serviceFee, leverage, loanFee } from '../utils';

export const getIncome = (amount, rate) => roundTwo((amount + leverage(amount)) * rate / 100);
export const getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount + leverage(amount)) - loanFee(leverage(amount)));
export const getContractDelta = (amount, contract) => Math.ceil((10 * amount - 3 * contract) / 3.7);

export const withLeverage = (enteredAmount, monthsCount, monthValue) =>
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