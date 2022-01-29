import { getMaxWithdraw as withLeverage } from './withLeverage';
import { getMaxWithdraw as withLoan } from './withLoan';
import { getMaxWithdraw as withNone } from './withoutLoan';

import { Leverage } from '../constants';

export const MaxWithdraw = {
    [Leverage.LEVERAGE_SIX]: withLeverage,
    [Leverage.LEVERAGE]: withLeverage,
    [Leverage.ONCE]: withLeverage,
    [Leverage.LOAN_SIX]: withLoan,
    [Leverage.LOAN]: withLoan,
    [Leverage.NONE]: withNone,
}