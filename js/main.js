var app = angular.module('matchMakerApp', [
    'ngRoute', 'ui.grid', 'ui.grid.selection', , 'ui.grid.pagination'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                // Home
                .when("/", {templateUrl: "partials/home.html", controller: "MainCtrl"})
                // Pages
                .when("/stats", {templateUrl: "partials/stats.html", controller: "MainCtrl"})



                .otherwise("/404", {templateUrl: "partials/404.html", controller: "MainCtrl"});
    }]);



/**
 * Controlers
 */

app.controller('MainCtrl', function (myService1, $scope, $location, $http) {
    console.log("Page Controller reporting for duty.");

    $scope.leftData = [];


    $scope.showTotalRecords = false;

    $scope.getLeftData = function () {
        $scope.loadLeftData();
        myService1.async().then(function (d) {
            $scope.leftData = d;
            $scope.loadLeftData();
        });

    };
    $scope.loadLeftData = function () {



        $scope.totalRecords = $scope.leftData.length;
        $scope.showTotalRecords = true;
        $scope.gridOptions = {
            data: $scope.leftData,
            enableSorting: true,
            enableFiltering: true,
            showTreeExpandNoChildren: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            noUnselect: false,
            modifierKeysToMultiSelect: false,
            showGridFooter: false,
            showColumnFooter: false,
            paginationPageSizes: [10, 20, 30],
            paginationPageSize: 10,

            //    columnDefs: [
            //      { name: 'number' },
            //      { name: 'name' }
            //    ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi; // i'd recommend a promise or deferred for this

                var onRowsRenderedOff = gridApi.core.on.rowsRendered(null, function () {
                    onRowsRenderedOff(); // run once
                    triggerRowSelectOnClick('#grid1'); // requires '.ui-grid-canvas'
                });
            }
        };


    };



    function triggerRowSelectOnClick(yourGridId) {

        $(yourGridId + ' .ui-grid-contents-wrapper > [role=grid] .ui-grid-canvas')
                .delegate('.ui-grid-row', 'click', function (ev) {
                    jqRow = $(this); // '.ui-grid-row'
                    var index = jqRow.index();
                    var commonAncestor = jqRow.closest(yourGridId + ' .ui-grid-contents-wrapper');

                    var selectButtonQuery = [
                        '.ui-grid-pinned-container', // left side class
                        '[role=grid] .ui-grid-canvas', // redundant, but doesn't hurt
                        '.ui-grid-row .ui-grid-selection-row-header-buttons' // select button class
                    ].join(' ');
                    var checkboxDiv = commonAncestor.find(selectButtonQuery);
                    checkboxDiv.get(index).click();
                });
    }

    $scope.showBottom = function () {
        $scope.showBottomResult = true;
    };







});
app.factory('myService1', function ($http) {
    var myService1 = {
        async: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('myService1.json').then(function (response) {
                // The then function here is an opportunity to modify the response
                //console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return myService1;
});

