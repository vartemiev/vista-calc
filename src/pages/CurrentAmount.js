import React, { useCallback, useState, useMemo } from 'react';
import classNames from 'classnames';

import { RadioGroup } from '../components/RadioGroup';
import { CalculationResult } from '../components/CalculationResult';

import { MaxWithdraw } from '../utils';

import { withLeverage } from '../utils/withLeverage';
import { onceLeverage } from '../utils/onceLeverage';
import { withoutLoan } from '../utils/withoutLoan';
import { withLoan } from '../utils/withLoan';

import { isValidNumber, getFileName } from '../utils/helpers';

import { Leverage, Withdraw, Periods, PeriodsTranslations, MIN_CONTRACT } from '../constants';

const validateAmount = (amount) => !amount ?
    `Необходимо ввести текущий баланс` :
    ``;

const validateLoan = (loan, amount) => {
    if (loan > amount) {
        return `Сумма займа не может превышать текущий баланс`;
    }

    return ``;
}

const validateContract = (contract) => {
    if (!contract) {
        return `Необходимо ввести текущий контракт`;
    }

    if (contract < MIN_CONTRACT) {
        return `Контракт не может быть менее 10000 EUR`;
    }

    return ``;
}

const validatePeriod = (period, activePeriod) => !period ?
    `Необходимо ввести количество ${activePeriod === Periods.MONTH ? 'месяцев' : 'лет'}` :
    ``;

const validateWithdraw = (value, maxWithdraw, isWithdraw) => value > maxWithdraw && isWithdraw ?
    `Превышено максимально допустимое значение` :
    ``;

