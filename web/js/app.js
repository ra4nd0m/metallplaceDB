class App {

    constructor() {
        this.materialMap = new Map();

        this.myChart = null;
        this.materialSelect = document.getElementById('materialSelect')
        this.drawChartButton = document.getElementById('chartBtn')
        this.canvas = document.getElementById("chartCanvas")
        this.startDate = document.getElementById("startDate")
        this.finishDate = document.getElementById("finishDate")
        this.drawTable5Button = document.getElementById("tableLast5")
        this.drawTable10Button = document.getElementById("tableLast10")
        this.table = document.getElementById("table5")

        this.drawChartButton.addEventListener('click', this.loadChart)
        this.drawTable5Button.addEventListener('click', this.drawTable(false))
        this.drawTable10Button.addEventListener('click', this.drawTable(true))
    }

    run = () => {
        this
            .getMaterial()
            .then(materials => {
                materials.list.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.Id;
                    opt.innerHTML = `${item.Name} (${item.Market}, ${item.Unit})`;
                    this.materialSelect.appendChild(opt);
                    this.materialMap.set(item.Id, item);
                })
            });
    }

    loadChart = async () => {
        this.table.style.display = "none"
        const ctx = this.canvas.getContext('2d');
        const response = await this.getValueForPeriod(
            parseInt(this.materialSelect.value),
            this.startDate.value,
            this.finishDate.value
        )

        const labels = []
        const data = [];

        response.forEach(item => {
            labels.push(rusDate(item.Date.substring(0, 10)))
            data.push(item.Value)
        })


        if (this.myChart) {
            this.myChart.destroy();
        }
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price',
                    data: data,
                    backgroundColor: '#576F72',
                    pointBackgroundColor: '#576F72'
                }]
            },
        })
        return Promise.resolve()
    }

    getMaterial = () => {
        return fetch('/getMaterials')
            .then(x => x.json())
    }

    getValueForPeriod = async (materialId, startDate, finishDate) => {
        const rawResponse = await fetch('/getValueForPeriod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "material_source_id": materialId,
                "start": startDate,
                "finish": finishDate
            })
        });
        const content = await rawResponse.json();
        return content.price_feed;
    }

    getNLastValues = async (materialId, nValues) => {
        const rawResponse = await fetch('/getNLastValues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "material_source_id": materialId,
                "n_values": nValues
            })
        });
        const content = await rawResponse.json();
        return content.price_feed;
    }

    drawTable = (isBig) => () => {
        this.canvas.style.display = "none"
        const materialId = parseInt(this.materialSelect.value)

        this.getNLastValues(
            materialId,
            isBig ? 10 : 5
        ).then(response => {
            const avgPrice = [];
            if (isBig) {
                for (let i = 0; i < response.length; i++) {
                    const group = Math.floor(i/5);
                    if (avgPrice[group]) {
                        avgPrice[group] = (avgPrice[group] + response[i].Value) / 2;
                    } else {
                        avgPrice[group] = response[i].Value;
                    }
                }
            }

            let html = '';
            let prevPrice;
            for (let i = 0; i < response.length; i++) {

                const date = rusDate(response[i].Date.substring(0, 10));
                const price = response[i].Value;

                const change = prevPrice !== undefined ? price - prevPrice : 0;
                const percent = prevPrice !== undefined ? Math.round(change / prevPrice * 100) / 10 : 0;
                const changeStr = change === 0 ? '-' : (change > 0 ? "+" : "") + (Math.round(change * 100) / 100);
                const percentStr = change === 0 ? '-' : (percent > 0 ? "+" : "") + percent + "%";

                const changeClass = change === 0 ? "" : (change < 0 ? "text-danger" : "text-success");

                html += '<tr>' +
                    `<td>${date}</td>` +
                    `<td>${price}</td>` +
                    `<td class="${changeClass}">${changeStr}</td>` +
                    `<td class="${changeClass}">${percentStr}</td>` +
                    (i % 5 === 0 && isBig ? `<td rowspan="5" class="text-center align-middle">${Math.round(avgPrice[Math.floor(i/5)] * 100) / 100}</td>` : "") +
                    '</tr>';
                prevPrice = price;
            }

            this.table.style.display = 'table';
            const material = this.materialMap.get(materialId)

            this.table.innerHTML =

            '<thead>' +
                '<tr><td rowspan="3">Дата<br>(чч.мм.гггг)</td></tr>' +
                `<tr><td colspan="${isBig ? 4 : 3}">${material.Name}</td></tr>` +
                `                    <tr>` +
                `                        <td>Цена, ${material.Unit}</td>` +
                `                        <td>Изм., ${material.Unit}</td>` +
                `                        <td>Изм. %</td>` +
                (isBig ? `<td>Ср. цена за неделю, ${material.Unit}</td>` : '') +
                '                    </tr>' +
                '                </thead>' +
                `                <tbody id="table5Body">${html}</tbody>`;
        });
    }

}

function rusDate(date) {
    return date.split('-').reverse().join('.');
}

window.addEventListener('load', () => {
    const app = new App();
    app.run();
});