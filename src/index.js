import {
    RestockingStatus,
    LeverageStatus,

    MONTHS,
    RATES,

    AVERAGE_RATE,
    MIN_CONTRACT,
    AJIO,
    LOAN_KOEF,
} from './constants';

const twoDigits = amount => +amount.toFixed(2);

const loan = amount => twoDigits(amount * LOAN_KOEF);
const leverage = amount =>  twoDigits(amount / 3 * 7);
const workFee = amount => twoDigits(amount * 0.2);
const serviceFee = amount => twoDigits(amount / 12 / 100);
const loanFee = amount => twoDigits(amount * 7 / 12 / 100);

const Profit = {
    withLeverage: (income, amount) => twoDigits(income - workFee(income) - serviceFee(amount + leverage(amount)) - loanFee(leverage(amount))),
    withLoan: (income, amount) => twoDigits(income - workFee(income) - serviceFee(amount + loan(amount)) - loanFee(loan(amount))),
    withoutLoan: (income, amount) => twoDigits(income - workFee(income) - serviceFee(amount)),
    onceUpdate: (income, amount, leverage) => twoDigits(income - workFee(income) - serviceFee(amount) - loanFee(leverage)),
}

const UpdateContract = {
    withLeverage: (amount, contract) => Math.ceil((10 * amount - 3 * contract) / 3.7),
    withLoan: (amount, contract) => Math.ceil((1.7 * amount -  contract) / 1.119),
    withoutLoan: (amount, contract) => amount - contract,
}

const Income = {
    withLeverage: (amount, rate) => twoDigits((amount + leverage(amount)) * rate / 100),
    withLoan: (amount, rate) => twoDigits((amount + loan(amount)) * rate / 100),
    withoutLoan: (amount, rate) => twoDigits(amount * rate / 100),
}

const defineMaxWithdraw = (amount, leverageStatus) => {
    let withdrawRate;

    switch (leverageStatus) {
        case LeverageStatus.WITH_LEVERAGE:
        case LeverageStatus.ONCE_UPDATE:
            withdrawRate = 3.55;
            break;

        case LeverageStatus.WITH_LOAN:
            withdrawRate = 2.09;
            break;

        default:
            withdrawRate = AVERAGE_RATE;
    }

    return amount * withdrawRate / 100;
}
const getWithdrawAmount = () => {
    const enteredAmount = +document.querySelector('#start').value;
    const contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    const amount = Math.round((enteredAmount - 100) - AJIO * contract);
    const leverageStatus = document.querySelector('[name="radio-group1"]:checked').id;

    return Math.floor(defineMaxWithdraw(amount, leverageStatus));
};

const formatDate = (timestamp) => {
    const [date] = timestamp.split('T');
    const [year, month, day] = date.split('-');

    return `${day} ${MONTHS[+month - 1]} ${year}`;
}

