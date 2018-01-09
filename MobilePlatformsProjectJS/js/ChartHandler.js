var firstCurrencyCode = null;
var secondCurrencyCode = null;
(function () {
    "use strict";

    WinJS.UI.Pages.define("/CurrencyHistoryPage.html", {
        ready: function (elem, options) {

            if (options.length == 1)
                firstCurrencyCode = options.code[0];
            else {
                firstCurrencyCode = options.code[0];
                secondCurrencyCode = options.code[1];
            }

            document.getElementById("hearderText").innerHTML = "Historia waluty " + options.code;
            document.getElementById("back").onclick = function (evt) {
                WinJS.Navigation.navigate("/index.html");
            }
            document.getElementById("exitButton").onclick = function (evt) {
                window.close();
            }
            document.getElementById("generateChart").onclick = function (evt) {
                var startDate = document.getElementById("startDate").value;
                var endDate = document.getElementById("endDate").value;
                var url = [];

                if (options.code.length == 1)
                    url[0] = prepareURL(firstCurrencyCode, startDate, endDate);
                else {
                    url[0] = prepareURL(firstCurrencyCode, startDate, endDate);
                    url[1] = prepareURL(secondCurrencyCode, startDate, endDate);
                }

                loadCurrencySet(url);
            }
            document.getElementById("saveAsPng").onclick = function (evt) {
                var canvas = document.getElementById("myChart");
                writeBlobToFile(canvas.msToBlob());
            };

            setMaxDate();
        }
    });
})();

function writeBlobToFile(blob) {
    Windows.Storage.KnownFolders.picturesLibrary.createFileAsync("chart.jpg", Windows.Storage.CreationCollisionOption.generateUniqueName).then(function (file) {
        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {

            var input = blob.msDetachStream();

            Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                output.flushAsync().done(function () {
                    input.close();
                    output.close();

                    var myMessage = new Windows.UI.Popups.MessageDialog("Zapisano w folderze Zdjęcia.");
                    myMessage.showAsync();
                });
            });
        });
    });
}

function prepareURL(currencyCode, startDate, endDate) {
    return "http://api.nbp.pl/api/exchangerates/rates/a/" + currencyCode + "/" + startDate + "/" + endDate + "/?format=xml";
}

function setMaxDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
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

function loadCurrencySet(queryURL) {
    var results = [];
    WinJS.xhr({ url: queryURL[0] }).done(
        function completed(result) {
            if (queryURL.length == 2) {
                WinJS.xhr({ url: queryURL[1] }).done(
                    function completed(result2) {
                        results[0] = result;
                        results[1] = result2;
                        xhrParseCurrencySetXml(results);
                    }, 
        function error(request) {
            var myMessage = new Windows.UI.Popups.MessageDialog("Błąd pobierania. Prawdopodbnie zła data.");
            myMessage.showAsync();
        });
            }
            else {
                results[0] = result;
                xhrParseCurrencySetXml(results);
            }
        }, 
        function error(request) {
            var myMessage = new Windows.UI.Popups.MessageDialog("Błąd pobierania. Prawdopodbnie zła data.");
            myMessage.showAsync();
        });
}

function xhrParseCurrencySetXml(result) {
    var xmlRsp = [];
    xmlRsp[0] = result[0].responseXML;
    if (result.length == 2)
        xmlRsp[1] = result[1].responseXML;
       
    var datesArray = [];
    var dataArray = [];

    var datesArray2 = [];
    var dataArray2 = [];



    if (xmlRsp[0]) {
        var rates = xmlRsp[0].querySelectorAll("ExchangeRatesSeries > Rates > Rate");
        if (rates) {
            var length = rates.length;
            for (var i = 0; i < length; i++) {
                datesArray[i] = rates[i].querySelector("EffectiveDate").textContent;
                dataArray[i] = rates[i].querySelector("Mid").textContent;
            }
        } else {
            var myMessage = new Windows.UI.Popups.MessageDialog("Brak kursów.");
            myMessage.showAsync();
        }
    } else {
        var myMessage = new Windows.UI.Popups.MessageDialog("Wystąpił problem podczas pobierania serii danych.");
        myMessage.showAsync();
    }

    if (xmlRsp.length == 2)
        if (xmlRsp[1]) {
            var rates = xmlRsp[1].querySelectorAll("ExchangeRatesSeries > Rates > Rate");
            if (rates) {
                var length = rates.length;
                for (var i = 0; i < length; i++) {
                    datesArray2[i] = rates[i].querySelector("EffectiveDate").textContent;
                    dataArray2[i] = rates[i].querySelector("Mid").textContent;
                }
            } else {
                var myMessage = new Windows.UI.Popups.MessageDialog("Brak kursów.");
                myMessage.showAsync();
            }
        }
    else {
        var myMessage = new Windows.UI.Popups.MessageDialog("Wystąpił problem podczas pobierania serii danych.");
        myMessage.showAsync();
    }


    var chartData;
    var optionsSettings;
    if (xmlRsp.length == 1) {
        chartData = {
            labels: datesArray,
            datasets: [
                {
                    label: "Historia waluty " + firstCurrencyCode,
                    data: dataArray,
                    yAxisID: "y-axis-1"
                }]
        }
        optionsSettings = {
            scales: {
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }]
            }
        }
    } else {
        chartData = {
            labels: datesArray,
            datasets: [
                {
                    label: "Historia waluty " + firstCurrencyCode,
                    data: dataArray,
                    yAxisID: "y-axis-1"
                },
            {
                label: "Historia waluty " + secondCurrencyCode,
                data: dataArray2,
                yAxisID: "y-axis-2"
            }]
        }
        optionsSettings = {
            scales: {
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }, {
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    // grid line settings
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                }],
            }
        }
    }


    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: optionsSettings
    });
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
