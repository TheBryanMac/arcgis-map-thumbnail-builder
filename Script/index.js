﻿/*global require, html2canvas*/

require([
	"esri/map",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"layerFactory",
	"//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"
], function (Map, ArcGISTiledMapServiceLayer, LayerFactory) {
	function addLayerToList(layerInfo) {
		var ul = document.getElementById("layersList");
		var layer = layerInfo.layer;
		var li = document.createElement("li");
		li.textContent = layer.url;
		ul.appendChild(li);
	}

	function takeScreenshot() {
		html2canvas(document.getElementById("map"), {
			useCORS: true,
			width: 200,
			height: 133,
			onrendered: function (canvas) {
				document.body.appendChild(canvas);
			}
		});
	}

	var map, bgLayer, layerFactory;

	layerFactory = new LayerFactory();

	layerFactory.on("layer-create", function (response) {
		if (response.layer) {
			map.addLayer(response.layer);
		} else if (response.error) {
			console.error(response.error);
		}
	});

	document.forms.addLayerForm.onsubmit = function () {
		console.log("url", this.layerUrl.value);
		layerFactory.createLayer({
			url: this.layerUrl.value
		});

		return false;
	};


	bgLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer", {
		useMapImage: true
	});

	map = new Map("map", {
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 5,
		showAttribution: false,
		showInfoWindowOnClick: false,
		slider: false,
		logo: false
	});

	map.on("layer-add", addLayerToList);

	map.addLayer(bgLayer);
	layerFactory.createLayer({
		url: "http://services.arcgis.com/IYrj3otxNjPsrTRD/arcgis/rest/services/WSDOTAccessControl/FeatureServer/0"
	});

	var screenshotButton = document.getElementById("screenshotButton");
	screenshotButton.addEventListener("click", takeScreenshot);
});