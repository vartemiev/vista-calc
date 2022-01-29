import { withSixMonth } from './base';
import { MIN_CONTRACT } from '../../constants';

import { getContractDelta } from '../withLeverage';
import { leverage } from '../helpers';

export const withSixMonthLeverage = (enteredAmount, monthsCount, monthValue, actualContract = MIN_CONTRACT, isNew = true) =>
    withSixMonth(enteredAmount, monthsCount, monthValue, getContractDelta, leverage, actualContract, isNew);