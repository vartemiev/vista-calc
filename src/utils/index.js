import { getMaxWithdraw as withLeverage } from './withLeverage';
import { getMaxWithdraw as withLoan } from './withLoan';
import { getMaxWithdraw as withNone } from './withoutLoan';

import { Leverage } from '../constants';

export const MaxWithdraw = {
    [Leverage.LEVERAGE]: withLeverage,
    [Leverage.ONCE]: withLeverage,
    [Leverage.LOAN]: withLoan,
    [Leverage.NONE]: withNone,
}