export const CurrentAmount = () => {
    const [amount, setAmount] = useState('');
    const [loan, setLoan] = useState('');
    const [contract, setContract] = useState('');
    const [monthValue, setMonthValue] = useState('');

    const [activePeriod, setActivePeriod] = useState(Periods.MONTH);
    const [period, setPeriod] = useState('');

    const [leverage, setLeverage] = useState(Leverage.LEVERAGE);
    const [withdraw, setWithdraw] = useState(Withdraw.NONE);

    const [calculationResult, setCalculationResult] = useState(null);

    const [errors, setErrors] = useState({
        amount: '',
        loan: '',
        contract: '',
    });

    const togglerClassName = (isActive) => classNames({
        toggler: true,
        active: isActive,
    });

    const renderPeriod = (chosenPeriod) => (
        <span
            className={togglerClassName(activePeriod === chosenPeriod)}
            onClick={() => {
                setActivePeriod(chosenPeriod);
                setErrors({ ...errors, period: '' });
                setPeriod('');
            }}
        >
            {PeriodsTranslations[chosenPeriod]}
        </span>
    );

    const onChangeLeverage = useCallback(
        (value) => () => setLeverage(value),
        []
    );

    const onChangeWithdraw = useCallback(
        (value) => () => {
            setWithdraw(value);
            setMonthValue('');
        },
        []
    );

    const createFilename = () => getFileName(
        leverage,
        withdraw,
        activePeriod === Periods.MONTH ? period : period * 12,
        amount,
        monthValue,
    );


    const maxWithdraw = useMemo(
        () => MaxWithdraw[leverage](amount - loan, +contract),
        [leverage, amount, loan, contract]
    );

    const onChangeAmount = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setErrors({ ...errors, amount: '' });
                setAmount(e.target.value);
            }
        },
        [errors]
    );
    const onChangeLoan = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setErrors({ ...errors, loan: '' });
                setLoan(e.target.value);
            }
        },
        [errors]
    );
    const onChangeContract = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setErrors({ ...errors, contract: '' });
                setContract(e.target.value);
            }
        },
        [errors]
    );

    const onChangePeriod = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setErrors({ ...errors, period: '' });
                setPeriod(e.target.value);
            }
        },
        [errors]
    );
    const onChangeMonthValue = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setErrors({ ...errors, monthValue: '' });
                setMonthValue(e.target.value);
            }
        },
        [errors]
    );

    const onValidate = useCallback(
        () => {
            const validationResult = {
                amount: validateAmount(+amount),
                loan: validateLoan(+loan, +amount),
                contract: validateContract(+contract),
                period: validatePeriod(+period, activePeriod),
                monthValue: validateWithdraw(+monthValue, maxWithdraw, withdraw === Withdraw.REMOVE)
            };

            if (Object.values(validationResult).some(val => val)) {
                setErrors(validationResult);
                return false;
            }

            return true;
        },
        [amount, loan, contract, period, activePeriod, monthValue, maxWithdraw, withdraw]
    );

    const onCalculateResult = useCallback(
        () => {
            if (!onValidate()) {
                setCalculationResult(null);
                return;
            }

            const _monthValue = withdraw === Withdraw.REMOVE ? -monthValue : +monthValue;
            const initValue = amount - loan;

            switch (leverage) {
                case Leverage.ONCE:
                    return setCalculationResult(onceLeverage(initValue, +period, _monthValue, +contract, false));
                case Leverage.LOAN:
                    return setCalculationResult(withLoan(initValue, +period, _monthValue, +contract, false));
                case Leverage.LEVERAGE:
                    return setCalculationResult(withLeverage(initValue, +period, _monthValue, +contract, false));
                case Leverage.NONE:
                    return setCalculationResult(withoutLoan(initValue, +period, _monthValue, +contract, false));
            }
        },
        [amount, contract, period, leverage, withdraw, monthValue, onValidate]
    );

    return (
        <div className="tab-content">
            <label>
                <div className="input-container__label">
                    Текущий баланс (EUR)<span className="required-field">*</span>
                </div>
                <input
                    type="text"
                    className={classNames("form-control form-input", { 'is-invalid': errors.amount })}
                    autoComplete="off"

                    value={amount}
                    onChange={onChangeAmount}
                />
                <div className="invalid-feedback">
                    {errors.amount}
                </div>
            </label>

            <label>
                <div className="input-container__label">
                    Текущий займ (EUR)
                </div>
                <input
                    type="text"
                    className={classNames("form-control form-input", { 'is-invalid': errors.loan })}
                    autoComplete="off"

                    value={loan}
                    onChange={onChangeLoan}
                />
                <div className="invalid-feedback">
                    {errors.loan}
                </div>
            </label>

            <label>
                <div className="input-container__label">
                    Текущий контракт (EUR)<span className="required-field">*</span>
                </div>
                <input
                    type="text"
                    className={classNames("form-control form-input", { 'is-invalid': errors.contract })}
                    autoComplete="off"

                    value={contract}
                    onChange={onChangeContract}
                />
                <div className="invalid-feedback">
                    {errors.contract}
                </div>
            </label>

            <RadioGroup
                leverage={leverage}
                withdraw={withdraw}

                onChangeLeverage={onChangeLeverage}
                onChangeWithdraw={onChangeWithdraw}
            />

            {withdraw === Withdraw.ADD && (
                <label className="input-container">
                    <div className="input-container__label">Сумма ежемесячного пополнения (EUR)</div>
                    <input
                        type="text"
                        className="form-control form-input"
                        autoComplete="off"

                        value={monthValue}
                        onChange={onChangeMonthValue}
                    />
                </label>
            )}

            {withdraw === Withdraw.REMOVE && (
                <React.Fragment>
                    <label className="input-container">
                        <div className="input-container__label">Сумма ежемесячного снятия (EUR)</div>
                        <input
                            type="text"
                            className={classNames("form-control form-input", { 'is-invalid': errors.monthValue })}
                            autoComplete="off"

                            value={monthValue}
                            onChange={onChangeMonthValue}
                        />
                        <div className="invalid-feedback">
                            {errors.monthValue}
                        </div>
                    </label>
                    <div className="leverage-result">
                        <div className="leverage-result__label">Максимально допустимая сумма:</div>
                        <div className="digit">{maxWithdraw} EUR</div>
                    </div>
                </React.Fragment>
            )}

            <label className="input-container">
                <div className="input-container__label">Период ( {renderPeriod(Periods.MONTH)} | {renderPeriod(Periods.YEAR)} )<span className="required-field">*</span></div>
                <input
                    type="text"
                    className={classNames("form-control form-input", { 'is-invalid': errors.period })}
                    autoComplete="off"

                    value={period}
                    onChange={onChangePeriod}
                />
                <div className="invalid-feedback">
                    {errors.period}
                </div>
            </label>

            <button className="btn btn-success calc-btn" onClick={onCalculateResult}>
                Рассчитать
            </button>

            {calculationResult && <CalculationResult {...calculationResult} filename={createFilename()} />}
        </div>
    );
};

