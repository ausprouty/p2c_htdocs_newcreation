var ChapterListView = function (chapters) {
    var chapters;
	this.initialize = function() {
		this.$el = $('<div/>');
	};

	this.render = function() {
		if (bookIsDownloaded(chapters.file_name)){
			chapters.download = 'hide';
			chapters.downloaded = 'show';
        }
        else{
			chapters.download = 'show';
			chapters.downloaded = 'hide';
        }
		var content = this.template(chapters);
		this.$el.html(content);
		return this;
	};
	

	this.initialize();

}