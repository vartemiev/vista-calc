import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

import { isValidNumber } from '../utils/helpers';
import { MIN_CONTRACT } from '../constants';
import { calculateBoost } from '../utils/boost';

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

export const Boost = () => {
    const [amount, setAmount] = useState('');
    const [loan, setLoan] = useState('');
    const [contract, setContract] = useState('');
    const [calculationResult, setCalculationResult] = useState(null);
    const [errors, setErrors] = useState({
        amount: '',
        contract: '',
    });

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
        []
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

    const onCalculateResult = useCallback(
        () => {
            const validationResult = {
                amount: validateAmount(+amount),
                loan: validateLoan(+loan, +amount),
                contract: validateContract(+contract),
            };

            if (Object.values(validationResult).some(val => val)) {
                setErrors(validationResult);
                return;
            }

            setCalculationResult(calculateBoost(+amount, +loan, +contract));
        },
        [amount, loan, contract]
    );

    return (
        <div className="tab-content">
            <label className="input-container">
                <div className="input-container__label">Текущий баланс (EUR)<span className="required-field">*</span></div>
                <input
                    type="text"
                    className={classNames('form-control form-input', { 'is-invalid': errors.amount })}
                    autoComplete="off"

                    value={amount}
                    onChange={onChangeAmount}
                />
                <div className="invalid-feedback">
                    {errors.amount}
                </div>
            </label>

            <label className="input-container">
                <div className="input-container__label">Текущий займ (EUR)</div>
                <input
                    type="text"
                    className={classNames('form-control form-input', { 'is-invalid': errors.loan })}
                    autoComplete="off"

                    value={loan}
                    onChange={onChangeLoan}
                />
                <div className="invalid-feedback">
                    {errors.loan}
                </div>
            </label>

            <label className="input-container">
                <div className="input-container__label">Текущий контракт (EUR)<span className="required-field">*</span></div>
                <input
                    type="text"
                    className={classNames('form-control form-input', { 'is-invalid': errors.contract })}
                    autoComplete="off"

                    value={contract}
                    onChange={onChangeContract}
                />
                <div className="invalid-feedback">
                    {errors.contract}
                </div>

            </label>

            <button className="btn btn-success calc-btn" onClick={onCalculateResult}>
                Рассчитать
            </button>

            {calculationResult && (
                <div className="leverage-result">
                    {calculationResult.contract && (
                        <div>
                            <div>Новый контракт:</div>
                            <div className="digit">{calculationResult.contract}</div>
                        </div>
                    )}

                    {calculationResult.balance && (
                        <div>
                            <div>Результирующий баланс:</div>
                            <div className="digit">{calculationResult.balance}</div>
                        </div>
                    )}

                    <div>
                        <div>Кредитное плечо:</div>
                        <div className="digit">{calculationResult.leverage}</div>
                    </div>
                </div>
            )}
        </div>
    )
};
