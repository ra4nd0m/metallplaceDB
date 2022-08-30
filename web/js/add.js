class App {
    constructor() {
        this.materialMap = new Map();
        this.propertyMap = new Map();

        this.materialSourceSelect = document.getElementById('materialSourceSelect')
        this.propertySelect = document.getElementById('propertySelectSelect')
        this.valueInput = document.getElementById('valueInput')
        this.addRecordBtn = document.getElementById('addRecordBtn')

    }

    run = () => {
        this
            .getMaterial()
            .then(materials => {
                materials.list.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.Id;
                    opt.innerHTML = `${item.Name} (${item.Market}, ${item.Unit})`;
                    this.materialSourceSelect.appendChild(opt);
                    this.materialMap.set(item.Id, item);
                })
            });
        this.loadProperty()
    }

    getMaterial = () => {
        return fetch('/getMaterialList')
            .then(x => x.json())
    }

    getProperty = () => {
        return fetch("/getPropertyList",
           {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    material_source_id: this.materialSourceSelect.value
                })
            }
        ).then(x => x.json())
    }

    loadProperty = () => {
        this.getProperty().
        then(properties =>{
            properties.list.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.Id;
                opt.innerHTML = `${item.Name}`;
                this.propertySelect.appendChild(opt);
                this.propertyMap.set(item.Id, item, item.Kind);
            })
        });
    }
}


window.addEventListener('load', () => {
    const app = new App();
    app.run();
});

this.materialSourceSelect.addEventListener("selectionchange", () => {
})