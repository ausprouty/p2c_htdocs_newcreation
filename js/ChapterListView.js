var ChapterListView = function (chapters) {
    var chapters;
	this.initialize = function() {
		this.$el = $('<div/>');
	};

	this.render = function() {
		var title = chapters.book_name;
		var download_book = getTerm(chapters.iso,'download_book');
		chapters.download_book  = download_book.replace("%", title);
		 var book_ready = getTerm(chapters.iso, 'book_ready');
		 chapters.book_ready = book_ready.replace("%", title);
		var remove_item = getTerm(chapters.iso,'remove_item');
		chapters.remove_item = remove_item.replace("%", title);
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