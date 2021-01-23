import {
    LOAN_RATIO,
    MONTHS,
    RATES,
    MONTHS_COUNT,
    MONTHS_DETAILS,
    LeverageStatus,
    RestockingStatus
} from '../constants';

export const roundTwo = amount => +amount.toFixed(2);

export const loan = amount => roundTwo(amount * LOAN_RATIO);
export const leverage = amount => roundTwo(amount / 3 * 7);
export const workFee = amount => roundTwo(amount * 0.2);
export const serviceFee = amount => roundTwo(amount / 12 / 100);
export const loanFee = amount => roundTwo(amount * 7 / 12 / 100);

export const format = amount => {
    const string = Math.round(amount)
        .toString()
        .split('');

    let res = '';
    while (string.length > 0) {
        res += string
            .splice(0, string.length % 3 || 3)
            .join('');
        res += ' ';
    }

    return res;
};

export const formatDate = (timestamp) => {
    const [date] = timestamp.split('T');
    const [year, month, day] = date.split('-');

    return `${day} ${MONTHS[+month - 1]} ${year}`;
}

export const hide = selector => document.querySelector(selector).style.display = 'none';
export const show = (selector, method) => document.querySelector(selector).style.display = method || 'block';
export const value = selector => document.querySelector(selector).value;

export const elem = selector => document.querySelector(selector);
export const elems = selector => document.querySelectorAll(selector);

export const generateRates = (monthsCount) => {
    if (monthsCount < RATES.length) {
        return RATES.slice(-monthsCount);
    }

    const averageRates = RATES
        .reduce(
            (res, rate, i) => {
                const index = i % MONTHS_COUNT
                res[index] = !res[index] ? [rate] : [...res[index], rate]

                return res
            },
            []
        )
        .map((rates) => roundTwo(rates.reduce((res, rate) => res + rate, 0) / rates.length))

    const leftMonth = monthsCount - RATES.length;

    return new Array(Math.ceil(leftMonth / MONTHS_COUNT))
        .fill(averageRates)
        .reduce((res, rates) => res.concat(rates), [])
        .slice(-leftMonth)
        .concat(RATES);
};

export const getMonthYear = (monthsCount) => {
    const today = new Date();
    today.setMonth(-monthsCount);

    const [year, month] = today
        .toISOString()
        .split('T')[0]
        .split('-');

    return `${MONTHS_DETAILS[+month - 1]}&nbsp;${year}`;
}

export const getFileName = () => {
    const leverageStatus = elem('[name="radio-group1"]:checked').id;
    const restockingStatus = elem('[name="radio-group2"]:checked').id;
    const months = +value('#monthsCount')
    const amount = +value('#init-amount');
    const monthValue = +value('#monthValue');

    let fileName = `${amount}_`;

    switch (leverageStatus) {
        case LeverageStatus.WITH_LEVERAGE:
            fileName += 'Прокачка_';
            break;
        case LeverageStatus.ONCE_UPDATE:
            fileName += 'ОднаПрокачка_';
            break;
        case LeverageStatus.WITH_LOAN:
            fileName += 'Займ_';
            break;
        case LeverageStatus.WITHOUT_LOAN:
            fileName += 'БезЗайма_';
            break;
    }

    switch (restockingStatus) {
        case RestockingStatus.ADD_MONTHLY:
            fileName += `Пололнение${monthValue}_`;
            break;
        case RestockingStatus.REMOVE_MONTHLY:
            fileName += `Снятие${monthValue}_`;
            break;
    }

    return `${fileName}Месяцев${months}`;
}

export const printResult = (amount, our, dividends) => `
        <tr></tr>
        <tr>
            <td>Вложено</td>
            <td>своих:</td>
            <td>${our}</td>
            <td>EUR</td>
        </tr>
        <tr>
            <td>Доступно</td>
            <td>к снятию:</td>
            <td>${amount}</td>
            <td>EUR</td> 
        </tr>
        <tr>
            <td>Ежемесячные</td>
            <td>дивиденды:</td>
            <td>${dividends}</td>
            <td>EUR</td> 
        </tr>
`