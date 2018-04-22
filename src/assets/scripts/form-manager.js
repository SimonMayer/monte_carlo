class FormManager {
    constructor() {
        this.entryPoints = {}
    }

    initializeEntryPoint(entryPoint) {
        this.setEntryPoint(entryPoint);
        const entryPointId = entryPoint.attr('id');
        const inputId = entryPointId + '_input';
        const label = entryPoint.find('label');
        const input = this.getInput(entryPointId);

        input.data('formManager', this);
        input.addClass('form-control');
        input.attr('id', inputId);
        label.attr('for', inputId);

        if (input.data('help-text')) {
            this.initializeHelpText(entryPointId);
        }

        this.fetchFromStorage(entryPointId);

        input.on('keyup blur change', function (event) {
            const formManager = $(event.target).data('formManager');
            formManager.storeValue(entryPointId)
        });
    }

    initializeHelpText(entryPointId) {
        const helpId = entryPointId + '_help';
        const input = this.getInput(entryPointId);

        const help = $('<small class="form-text text-muted">' + input.data('help-text') + '</small>');
        help.attr('id', helpId);

        this.entryPoints[entryPointId].append(help);
        input.attr('aria-describedby', helpId);

    }

    setEntryPoint (entryPoint){
        this.entryPoints[entryPoint.attr('id')] = entryPoint;
    }

    getInput(entryPointId) {
        return this.entryPoints[entryPointId].find('input, textarea, select');
    }

    storeValue(entryPointId) {
        localStorage.setItem(entryPointId, this.getValueById(entryPointId));
    }

    fetchFromStorage(entryPointId) {
        const data = localStorage.getItem(entryPointId);

        if (data) {
            this.getInput(entryPointId).val(data);
        }
    }

    getValueById(entryPointId) {
        return this.getInput(entryPointId).val();
    }
}
