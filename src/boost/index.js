import { format, leverage, roundTwo, elem, value, hide, show } from '../utils';
import { getContractDelta as getContractDelta_WLeverage } from '../new-account/withLeverage';

import { AJIO } from '../constants';

export const calculateBoost = () => {
    hide('#result_new');
    hide('#result_balance');

    const balance = +value('#balance');
    const loan = +value('#loan');
    let contract = +value('#contract');

    let amount = roundTwo(balance - loan);

    const contractDelta = getContractDelta_WLeverage(amount, contract);
    if (contractDelta > 0) {
        contract = Math.ceil(contract + contractDelta);
        amount = roundTwo(amount - contractDelta * AJIO);

        show('#result_new');
        elem('#result_new__value').innerText = `${format(contract)} EUR`;

        show('#result_balance');
        elem('#result_balance__value').innerText = `${format(amount)} EUR`;
    }

    elem('#result_leverage__value').innerText = `${format(leverage(amount))} EUR`;
    show('#result');
};
