// For an introduction to the Blank template, see the following documentation:
// https://go.microsoft.com/fwlink/?LinkId=232509
var pickedVal = [];
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());

        }
    };

    WinJS.Navigation.addEventListener("navigating", function (e) {
        var elem = document.getElementById("contentTarget");

        WinJS.UI.Animation.exitPage(elem.children).then(function () {
            WinJS.Utilities.empty(elem);
            WinJS.UI.Pages.render(e.detail.location, elem, { code: pickedVal })
                .then(function () {
                    return WinJS.UI.Animation.enterPage(elem.children)
                });
        });
    });

    WinJS.UI.Pages.define("/index.html", {
        ready: function (elem, options) {
            WinJS.Navigation.navigate("/MainPage.html");
        }
    })

    WinJS.Namespace.define("SourceData",
        {
            itemList: new WinJS.Binding.List([])
        })


    app.start();
})();
