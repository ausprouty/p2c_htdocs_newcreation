var PageView = function(page) {

	this.initialize = function() {
		this.$el = $('<div/>');
	};

	this.render = function() {
		var content = this.template(page);
		this.$el.html(content);
		return this;
	};
	

	this.initialize();

}