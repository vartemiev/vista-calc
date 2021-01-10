import { LOAN_RATIO, MONTHS } from '../constants';

export const roundTwo = amount => +amount.toFixed(2);

export const loan = amount => roundTwo(amount * LOAN_RATIO);
export const leverage = amount =>  roundTwo(amount / 3 * 7);
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