const format = (amount) => {
    const string = Math.round(amount).toString().split('');

    let res = '';
    while (string.length > 0) {
        res += string
            .splice(0, string.length % 3 || 3)
            .join('');
        res += ' ';
    }

    return res;
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

const makeCalculations = (enteredAmount, monthsCount, monthValue, leverageStatus) => {
    let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    let amount = Math.round((enteredAmount - 100) - AJIO * contract);

    RATES.slice(-monthsCount).forEach(
        (rate) => {
            const updatedContract = UpdateContract[leverageStatus](amount, contract);
            if (updatedContract > 0) {
                contract += updatedContract;
                amount = twoDigits(amount - updatedContract * AJIO);
            }

            const inc = Income[leverageStatus](amount, rate);
            const profit = Profit[leverageStatus](inc, amount);

            amount = twoDigits(amount + profit + monthValue);
        }
    );

    amount -= monthValue;
    const averageIncome = Income[leverageStatus](amount, AVERAGE_RATE);
    const averageProfit = Profit[leverageStatus](averageIncome, amount);

    document.querySelector('#amount').innerText = format(amount);
    document.querySelector('#our').innerText = format(monthValue * monthsCount + enteredAmount);
    document.querySelector('#profit').innerText = format(Math.floor(averageProfit));

    document.querySelector('#new-result').style.display = 'block';
};

const onceRestocking = (enteredAmount, monthsCount, monthValue) => {
    let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;
    let amount = Math.round((enteredAmount - 100) - AJIO * contract);

    const updatedContract = UpdateContract.withLeverage(amount, contract);
    if (updatedContract > 0) {
        contract += updatedContract;
        amount = twoDigits(amount - updatedContract * AJIO);
    }

    const _leverage = leverage(amount);
    amount += _leverage;
    const initialAmount = amount;

    RATES.slice(-monthsCount).forEach((rate, i) => {
        const updatedContract = UpdateContract.withoutLoan(initialAmount + i * monthValue, contract);
        if (updatedContract > 0) {
            contract += updatedContract;
            amount = twoDigits(amount - updatedContract * AJIO);
        }

        const inc = Income.withoutLoan(amount, rate);
        const profit = Profit.onceUpdate(inc, amount, _leverage);

        amount = twoDigits(amount + profit + monthValue);
    });

    amount -= monthValue;
    const averageIncome = Income.withoutLoan(amount, AVERAGE_RATE);
    const averageProfit = Profit.withLoan(averageIncome, amount);

    document.querySelector('#amount').innerText = format(amount - _leverage);
    document.querySelector('#our').innerText = format(monthValue * monthsCount + enteredAmount);
    document.querySelector('#profit').innerText = format(Math.floor(averageProfit));

    document.querySelector('#new-result').style.display = 'block';
}

const calculateValue = () => {
    const leverageStatus = document.querySelector('[name="radio-group1"]:checked').id;
    const restockingStatus = document.querySelector('[name="radio-group2"]:checked').id;

    const enteredAmount = +document.querySelector('#start').value;
    const monthsCount = +document.querySelector('#monthsCount').value;
    const monthValue = defineAmount(restockingStatus);

    switch (leverageStatus) {
        case LeverageStatus.WITH_LEVERAGE:
            makeCalculations(enteredAmount, monthsCount, monthValue, LeverageStatus.WITH_LEVERAGE);
            break;

        case LeverageStatus.WITH_LOAN:
            makeCalculations(enteredAmount, monthsCount, monthValue, LeverageStatus.WITH_LOAN);
            break;

        case LeverageStatus.WITHOUT_LOAN:
            makeCalculations(enteredAmount, monthsCount, monthValue, LeverageStatus.WITHOUT_LOAN);
            return;

        case LeverageStatus.ONCE_UPDATE:
            onceRestocking(enteredAmount, monthsCount, monthValue);
            return;

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
        document.querySelector('#withdrawLabel').style.display = 'block';
        document.querySelector('#addLabel').style.display = 'none';

        document.querySelector('#max-withdraw').style.display = 'block';
        document.querySelector('#withdraw-amount').innerText = getWithdrawAmount();
    });

    document.querySelector('#addMonthly').addEventListener('change', () => {
        document.querySelector('#withdrawLabel').style.display = 'none';
        document.querySelector('#addLabel').style.display = 'block';
        document.querySelector('#max-withdraw').style.display = 'none';
    });

    document.querySelector('#noAddNoRemove').addEventListener('change', () => {
        document.querySelector('#new-monthlyWithdraw').style.display = 'none';
        document.querySelector('#new-monthlyAdding').style.display = 'none';
        document.querySelector('#max-withdraw').style.display = 'none';
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

const calculateBoost = () => {
    const balance = +document.querySelector('#balance').value;
    const loan = +document.querySelector('#loan').value;
    let contract = +document.querySelector('#contract').value;

    let amount = twoDigits(balance - loan);
    const updatedContract = UpdateContract.withLeverage(amount, contract);
    if (updatedContract > 0) {
        contract = Math.ceil(contract + updatedContract);
        amount = twoDigits(amount - updatedContract * AJIO);
        document.querySelector('#new-contract').innerText = `${format(contract)} EUR`;
        document.querySelector('#result-amount').innerText = `${format(amount)} EUR`;
    }

    document.querySelector('#leverage-result').innerText = `${format(Math.floor(leverage(amount)))} EUR`;
    document.querySelector('#result').style.display = 'block';
};

document.querySelector('#leverage-calc').addEventListener('click', calculateBoost);

init();
