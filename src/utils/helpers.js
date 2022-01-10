import {
    LOAN_RATIO,
    MONTHS,
    RATES,
    MONTHS_COUNT,
    MONTHS_DETAILS,
    Leverage,
    Withdraw,
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

export const getFileName = (leverageStatus, withdrawStatus, months, amount, monthValue, EURRate, isRUB, isNew) => {
    let fileName = `${isNew ? 'Новый' : 'Текущий'}_${isRUB ? Math.floor(amount / EURRate * 0.98) : amount}_`;

    switch (leverageStatus) {
        case Leverage.LEVERAGE:
            fileName += 'Прокачка_';
            break;

        case Leverage.ONCE:
            fileName += 'ОднаПрокачка_';
            break;

        case Leverage.LOAN:
            fileName += 'Займ_';
            break;

        case Leverage.NONE:
            fileName += 'БезЗайма_';
            break;
    }

    switch (withdrawStatus) {
        case Withdraw.ADD:
            fileName += `Пололнение${monthValue}_`;
            break;

        case Withdraw.REMOVE:
            fileName += `Снятие${monthValue}_`;
            break;
    }

    return `${fileName}Месяцев${months}`;
}

export const detalizationResult = (amount, our, dividends) => `
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

export const createDetailazationTable = () => {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <td>Месяц</td>            
                <td>Внесено</td>            
                <td>Актив. счета</td>            
                <td>Контракт</td>            
                <td>Ажио</td>            
                <td>Своих</td>            
                <td>Займ</td>            
                <td>Баланс</td>            
                <td>Доходность</td>            
                <td>Начислено</td>            
                <td>Управл (-20%)</td>            
                <td>Обсл (-1/12%)</td>            
                <td>Займ (-7/12%)</td>            
                <td>Баланс</td>            
                <td>Своих</td>            
                <td>Прибыль</td>            
            </tr>        
        </thead>
        <tbody></tbody>
    `;

    return table;
};

export const isValidNumber = value => value === '' || /^(\d+)?(\.)?(\d{1,2})?$/.test(value);
