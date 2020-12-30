var PageView = function(page, iso= 'en') {

	this.initialize = function() {
		this.$el = $('<div/>');
	};

	this.render = function() {
		page.iso = iso;
		var content = this.template(page);
		this.$el.html(content);
		return this;
	};
	

	this.initialize();

}