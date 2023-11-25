sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/f/library',
    'sap/ui/model/Sorter',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
	'sap/ui/export/Spreadsheet',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, fioriLibrary, Sorter, Fragment, Filter, Spreadsheet) {
        "use strict";

        return Controller.extend("ap.materialapp.controller.Main", {
            onInit: function () {
                // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			    this._mViewSettingsDialogs = {};
            },

            onListItemPress: function () {
                var oFCL = this.oView.getParent().getParent();

                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
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
                var oTable = this.byId("materialTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];
            
                // Process the filter items
                mParams.filterItems.forEach(function(oItem) {
                    var sPath = oItem.getParent().getKey(),
                        sOperator = 'EQ',
                        sValue1 = oItem.getKey(),
                        oFilter = new Filter(sPath, sOperator, sValue1);
            
                    aFilters.push(oFilter);
                });
            
                // Store the applied filters in a variable in the controller
                this._appliedFilters = aFilters;
            
                // Get the other applied filters except for "Omschrijving" if present
                var aAppliedFilters = aFilters.filter(function(filter) {
                    return filter.sPath !== "Maktx";
                });
            
                // Combine with "Omschrijving" filter if it exists
                if (this._oMaktxFilter) {
                    aAppliedFilters.push(this._oMaktxFilter);
                }
            
                // Apply the combined filters
                oBinding.filter(aAppliedFilters);
            },
            
            handleSortButtonPressed: function () {
                this.getViewSettingsDialog("ap.materialapp.fragments.sortDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            handleFilterButtonPressed: function () {
                this.getViewSettingsDialog("ap.materialapp.fragments.filterDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            getViewSettingsDialog: function (sDialogFragmentName) {
                var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

                if (!pDialog) {
                    pDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    }).then(function (oDialog) {
                        if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }
                        return oDialog;
                    });
                    this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;
            },
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("materialTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
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
