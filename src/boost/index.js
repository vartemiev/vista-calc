import { format, leverage, roundTwo } from '../utils';
import { getContractDelta as getContractDelta_WLeverage } from '../new-account/withLeverage';

import { AJIO } from '../constants';

export const calculateBoost = () => {
    document.querySelector('#result_new').style.display = 'none';
    document.querySelector('#result_balance').style.display = 'none';

    const balance = +document.querySelector('#balance').value;
    const loan = +document.querySelector('#loan').value;
    let contract = +document.querySelector('#contract').value;

    let amount = roundTwo(balance - loan);

    const contractDelta = getContractDelta_WLeverage(amount, contract);
    if (contractDelta > 0) {
        contract = Math.ceil(contract + contractDelta);
        amount = roundTwo(amount - contractDelta * AJIO);

        document.querySelector('#result_new').style.display = `block`;
        document.querySelector('#result_new__value').innerText = `${format(contract)} EUR`;

        document.querySelector('#result_balance').style.display = `block`;
        document.querySelector('#result_balance__value').innerText = `${format(amount)} EUR`;
    }

    document.querySelector('#result_leverage__value').innerText = `${format(Math.floor(leverage(amount)))} EUR`;
    document.querySelector('#result').style.display = 'block';
};
