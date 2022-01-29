import { withSixMonth } from './base';
import { MIN_CONTRACT } from '../../constants';

import { getContractDelta } from '../withLoan';
import { loan } from '../helpers';

export const withSixMonthLoan = (enteredAmount, monthsCount, monthValue, actualContract = MIN_CONTRACT, isNew = true) =>
    withSixMonth(enteredAmount, monthsCount, monthValue, getContractDelta, loan, actualContract, isNew);