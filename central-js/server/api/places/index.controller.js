var request = require('request');
var NodeCache = require("node-cache" );
var arrayQuery = require('array-query');

var placesCache = new NodeCache();

function getStructure() {
	var structureKey = 'api/places';
	return placesCache.get(structureKey) || null;
};

function findRegions() {
	var regionsKey = 'api/places/regions';
	var regionsValue = placesCache.get(regionsKey);
	
	if(regionsValue) {
		return regionsValue;
	}
	
	var structureValue = getStructure();
	return structureValue;
};

function findRegion(region) {
	var regionKey = 'api/places/region/' + region;
	var cacheValue = placesCache.get(regionKey);
	
	if(cacheValue) {
		return cacheValue;
	};
	
	var structureValue = getStructure();
	if(structureValue == null) {
		return null;
	}
	
	for(var key in structureValue) {
		var oRegion = structureValue[key];
		if(oRegion.nID == region) {
			placesCache.set(regionKey, oRegion);
			return oRegion;
		}
	};
	
	return null;
};

function findCity(region, city) {
	var cityKey = 'api/places/region/' + region + '/city/' + city;
	var cacheValue = placesCache.get(cityKey);
	
	if(cacheValue) {
		return cacheValue;
	}
	
	var oRegion = findRegion(region);
	if(oRegion == null) {
		return null;
	}
	
	var aCity = oRegion.aCity;
	for(var key in aCity)	{
		var oCity = aCity[key];
		if(oCity.nID == city) {
			placesCache.set(cityKey, oCity);
			return oCity;
		}
	};
	
	return null;
};

function findCities(region, search) {
	var citiesKey = 'api/places/region/' + region + '/cities?sFind=' + search;
	var cacheValue = placesCache.get(citiesKey);
	
	if(cacheValue) {
		return cacheValue;
	}
	
	var oRegion = findRegion(region);
	if(oRegion == null) {
		return null;
	}
	
	return (search == null) ?
		oRegion.aCity:
		arrayQuery('sName').regex(new RegExp(search, 'i')).limit(10).on(oRegion.aCity);
};

module.exports = {
	getPlaces: function(options, next) {
		var structureValue = getStructure();

		if(structureValue) {
			next();
			return;
		}
	
		var url = options.protocol+'://'+options.hostname+options.path+'/services/getPlaces';
		return request.get({
			'url': url,
			'auth': {
				'username': options.username,
				'password': options.password
			}
		}, function(error, response, body) {
			placesCache.set('api/places', JSON.parse(body), 86400);
			next();
			return;
		});
	},
	getRegions: function() {
		var aRegion = findRegions();
		
		if(aRegion == null) {
			return null;
		}
		
		var result = [];
		for(var i = 0; i < aRegion.length; i++) {
			var oRegion = aRegion[i];
			result.push({
				nID: oRegion.nID,
				sName: oRegion.sName
			});
		};
		
		return result;
	},
	getRegion: function(region) {
		var oRegion = findRegion(region);
		
		if(oRegion == null) {
			return null;
		}
		
		return {
			nID: oRegion.nID,
			sName: oRegion.sName
		}
	},
	getCities: function(region, search) {
		var aCity = findCities(region, search);
		
		var result = [];
		for(var i = 0; i < aCity.length; i++) {
			var oCity = aCity[i];
			result.push({
				nID: oCity.nID,
				sName: oCity.sName
			});
		}
		
		return result;
	},
	getCity: function(region, city) {
		var oCity = findCity(region, city);
		
		if(oCity == null) {
			return null;
		}
		
		return {
			nID: oCity.nID,
			sName: oCity.sName
		}
	}
};