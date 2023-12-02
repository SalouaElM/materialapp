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
                let sMaterialID = oEvent.getParameter("arguments").material || "0";
                this.getView().bindElement({
                    path: `/MaterialSet('${sMaterialID}')`,
                    model: ""
                });
            },

            onExit: function () {
                this.oRouter.getRoute("list").detachPatternMatched(this._onMaterialMatched, this);
                this.oRouter.getRoute("detail").detachPatternMatched(this._onMaterialMatched, this);
            }
        });
    });