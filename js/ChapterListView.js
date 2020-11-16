var ChapterListView = function (chapters) {
    var chapters;
	this.initialize = function() {
		this.$el = $('<div/>');
	};

	this.render = function() {
		var content = this.template(chapters);
		this.$el.html(content);
		return this;
	};
	

	this.initialize();

}