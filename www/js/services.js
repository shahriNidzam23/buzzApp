angular.module('app.services', [])

.factory('buzzzFactory', [function(){ 
	var user = [
		{ email: "ashwin_21962@utp.edu.my", pass: "ashwin_21962", name: "Ashwin", plate: "MWT550", summon: "-"},
		{ email: "tioe_chien@utp.edu.my", pass: "tioe_chien", name: "Tioe Chien", plate: "WNP9901", summon: "RM30"},
	];

	var login = {};
  return {
    setLogin: function(data) {
    	for(var i = 0; i < user.length; i++){
    		if(data.email == user[i].email && data.pass == user[i].pass){
    			login = user[i];
    			return true;
    		}
    	}

    	return false;
    },
    getLogin: function() {
    	return login;
    },
	getPlate: function(){
		return user;
    }
  }
}])

.service('BlankService', [function(){

}]);