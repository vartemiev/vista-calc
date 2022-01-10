import React from 'react';
import PropTypes from 'prop-types';

import { Leverage, Withdraw } from '../constants';

const noop = () => null;

export const RadioGroup = props => (
    <div className="Radio-group">
        <div className="Radio-group__block">
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.leverage === Leverage.LEVERAGE}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeLeverage(Leverage.LEVERAGE)}
                >
                    С ежемесячной прокачкой
                </label>
            </div>
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.leverage === Leverage.ONCE}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeLeverage(Leverage.ONCE)}
                >
                    Прокачать один раз
                </label>
            </div>
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.leverage === Leverage.LOAN}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeLeverage(Leverage.LOAN)}
                >
                    С займом 70% каждый месяц
                </label>
            </div>
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.leverage === Leverage.NONE}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeLeverage(Leverage.NONE)}
                >
                    Без займа
                </label>
            </div>
        </div>

        <div className="Radio-group__block">
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.withdraw === Withdraw.NONE}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeWithdraw(Withdraw.NONE)}
                >
                    Не снимать и не пополнять
                </label>
            </div>
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.withdraw === Withdraw.ADD}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeWithdraw(Withdraw.ADD)}
                >
                    Пополнять ежемесячно
                </label>
            </div>
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className="custom-control-input"
                    checked={props.withdraw === Withdraw.REMOVE}

                    onChange={noop}
                />
                <label
                    className="custom-control-label"
                    onClick={props.onChangeWithdraw(Withdraw.REMOVE)}
                >
                    Снимать ежемесячно
                </label>
            </div>
        </div>
    </div>
);

RadioGroup.propTypes = {
    leverage: PropTypes.string,
    withdraw: PropTypes.string,

    onChangeLeverage: PropTypes.func,
    onChangeWithdraw: PropTypes.func,
}