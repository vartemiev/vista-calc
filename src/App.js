import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './App.css';

import { NewAmount } from './pages/NewAmount';
import { CurrentAmount } from './pages/CurrentAmount';
import { Converter } from './pages/Converter';
import { Boost } from './pages/Boost';

import { formatDate } from './utils/helpers';

export const EURContext = React.createContext(null);

const Tabs = {
    NEW: 'NEW',
    CURRENT: 'CURRENT',
    LEVERAGE: 'LEVERAGE',
    CONVERTER: 'CONVERTER',
};

function App() {
    const [tab, setTab] = useState(Tabs.NEW);
    const [EURRate, setEURRate] = useState({});
    const [quotationsDate, setQuotationsDate] = useState('');

    useEffect(
        async () => {
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            const data = await response.json();

            setEURRate(data.Valute.EUR.Value);
            setQuotationsDate(data.Date);
        },
        []
    );

    return (
        <EURContext.Provider value={EURRate}>
            <div className="App">
                {EURRate && quotationsDate && (
                    <div className="cb-rate">
                        <span className="cb-rate__grey"><b>Курс ЦБ EUR / RUB:</b></span>
                        <span><b>{EURRate}</b></span>
                        <span className="cb-rate__grey"><b>({formatDate(quotationsDate)})</b></span>
                    </div>
                )}
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <a
                            className={classNames({'nav-link nav-link-sm': true, 'active': tab === Tabs.NEW})}
                            id="new-account-tab"
                            href="#"

                            onClick={() => setTab(Tabs.NEW)}
                        >
                            Новый счет
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={classNames({'nav-link nav-link-sm': true, 'active': tab === Tabs.CURRENT})}
                            id="new-account-tab"
                            href="#"

                            onClick={() => setTab(Tabs.CURRENT)}
                        >
                            Действующий счет
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={classNames({'nav-link nav-link-sm': true, 'active': tab === Tabs.LEVERAGE})}
                            id="leverage-tab"
                            href="#"

                            onClick={() => setTab(Tabs.LEVERAGE)}
                        >
                            Прокачка (Помощь друга)
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={classNames({'nav-link nav-link-sm': true, 'active': tab === Tabs.CONVERTER})}
                            id="convert-EUR-tab"
                            href="#"

                            onClick={() => setTab(Tabs.CONVERTER)}
                        >
                            Конвертер
                        </a>
                    </li>
                </ul>

                <hr style={{ borderTop: '2px solid rgba(0,0,0,.1)' }} />

                {tab === Tabs.NEW && EURRate && quotationsDate && <NewAmount />}

                {tab === Tabs.CURRENT && <CurrentAmount />}

                {tab === Tabs.LEVERAGE && <Boost />}

                {tab === Tabs.CONVERTER && <Converter />}
            </div>
        </EURContext.Provider>
    );
}

export default App;
