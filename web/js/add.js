class App {
    constructor() {
        this.materialMap = new Map();
        this.propertyMap = new Map();

        this.materialSourceSelect = document.getElementById('materialSourceSelect')
        this.propertySelect = document.getElementById('propertySelectSelect')
        this.valueInput = document.getElementById('valueInput')
        this.addRecordBtn = document.getElementById('addRecordBtn')

    }

    getMaterial = () => {
        return fetch('/getMaterials')
            .then(x => x.json())
    }
}
