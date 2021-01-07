import {
    RestockingStatus,
    LeverageStatus,

    MIN_CONTRACT,
    AJIO,
} from './constants';

import { formatDate } from './utils';

import { withLeverage, getMaxWithdraw as getMaxWithdraw_WLeverage } from './new-account/withLeverage';
import { withoutLoan, getMaxWithdraw as getMaxWithdraw_WOLoan } from './new-account/withoutLoan';
import { withLoan, getMaxWithdraw as getMaxWithdraw_WLoan } from './new-account/withLoan';
import { onceLeverage } from './new-account/onceLeverage';

import { calculateBoost } from './boost';

const getWithdrawAmount = () => {
    const enteredAmount = +document.querySelector('#start').value;
    const contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    const amount = Math.round((enteredAmount - 100) - AJIO * contract);

    const leverageStatus = document.querySelector('[name="radio-group1"]:checked').id;
    switch (leverageStatus) {
        case LeverageStatus.WITH_LEVERAGE:
        case LeverageStatus.ONCE_UPDATE:
            return getMaxWithdraw_WLeverage(amount, contract);

        case LeverageStatus.WITH_LOAN:
            return getMaxWithdraw_WLoan(amount, contract);

        case LeverageStatus.WITHOUT_LOAN:
            return getMaxWithdraw_WOLoan(amount);
    }
};

const defineAmount = (restockingStatus) => {
    switch (restockingStatus) {
        case RestockingStatus.NO_ADD_NO_REMOVE:
            return 0;

        case RestockingStatus.ADD_MONTHLY:
            return +document.querySelector('#monthValue').value;

        case RestockingStatus.REMOVE_MONTHLY:
            return -(+document.querySelector('#monthValue').value);
    }
};

const calculateValue = () => {
    const leverageStatus = document.querySelector('[name="radio-group1"]:checked').id;
    const restockingStatus = document.querySelector('[name="radio-group2"]:checked').id;

    const enteredAmount = +document.querySelector('#start').value;
    const monthsCount = +document.querySelector('#monthsCount').value;
    const monthValue = defineAmount(restockingStatus);

    switch (leverageStatus) {
        case LeverageStatus.WITH_LEVERAGE:
            withLeverage(enteredAmount, monthsCount, monthValue);
            break;

        case LeverageStatus.WITH_LOAN:
            withLoan(enteredAmount, monthsCount, monthValue);
            break;

        case LeverageStatus.WITHOUT_LOAN:
            withoutLoan(enteredAmount, monthsCount, monthValue);
            return;

        case LeverageStatus.ONCE_UPDATE:
            onceLeverage(enteredAmount, monthsCount, monthValue);
            return;
    }
};

const updateWithdrawAmount = () => {
    const isWithdrawChosen = document.querySelector('#removeMonthly').checked;
    if (!isWithdrawChosen) {
        return;
    }

    const withdrawAmount = getWithdrawAmount();

    document.querySelector('#withdraw-amount').innerText = withdrawAmount;

    const isValueExceeds = +document.querySelector('#monthValue').value > withdrawAmount;
    if (isValueExceeds) {
        document.querySelector('#monthValue').value = withdrawAmount;
        document.querySelector('#monthValue').max = withdrawAmount;
    }
};

document.querySelector('#calculate').addEventListener('click', calculateValue);

const init = () => {
    const accTab = document.querySelector('#new-account-tab');
    const levTab = document.querySelector('#leverage-tab');

    const accForm = document.querySelector('#new-account');
    const levForm = document.querySelector('#leverage');

    accTab.addEventListener('click', () => {
        accTab.classList.add('active')
        levTab.classList.remove('active');

        accForm.style.display = 'block';
        levForm.style.display = 'none';
    });

    levTab.addEventListener('click', () => {
        accTab.classList.remove('active')
        levTab.classList.add('active');

        accForm.style.display = 'none';
        levForm.style.display = 'block';
    });


    document.querySelector('#removeMonthly').addEventListener('change', () => {
        document.querySelector('#monthValue').value = '';
        document.querySelector('#new-monthlyValue').style.display = 'block';

        document.querySelector('#withdrawLabel').style.display = 'block';
        document.querySelector('#addLabel').style.display = 'none';

        document.querySelector('#max-withdraw').style.display = 'block';
        document.querySelector('#withdraw-amount').innerText = getWithdrawAmount();
    });

    document.querySelector('#addMonthly').addEventListener('change', () => {
        document.querySelector('#monthValue').value = '';
        document.querySelector('#new-monthlyValue').style.display = 'block';

        document.querySelector('#withdrawLabel').style.display = 'none';
        document.querySelector('#addLabel').style.display = 'block';

        document.querySelector('#max-withdraw').style.display = 'none';
    });

    document.querySelector('#noAddNoRemove').addEventListener('change', () => {
        document.querySelector('#new-monthlyValue').style.display = 'none';
        document.querySelector('#max-withdraw').style.display = 'none';
    });

    document.querySelector('#radio-group1').addEventListener('change', updateWithdrawAmount);
    document.querySelector('#start').addEventListener('change', updateWithdrawAmount)

    document.querySelector('#new-account').addEventListener('reset', () => {
        document.querySelector('#max-withdraw').style.display = 'none';
        document.querySelector('#new-monthlyValue').style.display = 'none';
        document.querySelector('#new-result').style.display = 'none';
    });

    document.querySelector('#leverage').addEventListener('reset', () => {
        document.querySelector('#result').style.display = 'none';
    });

    accTab.click();

    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(response => response.json())
        .then(daylyInfo => {
            document.querySelector('#eurValue').innerText = daylyInfo.Valute.EUR.Value;
            document.querySelector('#eurDate').innerText = formatDate(daylyInfo.Date);
            document.querySelector('#eurRate').style.display = 'block';
        });
}

document.querySelector('#leverage-calc').addEventListener('click', calculateBoost);

init();
