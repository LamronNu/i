define('service/service', ['angularAMD'], function (angularAMD) {
	angularAMD.service('ServiceService', ['$http', function($http) {
		this.get = function(id) {
			var data = {
				'nID': id
			};
			return $http.get('./api/service', {
				params: data,
				data: data,
				transformResponse: [function (rawData, headersGetter) {
					var data = angular.fromJson(rawData);
					angular.forEach(data.aServiceData, function(oServiceData) {
						try {
							oServiceData.oData = angular.fromJson(oServiceData.oData);
						} catch(e) {
							oServiceData.oData = {};
						}
					});
					return data;
				}]
			}).then(function(response) {
				return response.data;
			});
		};
		
		this.syncSubject = function (sInn) {
			var data = {
				'sINN': sInn
			};
			return $http.get('./api/service/syncSubject', {
				params: data,
				data: data
			}).then(function(response) {
				return response.data;
			});
		};
		
		this.getProcessDefinitions = function(oServiceData, latest) {
			var data = {
				'url': oServiceData.sURL,
				'latest': latest || null
			};
			return $http.get('./api/process-definitions', {
				'params': data,
				'data': data
			}).then(function(response) {
				return response.data;
			});
		};
		
		this.getDocuments = function(sID_Subject) {
			var data = {
				'sID_Subject': sID_Subject
			};
			return $http.get('./api/service/documents', {
				params: data,
				data: data
			}).then(function(response) {
				return response.data;
			});
		};
	}]);
});