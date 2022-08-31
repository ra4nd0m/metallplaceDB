class App {
    constructor() {
        this.materialMap = new Map();
        this.propertyMap = new Map();

        this.materialSourceSelect = document.getElementById('materialSourceSelect')
        this.propertySelect = document.getElementById('propertySelect')
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
                this.loadProperty(this.materialSourceSelect.value)
            });

        this.materialSourceSelect.addEventListener("change", () => {
            this.loadProperty(this.materialSourceSelect.value)
        })
    }

    getMaterial = () => {
        return fetch('/getMaterialList')
            .then(x => x.json())
    }

    getProperty = (id) => {
        return fetch("/getPropertyList",
           {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    material_source_id: id
                })
            }
        ).then(x => x.json())
    }

    loadProperty = (id) => {
        this.removeOptions(this.propertySelect)
        this.getProperty(id).
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

     removeOptions = (selectElement) => {
        let i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }
}


window.addEventListener('load', () => {
    const app = new App();
    app.run();
});

