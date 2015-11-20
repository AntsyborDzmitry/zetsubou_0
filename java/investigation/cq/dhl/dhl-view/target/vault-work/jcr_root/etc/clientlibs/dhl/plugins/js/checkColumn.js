CQ.Ext.ns('CQ.Ext.ux.grid');

/**
 * @class CQ.Ext.ux.grid.CheckColumn
 * @extends CQ.Ext.grid.Column
 * <p>A Column subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.</p>
 * <p><b>Note. As of ExtJS 3.3 this no longer has to be configured as a plugin of the GridPanel.</b></p>
 * <p>Example usage:</p>
 * <pre><code>
var cm = new CQ.Ext.grid.ColumnModel([{
       header: 'Foo',
       ...
    },{
       xtype: 'checkcolumn',
       header: 'Indoor?',
       dataIndex: 'indoor',
       width: 55
    }
]);

// create the grid
var grid = new CQ.Ext.grid.EditorGridPanel({
    ...
    colModel: cm,
    ...
});
 * </code></pre>
 * In addition to toggling a Boolean value within the record data, this
 * class toggles a css class between <tt>'x-grid3-check-col'</tt> and
 * <tt>'x-grid3-check-col-on'</tt> to alter the background image used for
 * a column.
 */
CQ.Ext.ux.grid.CheckColumn = CQ.Ext.extend(CQ.Ext.grid.Column, {

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent : function(name, e, grid, rowIndex, colIndex){
        if (name == 'mousedown') {
            var record = grid.store.getAt(rowIndex);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            return false; // Cancel row selection.
        } else {
            return CQ.Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return String.format('<div class="x-grid3-check-col{0}">&#160;</div>', v ? '-on' : '');
    },

    // Deprecate use as a plugin. Remove in 4.0
    init: CQ.Ext.emptyFn
});

// register ptype. Deprecate. Remove in 4.0
CQ.Ext.preg('checkcolumn', CQ.Ext.ux.grid.CheckColumn);

// backwards compat. Remove in 4.0
CQ.Ext.grid.CheckColumn = CQ.Ext.ux.grid.CheckColumn;

// register Column xtype
CQ.Ext.grid.Column.types.checkcolumn = CQ.Ext.ux.grid.CheckColumn;