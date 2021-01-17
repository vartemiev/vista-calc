import {
    RestockingStatus,
    LeverageStatus,

    MIN_CONTRACT,
    AJIO,
} from './constants';

import { formatDate, roundTwo, show, hide, value, elem, elems } from './utils';

import { withLeverage, getMaxWithdraw as getMaxWithdraw_WLeverage } from './new-account/withLeverage';
import { withoutLoan, getMaxWithdraw as getMaxWithdraw_WOLoan } from './new-account/withoutLoan';
import { withLoan, getMaxWithdraw as getMaxWithdraw_WLoan } from './new-account/withLoan';
import { onceLeverage } from './new-account/onceLeverage';

import { calculateBoost } from './boost';

let EURRate;

const getWithdrawAmount = () => {
    let enteredAmount = +value('#init-amount');
    if (elem('.currency.active').id === 'currency_RUB') {
        enteredAmount = enteredAmount / EURRate * 0.98;
    }

    if (enteredAmount < 1100) {
        return 0;
    }

    const contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    const amount = Math.round((enteredAmount - 100) - AJIO * contract);

    const leverageStatus = elem('[name="radio-group1"]:checked').id;
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
            return +value('#monthValue');

        case RestockingStatus.REMOVE_MONTHLY:
            return -value('#monthValue');
    }
};

const calculateValue = () => {
    const leverageStatus = elem('[name="radio-group1"]:checked').id;
    const restockingStatus = elem('[name="radio-group2"]:checked').id;

    const monthsCount = +value('#monthsCount');
    const monthValue = defineAmount(restockingStatus);

    let enteredAmount = +value('#init-amount');
    if (elem('.currency.active').id === 'currency_RUB') {
        enteredAmount = enteredAmount / EURRate * 0.98;
    }

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
    const isWithdrawChosen = elem('#removeMonthly').checked;
    if (!isWithdrawChosen) {
        return;
    }

    const withdrawAmount = getWithdrawAmount();

    elem('#withdraw-amount').innerText = `${withdrawAmount} EUR`;

    const isValueExceeds = +value('#monthValue') > withdrawAmount;
    if (isValueExceeds) {
        elem('#monthValue').value = withdrawAmount;
    }
};

const updateRUBInfo = () => {
    const enteredAmount = +value('#init-amount');
    const EURValue = enteredAmount / EURRate;
    const fee = EURValue * 0.02;

    elem('#init-amount').min = Math.ceil(1100 * EURRate / 0.98);
    elem('#RUB-info_fee').innerText = `${roundTwo(fee)} EUR`;
    elem('#RUB-info_value').innerText = `${roundTwo(EURValue  - fee)} EUR`;
};

const init = () => {
    const accTab = elem('#new-account-tab');
    const levTab = elem('#leverage-tab');

    accTab.addEventListener('click', () => {
        accTab.classList.add('active')
        levTab.classList.remove('active');

        show('#new-account');
        hide('#leverage');

        elem('#leverage').reset();
    });

    levTab.addEventListener('click', () => {
        accTab.classList.remove('active')
        levTab.classList.add('active');

        hide('#new-account');
        show('#leverage');

        elem('#new-account').reset();
    });


    elem('#new-account').addEventListener('submit', e => {
        e.preventDefault();
        calculateValue();
    });
    elem('#leverage').addEventListener('submit', e => {
        e.preventDefault();
        calculateBoost();
    });

    elem('#removeMonthly').addEventListener('change', () => {
        elem('#monthValue').value = '';
        show('#new-monthlyValue');

        show('#withdrawLabel');
        hide('#addLabel');

        show('#max-withdraw');
        elem('#withdraw-amount').innerText = `${getWithdrawAmount()} EUR`;
    });

    elem('#addMonthly').addEventListener('change', () => {
        elem('#monthValue').value = '';
        show('#new-monthlyValue');

        hide('#withdrawLabel');
        show('#addLabel');

        hide('#max-withdraw');
    });

    elem('#noAddNoRemove').addEventListener('change', () => {
        hide('#new-monthlyValue');
        hide('#max-withdraw');
    });

    elem('#radio-group1').addEventListener('change', updateWithdrawAmount);

    elem('#new-account').addEventListener('reset', () => {
        hide('#max-withdraw');
        hide('#new-monthlyValue');
        hide('#new-result');
    });

    elem('#leverage').addEventListener('reset', () => {
        hide('#result');
    });

    elem('#currency').addEventListener('click', (e) => {
        if (!e.target.classList.contains('currency')) {
            return;
        }

        elem('#new-account').reset();
        elems('.currency').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');

        const isRUB = e.target.id === 'currency_RUB';

        updateWithdrawAmount();

        if (isRUB) {
            updateRUBInfo();
            show('#cbRate', 'inline');
            show('#RUB-info');
        } else {
            elem('#init-amount').min = 1100;
            hide('#cbRate');
            hide('#RUB-info');
        }
    });

    elem('#init-amount').addEventListener('input', () => {
        updateWithdrawAmount();

        if (elem('.currency.active').id === 'currency_RUB') {
            updateRUBInfo();
        }
    });

    accTab.click();

    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(response => response.json())
        .then(daylyInfo => {
            EURRate = daylyInfo.Valute.EUR.Value;

            elem('#eurValue').innerText = EURRate;
            elem('#cbRate_value').innerText = EURRate;
            elem('#eurDate').innerText = formatDate(daylyInfo.Date);
            show('#eurRate');
        });
}

init();
