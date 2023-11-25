sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/f/library',
    'sap/ui/model/Sorter',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, fioriLibrary, Sorter, Fragment, Filter) {
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
                    var oMaktxFilter = new Filter("Maktx", sap.ui.model.FilterOperator.Contains, sSearchValue);
                    aFilters.push(oMaktxFilter);
                }
                oBinding.filter(aFilters);
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
            handleFilterDialogConfirm: function (oEvent) {
                var oTable = this.byId("materialTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                mParams.filterItems.forEach(function(oItem) {
                    let sPath = oItem.getParent().getKey(),
                        sOperator = 'EQ', 
                        sValue1 = oItem.getKey(),
                        oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });
                
                // apply filter settings
                oBinding.filter(aFilters);

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
        });
    });
