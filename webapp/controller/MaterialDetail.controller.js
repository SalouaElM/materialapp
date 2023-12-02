sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ap.materialapp.controller.MaterialDetail", {
            onInit: function () {
                let oRouter = this.getOwnerComponent().getRouter()
                oRouter.getRoute("master").attachPatternMatched(this._onMaterialMatched, this);
                oRouter.getRoute("detail").attachPatternMatched(this._onMaterialMatched, this);
            },
            _onMaterialMatched: function (oEvent) {
                var sMaterialID = oEvent.getParameter("arguments").material || "0";
                var sMaterialPath = `/MaterialSet('${sMaterialID}')`;
    
                this.getView().bindElement({
                    path: sMaterialPath,
                    model: ""
                });
    
                var oTable = this.getView().byId("materialdetailTable");
                oTable.bindItems({
                    path: sMaterialPath + "/Material_detail",
                    template: oTable.getBindingInfo("items").template
                });
            },
            

            onExit: function () {
                this.oRouter.getRoute("list").detachPatternMatched(this._onMaterialMatched, this);
                this.oRouter.getRoute("detail").detachPatternMatched(this._onMaterialMatched, this);
            },
           
        });
    });