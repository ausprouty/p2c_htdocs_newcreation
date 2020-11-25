var PageView = function(page, iso) {

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