angular.module('app.controllers', [])

  .controller('page1Ctrl', ['$scope', '$stateParams',
    function($scope, $stateParams) {


    }
  ])

  .controller('logInCtrl', ['$scope', '$stateParams', '$state', 'buzzzFactory', '$ionicPopup',
    function($scope, $stateParams, $state, buzzzFactory, $ionicPopup) {
      $scope.login = {};

      $scope.loginUser = function() {
        if (buzzzFactory.setLogin($scope.login)) {
          $state.go("homepage");
        } else {
          $scope.showConfirm("Error", "User Not Exist", "OK");
        }
      }

      $scope.showConfirm = function(title, template, buttonText) {

        var buttons = [];
        if (title == "Error") {
          buttons = [{
            text: '<b>' + buttonText + '</b>',
            type: 'button-energized',
            onTap: function(e) {}
          }];
        } else {
          buttons = [
            { text: 'Cancel' },
            {
              text: '<b>' + buttonText + '</b>',
              type: 'button-energized',
              onTap: function(e) {}
            }
          ];
        }

        var confirmPopup = $ionicPopup.show({
          title: title,
          template: template,
          scope: $scope,

          buttons: buttons
        });

      };

    }
  ])

  .controller('signUpCtrl', ['$scope', '$stateParams',
    function($scope, $stateParams) {


    }
  ])

  .controller('homepageCtrl', ['$scope', '$stateParams', '$ionicPopup', 'buzzzFactory', '$ionicModal', '$cordovaCamera', '$ionicPlatform',
    function($scope, $stateParams, $ionicPopup, buzzzFactory, $ionicModal, $cordovaCamera, $ionicPlatform) {
    	var tempType = {};
      var connection;
      $(function() {

        window.WebSocket = window.WebSocket || window.MozWebSocket;
        if (!window.WebSocket) {
          alert('Sorry, but your browser doesn\'t support WebSocket.');
          //input.hide();
          return;
        }
        // open connection
        connection = new WebSocket('ws://damp-reaches-33149.herokuapp.com', []);
        connection.onopen = function() {
          console.log("connected");
          //status.text('Choose name:');
        };
        connection.onerror = function(error) {
          alert('Sorry, but there\'s some problem with your ' +
            'connection or the server is down.');
        };
        // most important part - incoming messages
        connection.onmessage = function(message) {
          console.log("WebSocket: " + message.data);
          if (message.data.includes("plate")) {
            var temp = JSON.parse(message.data);
            console.log("Plate: " + temp.plate + ", Problem: " + temp.type);
            if (temp.plate == $scope.detail.plate) {
            	tempType = temp;
              $scope.showConfirm("Notification", "You have " + temp.type + " Problem (Report By: " + temp.name + ")", "OK", temp.img);
            }
          }
        };

        setInterval(function() {
          var d = new Date();
          var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
          if (connection.readyState !== 1) {
            console.log(connection);
            //status.text('Error');
            connection = new WebSocket('ws://damp-reaches-33149.herokuapp.com', []);
            console.log('reconnect: ' + time);
          } else {
            connection.send("ping");
          }
        }, 3000);
      });

      $scope.capture = function(type){
        $ionicPlatform.ready(function() {

	        var options = {
	          quality: 100,
	          destinationType: Camera.DestinationType.DATA_URL,
	          sourceType: Camera.PictureSourceType.CAMERA,
	          encodingType: Camera.EncodingType.JPEG,
	          popoverOptions: CameraPopoverOptions,
	          saveToPhotoAlbum: false,
	          correctOrientation: true
	        };

	        $cordovaCamera.getPicture(options).then(function(imageData) {
	          var src = "data:image/jpeg;base64," + imageData;
              $scope.send = { plate: $scope.main.plateReport, type: type, name: $scope.detail.name, img:src };
              $scope.showConfirm("Confirmation", "Notify " + $scope.main.plateReport + " have " + type + " problem?", "YES");
	        }, function(err) {
	          // error
	        });

        });
      }

      $ionicModal.fromTemplateUrl('image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.openModal = function() {
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
              $scope.showConfirm("Notification", "You have " + tempType.type + " Problem (Report By: " + tempType.name + ")", "OK", tempType.img);
      };

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      $scope.detail = {};
      $scope.main = {};

      $scope.init = function() {
        $scope.detail = buzzzFactory.getLogin();
      }

      $scope.report = function(type) {
        console.log(type);
        if (type == $scope.type) {
          $scope.type = false;
        } else {
          $scope.type = type;
        }

        if(type == "accident"){
            $scope.sendReport(type);
        }
      }

      $scope.sendReport = function(type) {
        if (!(!$scope.main.plateReport || $scope.main.plateReport == "")) {
          var bool = false;
          var temp = buzzzFactory.getPlate();
          for (var i = 0; i < temp.length; i++) {
            if ($scope.main.plateReport.toLowerCase() == temp[i].plate.toLowerCase()) {
              bool = true;
            }
          }

          if (bool) {
            if ($scope.main.plateReport.toLowerCase() != $scope.detail.plate.toLowerCase()) {
              $scope.capture(type);
            } else {
              $scope.showConfirm("Error", "You Cannot Report Your Own Car", "OK");
            }
          } else {
            $scope.showConfirm("Error", "Plate Number Did Not Register", "OK");
          }
        } else {
          $scope.showConfirm("Error", "Please State Plate Number", "OK");
        }
      }

      $scope.showConfirm = function(title, template, buttonText, imgSrc) {

        var buttons = [];
        if (title == "Error") {
          buttons = [{
            text: '<b>' + buttonText + '</b>',
            type: 'button-energized',
            onTap: function(e) {

            }
          }];
        } else if (title == "Notification") {
          buttons = [{
              text: 'See Image',
              type: 'button-energized',
              onTap: function(e) {
                $scope.showImage(imgSrc);
              }
            },
            {
              text: '<b>' + buttonText + '</b>',
              type: 'button-energized',
              onTap: function(e) {

              }
            }
          ];
        } else {
          buttons = [
            { text: 'Cancel' },
            {
              text: '<b>' + buttonText + '</b>',
              type: 'button-energized',
              onTap: function(e) {
                if (buttonText == "YES") {
                  if (connection.readyState !== 1) {
                    $scope.showConfirm("Error", "Something is Wrong, Try Again Later", "OK");
                  } else {
                    $scope.type = false;
                    $scope.main.plateReport = "";
                    connection.send(JSON.stringify($scope.send));
                  }
                }
              }
            }
          ];
        }
    
    
        var confirmPopup = $ionicPopup.show({
          title: title,
          template: '<img src="' + imgSrc + '" style="max-width:100%; max-height: 128px;margin-left: auto;margin-right: auto;display: block;"><br/>' + template,
          scope: $scope,

          buttons: buttons
        });

      };

      $scope.showImage = function(src) {
        if (src) {
          $scope.imageSrc = src;
          $scope.openModal();
        }
      }

      $scope.init();

    }
  ])
