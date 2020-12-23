var BookListView = function (books) {

    var books;

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };
	this.setBook = function(list) {
        books = list;
        this.render();
    }
	this.render = function() {
        //localize terms
        books.download_bible = getTerm(books.iso, 'download_bible' );
        books.bible_ready = getTerm(books.iso, 'bible_ready' );
        var remove_item = getTerm(books.iso, 'remove_item' );
        var bible = getTerm(books.iso, 'bible' );
        books.remove_bible = remove_item.replace("%", bible);
        // see which items to show and which to hide
        if (bibleIsDownloaded(books.iso)){
			books.download = 'hide';
			books.downloaded = 'show';
        }
        else{
			books.download = 'show';
			books.downloaded = 'hide';
        }
       
        this.$el.html(this.template(books));
        return this;
    };
	this.initialize();
}