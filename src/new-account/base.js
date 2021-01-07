import { AJIO, AVERAGE_RATE, MIN_CONTRACT, RATES } from '../constants';
import { roundTwo, format } from '../utils';

export const calculate = (enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta) => {
    let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    let amount = Math.round((enteredAmount - 100) - AJIO * contract);

    RATES.slice(-monthsCount).forEach(
        (rate) => {
            const contractDelta = getContractDelta(amount, contract);
            if (contractDelta > 0) {
                contract += contractDelta;
                amount = roundTwo(amount - contractDelta * AJIO);
            }

            const income = getIncome(amount, rate);
            const profit = getProfit(income, amount);

            amount = roundTwo(amount + profit + monthValue);
        }
    );

    amount -= monthValue;
    const averageIncome = getIncome(amount, AVERAGE_RATE);
    const averageProfit = getProfit(averageIncome, amount);
    const addedPerMonth = monthValue > 0 ? monthValue : 0;

    document.querySelector('#amount').innerText = `${format(amount)} EUR`;
    document.querySelector('#our').innerText = `${format(addedPerMonth * monthsCount + enteredAmount)} EUR`;
    document.querySelector('#profit').innerText = `${format(Math.floor(averageProfit))} EUR`;

    document.querySelector('#new-result').style.display = 'block';
};
