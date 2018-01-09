var lView;
var dataArray = [];

var apiModel = {
    currencyList: "http://api.nbp.pl/api/exchangerates/tables/a/?format=xml",
    currencyDates: "http://www.nbp.pl/kursy/xml/dir.txt",
    currencyCursesForYear: function (val) {
        return "http://www.nbp.pl/kursy/xml/dir" + val + ".txt"
    },
    currency: function (year, value) {
        return "http://api.nbp.pl/api/exchangerates/tables/a/" + year + "-" + value + "/?format=xml";
    }

};

(function () {
    "use strict";

    var app = WinJS.Application;

    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            WinJS.UI.processAll();
        }
    };

    WinJS.UI.Pages.define("/MainPage.html", {
        ready: function (elem, options) {
            pickedVal = [];
            loadRemoteXhr(apiModel.currencyList);
            loadRemoteDateXhr(apiModel.currencyDates);
            setupPicker();

            prepareYearSelect();

            document.getElementById("yearSelect").onchange = function (evt) {
                var val = evt.currentTarget.value;
                if (val == 2017) {
                    val = "";
                }
                loadRemoteDateXhr(apiModel.currencyCursesForYear(val));
            }
            document.getElementById("daySelect").onchange = function (evt) {
                var year = document.getElementById("yearSelect").value;
                loadRemoteXhr(apiModel.currency(year, evt.currentTarget.value));
            }
            document.getElementById("exitButton").onclick = function (evt) {
                window.close();
            }
            document.getElementById("generateButton").onclick = function (evt) {

                for (var i = 0; i < lView.selection._selected._ranges.length; i++) {
                    pickedVal[i] = dataArray[lView.selection._selected._ranges[i].firstIndex].code
                }

                WinJS.Navigation.navigate("/CurrencyHistoryPage.html");
            };

            lView = document.getElementById("basicListView").winControl;
            lView.addEventListener("selectionchanged", this.selectionChanged);
            lView.addEventListener("selectionchanging", this.selectionChanging);

        },
        selectionChanging: function (eventInfo) {
            if (lView.selection.count() >= 2) {
                var itemOnList = false;
                if (eventInfo.detail.newSelection._ranges.length > 2)
                    event.preventDefault(); xhrParseCurrencyXml
            }
        },
        selectionChanged: function (eventInfo) {
            var checkChartButton = document.getElementById("generateButton");
            if (lView.selection.count() > 0)
                checkChartButton.disabled = false;
            else
                checkChartButton.disabled = true;

            WinJS.UI.process(checkChartButton);
        }
    });

    app.start();
})();

function prepareYearSelect() {
    var outputDateArea = document.getElementById("yearSelect");
    for (var i = 2017; i >= 2002; i--) {
        var o = document.createElement("option");
        o.setAttribute("data-win-bind", "value: id; textContent: date");
        o.value = i;
        o.textContent = i;
        outputDateArea.appendChild(o);
    }
}

function loadRemoteXhr(queryURL) {
    WinJS.xhr({ url: queryURL }).then(
        xhrParseCurrencyXml, xhrError
    );
}

function xhrParseCurrencyXml(result) {
    var outputArea = document.getElementById("basicListView");
    var xml = result.responseXML;
    var counter = 0;
    if (xml) {
        var rates = xml.querySelectorAll("ArrayOfExchangeRatesTable > ExchangeRatesTable > Rates > Rate");
        if (rates) {
            var length = rates.length;
            for (var i = 0; i < length; i++) {
                dataArray[counter++] = { currency: rates[i].querySelector("Currency").textContent, code: rates[i].querySelector("Code").textContent, mid: rates[i].querySelector("Mid").textContent }
            }
            var datalist = new WinJS.Binding.List(dataArray);
            outputArea.winControl.itemDataSource = datalist.dataSource;
        } else {
            outputArea.innerHTML = "There are no rates available at this time";
        }
    } else {
        outputArea.innerHTML =
            "Unable to retrieve data at this time. Status code: ";
    }
}

function loadRemoteDateXhr(queryURL) {
    WinJS.xhr({ url: queryURL }).then(
        xhrParseDateTxt, xhrError
    );
}

function xhrParseDateTxt(result) {
    var outputDateArea = document.getElementById("daySelect");

    for (var i = outputDateArea.options.length - 1; i >= 0; i--) {
        outputDateArea.remove(i);
    }

    var txt = result.response;
    var dataArray = [];
    var counter = 0;
    var txtArray = txt.split("\n");
    if (txtArray) {
        var dateArray = [];
        for (var i = txtArray.length - 1; i >= 0; i--) {
            if (txtArray[i].charAt(0) == 'a') {
                var dateToConv = txtArray[i].substring(5);
                var month = dateToConv.substring(2, 4);
                var day = dateToConv.substring(4, 6);
                dateArray[i] = { date: month + "-" + day };

                var o = document.createElement("option");
                o.setAttribute("data-win-bind", "value: id; textContent: date");
                o.value = dateArray[i].date;
                o.textContent = dateArray[i].date;
                outputDateArea.appendChild(o);
            }
        }
    } else {
        outputDateArea.innerHTML =
            "Unable to retrieve data at this time. Status code: ";
    }
}


function xhrError(result) {

    var statusCode = result.status;
    var myMessag = new Windows.UI.Popups.MessageDialog("Wystąpił problem podczas pobierania serii danych. StatusCode:" + statusCode);
    if (statusCode == 400) {
        myMessage = new Windows.UI.Popups.MessageDialog("Błędny zakres. StatusCode:" + statusCode);
    } else if (statusCode == 404) {
        myMessage = new Windows.UI.Popups.MessageDialog("Brak danych w wybranym okresie. StatusCode:" + statusCode);
    }
    myMessage.showAsync();
}

function setupPicker() {
    var picker = document.getElementById("picker");
    var datePicker = new WinJS.UI.DatePicker(picker);

    datePicker.maxYear = 2017;
    datePicker.minYear = 2002;
}
