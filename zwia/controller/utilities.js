sap.ui.define([
    'jquery.sap.global',
    "./utilities"
], function (jQuery) {
    "use strict";

    // class providing static utility methods to retrieve entity default values.

    return {

        //APP
        APP: null,

        //Files for class
        file: {
            id: "",
            file: null
        },
        files: [],
        img: {
            id: "",
            file: null
        },
        imgs: [],
        //Memory for class
        memo: {
            id: "",
            content: null
        },
        memos: [],
        modelMemo: function () {
            return this.memo;
        },
        findMemo: function (id) {
            if (id !== null && typeof id !== "undefined")
                for (var i = 0; i < this.memos.length; i++) {
                    if (this.memos[i].id === id) {
                        return this.memos[i];
                    }
                }
            return null;
        },
        insertMemo: function (memo) {
            this.memos.push(memo);
            return true;
        },
        updateMemo: function (memo) {
            if (memo !== null && typeof memo !== "undefined" &&
                memo.id !== null && typeof memo.id !== "undefined") {
                for (var i = 0; i < this.memos.length; i++) {
                    if (this.memos[i].id === memo.id) {
                        this.memos.splice(i, 1);
                        this.memos.splice(i - 1, 0, memo);
                        return true;
                    }
                }
                this.insertMemo(memo);
            }
            return false;
        },
        removeMemo: function (id) {
            if (id !== null && typeof id !== "undefined")
                for (var i = 0; i < this.memos.length; i++) {
                    if (this.memos[i].id === id) {
                        this.memos.splice(i, 1);
                        return true;
                    }
                }
            return false;
        },
        //Global config vars for class
        msg: {
            type: '',
            msg: "",
        },
        serviceRoot: "/sap/opu/odata/sap/",
        apiHerokuCors: "https://cors-anywhere.herokuapp.com/",
        totalPages: 1,
        //Functions for class

        isUndefined: function (object) {
            return typeof object === "undefined";
        },

        _getFragment: function (sFragmentName) {

            if (0 !== (sFragmentName.localeCompare("DashboardTiles"))) {
                this.getView().byId("oAppPage").setShowNavButton(true);
                this.getView().byId("oSelectTile").setVisible(true);
            } else {
                this.getView().byId("oAppPage").setShowNavButton(false);
                this.getView().byId("oSelectTile").setVisible(false);
            }

            var oFragment = sap.ui.xmlfragment(this.getView().getId(), "pits_bodegapitsbodega2.view." + sFragmentName, this);

            return oFragment;
        },

        setFilters: function (oEvt, aFiltersSet, oTable) {
            if (aFiltersSet.length > 0) {
                var aFilters = [];
                var sQuery = oEvt.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var arrFilters = [];
                    for (var xs = 0; xs < aFiltersSet.length; xs++) {
                        var value = aFiltersSet[xs];
                        arrFilters.push(new sap.ui.model.Filter(value, sap.ui.model.FilterOperator.Contains, sQuery));
                    }
                    var filters = new sap.ui.model.Filter({
                        filters: arrFilters,
                        and: false
                    });
                    aFilters.push(filters);
                }
                // update list binding
                //      var oTable = this.getView().byId("oTable");
                var binding = oTable.getBinding("items");
                binding.filter(aFilters, "Application");
            }
        },

        constructFirstPanelUserDetail: function (oPage) {
            oPage.addContent(new sap.m.Panel({
                id: "FirstPanel" + oPage.sId,
                width: "100%",
                height: "auto",
                headerText: "Datos Principales",
                expandable: true,
                expanded: true,
                content: [
                    new sap.m.Toolbar({
                        content: [
                            new sap.m.Label({
                                text: "Usr. SCP",
                                width: "140px"
                            }),
                            new sap.m.Text({
                                text: "{/name}"
                            })
                        ]
                    }),
                    new sap.m.Toolbar({
                        content: [
                            new sap.m.Label({
                                text: "Nombre",
                                width: "140px"
                            }),
                            new sap.m.Text({
                                text: "{/displayName}"
                            })
                        ]
                    }),
                    new sap.m.Toolbar({
                        content: [
                            new sap.m.Label({
                                text: "Email",
                                width: "140px"
                            }),
                            new sap.m.Text({
                                text: "{/email}"
                            })
                        ]
                    })
                ]
            }));
        },

        constructPanelParameters: function (oPage, expandable, parameters) {
            var expanded = true;
            if (!(this.isUndefined(expandable))) {
                if (!expandable) {
                    expanded = true;
                }
            } else {
                var expandable = true;
            }

            var panel = new sap.m.Panel({
                id: "PanelParameters" + oPage.sId,
                width: "100%",
                height: "auto",
                headerText: "Parametros",
                expandable: expandable,
                expanded: expanded
            });
            if (!(this.isUndefined(parameters)))
                if (Array.isArray(parameters))
                    for (var i = 0; i < parameters.length; i++) {
                        var parameter = parameters[i];
                        panel.addContent(parameter);
                    }
            else
                panel.addContent(parameters);

            oPage.addContent(panel);
        },

        constructPanelTable: function (oPage, expandable) {
            var expanded = false;
            if (!(this.isUndefined(expandable))) {
                if (!expandable) {
                    expanded = true;
                }
            } else {
                var expandable = true;
            }

            var oPanel = new sap.m.Panel({
                id: "PanelTable" + oPage.sId,
                width: "100%",
                height: "auto",
                headerText: "",
                expandable: expandable,
                expanded: expanded
            });
            var oTable = new sap.m.Table({
                id: "Table" + oPage.sId,
                width: "100%"
            });
            oPanel.addContent(oTable);
            oPage.addContent(oPanel);
        },

        _showFragment: function (sFragmentName) {
            var oPage = this.getView().byId("oAppPage");
            oPage.destroyContent();
            oPage.insertContent(this._getFragment(sFragmentName));
        },

        onCheckingControlToSetUnbusy: function (oControl, mlSeconds) {
            var iMlSeconds = 30000;
            if (mlSeconds > 0) {
                iMlSeconds = mlSeconds;
            }
            if (oControl !== null || typeof oControl !== undefined) {
                oControl.setBusy(true);
                setTimeout(function () {
                    oControl.setBusy(false);
                }, iMlSeconds);
            }
        },

        onTapAlterOnControl: function (oControl, fnVar, mlSeconds) {
            if (oControl.getMetadata().getName() !== "sap.m.Select") {
                return false;
            }
            var oSelect = oControl;
            if (oSelect === null) return false;
            oSelect.ontap = function (oEvent) {
                if (!oSelect.isOpen()) {
                    var callBackend = fnVar;
                }
                if (isNaN(mlSeconds) || mlSeconds === 0) {
                    mlSeconds = 1000;
                }
                setTimeout(callBackend, mlSeconds);
                sap.m.Select.prototype.ontap.apply(this, arguments);
            };
            return true;
        },

        onTapAlter: function (id, fnVar, mlSeconds) {
            var oSelect = this.getView().byId(id);
            if (oSelect === null) return false;
            if (oSelect.getMetada().getName() !== "sap.m.Select") {
                return false;
            }
            oSelect.ontap = function (oEvent) {
                if (!oSelect.isOpen()) {
                    var callBackend = fnVar;
                }
                if (isNaN(mlSeconds) || mlSeconds === 0) {
                    mlSeconds = 1000;
                };
                setTimeout(callBackend, mlSeconds);
                sap.m.Select.prototype.ontap.apply(this, arguments);
            };
            return true;
        },

        getAllItems: function (results) {
            var response = "";
            if (Array.isArray(results)) {
                for (var i = 0; i < results.length; i++) {
                    response += results[i].Item;
                }
            } else {
                response += results[i].Item;
            }

            return response;
        },

        onCallReadOdata: function (filters, fnVarSuccess, fnVarError, oModel) {

            var that = this;

            var lo_FileFilter = new sap.ui.model.Filter({
                path: "File",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: filters.file
            });

            var lo_UseridFilter = new sap.ui.model.Filter({
                path: "Userid",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: filters.userid
            });

            var lo_MethodFilter = new sap.ui.model.Filter({
                path: "Method",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: filters.method
            });

            var lo_ItemFilter = new sap.ui.model.Filter({
                path: "Item",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: filters.item
            });

            var filterArray = [];
            filterArray.push(lo_FileFilter);
            filterArray.push(lo_UseridFilter);
            filterArray.push(lo_MethodFilter);
            filterArray.push(lo_ItemFilter);

            var alternateVarError = function (err) {
                console.log("E: comm.");
                console.log(err);
                that._dialog.close();
                var json;

                if ((typeof err) === "string")
                    json = JSON.parse(err);
                else
                    json = err;

                sap.m.MessageBox.error("Mensaje de Error", {
                    title: "Error",
                    //id: "messageBoxId1",
                    details: json,
                    styleClass: "sapUiSizeCompact",
                    contentWidth: "100px"
                });
            };

            var params = {

                context: null,
                urlParameters: {
                    "$format": "json"
                },
                async: false,
                filters: filterArray,
                sorters: null,
                success: fnVarSuccess,
                error: alternateVarError

            };

            var oModelOdata = new sap.ui.model.odata.v2.ODataModel(oModel.getData().uri, false);
            //this._dialog.open();
            oModelOdata.attachRequestSent(function onSent(oEvent) {
                that._dialog.open();
            });
            oModelOdata.attachRequestCompleted(function onCompleted(oEvent) {
                that._dialog.close();
            });
            oModelOdata.attachRequestFailed(function onFailed(oEvent) {
                that._dialog.close();
            });
            oModelOdata.read("/commSet", params);

            return true;
        },

        backendIsOnline: function () {
            var data;
            var that = this;
            $.ajax({
                type: "GET",
                url: "/sap/opu/odata/sap/ZFIORI_P004SC_SRV",
                dataType: "json",
                async: false,
                cache: false,
                timeout: 30000,
                beforeSend: function (xhr) {},
                success: function (oData, textStatus, jqXHR) {
                    data = true;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    data = false;
                    that.newMessageErrorLoading();
                },
                complete: function () {}
            });
            return data;
        },

        doOdataComm: function (username, method, item, url) {
            var object = {
                "userid": username,
                "method": method,
                "item": JSON.stringify(item)
            };

            var fnVarSuccess = function (oData, response) {
                console.log("S: comm.");
                console.log(oData);
                console.log(response);
                var concatenateStr = "";
                for (var x = 0; x < oData.results.length; x++) {
                    concatenateStr += oData.results[x].Item;
                }
                console.log(concatenateStr);
            };

            var fnVarError = function (err) {
                console.log("E: comm.");
                console.log(err);
            };

            this.onCallReadOdata(object, fnVarSuccess, fnVarError, url);
        },

        strReplaceAll: function (strOriginal, strToReplace, strToPut, ignore) {
            return strOriginal.replace(new RegExp(strToReplace.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ?
                "gi" : "g")), (typeof (strToPut) === "string") ? strToPut.replace(/\$/g, "$$$$") : strToPut);
        },

        createDialog: function (params) {
            var title = "";

            if (params.title !== undefined) {
                title = params.title;
            }

            var oDialog = new sap.m.Dialog({
                title: title,
                modal: true,
                afterClose: function () {
                    oDialog.destroy();
                },
                afterOpen: function () {

                }
            });

            var fnVarOk = function () {
                // //console.log("fnVarOk Default");
                if (params.fnOk !== undefined) {
                    params.fnOk();
                }
                oDialog.close();
            };
            var fnVarCancel = function () {
                // //console.log("fnVarCancel Default");
                if (params.fnCancel !== undefined) {
                    fnVarCancel = params.fnCancel;
                }
                oDialog.close();
            };

            if (Array.isArray(params.panels)) {
                for (var i = 0; i < params.panels.length; i++) {
                    var panel = params.panels[i];
                    var oPanelTitle = "";
                    if (panel.title !== undefined) {
                        oPanelTitle = panel.title;
                    }
                    var oPanel = new sap.m.Panel({
                        headerText: oPanelTitle
                    });
                    if (panel.content !== undefined) {
                        for (var j = 0; j < panel.content.length; j++) {
                            var object = panel.content[j];
                            if (object.type !== undefined) {
                                switch (object.type) {
                                    case "text":
                                        var text = "";
                                        if (object.text !== undefined) {
                                            text = object.text;
                                        }
                                        oPanel.addContent(
                                            new sap.m.Text({
                                                text: text
                                            })
                                        );
                                        break;

                                    default:
                                        break;
                                }
                            }
                        }
                    }
                    oDialog.addContent(oPanel);
                }

            }

            var oBtnOk = new sap.m.Button({
                text: "Ok",
                press: fnVarOk
            });

            var oBtnCancel = new sap.m.Button({
                text: "Cancel",
                press: fnVarCancel
            });

            oDialog.addButton(oBtnOk);
            oDialog.addButton(oBtnCancel);
            oDialog.setDraggable(true);
            oDialog.open();
            return oDialog;

        },

        goToPage: function (oAppControl, pageName, footer) {
            oAppControl.to(pageName);
            var oPage = oAppControl.getCurrentPage();
            //      oPage.setFooter(this.getFooter(footer));
        },

        backToPage: function (oAppControl, pageName, footer) {
            oAppControl.back(pageName);
            var oPage = oAppControl.getCurrentPage();
            //      oPage.setFooter(this.getFooter(footer));
        },

        knowBrowser: function () {
            var browser = sap.ui.Device.browser;
            switch (browser.name) {
                case "ff":
                    return "firefox";
                default:
                    return "";
            }
        },

        setModelFromData: function (oControl, data, that) {
            if (typeof data !== "undefined")
                var oModel = new sap.ui.model.json.JSONModel();
            else
                return false;

            if (typeof oControl !== "undefined") {
                var newItems = null;
                var id = oControl.sId;
                var oItemTemplate = null;
                var typeObj = oControl.getMetadata().getName();
                //console.log(typeObj);
                switch (typeObj) {
                    case "sap.m.Select":
                        oItemTemplate = new sap.ui.core.Item({
                            key: "{KEY}",
                            text: {
                                parts: [{
                                    path: "KEY"
                                }, {
                                    path: "TEXT"
                                }],
                                formatter: function (KEY, TEXT) {
                                    return KEY + " " + TEXT;
                                }
                            }
                        });
                        oControl.bindAggregation("items", "/", oItemTemplate);
                        break;
                }
                if (oItemTemplate !== null) {
                    var items = [];
                    if (typeof data !== undefined) {
                        items = data;
                    }
                    if (items.length === 1) {
                        if (items[0].KEY === '*') {
                            var oParent = oControl.getParent();
                            oControl.destroy();
                            oControl = new sap.m.Input({
                                id: id,
                                width: "140px"
                            });
                            oParent.addContent(oControl);
                        } else if (items[0].KEY === '') {
                            oControl.setEnabled(false);
                            that.setDisableControl(id);
                        } else if (items[0].KEY !== '*' && items[0].KEY !== '') {
                            newItems = items;
                            oModel.setData(newItems);
                            oModel.setSizeLimit(newItems.length);
                            oControl.setModel(oModel);
                            if (oControl.getMetadata().getName() === "sap.m.Input") {
                                oControl.setValue(newItems[0].KEY);
                            } else if (oControl.getMetadata().getName() === "sap.m.Select") {
                                oControl.setSelectedKey(newItems[0].KEY);
                            }
                            that.setDisableControl(id);
                        }
                    } else {

                        newItems = [];
                        newItems.push({
                            "KEY": "",
                            "TEXT": ""
                        });

                        for (var i = 0; i < items.length; i++) {
                            if (items[i].KEY !== '*' || items[i].KEY !== '')
                                newItems.push(items[i]);
                        }
                        oModel.setData(newItems);
                        oModel.setSizeLimit(newItems.length);
                        oControl.setModel(oModel);
                        oControl.setSelectedKey(newItems[0].KEY);
                    }
                }
                return true;
            } else return false;
        },

        toast: function (msg) {
            if (msg !== undefined) {
                sap.m.MessageToast.show("M: " + msg, {
                    duration: 2000, // 3000 default
                    width: "15em", // default
                    my: "center bottom", // default
                    at: "center bottom", // default
                    of: window, // default
                    offset: "0 0", // default
                    collision: "fit fit", // default
                    onClose: null, // default
                    autoClose: true, // default
                    animationTimingFunction: "ease", // default
                    animationDuration: 1000, // default
                    closeOnBrowserNavigation: true // default
                });
            }
        },

        clone: function (obj) {
            var copy;

            // Handle the 3 simple types, and null or undefined
            if (null === obj || "object" !== typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = this.clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");

        },

        addPages: function (pages) {
            var page;
            if (this.APP !== null) {
                if (Array.isArray(pages)) {
                    var result = false;
                    for (var i = 0; i < pages.length; i++) {
                        page = pages[i];
                        if (page.getMetadata().getName() === "sap.m.Page") {
                            this.APP.addPage(page);
                            result = true;
                        }
                    }
                    return result;
                } else {
                    page = pages;
                    if (page.getMetadata().getName() === "sap.m.Page") {
                        this.APP.addPage(page);
                        return true;
                    }
                    return false;
                }
            }
            return false;
        },

        doAjax: function (jQuery, url, json, varFnSuccess, varFnError, mHeaders) {
            jQuery.ajax({
                url: url,
                type: "POST",
                crossDomain: true,
                async: false,
                xhrFields: {
                    withCredentials: false
                },
                dataType: "json",
                data: JSON.stringify(json),
                headers: mHeaders
                    // {
                    //  "sfa": "true",
                    //  "usuario": "fioribodega",
                    //  "clave": "acceso_2018",
                    //  "ws": "usersReadAll",
                    //  "Content-Type": "application/json; charset=utf-8"
                    // }
                    ,
                error: function (err) {
                    if (typeof varFnError !== undefined) {
                        varFnError();
                    }
                },
                success: function (obj, response, xhr) {
                    if (typeof varFnSuccess !== undefined) {
                        varFnSuccess();
                    }
                }
            });
        },

        onGetUser: function (t) {
            this._dialog.open();
            var that = this;
            this.onCheckingControlToSetUnbusy(sap.ui.getCore().byId("App"));
            var userModel = null;
            if ((typeof sap.ui.getCore().byId("App").getModel("userSet")) !== "undefined") {
                sap.ui.getCore().byId("App").setBusy(true);
                userModel = new sap.ui.model.json.JSONModel();
                userModel.loadData("/services/userapi/currentUser");
                userModel.attachRequestSent(function onSent(oEvent) {
                    that._dialog.open();
                });
                userModel.attachRequestFailed(function onFailed(oEvent) {
                    that._dialog.close();
                });
                userModel.attachRequestCompleted(function onCompleted(oEvent) {
                    console.log(oEvent);
                    that._dialog.close();
                    if (oEvent.getParameter("success")) {
                        sap.ui.getCore().byId("App").setBusy(false);
                        var usrStruct = sap.ui.getCore().byId("App").getModel("userSet").getData();
                        usrStruct.ID_SCP = userModel.getProperty("/name");
                        usrStruct.EMAIL = userModel.getProperty("/email");
                        usrStruct.NOMBRE = userModel.getProperty("/displayName");
                        sap.ui.getCore().byId("App").getModel("userSet").setData(usrStruct);
                        console.log(sap.ui.getCore().byId("App").getModel("userSet").getData());
                        console.log(userModel.getData());
                        that.toast("Cargando datos de usuario...");
                        that.onGetUserRoles();
                        return userModel;
                    } else {
                        that.onGetUser();
                    }
                });
            } else {
                this.onGetUser();
            }
        },

        onGetUserRoles: function () {
            this._dialog.open();
            var that = this;
            var object = {
                "userid": String(sap.ui.getCore().byId("App").getModel("userSet").getProperty("/ID_SCP")),
                "method": "GET_USER_ROLES",
                "item": JSON.stringify(sap.ui.getCore().byId("App").getModel("userSet").getData()),
                "file": "NA"
            };

            var fnVarSuccess = function (oData, response) {
                console.log("S: comm.");
                console.log(oData);
                console.log(response);
                that._dialog.close();
                var concatenateStr = "";

                for (var x = 0; x < oData.results.length; x++) {
                    concatenateStr += oData.results[x].Item;
                }
                console.log(concatenateStr);
                concatenateStr = JSON.parse(concatenateStr);
                sap.ui.getCore().byId("App").getModel("userSet").setData(concatenateStr);

            };

            var fnVarError = function (err) {
                console.log("E: comm.");
                console.log(err);
                that._dialog.close();
            };

            this.onCallReadOdata(object, fnVarSuccess, fnVarError, sap.ui.getCore().byId("App").getModel("dataSource"));

        },

        loadMessageManager: function (that) {
            // set message model
            var oMessageManager = sap.ui.getCore().getMessageManager();
            that.getView().setModel(oMessageManager.getMessageModel(), "message");

            // activate automatic message generation for complete view
            oMessageManager.registerObject(that.getView(), true);
        },

        _timeout: null,
        _dialog: new sap.m.BusyDialog("oBusyDialogAPP"
            // , {
            //  "title": "Cargando datos",
            //  "text": "Espere por favor...",
            //  "showCancelButton": false
            // }
        ),

        onBusyAccionOdata: function (oEvent) {
            // instantiate dialog

            // if (!this._dialog) {
            //  this._dialog = sap.ui.xmlfragment("com.sap.build.standard.colbunVmcaMdmV2.view.BusyDialog", this);
            //  // this.getView().addDependent(this._dialog);
            // }

            // open dialog
            // jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
            // this._dialog.open();

            // simulate end of operation
            // this._timeout = jQuery.sap.delayedCall(3000, this, function () {
            //  this._dialog.close();
            // });
        },

        onDialogClosed: function (oEvent) {
            // jQuery.sap.clearDelayedCall(this._timeout);

            // if (oEvent.getParameter("cancelPressed")) {
            //  this.toast("La operación fue cancelada");
            // } else {
            //  this.toast("La operación fue completada");
            // }
        },

        onLoadFields: function (panel, configs, model) {
            var dataLoaded = model.getData();
            var totalArray = [];
            totalArray.push(dataLoaded.MATERIAL);
            // totalArray.push(dataLoaded.MARA);
            // totalArray.push(dataLoaded.MARC);
            // totalArray.push(dataLoaded.MAKT);
            // totalArray.push(dataLoaded.MARM);
            // totalArray = totalArray.concat(dataLoaded.MBEW)
            // totalArray = totalArray.concat(dataLoaded.MLAN)

            console.log(totalArray);
            for (var i = 0; i < configs.length; i++) {
                var newPanel = new sap.m.Panel({
                    "headerText": configs[i].title,
                    width: "100%"
                });
                for (var j = 0; j < configs[i].fields.length; j = j + 2) {
                    var newToolBar = new sap.m.Toolbar({
                        design: sap.m.ToolbarDesign.Transparent
                    });

                    var posFiltered = dataLoaded.DICT.filter(function (pos) {
                        return pos.FIELDNAME === configs[i].fields[j].FIELDNAME;
                    });

                    if (Array.isArray(posFiltered)) {
                        posFiltered = posFiltered[0];
                    }

                    if (posFiltered === undefined) {
                        posFiltered = {
                            SCRTEXT_L: ""
                        };
                    }

                    newToolBar.addContent(new sap.m.Label({
                        //id: configs[i].fields[j].FIELDNAME + "_label",
                        //text: configs[i].fields[j].FIELDNAME,
                        text: posFiltered.SCRTEXT_L,
                        maxLines: 3,
                        width: "20%",
                    }));

                    var maxLength = (posFiltered.LENG !== undefined && isNaN(posFiltered.LENG) !== false) ? posFiltered.LENG : 0;

                    var valueFor = "";

                    for (var xxxx = 0; xxxx < totalArray.length; xxxx++) {
                        for (var property in totalArray[xxxx]) {
                            if (totalArray[xxxx].hasOwnProperty(property) && property === configs[i].fields[j].FIELDNAME) {
                                console.log("made it");
                                valueFor = totalArray[xxxx][property];
                            }
                        }
                    }

                    var sid = configs[i].fields[j].FIELDNAME + "_" + configs[i].fields[j].type;
                    if (configs[i].fields[j].type === "input") {
                        newToolBar.addContent(new sap.m.Input({
                            //id: sid,
                            value: valueFor,
                            maxLength: maxLength,
                            placeholder: configs[i].fields[j].FIELDNAME,
                            width: "auto"
                        }));
                    } else if (configs[i].fields[j].type === "select") {
                        newToolBar.addContent(new sap.m.Select({
                            //id: sid,
                            //text: configs[i].fields[j].FIELDNAME,
                            width: "auto"
                        }));
                    } else if (configs[i].fields[j].type === "check") {
                        newToolBar.addContent(new sap.m.CheckBox({
                            //id: sid,
                            //text: configs[i].fields[j].FIELDNAME,
                            width: "auto"
                        }));
                    } else if (configs[i].fields[j].type === "label") {
                        newToolBar.addContent(new sap.m.Label({
                            //id: sid,
                            text: configs[i].fields[j].FIELDNAME,
                            width: "auto"
                        }));
                    }

                    if (configs[i].fields[j].hasLabel === true) {

                        var hasManualLabel = configs[i].fields[j].manualLabel.length > 0;
                        var labelConfig = {
                            //id: configs[i].fields[j].FIELDNAME + "_label",
                            text: "",
                            maxLines: 3,
                            width: "20%",
                        };
                        if (hasManualLabel) {
                            labelConfig.text = configs[i].fields[j].manualLabel;
                        } else {
                            labelConfig.text = ""; //agregar busqueda de label adicional
                        }
                        newToolBar.addContent(new sap.m.Label(labelConfig));

                    }

                    newPanel.addContent(newToolBar);
                }
                // {
                //  "title": "",
                //  "fields": [{
                //      "FIELDNAME": "MATNR",
                //      "hasLabel": false,
                //      "type": "input",
                // "manualLabel": ""
                //    }, //MARA
                //    {
                //      "FIELDNAME": "MAKTX",
                //      "hasLabel": false,
                //      "type": "input",
                // "manualLabel": ""
                //    } //MARA
                //  ]
                // }
                panel.addContent(newPanel);
            }
        },

        onLoadFieldsWithoutConfig: function (panel, model, exclude) {
            var dataLoaded = model.getData();
            var totalArray = [];
            totalArray.push(dataLoaded.MATERIAL);

            for (var xxxx = 0; xxxx < totalArray.length; xxxx++) {
                for (var property in totalArray[xxxx]) {
                    if (totalArray[xxxx].hasOwnProperty(property)) {

                        var newToolBar = new sap.m.Toolbar({
                            design: sap.m.ToolbarDesign.Transparent
                        });

                        var posFiltered = dataLoaded.DICT.filter(function (pos) {
                            return pos.FIELDNAME === property;
                        });

                        if (Array.isArray(posFiltered)) {
                            posFiltered = posFiltered[0];
                        }

                        if (posFiltered === undefined) {
                            posFiltered = {
                                SCRTEXT_L: ""
                            };
                        }

                        newToolBar.addContent(new sap.m.Label({
                            //id: configs[i].fields[j].FIELDNAME + "_label",
                            //text: configs[i].fields[j].FIELDNAME,
                            text: posFiltered.SCRTEXT_L,
                            maxLines: 3,
                            width: "20%",
                        }));

                        var maxLength = (posFiltered.LENG !== undefined && isNaN(posFiltered.LENG) !== false) ? posFiltered.LENG : 0;
                        var valueFor = "";
                        valueFor = totalArray[xxxx][property];

                        var sid = property + "_input";

                        newToolBar.addContent(new sap.m.Input({
                            //id: sid,
                            value: valueFor,
                            maxLength: maxLength,
                            placeholder: property,
                            width: "auto"
                        }));

                        panel.addContent(newToolBar);
                    }
                }
            }

        },

        _ActualDateformated: function () {
            var fromDate = new Date();
            return String((String(fromDate.getDate()).length === 1) ? '0' + String(fromDate.getDate()) : String(fromDate.getDate()) ) +
            "/" +
            //String(fromDate.getMonth()+1) +
            ((String(fromDate.getMonth()+1).length === 1) ? '0' + String(fromDate.getMonth()+1) : String(fromDate.getMonth()+1) ) +
            "/" +
            String(fromDate.getFullYear());
        },

        _manipulateDate: function (date, days, operation)

        {
            if (date === null) {
                date = new Date();
            }
            var dateOffset = (24 * 60 * 60 * 1000) * days;

            var myDate = new Date();

            if (operation === "sub") {

                myDate.setTime(date.getTime() - dateOffset);

            } else if (operation === "add")

            {

                myDate.setTime(date.getTime() + dateOffset);

            }

            return String((String(myDate.getDate()).length === 1) ? '0' + String(myDate.getDate()) : String(myDate.getDate()) ) +
            "/" +
            //String(myDate.getMonth()+1) +
            ((String(myDate.getMonth()+1).length === 1) ? '0' + String(myDate.getMonth()+1) : String(myDate.getMonth()+1) ) +
            "/" +
            String(myDate.getFullYear());

        },


redLight_b64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAABkCAYAAAFP1rpCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbW'+
'FnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2'+
'VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUC'+
'BDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPS'+
'JodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9Ii'+
'IgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS'+
'94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIH'+
'htcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NU'+
'FEOTk1MTUyMjZCMTFFQUIyMkI4NUQyRjFCQjYyQzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUFEOTk1MTYyMjZCMTFFQU'+
'IyMkI4NUQyRjFCQjYyQzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QUQ5OTUxMzIyNk'+
'IxMUVBQjIyQjg1RDJGMUJCNjJDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QUQ5OTUxNDIyNkIxMUVBQjIyQjg1RDJGMU'+
'JCNjJDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgcT+w'+
'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'+
'xc2kp4+x+84OGar4qVOAAAAABJRU5ErkJggg==',

yellowLight_b64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAABkCAYAAAFP1rpCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbW'+
'FnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2'+
'VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUC'+
'BDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPS'+
'JodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9Ii'+
'IgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS'+
'94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIH'+
'htcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NE'+
'I1NDlDNEIyMjZCMTFFQTkyQzdDQ0I3Q0ZCNUE5MkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEI1NDlDNEMyMjZCMTFFQT'+
'kyQzdDQ0I3Q0ZCNUE5MkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QjU0OUM0OTIyNk'+
'IxMUVBOTJDN0NDQjdDRkI1QTkyRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QjU0OUM0QTIyNkIxMUVBOTJDN0NDQjdDRk'+
'I1QTkyRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pnozcg'+
'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'
,

greenLight_b64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAABkCAYAAAFP1rpCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbW'+
'FnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2'+
'VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUC'+
'BDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPS'+
'JodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9Ii'+
'IgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS'+
'94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIH'+
'htcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ND'+
'A4REI0NDAyMjZCMTFFQUIwRTZBNTdBNjZEMjFBNDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDA4REI0NDEyMjZCMTFFQU'+
'IwRTZBNTdBNjZEMjFBNDIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MDhEQjQzRTIyNk'+
'IxMUVBQjBFNkE1N0E2NkQyMUE0MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MDhEQjQzRjIyNkIxMUVBQjBFNkE1N0E2Nk'+
'QyMUE0MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvYDQB'+
'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'+
'/s05gvSNrqTQAAAABJRU5ErkJggg==',
    };
});