// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function() {
    /* ---------------------------------- Local Variables ---------------------------------- */

    BookListView.prototype.template = Handlebars.compile(
        $("#book-list-tpl").html()
    );
    ChapterListView.prototype.template = Handlebars.compile(
        $("#chapter-list-tpl").html()
    );
    ChapterView.prototype.template = Handlebars.compile(
        $("#chapter-tpl").html()
    );
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    PageView.prototype.template = Handlebars.compile($("#page-tpl").html());
    EbookView.prototype.template = Handlebars.compile($("#ebook-tpl").html());
    var slider = new PageSlider($("body"));
    var service = new BibleService();
    var page = new PageService();

    service.initialize().done(function() {
        service.setup();
        router.addRoute("", function() {
            page.findFile("opening.html").done(function(page) {
                slider.slidePage(new HomeView(page).render().$el);
            });
            $(".right, .left").remove();
        });

        router.addRoute("bible", function() {
            service.findAllBooks().done(function(books) {
                var booksList = new BookListView(books).render().$el;
                slider.slidePage(booksList);

                // Cleaning up: remove old pages that were moved out of the viewport
                $(".right, .left").remove();
            });
        });
        router.addRoute("book/:id", function(id) {
            service.findBookById(parseInt(id)).done(function(book) {
                var chart = service.chapterTable(book);
                var chaptersList = new ChapterListView(chart).render().$el;
                slider.slidePage(chaptersList);
            });
        });
        router.addRoute("chapter/:id", function(id) {
            service.findChapterById(id).done(function(chapter) {
                var chapterContent = new ChapterView(chapter).render().$el;
                slider.slidePage(chapterContent);
            });
        });
        router.addRoute("newcreation", function() {
            localStorage.removeItem("ebookChapter");
            page.findFile("basic.html").done(function(page) {
                slider.slidePage(new EbookView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("newchapter/:id", function(id) {
            localStorage.setItem("ebookChapter", id);
            page.findFile("basic.html").done(function(page) {
                slider.slidePage(new EbookView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("principles", function() {
            page.findFile("principles.html").done(function(page) {
                slider.slidePage(new PageView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("arabic", function() {
            page.findFile("arabic.pdf").done(function(page) {
                slider.slidePage(new PdfView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("urdu", function() {
            page.findFile("urdu.pdf").done(function(page) {
                slider.slidePage(new PdfView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.start();
    });

    /* --------------------------------- Event Registration -------------------------------- */

    $(window).on("hashchange", $.proxy(this.route, this));

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("./service-worker.js");
        });
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            }
        }
        }
    } 


    /* ---------------------------------- Local Functions ---------------------------------- */
})();
