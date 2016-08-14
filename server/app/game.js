function Game(user1, user2) {
	this.user1 = user1;
	this.user2 = user2;
	this.receiver = false;
}
/**
 *
 * @param SendingUser
 * @returns {*|boolean}
 */
Game.prototype.channelFrom = function (SendingUser) {
	switch (SendingUser) {
		case this.user1:
			this.receiver = this.user2;
			break;
		case this.user2:
			this.receiver = this.user1;
			break;
		default:
			throw new Error('No receiver found on the other end!!!');
	}
	return this.receiver;
};

Game.prototype.lookForPartner = function (name) {
	return this.channelFrom(name);
};
module.exports = Game;