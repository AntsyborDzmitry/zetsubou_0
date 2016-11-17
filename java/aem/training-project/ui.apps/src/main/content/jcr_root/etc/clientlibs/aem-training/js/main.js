var DynamicDialog = function() {
    this.initFields = function() {
        var self, $dynamicDialogFields;
        self = this;
        $dynamicDialogFields = $('.dynamic-dialog-field');
        $dynamicDialogFields.each(function(key, value) {
            var $this, $input, name, label;
            $this = $(this);
            name = $this.data('product-field-name');
            label = $this.data('product-field-label');
            $input = $this.find('input.coral-InputGroup-input');
            self.addProperties($input, name, label);
            $input = $this.find('input.coral-Form-field');
            self.addProperties($input, name, label);
        });
    }

    this.addProperties = function($input, name, label) {
        $input.attr('name', name);
        $input.wrap(function() {
            return `<label>${label} ${$(this).html()}</label>`;
        });
    }
}

new DynamicDialog().initFields();
