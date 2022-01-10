import { format, leverage, roundTwo } from './helpers';
import { getContractDelta } from './withLeverage';

import { AJIO } from '../constants';

export const calculateBoost = (balance, loan, contract) => {
    let amount = roundTwo(balance - loan);

    const contractDelta = getContractDelta(amount, contract);
    const result = {};

    if (contractDelta > 0) {
        const newContract = Math.ceil(contract + contractDelta);
        amount = roundTwo(amount - contractDelta * AJIO);

        result.contract = format(newContract);
        result.balance = format(amount);
    }

    return {
        ...result,
        leverage: format(leverage(amount)),
    };
};
