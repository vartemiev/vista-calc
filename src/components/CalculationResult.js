import React from 'react';

const tableToExcel = (table, name, fileName) => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
    const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));
    const format = (s, c) => s.replace(/{(\w+)}/g, function(m, p) { return c[p]; });

    const downloadURI = (uri, name) => {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        link.click();
    }

    if (!table.nodeType) {
        table = document.getElementById(table)
    }

    const ctx = {
        worksheet: name || 'Worksheet',
        table: table.innerHTML
    };

    const resUri = uri + base64(format(template, ctx));
    downloadURI(resUri, fileName);
};

export const CalculationResult = props => (
    <div className="leverage-result">
        {props.isNew && (
            <div>
                <div>Активация счета:</div>
                <div className="digit">-100 EUR</div>
            </div>
        )}

        {props.initialAjio.trim() !== '0' && (
            <div>
                <div>Ажио:</div>
                <div className="digit">-{props.initialAjio} EUR</div>
            </div>
        )}

        <div>
            <div>Доступно к снятию на конец срока:</div>
            <div className="digit">{props.amount} EUR</div>
        </div>
        <div>
            <div>Вложено всего:</div>
            <div className="digit">{props.selfFunds} EUR</div>
        </div>
        <div>
            <div>Ежемесячные дивиденды:</div>
            <div className="digit">{props.profit} EUR</div>
        </div>
        <div>
            <button
                className="btn btn-sm btn-info"
                onClick={() => tableToExcel(props.detalizationTable, 'Детализация', props.filename)}
            >
                Детализация рассчета
            </button>
        </div>
    </div>
);
