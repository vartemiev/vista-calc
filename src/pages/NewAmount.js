import React, { useCallback, useState, useMemo, useContext } from 'react';
import classNames from 'classnames';

import { EURContext } from '../App';

import { RadioGroup } from '../components/RadioGroup';
import { CalculationResult } from '../components/CalculationResult';

import { MaxWithdraw } from '../utils';

import { withLeverage } from '../utils/withLeverage';
import { onceLeverage } from '../utils/onceLeverage';
import { withoutLoan } from '../utils/withoutLoan';
import { withLoan } from '../utils/withLoan';

import { roundTwo, isValidNumber, getFileName } from '../utils/helpers';

import { Leverage, Withdraw, Periods, PeriodsTranslations, MIN_AMOUNT, AJIO, MIN_CONTRACT } from '../constants';

const Currency = {
    EUR: 'EUR',
    RUB: 'RUB',
};

const CB_FEE = 0.02;

const validateInitValue = (value, activeCurrency, EURRate) => {
    if (!value) {
        return `Необходимо ввести начальную сумму`;
    }

    const amount = activeCurrency === Currency.RUB ?
        +value / EURRate * 0.98 :
        +value;

    if (amount < MIN_AMOUNT) {
        const minAmount = activeCurrency === Currency.RUB ?
            Math.ceil(MIN_AMOUNT * EURRate / 0.98) :
            MIN_AMOUNT;

        return `Минимальная сумма для пополнения: ${minAmount} ${activeCurrency}`;
    }

    return '';
}

const validatePeriod = (period, activePeriod) => !period ?
    `Необходимо ввести количество ${activePeriod === Periods.MONTH ? 'месяцев' : 'лет'}` :
    ``;

const validateWithdraw = (value, maxWithdraw, isWithdraw) => value > maxWithdraw && isWithdraw ?
    `Превышено максимально допустимое значение` :
    ``;


export const NewAmount = () => {
    const EURRate = useContext(EURContext);

    const [activeCurrency, setActiveCurrency] = useState(Currency.EUR);
    const [activePeriod, setActivePeriod] = useState(Periods.MONTH);
    const [initValue, setInitValue] = useState('');
    const [period, setPeriod] = useState('');

    const [leverage, setLeverage] = useState(Leverage.LEVERAGE);
    const [withdraw, setWithdraw] = useState(Withdraw.NONE);

    const [monthValue, setMonthValue] = useState('');

    const [calculationResult, setCalculationResult] = useState(null);
    const [errors, setErrors] = useState({
        monthValue: '',
        initValue: '',
        period: '',
    });

    const togglerClassName = (isActive) => classNames({
        toggler: true,
        active: isActive,
    });

    const renderCurrency = (currency) => (
        <span
            className={togglerClassName(activeCurrency === currency)}
            onClick={() => {
                setActiveCurrency(currency);
                setErrors({ ...errors, initValue: '' });
                setInitValue('');
            }}
        >
            {currency}
        </span>
    );

    const renderPeriod = (chosenPeriod) => (
        <span
            className={togglerClassName(activePeriod === chosenPeriod)}
            onClick={() => {
                setActivePeriod(chosenPeriod);
                setErrors({ ...errors, period: '' });
                setPeriod(chosenPeriod === Periods.MONTH ?
                    (period * 12).toString() :
                    Math.floor(period / 12).toString()
                );
            }}
        >
            {PeriodsTranslations[chosenPeriod]}
        </span>
    );


    const maxWithdraw = useMemo(
        () => {
            if (initValue < MIN_AMOUNT) {
                return 0;
            }

            const actualValue = activeCurrency === Currency.RUB ?
                initValue / EURRate * 0.98 :
                initValue;

            const contract = actualValue - 100 > MIN_CONTRACT ? actualValue - 100 : MIN_CONTRACT;
            const amount = Math.round((actualValue - 100) - AJIO * contract);

            return MaxWithdraw[leverage](amount, contract);
        },
        [leverage, initValue, activeCurrency]
    );

    const RUBInfo = useMemo(
        () => {
            const EURValue = initValue / EURRate;
            const fee = EURValue * CB_FEE;

            return {
                fee: roundTwo(fee),
                value: roundTwo(EURValue  - fee),
            };
        },
        [initValue, EURRate]
    );

    const createFilename = () => getFileName(
        leverage,
        withdraw,
        activePeriod === Periods.MONTH ? period : period * 12,
        initValue,
        monthValue,
        EURRate,
        activeCurrency === Currency.RUB,
        true
    );

    const onChangeInitValue = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setErrors({ ...errors, initValue: '' });
                setInitValue(e.target.value);
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

    const onValidate = useCallback(
        () => {
            const validationResult = {
                initValue: validateInitValue(+initValue, activeCurrency, EURRate),
                monthValue: validateWithdraw(+monthValue, maxWithdraw, withdraw === Withdraw.REMOVE),
                period: validatePeriod(+period, activePeriod),
            };

            if (Object.values(validationResult).some(val => val)) {
                setErrors(validationResult);
                return false;
            }

            return true;
        },
        [initValue, activeCurrency, EURRate, monthValue, maxWithdraw, period, activePeriod]
    );

    const onCalculateResult = useCallback(
        () => {
            if (!onValidate()) {
                setCalculationResult(null);
                return;
            }

            const amount = activeCurrency === Currency.RUB ?
                initValue / EURRate * 0.98 :
                +initValue;

            const _monthValue = withdraw === Withdraw.REMOVE ? -monthValue : +monthValue;

            switch (leverage) {
                case Leverage.ONCE:
                    return setCalculationResult(onceLeverage(amount, +period, _monthValue));
                case Leverage.LOAN:
                    return setCalculationResult(withLoan(amount, +period, _monthValue));
                case Leverage.LEVERAGE:
                    return setCalculationResult(withLeverage(amount, +period, _monthValue));
                case Leverage.NONE:
                    return setCalculationResult(withoutLoan(amount, +period, _monthValue));
            }
        },
        [initValue, period, leverage, withdraw, monthValue, onValidate, activeCurrency]
    );

    return (
        <div className="tab-content">
            <div>
                <label style={{ width: '100%' }}>
                    <div className="input-container__label">
                        Начальная сумма
                        ({renderCurrency(Currency.EUR)}|{renderCurrency(Currency.RUB)}) <span className="required-field">*</span>
                    </div>
                    <input
                        type="text"
                        id="initValue"
                        className={classNames("form-control form-input", { 'is-invalid': errors.initValue })}
                        autoComplete="off"

                        value={initValue}
                        onChange={onChangeInitValue}
                    />
                    <div className="invalid-feedback">
                        {errors.initValue}
                    </div>
                </label>

                {activeCurrency === Currency.RUB && (
                    <div className="RUB-info">
                        <div className="RUB-info__block">
                            <span>Комиссия:</span>
                            <span className="digit-sm">{RUBInfo.fee} EUR</span>
                        </div>
                        <div className="RUB-info__block">
                            <span>Сумма для пополнения счета:</span>
                            <span className="digit-sm">{RUBInfo.value} EUR</span>
                        </div>
                    </div>
                )}
            </div>

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

            {calculationResult && <CalculationResult isNew {...calculationResult} filename={createFilename()}/>}
        </div>
    );
};

