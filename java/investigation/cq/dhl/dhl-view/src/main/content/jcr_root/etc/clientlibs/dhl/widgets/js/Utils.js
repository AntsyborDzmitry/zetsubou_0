CQ.Utils = new function () {
    return {

        /**
         * The number of pads by default.
         * @static
         * @final
         * @type {Number}
         */
        PAD_NUMBER_DEFAULT: 3,


        /**
         * Set the new name to already rendered form field
         * @static
         * @param {CQ.Ext.form.Field} fieldWidget Field to be renamed
         * @param {String} newName New name of the field
         * @return true if the field is already rendered
         */
        setFieldName: function (fieldWidget, newName) {
            var result = false;
            /* Very dirty post-render hack to change the actual name
             * of the control that gets submitted to server */

            if (fieldWidget.getXType() === "selection" && fieldWidget.type === "select") {
                var items = fieldWidget.items.items;
                for(var i=0; i<items.length; i++){
                    // in the selection widget two inputs are used,
                    // we need to update only hidden field because it holds value for JCR
                    if (items[i].getXType() === "hidden") {
                        items[i].name = newName;
                        if (items[i].el && items[i].el.dom) {
                            items[i].el.dom.name = newName;
                        }
                    }
                }
            }

            fieldWidget.name = newName;
            if (fieldWidget.el && fieldWidget.el.dom) {
                fieldWidget.el.dom.name = newName;
                result = true;
            }

            return result;
        },

        /**
         * Prepends the necessary amount of zeroes in order to comply
         * a given width of the formatted number
         * @static
         * @param {Number} num Input number
         * @param {String} prefix Prefix of the result (optional)
         * @param {Number} width Output width (optional)
         * @return
         */
        padNumberWithZeroes: function (num, prefix, width) {
            if (!width) width = CQ.Utils.PAD_NUMBER_DEFAULT;
            var pref = prefix || "";
            var numStr = "" + num;
            while (numStr.length < width) {
                numStr = "0" + numStr;
            }
            numStr = pref + numStr;
            return numStr;
        },

        /**
         * Parse the number that can be prepended by zeroes and prefix
         * @static
         * @param {String} numStr string representation of the number to parse
         * @param {String} prefix that prepends the number (optional)
         * @return
         */
        parseNumberWithZeroes: function (numStr, prefix) {
            if (prefix) {
                numStr = numStr.substring(prefix.length);
            }
            return parseInt(numStr, 10);
        },

        /**
         * Prints object's first level properties using alert.
         * @static
         * @param {Object} _ob object to print
         */
        printDebug: function (_ob) {
            var out = [],
                name;
            for (name in _ob) {
                out.push(name + ": " + _ob[j]);
            }
            alert(out.join(", "));
        },

        /**
         * Complements the number with zero. Usable when format date.
         * @static
         * @param {Number}
         */
        _2: function (num) {
            var A = num.toString();
            if (A.length > 1) {
                return A;
            } else {
                return ("00" + A).slice(-2);
            }
        },

        /**
         * Add to Array prototype function to determine whether values ​​in the array.
         * Use yourArray.has(value)
         * @static
         * @param {None}
         * @return {boolean}
         */
        initHasInArray: function () {
            Array.prototype.has = function (value) {
                var i, loopCnt = this.length;
                for (i = 0; i < loopCnt; i++) {
                    if (this[i] === value) {
                        return true;
                    }
                }
                return false;
            };
        }
    };
};
