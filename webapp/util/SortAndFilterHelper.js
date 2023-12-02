sap.ui.define(['sap/ui/Device','sap/ui/model/Sorter',
'sap/ui/core/Fragment',
'sap/ui/model/Filter'], function (Device, Sorter, Fragment, Filter) {
    "use strict";

    return {
        handleSortButtonPressed: function () {
            this.getViewSettingsDialog(sFragment, oController)
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleFilterButtonPressed: function () {
            this.getViewSettingsDialog(oController, sFragment)
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleSortDialogConfirm: function (oEvent, oController, sTableName) {
            var oTable = oController.byId(sTableName),
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
        getViewSettingsDialog: function (sDialogFragmentName, oController) {
            var pDialog = oController._mViewSettingsDialogs[sDialogFragmentName];

            if (!pDialog) {
                pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: sDialogFragmentName,
                    controller: oController
                }).then(function (oDialog) {
                    if (Device.system.desktop) {
                        oDialog.addStyleClass("sapUiSizeCompact");
                    }
                    return oDialog;
                });
                oController._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            }
            return pDialog;
        },
        handleFilterDialogConfirm: function (oEvent, oController, sTableName) {
            var oTable = oController.byId(sTableName),
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
            oController._appliedFilters = aFilters;
        
            // Get the other applied filters except for "Omschrijving" if present
            var aAppliedFilters = aFilters.filter(function(filter) {
                return filter.sPath !== "Maktx";
            });
        
            // Combine with "Omschrijving" filter if it exists
            if (oController._oMaktxFilter) {
                aAppliedFilters.push(oController._oMaktxFilter);
            }
        
            // Apply the combined filters
            oBinding.filter(aAppliedFilters);
        }
    }})