sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function (BaseController, MessageBox, UTI, History) {
  "use strict";
  return BaseController.extend("ZFI_ZWIA.controller.ListItems_1", {
    handleRouteMatched: function (oEvent) {
      var sAppId = "App5df79493b8f2ce16805468c8";
      var oParams = {};
      if (oEvent.mParameters.data.context) {
        this.sContext = oEvent.mParameters.data.context;
      } else {
        if (this.getOwnerComponent().getComponentData()) {
          var patternConvert = function (oParam) {
            if (Object.keys(oParam).length !== 0) {
              for (var prop in oParam) {
                if (prop !== "sourcePrototype" && prop.includes("Set")) {
                  return prop + "(" + oParam[prop][0] + ")";
                }
              }
            }
          };
          this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
        }
      }
      var oPath;
      if (this.sContext) {
        oPath = {
          path: "/" + this.sContext,
          parameters: oParams
        };
        this.getView().bindObject(oPath);
      }
      this.aRadioButtonGroupIds = [
        "sap_Worklist_Page_0-content-sap_m_Panel-1576507612704-i44wta3qtkvi19zf48a49zdu2_S2-content-sap_m_Panel-1576730800718-content-sap_m_RadioButtonGroup-1576730923592"
      ];
      this.handleRadioButtonGroupsSelectedIndex();
    },
    handleRadioButtonGroupsSelectedIndex: function () {
      var that = this;
      this.aRadioButtonGroupIds.forEach(function (sRadioButtonGroupId) {
        var oRadioButtonGroup = that.byId(sRadioButtonGroupId);
        var oButtonsBinding = oRadioButtonGroup ? oRadioButtonGroup.getBinding("buttons") : undefined;
        if (oButtonsBinding) {
          var oSelectedIndexBinding = oRadioButtonGroup.getBinding("selectedIndex");
          var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
          oButtonsBinding.attachEventOnce("change", function () {
            if (oSelectedIndexBinding) {
              oSelectedIndexBinding.refresh(true);
            } else {
              oRadioButtonGroup.setSelectedIndex(iSelectedIndex);
            }
          });
        }
      });
    },
    _onPageNavButtonPress: function () {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();
      var oQueryParams = this.getQueryParameters(window.location);
      if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
        window.history.go(-1);
      } else {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("default", true);
      }
    },
    getQueryParameters: function (oLocation) {
      var oQuery = {};
      var aParams = oLocation.search.substring(1).split("&");
      for (var i = 0; i < aParams.length; i++) {
        var aPair = aParams[i].split("=");
        oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
      }
      return oQuery;
    },
    convertTextToIndexFormatter: function (sTextValue) {
      var oRadioButtonGroup = this.byId(
        "sap_Worklist_Page_0-content-sap_m_Panel-1576507612704-i44wta3qtkvi19zf48a49zdu2_S2-content-sap_m_Panel-1576730800718-content-sap_m_RadioButtonGroup-1576730923592"
      );
      var oButtonsBindingInfo = oRadioButtonGroup.getBindingInfo("buttons");
      if (oButtonsBindingInfo && oButtonsBindingInfo.binding) {
        // look up index in bound context
        var sTextBindingPath = oButtonsBindingInfo.template.getBindingPath("text");
        return oButtonsBindingInfo.binding.getContexts(oButtonsBindingInfo.startIndex, oButtonsBindingInfo.length).findIndex(function (
          oButtonContext) {
          return oButtonContext.getProperty(sTextBindingPath) === sTextValue;
        });
      } else {
        // look up index in static items
        return oRadioButtonGroup.getButtons().findIndex(function (oButton) {
          return oButton.getText() === sTextValue;
        });
      }
    },
    _onRadioButtonGroupSelect: function () {},
    getRangeFromField: function (sId) {

      var sIdTreated = sId;
      var oView = this.oView;
      var gv_oEvt = oView.byId(sId);
      var oController = this;
      var status = true;
      var requiredFieldInfo = [];
      var intervalStruct = {
        low: "",
        high: "",
        option: "EQ",
        sign: "I"
      };
      var range = [];

      if (gv_oEvt === undefined) {
        return;
      }
      if (gv_oEvt.getModel() === undefined) {
        return;
      }
      if (gv_oEvt.getModel().getData() === undefined) {
        return;
      }
      var low = "";
      var high = "";
      if (gv_oEvt.getModel().getData() === null) {
        low = this.oView.byId(sIdTreated + "low").getValue();
        intervalStruct.low = low;
        if (this.oView.byId(sIdTreated + "high") !== undefined) {
          high = this.oView.byId(sIdTreated + "high").getValue();
          intervalStruct.high = high;
        }
        range.push(intervalStruct);
        var Model = new sap.ui.model.json.JSONModel();
        Model.setData(range);
        gv_oEvt.setModel(Model);
      }

      range = gv_oEvt.getModel().getData();

      var structureRange = {
        "low": "",
        "high": "",
        "sign": "",
        "option": ""
      };
      low = this.oView.byId(sIdTreated + "low").getValue();
      structureRange.low = low;
      if (this.oView.byId(sIdTreated + "high") !== undefined) {
        var high = this.oView.byId(sIdTreated + "high").getValue();
        structureRange.high = high;
      }
      if (structureRange.low.length > 0 && structureRange.high.length == 0)
        structureRange.option = "EQ";
      else if (structureRange.low.length == 0 && structureRange.high.length > 0)
        structureRange.option = "EQ";
      else if (structureRange.low.length > 0 && structureRange.high.length > 0)
        structureRange.option = "BT";
      structureRange.sign = "I";
      range[0] = structureRange;

      for (var index = 0; index < range.length; index++) {
        var element = range[index];
        if (element.low.length > 0 && element.high.length == 0) {
          element.option = "EQ";
        } else if (element.low.length == 0 && element.high.length > 0) {
          element.option = "EQ";
        } else if (element.low.length > 0 && element.high.length > 0) {
          element.option = "BT";
        }

        range[index] = element;

        if (element.low.length === 0 && element.high.length === 0)
          range.splice(index, 1);
      }

      return range;
    },
    makeRangeFromField: function (sId_low, sId_high) {
      var structureRange = {
        "low": "",
        "high": "",
        "sign": "",
        "option": ""
      };
      if (sId_low.length > 0)
        structureRange.low = this.getView().byId(sId_low).getValue();
      if (sId_high.length > 0)
        structureRange.high = this.getView().byId(sId_high).getValue();
      if (structureRange.low.length > 0 && structureRange.high.length == 0)
        structureRange.option = "EQ";
      else if (structureRange.low.length == 0 && structureRange.high.length > 0)
        structureRange.option = "EQ";
      else if (structureRange.low.length > 0 && structureRange.high.length > 0)
        structureRange.option = "BT";
      structureRange.sign = "I";
      var arr = [];
      if (structureRange.low.length > 0 || structureRange.high.length > 0)
        arr.push(structureRange);
      return arr;
    },
    _onBtnSearchPress: function () {
      console.log("btn search pressed!");
      var oView = this.getView(),
        oController = this,
        status = true,
        requiredFieldInfo = [];

      if (String(this.getView().byId("p_bukrs").getValue()).length === 0) {
        //UTI.toast("Debe ingresar alguna sociedad para poder buscar.");
        UTI.toast(oView.getModel("i18n").getProperty("m1"));
        return;
      }

      var object = {
        "userid": "****",
        "method": "GET_DATA_ZWF_SWIA",
        "item": JSON.stringify({
          // "p_bukrs": String(this.getView().byId("p_bukrs").getValue()),
          // "p_lifnr": this.makeRangeFromField("p_lifnr", ""),
          // "p_proce": this.makeRangeFromField("p_proce_low", ""),
          // "p_monto": this.makeRangeFromField("p_monto_low", ""),
          // "p_moneda": this.makeRangeFromField("p_moneda_low", ""),
          // "so_fecha_f": this.makeRangeFromField("so_fecha_low", "so_fecha_high"),
          // "r1": String((this.getView().byId("r1").getSelected() === true) ? "X" : ""),
          // "r2": String((this.getView().byId("r2").getSelected() === true) ? "X" : ""),
          // "p_ebeln": this.makeRangeFromField("p_ebeln_low", "p_ebeln_high"),
          // "p_bsart": this.makeRangeFromField("p_bsart_low", "p_bsart_high"),
          // "p_belnr": this.makeRangeFromField("p_belnr_low", "p_belnr_high"),
          // "p_blart": this.makeRangeFromField("p_blart_low", "p_blart_high"),
          // "p_ceco": this.makeRangeFromField("p_ceco_low", "p_ceco_high"),
          // "p_xblnr": this.makeRangeFromField("p_xblnr_low", "p_xblnr_high")
          "p_bukrs": String(this.getView().byId("p_bukrs").getValue()),
          "p_lifnr": this.makeRangeFromField("p_lifnr", ""),
          "p_proce": this.getRangeFromField("p_proce_"),
          "p_monto": this.makeRangeFromField("p_monto_low", ""),
          "p_moneda": this.makeRangeFromField("p_moneda_low", ""),
          "so_fecha_f": this.getRangeFromField("so_fecha_"),
          "r1": String((this.getView().byId("r1").getSelected() === true) ? "X" : ""),
          "r2": String((this.getView().byId("r2").getSelected() === true) ? "X" : ""),
          "p_ebeln": this.getRangeFromField("p_ebeln_"),
          "p_bsart": this.getRangeFromField("p_bsart_"),
          "p_belnr": this.getRangeFromField("p_belnr_"),
          "p_blart": this.getRangeFromField("p_blart_"),
          "p_ceco": this.getRangeFromField("p_ceco_"),
          "p_xblnr": this.getRangeFromField("p_xblnr_")
        }),
        "file": "NA"
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
        concatenateStr = JSON.parse(concatenateStr);
        for (let index = 0; index < concatenateStr.length; index++) {
          if (concatenateStr[index]["ERROR"] === "@08@") {
            //concatenateStr[index]["ERROR3"] = "./resources/green_light.png";
            concatenateStr[index]["ERROR3"] = UTI.greenLight_b64;
          } else if (concatenateStr[index]["ERROR"] === "@09@") {
            //concatenateStr[index]["ERROR3"] = "./resources/yellow_light.png";
            concatenateStr[index]["ERROR3"] = UTI.yellowLight_b64;
          } else {
            //concatenateStr[index]["ERROR3"] = "./resources/red_light.png";
            concatenateStr[index]["ERROR3"] = UTI.redLight_b64;
          }
          if (concatenateStr[index]["EBELN"].length === 0)
            concatenateStr[index]["EBELN"] = concatenateStr[index]["BELNR"];
          /*
          var trx =
          //(concatenateStr[index]["BELNR"].length == 0) ?
          ("/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=ES&~transaction=*SWF_OBJ_EXEC_CL%20P_CATID="
          +String(concatenateStr[index]["CAT_ID"]))
          +";P_TYPEID="
          +String(concatenateStr[index]["WORKFLOW_ID"]))
          +";P_INSTID="
          +String(concatenateStr[index]["EBELN"]))
          +";P_METHOD=DISPLAY;DYNP_OKCODE=ONLI"
          //: "/sap/bc/gui/sap/its/webgui?~transaction=FBV60"
          ;
          */
          //var trx = ("/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=ES&~transaction=*SWF_OBJ_EXEC_CL%20P_CATID=" +

          var sap_client = ( oController._onSearchForParameter("sap-client") !== null &&
          oController._onSearchForParameter("sap-client").length ) > 0 ?
          oController._onSearchForParameter("sap-client")
          : false
          ;
          var sap_language = (  oController._onSearchForParameter("sap-language") !== null &&
          oController._onSearchForParameter("sap-language").length ) > 0 ?
          oController._onSearchForParameter("sap-language")
          : false
          ;

          if (sap_client === false) {
            sap_client = "";
          } else {
            sap_client = "sap-client=" + sap_client +"&";
          }

          if (sap_language === false) {
            sap_language = (  oController._onSearchForParameter("sap-ui-language") !== null &&
            oController._onSearchForParameter("sap-ui-language").length ) > 0 ?
            oController._onSearchForParameter("sap-ui-language")
            : false
            ;
            if (sap_language === false) {
              sap_language = "";
            } else {
              sap_language = "sap-language=" + sap_language +"&";
            }
            sap_language = "";
          } else {
            sap_language = "sap-language=" + sap_language +"&";
          }

          var trx = ("/sap/bc/gui/sap/its/webgui?" +
          //"sap-client=100& "+
          sap_client +
          //"sap-language=ES&"+
          sap_language +
          "~transaction=*SWF_OBJ_EXEC_CL%20P_CATID=" +
            String(concatenateStr[index]["CAT_ID"]) +
            ";P_TYPEID=" +
            String(concatenateStr[index]["WORKFLOW_ID"]) +
            ";P_INSTID=" +
            String(concatenateStr[index]["ID_TRX"]));
          concatenateStr[index]["LINK_DOCTO"] = String(window.location.origin) + trx;
          var lv_splitDate = concatenateStr[index]["BEDAT"].split("-");
          concatenateStr[index]["BEDAT"] = lv_splitDate[2] + '/' + lv_splitDate[1] + '/' + lv_splitDate[0];
          lv_splitDate = concatenateStr[index]["BLDAT"].split("-");
          concatenateStr[index]["BLDAT"] = lv_splitDate[2] + '/' + lv_splitDate[1] + '/' + lv_splitDate[0];
          lv_splitDate = concatenateStr[index]["BUDAT"].split("-");
          concatenateStr[index]["BUDAT"] = lv_splitDate[2] + '/' + lv_splitDate[1] + '/' + lv_splitDate[0];

        }
        concatenateStr = {
          "doctosSet": concatenateStr
        };
        var oModelDoctosSet = new sap.ui.model.json.JSONModel();
        oModelDoctosSet.setData(concatenateStr);
        oModelDoctosSet.setSizeLimit(concatenateStr.doctosSet.length * 2);
        if (concatenateStr.doctosSet.length === 0)
          //UTI.toast("Sin resultados para los parámetros de búsqueda.");
          UTI.toast(oView.getModel("i18n").getProperty("m2"));
        oView.byId("oTitleCounterDoctos").setText(String(concatenateStr.doctosSet.length));
        sap.ui.getCore().setModel(concatenateStr.doctosSet.length, "countDoctos");
        oView.setModel(oModelDoctosSet, "doctosSet");
        /*oView.byId(
          "oTableDoctos"
        ).setModel(oModelDoctosSet);*/
      };
      var fnVarError = function (err) {
        console.log("E: comm.");
        console.log(err);
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
      UTI.onCallReadOdata(object, fnVarSuccess, fnVarError, sap.ui.getCore().byId("App").getModel("dataSource"));
    },
    _dialogFlow: null,
    _onPressFlujo: function (oEvt) {
      console.log(this);
      console.log(oEvt);
      this._dialogFlow.destroyContent();
      var path = oEvt.getSource().getParent().getBindingContext().getPath();
      var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
      this._dialogFlow.addContent(new sap.ui.core.HTML({
        content: oEvt.getSource().getParent().getBindingContext().oModel.oData.doctosSet[idx].HTML_APROBADORES
      }));
      this._dialogFlow.open();
    },
    _onPressFlujo2: function (oEvt) {
      console.log(this);
      console.log(oEvt);
      this._dialogFlow.destroyContent();
      var path = oEvt.getSource().getParent().getBindingContext().getPath();
      var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
      this._dialogFlow.addContent(new sap.ui.core.HTML({
        content: oEvt.getSource().getParent().getBindingContext().oModel.oData.doctosSet[idx].BFLUJO2
      }));
      this._dialogFlow.open();
    },

    _onPressDownload: function (oEvt) {

      console.log(this);
      console.log(oEvt);
      this._dialogFlow.destroyContent();
      var path = oEvt.getSource().getParent().getBindingContext().getPath();
      var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
      window.open(oEvt.getSource().getParent().getBindingContext().oModel.oData.doctosSet[idx].LINK);

    },

    _onPressMatchCode: function (oEvt) {

      console.log("btn search pressed!");
      var sIdTreated = oEvt.getSource().sId.replace("container-molymetAppZFI_ZWIA---ListItems_1--", "");
      sIdTreated = sIdTreated.replace("application-ZFI_ZWIA-display-component---ListItems_1--", "");
      var gv_oEvt = oEvt.getSource();
      var oView = this.getView(),
        oController = this,
        status = true,
        requiredFieldInfo = [];
      var object = {
        "userid": "****",
        "method": "GET_MATCHCODE",
        "item": JSON.stringify({
          "ID": String(sIdTreated),
          "RADIO": String((this.getView().byId("r2").getSelected() === true) ? "X" : ""),
          "TABLE": ""
        }),
        "file": "NA"
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
        concatenateStr = JSON.parse(concatenateStr);
        var model = concatenateStr;

        var jsonModel = new sap.ui.model.json.JSONModel();

        jsonModel.setData(concatenateStr);
        jsonModel.setSizeLimit(concatenateStr.length * 2);

        var oColumns = [];
        var oFilters = [];
        var oCells = [];

        if (concatenateStr.length > 0) {
          for (var key in concatenateStr[0]) {
            if (concatenateStr[0].hasOwnProperty(key)) {
              // var element = concatenateStr[0][key];
              var element = "";
              switch (key) {
              case "BUKRS":
                element = "Sociedad";
                element = oView.getModel("i18n").getProperty("bukrs");
                break;
              case "BUTXT":
                element = "Denominación";
                element = oView.getModel("i18n").getProperty("butxt");
                break;
              case "LIFNR":
                element = "Núm. Proveedor";
                element = oView.getModel("i18n").getProperty("lifnr");
                break;
              case "LAND1":
                element = "País";
                element = oView.getModel("i18n").getProperty("land1");
                break;
              case "NAME1":
                element = "Nombre 1";
                element = oView.getModel("i18n").getProperty("name1");
                break;
              case "ORT01":
                element = "Población";
                element = oView.getModel("i18n").getProperty("orto1");
                break;
              case "REGIO":
                element = "Región";
                element = oView.getModel("i18n").getProperty("regio");
                break;
              case "SORTL":
                element = "Campo de clasificación";
                element = oView.getModel("i18n").getProperty("sortl");
                break;
              case "STRAS":
                element = "Calle y nº";
                element = oView.getModel("i18n").getProperty("stras");
                break;
              case "ADRNR":
                element = "Dirección";
                element = oView.getModel("i18n").getProperty("adrnr");
                break;
              case "DOMVALUE_L":
                element = "Estado";
                element = oView.getModel("i18n").getProperty("domvalue_l");
                break;
              case "DDTEXT":
                element = "Descripción";
                element = oView.getModel("i18n").getProperty("ddtext");
                break;
              case "WAERS":
                element = "Moneda";
                element = oView.getModel("i18n").getProperty("waers");
                break;
              case "LTEXT":
                element = "Texto explicativo";
                element = oView.getModel("i18n").getProperty("ltext");
                break;
              case "BSART":
                element = "Clase de documento";
                element = oView.getModel("i18n").getProperty("bsart");
                break;
              case "BSTYP":
                element = "Tipo de documento";
                element = oView.getModel("i18n").getProperty("bstyp");
                break;
              case "BATXT":
                element = "Denominación de la clase de documento";
                element = oView.getModel("i18n").getProperty("batxt");
                break;
              case "EKGRP":
                element = "Grupo de compras";
                element = oView.getModel("i18n").getProperty("ekgrp");
                break;
              case "EKNAM":
                element = "Denominación del grupo de compras";
                element = oView.getModel("i18n").getProperty("eknam");
                break;
              case "EKTEL":
                element = "Número de telefono del grupo de compras";
                element = oView.getModel("i18n").getProperty("ektel");
                break;
              case "TELFX":
                element = "Número telefax del grupo de compradores";
                element = oView.getModel("i18n").getProperty("telfx");
                break;
              case "KOSTL":
                element = "Centro de coste";
                element = oView.getModel("i18n").getProperty("kostl");
                break;
              case "KOKRS":
                element = "Sociedad CO";
                element = oView.getModel("i18n").getProperty("kokrs");
                break;

              default:

                break;
              }
              oColumns.push(new sap.m.Column({
                header: new sap.m.Label({
                  text: element
                })
              }));
              oFilters.push(key);
              oCells.push(new sap.m.Text({
                text: "{" + key + "}"
              }));
            }
          }
        }

        var otableSelectDialog = new sap.m.TableSelectDialog({
          title: oView.getModel("i18n").getProperty("seleccione"),
          confirm: function (evt) {
            var aContexts = evt.getParameters().selectedContexts;
            if (aContexts && aContexts.length) {
              var value = aContexts.map(function (oContext) {
                for (var key in oContext.getObject()) {
                  if (oContext.getObject().hasOwnProperty("BUTXT")) {
                    oView.byId("p_text").setText(oContext.getObject()["BUTXT"]);
                  }
                  if (oContext.getObject().hasOwnProperty("NAME1")) {
                    oView.byId("p_tlifnr").setText(oContext.getObject()["NAME1"]);
                  }
                  if (oContext.getObject().hasOwnProperty(key)) {

                    return oContext.getObject()[key];
                  }
                }
              });
            }
            gv_oEvt.setValue(value);
            otableSelectDialog.destroy();
          },
          search: function (e) {
            var aFilters = [];
            var sQuery = e.getParameters().value;
            var oFiltersObj = [];
            if (sQuery && sQuery.length > 0) {
              for (var index = 0; index < oFilters.length; index++) {
                var element = new sap.ui.model.Filter(oFilters[index], sap.ui.model.FilterOperator.Contains, sQuery);
                oFiltersObj.push(element);
              }
              var filters = new sap.ui.model.Filter({
                filters: oFiltersObj,
                //[
                //         new sap.ui.model.Filter("NAME", sap.ui.model.FilterOperator.Contains, sQuery),
                //         new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, sQuery)
                //     ],
                and: false
              });
              aFilters.push(filters);
            }
            // update list binding
            var binding = this.getBinding("items");
            binding.filter(aFilters, "Application");
          },
          cancel: function () {
            otableSelectDialog.destroy();
          },
          columns: oColumns
        });

        var oTemplate = new sap.m.ColumnListItem({
          vAlign: sap.ui.core.VerticalAlign.Middle,
          type: "Active",
          cells: oCells
            // [
            // new sap.m.Text({
            //     text: "{NAME}"
            // }),
            // new sap.m.Text({
            //     text: "{MATNR}"
            // }),
            //]
        });

        otableSelectDialog.setModel(jsonModel); //     /[{"MATNR":""}]
        otableSelectDialog.bindAggregation("items", "/", oTemplate);
        otableSelectDialog.open();
      };
      var fnVarError = function (err) {
        console.log("E: comm.");
        console.log(err);
        var json;
        if ((typeof err) === "string")
          json = JSON.parse(err);
        else
          json = err;
        sap.m.MessageBox.error(oView.getModel("i18n").getProperty("mensajeError"), {
          title: "Error",
          //id: "messageBoxId1",
          details: json,
          styleClass: "sapUiSizeCompact",
          contentWidth: "100px"
        });
      };
      UTI.onCallReadOdata(object, fnVarSuccess, fnVarError, sap.ui.getCore().byId("App").getModel("dataSource"));

    },

    _loadIntervals: function (sId) {
      // var ooEvt = oEvt;
      // var sIdTreated = oEvt.getSource().sId.replace("container-molymetAppZFI_ZWIA---ListItems_1--", "");
      var sIdTreated = sId;
      var oView = this.oView;
      var gv_oEvt = oView.byId(sId);
      var oController = this;
      var status = true;
      var requiredFieldInfo = [];
      var intervalStruct = {
        low: "",
        high: "",
        option: "EQ",
        sign: "I"
      };
      var range = [];

      if (gv_oEvt === undefined) {
        return;
      }
      if (gv_oEvt.getModel() === undefined) {
        return;
      }
      if (gv_oEvt.getModel().getData() === undefined) {
        return;
      }

      if (gv_oEvt.getModel().getData() === null) {
        var low = this.oView.byId(sIdTreated + "low").getValue();
        intervalStruct.low = low;
        if (this.oView.byId(sIdTreated + "high") !== undefined) {
          var high = this.oView.byId(sIdTreated + "high").getValue();
          intervalStruct.high = high;
        }
        range.push(intervalStruct);
        var Model = new sap.ui.model.json.JSONModel();
        Model.setData(range);
        gv_oEvt.setModel(Model);
      }
    },

    _onBtnSearchDialogIntervals: function (oEvt) {
      var ooEvt = oEvt;
      var sIdTreated = oEvt.getSource().sId.replace("container-molymetAppZFI_ZWIA---ListItems_1--", "");
      sIdTreated = sIdTreated.replace("application-ZFI_ZWIA-display-component---ListItems_1--", "");
      var gv_oEvt = oEvt.getSource();
      var oView = this.getView();
      var oController = this;
      var status = true;
      var requiredFieldInfo = [];
      var intervalStruct = {
        low: "",
        high: "",
        option: "EQ",
        sign: "I"
      };
      var range = [];
      if (oEvt.getSource().getModel().getData() === null) {
        var low = this.oView.byId(sIdTreated + "low").getValue();
        intervalStruct.low = low;
        if (this.oView.byId(sIdTreated + "high") !== undefined) {
          var high = this.oView.byId(sIdTreated + "high").getValue();
          intervalStruct.high = high;
        }
        range.push(intervalStruct);
        var Model = new sap.ui.model.json.JSONModel();
        Model.setData(range);
        oEvt.getSource().setModel(Model);
      } else {
        range = oEvt.getSource().getModel().getData();
      }
      range[0].low = this.oView.byId(sIdTreated + "low").getValue();
      if (this.oView.byId(sIdTreated + "high") !== undefined) {
        var high = this.oView.byId(sIdTreated + "high").getValue();
        range[0].high = high;
      }

      if(sIdTreated === "so_fecha_")
        for (var key in range) {
            if (range.hasOwnProperty(key)) {
                var tempo = "";
                if (range[key].low.length === 8) {
                    tempo = range[key].low.substring(6,8)+'/'+range[key].low.substring(4,6)+'/'+range[key].low.substring(0,4);
                    range[key].low = tempo;
                }
                tempo = "";
                if (range[key].high.length === 8) {
                    tempo = range[key].high.substring(6,8)+'/'+range[key].high.substring(4,6)+'/'+range[key].high.substring(0,4);
                    range[key].high = tempo;
                }

            }
        }

      var oTable = new sap.m.Table({
        headerToolbar: new sap.m.Toolbar({
          content: [
            new sap.m.ToolbarSpacer(),
            new sap.m.Button({
              icon: 'sap-icon://add',
              press: function () {
                var oTable = this.getParent().getParent();
                var model = oTable.getModel();
                var elements = model.getData();
                // var path = this.getBindingContext().getPath();
                // var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
                var intervalStructAlt = {
                  low: "",
                  high: "",
                  option: "EQ",
                  sign: "I"
                };
                intervalStructAlt.low = "";
                intervalStructAlt.high = "";
                elements.push(intervalStructAlt);
                model.setData(elements);
              }
            })
          ]
        })
      });
      oTable.setModel(oEvt.getSource().getModel());
      oTable.addColumn(new sap.m.Column({
        header: new sap.m.Label({
          text: oView.getModel("i18n").getProperty("inicio")
        })
      }));
      oTable.addColumn(new sap.m.Column({
        header: new sap.m.Label({
          text: oView.getModel("i18n").getProperty("fin")
        })
      }));
      oTable.addColumn(new sap.m.Column({
        header: new sap.m.Label({
          text: oView.getModel("i18n").getProperty("acciones")
        })
      }));
      var lowField = null;
      var highField = null;
      if(sIdTreated === "so_fecha_") {
        lowField = new sap.m.DatePicker({
            value: "{low}",
            displayFormat:"dd/MM/yyyy", valueFormat:"dd/MM/yyyy"
          });
        highField = new sap.m.DatePicker({
            value: "{high}",
            displayFormat:"dd/MM/yyyy", valueFormat:"dd/MM/yyyy"
          });
      } else {
        lowField = new sap.m.Input({
            value: "{low}"
          });
        highField = new sap.m.Input({
            value: "{high}"
          });
      }

      var oTemplate = new sap.m.ColumnListItem({
        cells: [
        /*
          new sap.m.Input({
            value: "{low}"
          }),
          new sap.m.Input({
            value: "{high}"
          }),
        */
          lowField,
          highField,
          new sap.m.Button({
            icon: 'sap-icon://delete',
            press: function () {
              var oTable = this.getParent().getParent().getParent();
              var model = oTable.getModel();
              var elements = model.getData();
              var path = this.getBindingContext().getPath();
              var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
              if (elements.length > 1) {
                elements.splice(idx, 1);
              } else {
                // UTI.toast("No puede eliminar todas las lineas");
                UTI.toast(oView.getModel("i18n").getProperty("nosepuedeelimiarlinea"));
              }

              model.setData(elements);
            }
          })
        ],
        vAlign: sap.ui.core.VerticalAlign.Middle
      });

      oTable.bindAggregation("items", "/", oTemplate);

      var __dialog = new sap.m.Dialog({
        title: oView.getModel("i18n").getProperty("tiDialog"),
        contentWidth: "550px",
        contentHeight: "300px",
        resizable: true,
        draggable: true,
        content: oTable,

        endButton: new sap.m.Button({
          //text: "Cerrar",
          text: oView.getModel("i18n").getProperty("cerrar"),
          press: function () {
            var model = __dialog.getContent()[0].getModel();
            var elements = model.getData();
            oView.byId(sIdTreated + "low").setValue(elements[0].low);
            __dialog.destroy();
          }
        })
      });

      //to get access to the global model
      // this.getView().addDependent(__dialog);

      __dialog.setModel(oEvt.getSource().getModel());
      __dialog.open();
      console.log(range);
    },

    _onSearchFilter: function (e) {
      var data = this.oView.byId("oTableDoctos").getModel().getData();
      if (data.doctosSet.length > 0)
        var row = data.doctosSet[0];
      else
        return;

      var oFilters = [];
      for (var key in row) {
        oFilters.push(key);
      }
      var aFilters = [];
      var sQuery = e.getSource().getValue();
      var oFiltersObj = [];
      if (sQuery && sQuery.length > 0) {
        for (var index = 0; index < oFilters.length; index++) {
          var element = new sap.ui.model.Filter(oFilters[index], sap.ui.model.FilterOperator.Contains, sQuery);
          if ((typeof row[element.sPath]) === "string")
            oFiltersObj.push(element);
        }
        var filters = new sap.ui.model.Filter({
          filters: oFiltersObj,
          //[
          //         new sap.ui.model.Filter("NAME", sap.ui.model.FilterOperator.Contains, sQuery),
          //         new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, sQuery)
          //     ],
          and: false
        });
        aFilters.push(filters);
      }
      // update list binding
      var binding = this.oView.byId("oTableDoctos").getBinding("items");
      binding.filter(aFilters, "Application");
    },

    _onSearchForParameter: function (parameterName){
      var result = null,
        tmp = [];
      var items = location.search.substr(1).split("&");
      for (var index = 0; index < items.length; index++) {
          tmp = items[index].split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      }
      return result;
    },

    onInit: function () {
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.getTarget("ListItems_1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
    },
    onAfterRendering: function () {
      console.log(this);
      var oFromDate = this.getView().byId('so_fecha_low');
      var oToDate = this.getView().byId('so_fecha_high');
      var oView = this.getView();
      oToDate.setValue(UTI._ActualDateformated());
      oFromDate.setValue(UTI._manipulateDate(null, 30, "sub"));
      this._dialogFlow = new sap.m.Dialog({
        // title: "Flujo del documento",
        title: oView.getModel("i18n").getProperty("flujodocumento"),
        endButton: new sap.m.Button({
          //  text: "Cerrar",
          text: oView.getModel("i18n").getProperty("cerrar"),
          press: function (oEvt) {
            this._dialogFlow.close();
          }.bind(this)
        })
      });
      this.getView().addDependent(this._dialogFlow);

      this._loadIntervals("p_proce_");
      this._loadIntervals("p_monto_");
      this._loadIntervals("p_moneda_");
      this._loadIntervals("so_fecha_");
      this._loadIntervals("p_ebeln_");
      this._loadIntervals("p_bsart_");
      this._loadIntervals("p_belnr_");
      this._loadIntervals("p_blart_");
      this._loadIntervals("p_ceco_");
      this._loadIntervals("p_xblnr_");
    }
  });
}, /* bExport= */ true);