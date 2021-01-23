!function(t){var n={};function e(a){if(n[a])return n[a].exports;var o=n[a]={i:a,l:!1,exports:{}};return t[a].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,a){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:a})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(e.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(a,o,function(n){return t[n]}.bind(null,o));return a},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="/dist/",e(e.s=0)}([function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./src/constants.js\nconst RestockingStatus = {\n  NO_ADD_NO_REMOVE: 'noAddNoRemove',\n  REMOVE_MONTHLY: 'removeMonthly',\n  ADD_MONTHLY: 'addMonthly'\n};\nconst LeverageStatus = {\n  WITH_LEVERAGE: 'withLeverage',\n  WITHOUT_LOAN: 'withoutLoan',\n  ONCE_UPDATE: 'onceUpdate',\n  WITH_LOAN: 'withLoan'\n};\nconst MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];\nconst MONTHS_DETAILS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];\nconst RATES = [1.94, // Январь 2014\n2.07, 1.87, 1.76, 1.37, 1.23, 2.15, 2.17, 1.83, 2.21, 1.94, 2.16, 1.56, 2.23, 2.52, 2.14, 2.41, 2.16, 2.21, 1.71, 1.8, 2.07, 2.25, 1.62, 1.15, 2.05, 2.16, 1.96, 1.87, 2.14, 2.07, 1.98, 2.23, 2.25, 2.32, 1.26, 1.06, 2.25, 2.14, 1.98, 1.78, 2.25, 2.52, 2.32, 1.87, 2.07, 1.89, 1.26, 0.86, 2.52, 2.61, 1.15, 2.16, 1.26, 2.43, 1.08, 2.5, 2.7, 2.61, 0.18, 0.81, 2.25, 2.07, 2.16, 2.32, 2.05, 1.62, 2.23, 2.52, 2.41, 2.14, 0.9, 0.72, 2.61, 2.25, 2.5, 2.07, 2.41, 2.16, 2.14, 1.8, 2.52, 2.43, 1.17 // Декабрь 2020\n];\nconst MIN_CONTRACT = 10000;\nconst AVERAGE_RATE = 1.95;\nconst LOAN_RATIO = 0.7;\nconst AJIO = 0.07;\nconst MONTHS_COUNT = 12;\n// CONCATENATED MODULE: ./src/utils/index.js\n\nconst roundTwo = amount => +amount.toFixed(2);\nconst utils_loan = amount => roundTwo(amount * LOAN_RATIO);\nconst utils_leverage = amount => roundTwo(amount / 3 * 7);\nconst workFee = amount => roundTwo(amount * 0.2);\nconst serviceFee = amount => roundTwo(amount / 12 / 100);\nconst loanFee = amount => roundTwo(amount * 7 / 12 / 100);\nconst format = amount => {\n  const string = Math.round(amount).toString().split('');\n  let res = '';\n\n  while (string.length > 0) {\n    res += string.splice(0, string.length % 3 || 3).join('');\n    res += ' ';\n  }\n\n  return res;\n};\nconst formatDate = timestamp => {\n  const [date] = timestamp.split('T');\n  const [year, month, day] = date.split('-');\n  return `${day} ${MONTHS[+month - 1]} ${year}`;\n};\nconst hide = selector => document.querySelector(selector).style.display = 'none';\nconst show = (selector, method) => document.querySelector(selector).style.display = method || 'block';\nconst value = selector => document.querySelector(selector).value;\nconst elem = selector => document.querySelector(selector);\nconst elems = selector => document.querySelectorAll(selector);\nconst generateRates = monthsCount => {\n  if (monthsCount < RATES.length) {\n    return RATES.slice(-monthsCount);\n  }\n\n  const averageRates = RATES.reduce((res, rate, i) => {\n    const index = i % MONTHS_COUNT;\n    res[index] = !res[index] ? [rate] : [...res[index], rate];\n    return res;\n  }, []).map(rates => roundTwo(rates.reduce((res, rate) => res + rate, 0) / rates.length));\n  const leftMonth = monthsCount - RATES.length;\n  return new Array(Math.ceil(leftMonth / MONTHS_COUNT)).fill(averageRates).reduce((res, rates) => res.concat(rates), []).slice(-leftMonth).concat(RATES);\n};\nconst getMonthYear = monthsCount => {\n  const today = new Date();\n  today.setMonth(-monthsCount);\n  const [year, month] = today.toISOString().split('T')[0].split('-');\n  return `${MONTHS_DETAILS[+month - 1]}&nbsp;${year}`;\n};\nconst getFileName = () => {\n  const leverageStatus = elem('[name=\"radio-group1\"]:checked').id;\n  const restockingStatus = elem('[name=\"radio-group2\"]:checked').id;\n  const months = +value('#monthsCount');\n  const amount = +value('#init-amount');\n  const monthValue = +value('#monthValue');\n  let fileName = `${amount}_`;\n\n  switch (leverageStatus) {\n    case LeverageStatus.WITH_LEVERAGE:\n      fileName += 'Прокачка_';\n      break;\n\n    case LeverageStatus.ONCE_UPDATE:\n      fileName += 'ОднаПрокачка_';\n      break;\n\n    case LeverageStatus.WITH_LOAN:\n      fileName += 'Займ_';\n      break;\n\n    case LeverageStatus.WITHOUT_LOAN:\n      fileName += 'БезЗайма_';\n      break;\n  }\n\n  switch (restockingStatus) {\n    case RestockingStatus.ADD_MONTHLY:\n      fileName += `Пололнение${monthValue}_`;\n      break;\n\n    case RestockingStatus.REMOVE_MONTHLY:\n      fileName += `Снятие${monthValue}_`;\n      break;\n  }\n\n  return `${fileName}Месяцев${months}`;\n};\nconst printResult = (amount, our, dividends) => `\n        <tr></tr>\n        <tr>\n            <td>Вложено</td>\n            <td>своих:</td>\n            <td>${our}</td>\n            <td>EUR</td>\n        </tr>\n        <tr>\n            <td>Доступно</td>\n            <td>к снятию:</td>\n            <td>${amount}</td>\n            <td>EUR</td> \n        </tr>\n        <tr>\n            <td>Ежемесячные</td>\n            <td>дивиденды:</td>\n            <td>${dividends}</td>\n            <td>EUR</td> \n        </tr>\n`;\n// CONCATENATED MODULE: ./src/new-account/base.js\n\n\nconst calculate = (enteredAmount, monthsCount, monthValue, getIncome, getProfit, getContractDelta, createRow) => {\n  let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;\n  let amount = Math.round(enteredAmount - 100 - contract * AJIO);\n  const initialAmount = amount;\n  generateRates(monthsCount).forEach((rate, i) => {\n    let ajio;\n    const contractDelta = getContractDelta(amount, contract, initialAmount + i * monthValue);\n\n    if (contractDelta > 0) {\n      contract += contractDelta;\n      ajio = contractDelta * AJIO;\n      amount = roundTwo(amount - ajio);\n    } else {\n      ajio = 0;\n    }\n\n    const income = getIncome(amount, rate);\n    const profit = getProfit(income, amount);\n\n    if (createRow) {\n      const tableRow = createRow({\n        month: getMonthYear(monthsCount - i),\n        renewal: i === 0 ? enteredAmount : monthValue,\n        ajio: i === 0 ? -(contract * AJIO) : -ajio,\n        activation: i === 0 ? -100 : 0,\n        contract,\n        amount,\n        rate,\n        income,\n        profit\n      });\n      elem('#detalization tbody').innerHTML += tableRow;\n    }\n\n    amount = roundTwo(amount + profit + monthValue);\n  });\n  amount -= monthValue;\n  const averageIncome = getIncome(amount, AVERAGE_RATE);\n  const averageProfit = getProfit(averageIncome, amount);\n  const addedPerMonth = monthValue > 0 ? monthValue : 0;\n  elem('#amount').innerText = `${format(amount)} EUR`;\n  elem('#our').innerText = `${format(addedPerMonth * monthsCount + enteredAmount)} EUR`;\n  elem('#profit').innerText = `${format(Math.floor(averageProfit))} EUR`;\n  elem('#detalization tbody').innerHTML += printResult(amount, addedPerMonth * monthsCount + enteredAmount, averageProfit);\n  show('#new-result');\n};\n// CONCATENATED MODULE: ./src/new-account/withLeverage.js\n\n\n\nconst withLeverage_getIncome = (amount, rate) => roundTwo((amount + utils_leverage(amount)) * rate / 100);\nconst withLeverage_getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount + utils_leverage(amount)) - loanFee(utils_leverage(amount)));\nconst withLeverage_getContractDelta = (amount, contract) => Math.ceil((10 * amount - 3 * contract) / 3.7);\nconst withLeverage_createRow = data => {\n  const _leverage = utils_leverage(data.amount);\n\n  return `\n        <tr>\n            <td>${data.month}</td>\n            <td>${data.renewal.toFixed(2)}</td>\n            <td>${data.activation}</td>\n            <td>${data.contract.toFixed(2)}</td>\n            <td>${data.ajio.toFixed(2)}</td>\n            <td>${data.amount.toFixed(2)}</td>\n            <td>${_leverage.toFixed(2)}</td>\n            <td>${(data.amount + _leverage).toFixed(2)}</td>\n            <td>${data.rate.toFixed(2)}%</td>\n            <td>+${data.income.toFixed(2)}</td>\n            <td>-${workFee(data.income).toFixed(2)}</td>\n            <td>-${serviceFee(data.amount + _leverage).toFixed(2)}</td>\n            <td>-${loanFee(_leverage).toFixed(2)}</td>\n            <td>${(data.amount + data.profit + _leverage).toFixed(2)}</td>\n            <td>${(data.amount + data.profit).toFixed(2)}</td>\n            <td>${data.profit.toFixed(2)}</td>\n        </tr>\n    `.replace(/[ \\t\\n]/g, '');\n};\nconst withLeverage = (enteredAmount, monthsCount, monthValue) => calculate(enteredAmount, monthsCount, monthValue, withLeverage_getIncome, withLeverage_getProfit, withLeverage_getContractDelta, withLeverage_createRow);\nconst getMaxWithdraw = (amount, contract) => {\n  const contractDelta = withLeverage_getContractDelta(amount, contract);\n\n  if (contractDelta > 0) {\n    amount = roundTwo(amount - contractDelta * AJIO);\n  }\n\n  const income = withLeverage_getIncome(amount, AVERAGE_RATE);\n  const profit = withLeverage_getProfit(income, amount);\n  return Math.floor(profit);\n};\n// CONCATENATED MODULE: ./src/new-account/withoutLoan.js\n\n\n\nconst withoutLoan_getIncome = (amount, rate) => roundTwo(amount * rate / 100);\nconst withoutLoan_getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount));\nconst withoutLoan_getContractDelta = (_, contract, initialAmount) => initialAmount - contract;\nconst withoutLoan_createRow = data => {\n  const balance = (data.amount + data.profit).toFixed(2);\n  return `\n        <tr>\n            <td>${data.month}</td>\n            <td>${data.renewal.toFixed(2)}</td>\n            <td>${data.activation}</td>\n            <td>${data.contract.toFixed(2)}</td>\n            <td>${data.ajio.toFixed(2)}</td>\n            <td>${data.amount.toFixed(2)}</td>\n            <td>0.00</td>\n            <td>${data.amount.toFixed(2)}</td>\n            <td>${data.rate.toFixed(2)}</td>\n            <td>+${data.income.toFixed(2)}</td>\n            <td>-${workFee(data.income).toFixed(2)}</td>\n            <td>-${serviceFee(data.amount).toFixed(2)}</td>\n            <td>0.00</td>\n            <td>${balance}</td>\n            <td>${balance}</td>\n            <td>${data.profit.toFixed(2)}</td>\n        </tr>\n    `.replace(/[ \\t\\n]/g, '');\n};\nconst withoutLoan = (enteredAmount, monthsCount, monthValue) => calculate(enteredAmount, monthsCount, monthValue, withoutLoan_getIncome, withoutLoan_getProfit, withoutLoan_getContractDelta, withoutLoan_createRow);\nconst withoutLoan_getMaxWithdraw = amount => {\n  const income = withoutLoan_getIncome(amount, AVERAGE_RATE);\n  const profit = withoutLoan_getProfit(income, amount);\n  return Math.floor(profit);\n};\n// CONCATENATED MODULE: ./src/new-account/withLoan.js\n\n\n\nconst withLoan_getIncome = (amount, rate) => roundTwo((amount + utils_loan(amount)) * rate / 100);\nconst withLoan_getProfit = (income, amount) => roundTwo(income - workFee(income) - serviceFee(amount + utils_loan(amount)) - loanFee(utils_loan(amount)));\nconst withLoan_getContractDelta = (amount, contract) => Math.ceil((1.7 * amount - contract) / 1.119);\nconst withLoan_createRow = data => {\n  const _loan = utils_loan(data.amount);\n\n  return `\n        <tr>\n            <td>${data.month}</td>\n            <td>${data.renewal.toFixed(2)}</td>\n            <td>${data.activation}</td>\n            <td>${data.contract.toFixed(2)}</td>\n            <td>${data.ajio.toFixed(2)}</td>\n            <td>${data.amount.toFixed(2)}</td>\n            <td>${_loan}</td>\n            <td>${(data.amount + _loan).toFixed(2)}</td>\n            <td>${data.rate.toFixed(2)}%</td>\n            <td>+${data.income.toFixed(2)}</td>\n            <td>-${workFee(data.income).toFixed(2)}</td>\n            <td>-${serviceFee(data.amount + _loan).toFixed(2)}</td>\n            <td>-${loanFee(_loan).toFixed(2)}</td>\n            <td>${(data.amount + data.profit + _loan).toFixed(2)}</td>\n            <td>${(data.amount + data.profit).toFixed(2)}</td>\n            <td>${data.profit.toFixed(2)}</td>\n        </tr>\n    `.replace(/[ \\t\\n]/g, '');\n};\nconst withLoan = (enteredAmount, monthsCount, monthValue) => calculate(enteredAmount, monthsCount, monthValue, withLoan_getIncome, withLoan_getProfit, withLoan_getContractDelta, withLoan_createRow);\nconst withLoan_getMaxWithdraw = (amount, contract) => {\n  const contractDelta = withLoan_getContractDelta(amount, contract);\n\n  if (contractDelta > 0) {\n    amount = roundTwo(amount - contractDelta * AJIO);\n  }\n\n  const income = withLoan_getIncome(amount, AVERAGE_RATE);\n  const profit = withLoan_getProfit(income, amount);\n  return Math.floor(profit);\n};\n// CONCATENATED MODULE: ./src/new-account/onceLeverage.js\n\n\n\n\n\nconst onceLeverage_getProfit = (income, amount, leverage) => roundTwo(income - workFee(income) - serviceFee(amount) - loanFee(leverage));\nconst onceLeverage_createRow = data => {\n  return `\n        <tr>\n            <td>${data.month}</td>\n            <td>${data.renewal.toFixed(2)}</td>\n            <td>${data.activation}</td>\n            <td>${data.contract.toFixed(2)}</td>\n            <td>${data.ajio.toFixed(2)}</td>\n            <td>${data.amount.toFixed(2)}</td>\n            <td>${data.leverage.toFixed(2)}</td>\n            <td>${(data.amount + data.leverage).toFixed(2)}</td>\n            <td>${data.rate.toFixed(2)}</td>\n            <td>+${data.income.toFixed(2)}</td>\n            <td>-${workFee(data.income).toFixed(2)}</td>\n            <td>-${serviceFee(data.amount + data.leverage).toFixed(2)}</td>\n            <td>-${loanFee(data.leverage).toFixed(2)}</td>\n            <td>${(data.amount + data.profit + data.leverage).toFixed(2)}</td>\n            <td>${(data.amount + data.profit).toFixed(2)}</td>\n            <td>${data.profit.toFixed(2)}</td>\n        </tr>\n    `.replace(/[ \\t\\n]/g, '');\n};\nconst onceLeverage = (enteredAmount, monthsCount, monthValue) => {\n  let contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;\n  let amount = Math.round(enteredAmount - 100 - AJIO * contract);\n  const contractDelta = withLeverage_getContractDelta(amount, contract);\n\n  if (contractDelta > 0) {\n    contract += contractDelta;\n    amount = roundTwo(amount - contractDelta * AJIO);\n  }\n\n  const _leverage = utils_leverage(amount);\n\n  amount += _leverage;\n  const initialAmount = amount;\n  generateRates(monthsCount).forEach((rate, i) => {\n    let ajio;\n    const contractDelta = Math.ceil(withoutLoan_getContractDelta(amount, contract, initialAmount + i * monthValue));\n\n    if (contractDelta > 0) {\n      contract += contractDelta;\n      ajio = contractDelta * AJIO;\n      amount = roundTwo(amount - ajio);\n    } else {\n      ajio = 0;\n    }\n\n    const income = withoutLoan_getIncome(amount, rate);\n    const profit = onceLeverage_getProfit(income, amount, _leverage);\n    const tableRow = onceLeverage_createRow({\n      month: getMonthYear(monthsCount - i),\n      renewal: i === 0 ? enteredAmount : monthValue,\n      ajio: i === 0 ? contract * AJIO : ajio,\n      activation: i === 0 ? 100 : 0,\n      amount: amount - _leverage,\n      leverage: _leverage,\n      contract,\n      rate,\n      income,\n      profit\n    });\n    elem('#detalization tbody').innerHTML += tableRow;\n    amount = roundTwo(amount + profit + monthValue);\n  });\n  amount -= monthValue;\n  const averageIncome = withoutLoan_getIncome(amount, AVERAGE_RATE);\n  const averageProfit = withLoan_getProfit(averageIncome, amount);\n  const addedPerMonth = monthValue > 0 ? monthValue : 0;\n  document.querySelector('#amount').innerText = `${format(amount - _leverage)} EUR`;\n  document.querySelector('#our').innerText = `${format(addedPerMonth * monthsCount + enteredAmount)} EUR`;\n  document.querySelector('#profit').innerText = `${format(Math.floor(averageProfit))} EUR`;\n  elem('#detalization tbody').innerHTML += printResult(amount - _leverage, addedPerMonth * monthsCount + enteredAmount, averageProfit);\n  document.querySelector('#new-result').style.display = 'block';\n};\n// CONCATENATED MODULE: ./src/boost/index.js\n\n\n\nconst calculateBoost = () => {\n  hide('#result_new');\n  hide('#result_balance');\n  const balance = +value('#balance');\n  const loan = +value('#loan');\n  let contract = +value('#contract');\n  let amount = roundTwo(balance - loan);\n  const contractDelta = withLeverage_getContractDelta(amount, contract);\n\n  if (contractDelta > 0) {\n    contract = Math.ceil(contract + contractDelta);\n    amount = roundTwo(amount - contractDelta * AJIO);\n    show('#result_new');\n    elem('#result_new__value').innerText = `${format(contract)} EUR`;\n    show('#result_balance');\n    elem('#result_balance__value').innerText = `${format(amount)} EUR`;\n  }\n\n  elem('#result_leverage__value').innerText = `${format(utils_leverage(amount))} EUR`;\n  show('#result');\n};\n// CONCATENATED MODULE: ./src/index.js\n\n\n\n\n\n\n\nlet EURRate;\n\nconst getWithdrawAmount = () => {\n  let enteredAmount = +value('#init-amount');\n\n  if (elem('.currency.active').id === 'currency_RUB') {\n    enteredAmount = enteredAmount / EURRate * 0.98;\n  }\n\n  if (enteredAmount < 1100) {\n    return 0;\n  }\n\n  const contract = enteredAmount - 100 > MIN_CONTRACT ? enteredAmount - 100 : MIN_CONTRACT;\n  const amount = Math.round(enteredAmount - 100 - AJIO * contract);\n  const leverageStatus = elem('[name=\"radio-group1\"]:checked').id;\n\n  switch (leverageStatus) {\n    case LeverageStatus.WITH_LEVERAGE:\n    case LeverageStatus.ONCE_UPDATE:\n      return getMaxWithdraw(amount, contract);\n\n    case LeverageStatus.WITH_LOAN:\n      return withLoan_getMaxWithdraw(amount, contract);\n\n    case LeverageStatus.WITHOUT_LOAN:\n      return withoutLoan_getMaxWithdraw(amount);\n  }\n};\n\nconst defineAmount = restockingStatus => {\n  switch (restockingStatus) {\n    case RestockingStatus.NO_ADD_NO_REMOVE:\n      return 0;\n\n    case RestockingStatus.ADD_MONTHLY:\n      return +value('#monthValue');\n\n    case RestockingStatus.REMOVE_MONTHLY:\n      return -value('#monthValue');\n  }\n};\n\nconst calculateValue = () => {\n  elem('#detalization tbody').innerHTML = '';\n  const leverageStatus = elem('[name=\"radio-group1\"]:checked').id;\n  const restockingStatus = elem('[name=\"radio-group2\"]:checked').id;\n  const monthsCount = +value('#monthsCount');\n  const monthValue = defineAmount(restockingStatus);\n  let enteredAmount = +value('#init-amount');\n\n  if (elem('.currency.active').id === 'currency_RUB') {\n    enteredAmount = enteredAmount / EURRate * 0.98;\n  }\n\n  switch (leverageStatus) {\n    case LeverageStatus.WITH_LEVERAGE:\n      withLeverage(enteredAmount, monthsCount, monthValue);\n      break;\n\n    case LeverageStatus.WITH_LOAN:\n      withLoan(enteredAmount, monthsCount, monthValue);\n      break;\n\n    case LeverageStatus.WITHOUT_LOAN:\n      withoutLoan(enteredAmount, monthsCount, monthValue);\n      return;\n\n    case LeverageStatus.ONCE_UPDATE:\n      onceLeverage(enteredAmount, monthsCount, monthValue);\n      return;\n  }\n};\n\nconst updateWithdrawAmount = () => {\n  const isWithdrawChosen = elem('#removeMonthly').checked;\n\n  if (!isWithdrawChosen) {\n    return;\n  }\n\n  const withdrawAmount = getWithdrawAmount();\n  elem('#monthValue').max = withdrawAmount;\n  elem('#withdraw-amount').innerText = `${withdrawAmount} EUR`;\n  const isValueExceeds = +value('#monthValue') > withdrawAmount;\n\n  if (isValueExceeds) {\n    elem('#monthValue').value = withdrawAmount;\n  }\n};\n\nconst updateRUBInfo = () => {\n  const enteredAmount = +value('#init-amount');\n  const EURValue = enteredAmount / EURRate;\n  const fee = EURValue * 0.02;\n  elem('#init-amount').min = Math.ceil(1100 * EURRate / 0.98);\n  elem('#RUB-info_fee').innerText = `${roundTwo(fee)} EUR`;\n  elem('#RUB-info_value').innerText = `${roundTwo(EURValue - fee)} EUR`;\n};\n\nconst init = () => {\n  const accTab = elem('#new-account-tab');\n  const levTab = elem('#leverage-tab');\n  accTab.addEventListener('click', () => {\n    accTab.classList.add('active');\n    levTab.classList.remove('active');\n    show('#new-account');\n    hide('#leverage');\n    elem('#leverage').reset();\n  });\n  levTab.addEventListener('click', () => {\n    accTab.classList.remove('active');\n    levTab.classList.add('active');\n    hide('#new-account');\n    show('#leverage');\n    elem('#new-account').reset();\n  });\n  elem('#new-account').addEventListener('submit', e => {\n    e.preventDefault();\n    calculateValue();\n  });\n  elem('#leverage').addEventListener('submit', e => {\n    e.preventDefault();\n    calculateBoost();\n  });\n  elem('#removeMonthly').addEventListener('change', () => {\n    elem('#monthValue').value = '';\n    show('#new-monthlyValue');\n    show('#withdrawLabel');\n    hide('#addLabel');\n    show('#max-withdraw');\n    elem('#monthValue').max = getWithdrawAmount();\n    elem('#withdraw-amount').innerText = `${getWithdrawAmount()} EUR`;\n  });\n  elem('#addMonthly').addEventListener('change', () => {\n    elem('#monthValue').value = '';\n    elem('#monthValue').max = '';\n    show('#new-monthlyValue');\n    hide('#withdrawLabel');\n    show('#addLabel');\n    hide('#max-withdraw');\n  });\n  elem('#noAddNoRemove').addEventListener('change', () => {\n    hide('#new-monthlyValue');\n    hide('#max-withdraw');\n  });\n  elem('#radio-group1').addEventListener('change', updateWithdrawAmount);\n  elem('#new-account').addEventListener('reset', () => {\n    hide('#max-withdraw');\n    hide('#new-monthlyValue');\n    hide('#new-result');\n  });\n  elem('#leverage').addEventListener('reset', () => {\n    hide('#result');\n  });\n  elem('#currency').addEventListener('click', e => {\n    if (!e.target.classList.contains('currency')) {\n      return;\n    }\n\n    elem('#new-account').reset();\n    elems('.currency').forEach(el => el.classList.remove('active'));\n    e.target.classList.add('active');\n    const isRUB = e.target.id === 'currency_RUB';\n    updateWithdrawAmount();\n\n    if (isRUB) {\n      updateRUBInfo();\n      show('#cbRate', 'inline');\n      show('#RUB-info');\n    } else {\n      elem('#init-amount').min = 1100;\n      hide('#cbRate');\n      hide('#RUB-info');\n    }\n  });\n  elem('#init-amount').addEventListener('input', () => {\n    updateWithdrawAmount();\n\n    if (elem('.currency.active').id === 'currency_RUB') {\n      updateRUBInfo();\n    }\n  });\n  accTab.click();\n  fetch('https://www.cbr-xml-daily.ru/daily_json.js').then(response => response.json()).then(daylyInfo => {\n    EURRate = daylyInfo.Valute.EUR.Value;\n    elem('#eurValue').innerText = EURRate;\n    elem('#cbRate_value').innerText = EURRate;\n    elem('#eurDate').innerText = formatDate(daylyInfo.Date);\n    show('#eurRate');\n  });\n};\n\ninit();\n\nconst tableToExcel = (table, name, fileName) => {\n  const uri = 'data:application/vnd.ms-excel;base64,';\n  const template = '<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head>\x3c!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--\x3e<meta http-equiv=\"content-type\" content=\"text/plain; charset=UTF-8\"/></head><body><table>{table}</table></body></html>';\n\n  const base64 = s => window.btoa(unescape(encodeURIComponent(s)));\n\n  const format = (s, c) => s.replace(/{(\\w+)}/g, function (m, p) {\n    return c[p];\n  });\n\n  const downloadURI = (uri, name) => {\n    const link = document.createElement('a');\n    link.download = name;\n    link.href = uri;\n    link.click();\n  };\n\n  if (!table.nodeType) {\n    table = document.getElementById(table);\n  }\n\n  const ctx = {\n    worksheet: name || 'Worksheet',\n    table: table.innerHTML\n  };\n  const resUri = uri + base64(format(template, ctx));\n  downloadURI(resUri, fileName);\n};\n\nelem('#details').addEventListener('click', () => tableToExcel('detalization', 'Детализация', `${getFileName()}.xls`));\n\n//# sourceURL=webpack:///./src/index.js_+_8_modules?")}]);