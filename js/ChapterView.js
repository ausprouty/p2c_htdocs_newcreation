var ChapterView = function(chapter) {

	this.initialize = function() {
		this.$el = $('<div/>');
	};

	this.render = function() {
		console.log ('in render');
		console.log (chapter);
		 var content = this.template(chapter);
		this.$el.html(content);
		return this;
	};
	

	this.initialize();

}