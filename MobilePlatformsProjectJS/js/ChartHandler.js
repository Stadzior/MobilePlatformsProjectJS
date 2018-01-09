var firstCurrencyCode = null;
var secondCurrencyCode = null;

var currencyCodes = [];

var dataModel = {
    firstCurrencyCode,
    secondCurrencyCode,
    firstCurencyData: [],
    secondCurrencyData: [],
    currenctDates: [],
    length
};

(function () {
    "use strict";

    WinJS.UI.Pages.define("/CurrencyHistoryPage.html", {
        ready: function (elem, options) {

            firstCurrencyCode = options.code[0];
            dataModel.firstCurrencyCode = options.code[0];
            dataModel.length = options.code.length;

            if (dataModel.length == 2)
                dataModel.secondCurrencyCode = options.code[1];

            document.getElementById("hearderText").innerHTML = "Historia waluty " + options.code;
            document.getElementById("back").onclick = function (evt) {
                WinJS.Navigation.navigate("/skeleton.html");
            }
            document.getElementById("exitButton").onclick = function (evt) {
                window.close();
            }
            document.getElementById("generateChart").onclick = function (evt) {
                var startDate = document.getElementById("startDate").value;
                var endDate = document.getElementById("endDate").value;
                var url = prepareURL(startDate, endDate)
                loadCurrencySet(url);
            }
            document.getElementById("saveChartButton").onclick = function (evt) {
                var canvas = document.getElementById("chart");
                writeBlobToFile(canvas.msToBlob());
            }

            setMaxDate();
        }
    });
})();

function loadCurrencySet(queryURL) {
    var results = [];
    WinJS.xhr({ url: queryURL[0] }).done(
        function completed(result) {

            results[0] = result;
            if (queryURL.length == 2) {
                WinJS.xhr({ url: queryURL[1] }).done(
                    function completed(result2) {
                        results[1] = result2;
                        xhrParseCurrencySetXml(results);
                    },
                    function error(request) {
                        showMessage("Wystąpił błąd przy próbie pobierania danych. Prawdopodobną przyczyną jest nieprawidłowa data.");
                    });
            }
            else {
                results[0] = result;
                xhrParseCurrencySetXml(results);
            }
        },
        function error(request) {
            showMessage("Wystąpił błąd przy próbie pobierania danych. Prawdopodobną przyczyną jest nieprawidłowa data.");
        });
}

function xhrParseCurrencySetXml(result) {
    var xmlRsp = [];
    xmlRsp[0] = result[0].responseXML;
    if (dataModel.length == 2)
        xmlRsp[1] = result[1].responseXML;

    getCurrencyDataFromXML(xmlRsp);

    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: prepareChartData(),
        options: prepareChartOptions()
    });
}

function prepareChartData() {

    var chartData;

    if (dataModel.length == 1)
        chartData = {
            labels: dataModel.currenctDates,
            datasets: [
                {
                    borderColor: '#4286f4',
                    label: "Historia waluty " + dataModel.firstCurrencyCode,
                    data: dataModel.firstCurencyData,
                    yAxisID: "y-axis-1"
                }]
        }
    else
        chartData = {
            labels: dataModel.currenctDates,
            datasets: [
                {
                    borderColor: '#4286f4',
                    label: "Historia waluty " + dataModel.firstCurrencyCode,
                    data: dataModel.firstCurencyData,
                    yAxisID: "y-axis-1"
                },
                {
                    borderColor: '#38ffcd',
                    label: "Historia waluty " + dataModel.secondCurrencyCode,
                    data: dataModel.secondCurrencyData,
                    yAxisID: "y-axis-2"
                }]
        }

    return chartData;
}

function prepareChartOptions() {
    var optionsSettings;

    if (dataModel.length == 1)
        optionsSettings = {
            scales: {
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }]
            }
        }
    else
        optionsSettings = {
            scales: {
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }, {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    gridLines: {
                        drawOnChartArea: false,
                    },
                }],
            }
        }

    return optionsSettings;
}

function getCurrencyDataFromXML(xmlRsp) {

    dataModel.currenctDates = getDatesFromXML(xmlRsp[0]);
    dataModel.firstCurencyData = XMLDataToArray(xmlRsp[0]);
    if (dataModel.length == 2)
        dataModel.secondCurrencyData = XMLDataToArray(xmlRsp[1]);

}

function getDatesFromXML(xmlRsp) {
    array = [];
    if (xmlRsp) {
        var rates = xmlRsp.querySelectorAll("ExchangeRatesSeries > Rates > Rate");
        if (rates) {
            var length = rates.length;
            for (var i = 0; i < length; i++) {
                array[i] = rates[i].querySelector("EffectiveDate").textContent;
            }
        } else {
            showMessage("Brak kursów.");
        }
    } else {
        showMessage("Wystąpił problem podczas pobierania serii danych.");
    }
    return array;
}

function XMLDataToArray(xmlRsp) {
    var array = [];
    if (xmlRsp) {
        var rates = xmlRsp.querySelectorAll("ExchangeRatesSeries > Rates > Rate");
        if (rates) {
            var length = rates.length;
            for (var i = 0; i < length; i++) {
                array[i] = rates[i].querySelector("Mid").textContent;
            }
        } else {
            showMessage("Brak kursów.");
        }
    } else {
        showMessage("Wystąpił problem podczas pobierania serii danych.");
    }

    return array;
}

function xhrError(result) {
    var messageString;
    var statusCode = result.status;
    messageString = "Wystąpił problem podczas pobierania serii danych. StatusCode:" + statusCode;
    if (statusCode == 400)
        messageString = "Błędny zakres. StatusCode:" + statusCode;
    else if (statusCode == 404)
        messageString = "Brak danych w wybranym okresie. StatusCode:" + statusCode;

    showMessage(messageString);
}

function setMaxDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("startDate").setAttribute("max", today);
    document.getElementById("startDate").setAttribute("value", today);
    document.getElementById("endDate").setAttribute("max", today);
    document.getElementById("endDate").setAttribute("value", today);
}

function showMessage(message) {
    var myMessage = new Windows.UI.Popups.MessageDialog(message);
    myMessage.showAsync();
}

function writeBlobToFile(blob) {
    Windows.Storage.KnownFolders.picturesLibrary.createFileAsync("chart.jpg", Windows.Storage.CreationCollisionOption.generateUniqueName).then(function (file) {
        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {

            var input = blob.msDetachStream();

            Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                output.flushAsync().done(function () {
                    input.close();
                    output.close();

                    showMessage("Zdjęcie zostało zapisane w Twoim domyślnym folderze ze zdjęciami");
                });
            });
        });
    });
}

function prepareURL(startDate, endDate) {
    var urls = [];

    urls[0] = "http://api.nbp.pl/api/exchangerates/rates/a/" + dataModel.firstCurrencyCode + "/" + startDate + "/" + endDate + "/?format=xml";

    if (dataModel.length == 2)
        urls[1] = "http://api.nbp.pl/api/exchangerates/rates/a/" + dataModel.secondCurrencyCode + "/" + startDate + "/" + endDate + "/?format=xml";

    return urls;
}