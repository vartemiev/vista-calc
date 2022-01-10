import React, { useState, useCallback, useMemo, useContext } from 'react';
import classNames from 'classnames';

import { EURContext } from '../App';
import { isValidNumber } from '../utils/helpers';

const helpImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHFSURBVEiJ1dXLb01RFAbwn0YTs4pI3WtQBp6pSASJgYTcGpngL2CASMRfQkRHQrw6NGqiwYAYiogGFRJiJOJx1SuCVlM1WPtIU/ucnmvWb3TOXt/+1jrf2WttFjoW1eA0sBc70vM0XuERhvHlf5OvwGVMYgZtjOIxPqW1n7iEZqfiAxjHD5xGf4azBYMpyQfs7kR8UliwrgZ/LcZSMbvmIzfwMYn31K0Iy/AE74S1pbiSKlkzZ71H2PEAt7A/s3eDsOtcmXgDv3AqE7stbLuDZ/iNfRneYOItzyU4Kk7GxkziGZxI7914jmsZjU2JeziX4ALe5gLYjq703IfPws4c2jifC9zEvZJNBVbipeiDshN2H9eLl8WzAl3C2ypcFP4O4EUJp1v8y7+iBV5j9TwJWsLK0QrOKjFK/sEx8YOqmuu4aKwybE0aB4uF2V8wgikcqRBYiiUV8UOiF4bLCEOi0cqqvIo9JbHNwvuzFQVoilExlqqti148xZs6+1qYEGO5yu8C65P4N+ysW1FLjODvOJlE5qIfZ4Tn452IF2iKbp0SJ+MrHopGaqe1CXHh9JaJ1L0yD2Cb6ORpMVLu4gbed1r5wsIfrI9pC90viCAAAAAASUVORK5CYII=';

export const Converter = () => {
    const EURRate = useContext(EURContext);

    const [value, setValue] = useState('');

    const onChange = useCallback(
        (e) => {
            if (isValidNumber(e.target.value)) {
                setValue(e.target.value);
            }
        },
        []
    );

    const RUBValue = useMemo(
        () => Math.ceil(value * EURRate * 1.02),
        [value, EURRate]
    );

    return (
        <div className="tab-content">
            <div className="input-container">
                <label style={{ width: '100%' }}>
                    <div className="input-container__label">Сумма для пополнения (EUR)</div>
                    <input
                        type="text"
                        className={classNames('form-control form-input')}
                        autoComplete="off"

                        value={value}
                        onChange={onChange}
                    />
                </label>

                <div className="RUB-info">
                    <div className="RUB-info__block">
                        <span>Сумма для пополнения (RUB):</span>
                        <span className="digit-sm">{RUBValue} RUB</span>

                        <span className="vista-tooltip">
                            <img src={helpImg} style={{ paddingBottom: 4 }}/>
                            <span className="vista-tooltip__text">
                                Сумма в рублях по курсу ЦБ включая 2% за завод денег на счет Vista
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}