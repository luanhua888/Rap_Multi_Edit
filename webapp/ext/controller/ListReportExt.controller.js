sap.ui.define([
    "sap/m/MessageToast",
    // messagepopover
    "sap/m/MessagePopover",
    // columnListItem
    "sap/m/ColumnListItem",
    // text
    "sap/m/Text",
    // button
    "sap/m/Button",
    // dialog
    "sap/m/Dialog",
    // label
    "sap/m/Label",
    // input
    "sap/m/Input",
    // DatePicker
    "sap/m/DatePicker",
    // DateTimePicker
    "sap/m/DateTimePicker",
    // textarea
    "sap/m/TextArea",
], function (MessageToast, MessagePopover, ColumnListItem, Text, Button, Dialog, Label, Input, DatePicker, DateTimePicker, TextArea) {
    // 'use strict';

    return {

        // onInit
        onInit: function () {
            // get data model
            var oModel = this.getOwnerComponent().getModel();
            this.oDataModel = new sap.ui.model.odata.ODataModel(oModel.sServiceUrl);

            // Get the table
            // var oTable = this.byId("listReport");
            this.oTable         = this.getView().byId("zmultiinlineeditlist2::sap.suite.ui.generic.template.ListReport.view.ListReport::WorkLog--responsiveTable");
            this.oEditButton    = this.getView().byId("zmultiinlineeditlist2::sap.suite.ui.generic.template.ListReport.view.ListReport::WorkLog--editButtonButton");
            this.oSaveButton    = this.getView().byId("zmultiinlineeditlist2::sap.suite.ui.generic.template.ListReport.view.ListReport::WorkLog--saveButtonButton");
            this.oAddButton     = this.getView().byId("zmultiinlineeditlist2::sap.suite.ui.generic.template.ListReport.view.ListReport::WorkLog--addButtonButton");
            this.oAddCreate     = this.getView().byId("zmultiinlineeditlist2::sap.suite.ui.generic.template.ListReport.view.ListReport::WorkLog--addEntry");
            this.oAddDelete     = this.getView().byId("zmultiinlineeditlist2::sap.suite.ui.generic.template.ListReport.view.ListReport::WorkLog--deleteEntry");


            // Edit mode
            this.oAddDelete.setVisible(false);
            this.oAddCreate.setVisible(false);
            this.oEditButton.setVisible(true);
            this.oSaveButton.setVisible(false);
            this.oAddButton.setVisible(false);

            var that = this;
            this.sfBatchArray = [];
            //Create template for columnListItem
            this.oEditableTemplate = new ColumnListItem({
                cells: [
                    new Text({
                        text: "{SAPUser}"
                    }),
                    new DatePicker({
                        value: "{WorkDate}",
                        type: "sap.ui.model.type.Date",
                        formatOptions: {
                            pattern: "yyyy-MM-dd"
                        },
                        change: function (oEvent) {
                            var sPath = oEvent.getSource().getParent().getBindingContext().getPath();
                            var payload = {};
                            payload.WorkDate = oEvent.getSource().getValue();
                            var batchOperation = that.oDataModel.createBatchOperation(sPath, "PATCH", payload);
                            that.sfBatchArray.push(batchOperation);
                        }
                    }),
                    new Input({
                        value: "{TaskID}",
                        change: function (oEvent) {
                            var sPath = oEvent.getSource().getParent().getBindingContext().getPath();
                            var payload = {};
                            payload.TaskID = oEvent.getSource().getValue();
                            var batchOperation = that.oDataModel.createBatchOperation(sPath, "PATCH", payload);
                            that.sfBatchArray.push(batchOperation);
                        }
                    }),
                    new Input({
                        value: "{WorkHours}",
                        change: function (oEvent) {
                            var sPath = oEvent.getSource().getParent().getBindingContext().getPath();
                            var payload = {};
                            payload.WorkHours = oEvent.getSource().getValue();
                            var batchOperation = that.oDataModel.createBatchOperation(sPath, "PATCH", payload); //PATCH ---update
                            that.sfBatchArray.push(batchOperation);
                        }
                    }),
                    new TextArea({
                        
                        value: "{WorkNote}",
                        change: function (oEvent) {
                            var sPath = oEvent.getSource().getParent().getBindingContext().getPath();
                            var payload = {};
                            payload.WorkNote = oEvent.getSource().getValue();
                            var batchOperation = that.oDataModel.createBatchOperation(sPath, "PATCH", payload);
                            that.sfBatchArray.push(batchOperation);
                        }
                    }),
                ]
            });


        },
        // rebindTable
        rebindTable: function (oTemplate) {
            if (this.oTable.bindItems) {
                this.oTable.bindItems({
                    path: "/WorkLog",
                    template: oTemplate,
                    templateShareable: true,
                    key: "ID"
                });
            }
        },

        // onSave
        onSave: function (oEvent) {

            this.rebindTable(this.oReadOnlyTemplate);


            // set visible button
            this.oEditButton.setVisible(true);
            this.oSaveButton.setVisible(false);
            this.oAddButton.setVisible(false);



            // batch
            this.oDataModel.addBatchChangeOperations(this.sfBatchArray);


            this.oDataModel.submitBatch(function (result) {
                console.log("save successfully");
                MessageToast.show("Save successfully");
                this.sfBatchArray = [];
            }.bind(this),
                function (oError) {
                    MessageToast.show("Save failed");
                    console.log("save failed", oError);
                    this.sfBatchArray = [];
                }.bind(this));

        },

        // onAdd Row
        onAdd: function (oEvent) {
            var sPath = "/WorkLog";
            var payload = {};
            payload.SAPUser = "TEST_USER";
            payload.WorkDate = new Date().toISOString().replace("Z","");
            payload.WorkHours = 0;

            var batchOperation = this.oDataModel.createBatchOperation(sPath, "POST", payload);


            this.oDataModel.addBatchChangeOperations([batchOperation]);
            

            this.oDataModel.submitBatch(function (oResult) {
                MessageToast.show("Add row successfully");
            }.bind(this),
                function (oError) {
                    // MessageToast.show("Add row failed");
                    console.log("add failed", oError);
                }.bind(this));

        },

        onEdit: function (oEvent) {
            // 1 Save readony template2
            this.oReadOnlyTemplate = this.oTable.removeItem(0);
            // 2 rebind table
            this.rebindTable(this.oEditableTemplate);
            // 3 change visible button
            this.oEditButton.setVisible(false);
            this.oSaveButton.setVisible(true);
            this.oAddButton.setVisible(true);

        },

        onpaste: function (oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
    };
});