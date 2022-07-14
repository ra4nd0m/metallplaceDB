class App {

    constructor() {
        this.myChart = null;
        this.materialSelect = document.getElementById('materialSelect')
        this.sendButton = document.querySelector('.js-send-btn')
        this.canvas = document.getElementById("chartCanvas")
        this.startDate = document.getElementById("startDate")
        this.finishDate = document.getElementById("finishDate")

        this.sendButton.addEventListener('click', this.loadChart)
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
                })
            });
    }

    loadChart = async () => {
        const ctx = this.canvas.getContext('2d');
        const response = await this.getValueForPeriod(
            parseInt(this.materialSelect.value),
            this.startDate.value,
            this.finishDate.value
        )

        const labels = []
        const data = [];

        response.forEach(item => {
            labels.push(item.Date.substring(0, 10))
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
                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                }]
            },
        })
        //this.myChart.update();
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
        return content.price_feed
    }
}

window.addEventListener('load', () => {
    const app = new App();
    app.run();
});