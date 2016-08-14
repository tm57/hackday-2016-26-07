/**
 * Created by tinashematate on 26/07/16.
 */

function Partner (name) {
	this.name = name;
	this.matched = false;
}

Partner.prototype.setName = function(){

	if((this.name)){
		return this.name;
	}

	return Names[Math.floor((Math.random() * 19) + 1)];
}