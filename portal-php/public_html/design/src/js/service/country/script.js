define('service.country', ['angularAMD', 'service.country.link', 'service.country.built-in'], function (angularAMD) {
    var app = angular.module('service.country', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('service.country', {
                url: '/country',
                views: {
                    '': angularAMD.route({
                        templateProvider: ['$templateCache', function($templateCache) {
							return $templateCache.get('html/service/country/index.html');
						}],
						controller: 'ServiceCountryController',
                        controllerUrl: 'state/service/country/controller'
                    })
                }
            })
    }]);
    return app;
});