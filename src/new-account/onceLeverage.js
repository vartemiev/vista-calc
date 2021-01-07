import { AJIO, AVERAGE_RATE, MIN_CONTRACT, RATES } from '../constants';
import { roundTwo, serviceFee, workFee, format, loanFee, leverage } from '../utils';

import { getProfit as getProfit_WLoan } from './withLoan';
import { getContractDelta as getContractDelta_WLeverage, getIncome } from './withLeverage';
import {
    getIncome as getIncome_WOLoan,
    getContractDelta as getContractDelta_WOLoan,
} from './withoutLoan';


export const getProfit = (income, amount, leverage) => roundTwo(income - workFee(income) - serviceFee(amount) - loanFee(leverage));

export const onceLeverage = (enteredAmount, monthsCount, monthValue) => {
    let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    let amount = Math.round((enteredAmount - 100) - AJIO * contract);

    const contractDelta = getContractDelta_WLeverage(amount, contract);
    if (contractDelta > 0) {
        contract += contractDelta;
        amount = roundTwo(amount - contractDelta * AJIO);
    }

    const _leverage = leverage(amount);
    amount += _leverage;
    const initialAmount = amount;

    RATES.slice(-monthsCount).forEach((rate, i) => {
        const updatedContract = getContractDelta_WOLoan(initialAmount + i * monthValue, contract);
        if (updatedContract > 0) {
            contract += updatedContract;
            amount = roundTwo(amount - updatedContract * AJIO);
        }

        const income = getIncome_WOLoan(amount, rate);
        const profit = getProfit(income, amount, _leverage);

        amount = roundTwo(amount + profit + monthValue);
    });

    amount -= monthValue;
    const averageIncome = getIncome_WOLoan(amount, AVERAGE_RATE);
    const averageProfit = getProfit_WLoan(averageIncome, amount);
    const addedPerMonth = monthValue > 0 ? monthValue : 0;

    document.querySelector('#amount').innerText = `${format(amount - _leverage)} EUR`;
    document.querySelector('#our').innerText = `${format(addedPerMonth * monthsCount + enteredAmount)} EUR`;
    document.querySelector('#profit').innerText = `${format(Math.floor(averageProfit))} EUR`;

    document.querySelector('#new-result').style.display = 'block';
}
