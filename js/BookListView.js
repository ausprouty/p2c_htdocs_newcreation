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
        this.$el.html(this.template(books));
        return this;
    };
	this.initialize();
}