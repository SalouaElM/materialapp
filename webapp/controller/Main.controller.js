sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/f/library',
    '../util/SortAndFilterHelper',
	'sap/ui/export/Spreadsheet',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, fioriLibrary, SortAndFilterHelper, Spreadsheet) {
        "use strict";

        return Controller.extend("ap.materialapp.controller.Main", {
            onInit: function () {
                // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			    this._mViewSettingsDialogs = {};
            },

            onListItemPress: function (oEvent) {
                let sMaterialPath = oEvent.getSource().getBindingContext().getPath(),
                oSelectedMaterial = sMaterialPath.split("'")[1]; // We split the path /MaterialSet('SHRT1636') into 3 pieces by splitting on '

			    this.getOwnerComponent().getRouter().navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, material: oSelectedMaterial});
            },
            onDescriptionSearch: function (oEvent) {
                var sSearchValue = oEvent.getParameter("newValue");
                var oTable = this.byId("materialTable");
                var oBinding = oTable.getBinding("items");
            
                var aFilters = [];
                if (sSearchValue && sSearchValue.length > 0) {
                    this._oMaktxFilter = new Filter("Maktx", sap.ui.model.FilterOperator.Contains, sSearchValue);
                    aFilters.push(this._oMaktxFilter);
                } else {
                    // Clear the filter if search field is empty
                    this._oMaktxFilter = null;
                }
            
                // Get the other applied filters except for "Omschrijving" if present
                var aAppliedFilters = this._appliedFilters.filter(function(filter) {
                    return filter.sPath !== "Maktx";
                });
            
                // Combine with "Omschrijving" filter if it exists
                if (this._oMaktxFilter) {
                    aAppliedFilters.push(this._oMaktxFilter);
                }
            
                oBinding.filter(aAppliedFilters);
            },
            
            handleFilterDialogConfirm: function (oEvent) {
                SortAndFilterHelper.handleFilterDialogConfirm(oEvent, this, 'materialTable')
            },
            
            handleSortButtonPressed: function () {
                SortAndFilterHelper.handleSortButtonPressed(this, "ap.materialapp.fragments.sortDialog")
            },
            handleFilterButtonPressed: function () {
                SortAndFilterHelper.handleFilterButtonPressed(this, "ap.materialapp.fragments.filterDialog")
            },
           
            handleSortDialogConfirm: function (oEvent) {
                SortAndFilterHelper.handleSortDialogConfirm(oEvent, this, "materialTable")
                
            },
            createColumnConfig: function() {
                var aCols = [];
            
                aCols.push({
                    label: 'Material Number',
                    property: 'Matnr',
                    type: 'string'
                });
            
                aCols.push({
                    label: 'Material Description',
                    property: 'Maktx',
                    type: 'string'
                });
            
                aCols.push({
                    label: 'Material Group',
                    property: 'Matkl',
                    type: 'string'
                });
            
                aCols.push({
                    label: 'Material Type',
                    property: 'Mtart',
                    type: 'string'
                });
    
                return aCols;
            },    
            onExport: function() {
                var aCols, oRowBinding, oSettings, oSheet, oTable;
    
                if (!this._oTable) {
                    this._oTable = this.byId('materialTable');
                }
    
                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();
    
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export Materials.xlsx',
                    worker: false 
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
            },
        });
    });
