import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

import { isValidNumber } from '../utils/helpers';

const USDT_FEE_RATE = 0.02;
const UTLTW_FEE_RATE = 0.07;

const calculateResult = (bvsdRate, utltwRate, bvsdCount) => {
    const ultlwFee = +(utltwRate * UTLTW_FEE_RATE).toFixed(2);

    const usdtFee = +(ultlwFee * (1 + USDT_FEE_RATE) / bvsdRate).toFixed(2);

    const utltwCount = Math.floor((bvsdCount / (utltwRate + usdtFee)) * 100) / 100;

    const totalBvsdFee = +(utltwCount * usdtFee).toFixed(2);

    return {
        utltwCount,
        totalBvsdFee,
        leftOver: +(bvsdCount - (utltwCount * utltwRate) - totalBvsdFee).toFixed(2),
    }
};

export const UTLCalculator = () => {
    const [bvsdRate, setBvsdRate] = useState(0.18);
    const [utltwRate, setUtltwRate] = useState(519);
    const [bvsdCount, setBvsdCount] = useState(3000);
    const [result, setResult] = useState(null);

    const onChange = useCallback(
        (setter) => (e) => {
            if (isValidNumber(e.target.value)) {
                setter(e.target.value);
            }
        },
        []
    );

    const onCalculateResult = useCallback(
        () => {
            setResult(calculateResult(+bvsdRate, +utltwRate, +bvsdCount));
        },
        [bvsdCount, bvsdRate, utltwRate]
    );

    return (
        <div className="tab-content">
            <div className="input-container">
                <label style={{ width: '100%' }}>
                    <div className="input-container__label">Курс BVSD (USDT)</div>
                    <input
                        type="text"
                        className={classNames('form-control form-input')}
                        autoComplete="off"

                        value={bvsdRate}
                        onChange={onChange(setBvsdRate)}
                    />
                </label>
                <label style={{ width: '100%' }}>
                    <div className="input-container__label">Курс UTLTw (BVSD)</div>
                    <input
                        type="text"
                        className={classNames('form-control form-input')}
                        autoComplete="off"

                        value={utltwRate}
                        onChange={onChange(setUtltwRate)}
                    />
                </label>
                <label style={{ width: '100%' }}>
                    <div className="input-container__label">Количество BVSD</div>
                    <input
                        type="text"
                        className={classNames('form-control form-input')}
                        autoComplete="off"

                        value={bvsdCount}
                        onChange={onChange(setBvsdCount)}
                    />
                </label>

            </div>

            <button className="btn btn-success calc-btn" onClick={onCalculateResult}>
                Рассчитать
            </button>

            {result && (
                <div className="leverage-result">
                    <div>
                        <div>Количество доступных UTLTw:</div>
                        <div className="digit">{result.utltwCount}</div>
                    </div>

                    <div>
                        <div>Комиссия за покупку UTLTw (BVSD):</div>
                        <div className="digit">{result.totalBvsdFee}</div>
                    </div>

                    <div>
                        <div>Остаток на счетe (BVSD):</div>
                        <div className="digit">{result.leftOver}</div>
                    </div>
                </div>
            )}

        </div>
    )
}
