muwApp.controller('MainController', [ '$scope', '$sce', '$timeout', '$http',
		function($scope, $sce, $timeout, $http) {
	
	$scope.myHTML = {};
	$scope.alert = {};
	$scope.auto_compile = {};
	$scope.containers = {};

    $scope.aceLoadedHtml = function(_editor) {
    	$scope.aceSessionHtml = _editor.getSession();
	    loadHotkeys(_editor);
	    loadFolder(_editor, "html");
	};
	$scope.aceChangedHtml = function () {
		compressAndPublic();
	};

	$scope.aceLoadedCss = function(_editor) {
    	$scope.aceSessionCss = _editor.getSession();
	    loadHotkeys(_editor);
	    loadFolder(_editor, "css");
	};
	$scope.aceChangedCss = function () {
		compressAndPublic();
	};

	$scope.aceLoadedJs = function(_editor) {
    	$scope.aceSessionJs = _editor.getSession();
	    loadHotkeys(_editor);
	    loadFolder(_editor, "js");
	};
	$scope.aceChangedJs = function () {
		compressAndPublic("js");
	};

	$scope.hideOthers = function(type){
		if(type == "html"){
			$scope.containers.html = !$scope.containers.html;
		} else if(type == "css"){
			$scope.containers.css = !$scope.containers.css;
		} else if(type == "js"){
			$scope.containers.js = !$scope.containers.js;
		}

	}

	$scope.$watch("hide_containers", function(newValue, oldValue){
		if(newValue)
			$scope.myStyle = {'height':'90%'};
		else
			$scope.myStyle = {};
	});

	function loadHotkeys(editor){
		editor.commands.addCommand({
	        name: 'ctrlS',
	        bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
	        exec: function () { 
	        	//em breve
	      	}
	  	});
	}

	function loadFolder(editor, type){
		$http({
	        url: 'files/example.' + type,
	        method: 'GET'
	    }).success(function(response){
	        editor.setValue(response, 2);
	    }).error(function(error){
	        console.log(error);
	    });        
	}

	function compressAndPublic(){
		var all_content = "\n<style>" + $scope.aceSessionCss.getDocument().getValue()
									.replaceAll("body", ".bodymuw") + "</style>" +
						  "\n<div class='bodymuw' ng-style='myStyle' onload='loadMuw();'>" + 
						  			$scope.aceSessionHtml.getDocument().getValue() + "</div>";
		$scope.myHTML.test = $sce.trustAsHtml(all_content);
		
		if($scope.auto_compile.js){
			var script = document.createElement('script');
			injectJs($scope.aceSessionJs.getDocument().getValue());
		}
	}

	function injectJs(link) {
		var scr = document.createElement('script');
		scr.type="text/javascript";
		scr.appendChild(document.createTextNode(link));
		document.getElementsByTagName('head')[0].appendChild(scr)
	}

	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};

}]);