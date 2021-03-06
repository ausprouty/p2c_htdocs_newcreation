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

    var slider = new PageSlider($("body"));
    var service = new BibleService();
    var page = new PageService();

    service.initialize().done(function() {
        service.setup();
        router.addRoute("", function() {
            var iso = 'en';
            page.findFile("en/opening.html", iso).done(function(page) {
                console.log (page);
                slider.slidePage(new HomeView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute(":iso/index", function(iso) {
            page.findFile(iso + "/opening.html", iso ).done(function(page,iso) {
                slider.slidePage(new HomeView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("index", function() {
            var iso = 'en';
            page.findFile("en/opening.html", iso).done(function(page,iso) {
                slider.slidePage(new HomeView(page).render().$el);
            });
            $(".right, .left").remove();
        });

        router.addRoute(":iso/bible", function(iso) {
            service.findAllBooks(iso).done(function(books) {
                var booksList = new BookListView(books).render().$el;
                slider.slidePage(booksList);

                // Cleaning up: remove old pages that were moved out of the viewport
                $(".right, .left").remove();
            });
        });
        router.addRoute("bible", function() {
            var iso = 'en';
            service.findAllBooks(iso).done(function(books) {
                var booksList = new BookListView(books).render().$el;
                slider.slidePage(booksList);

                // Cleaning up: remove old pages that were moved out of the viewport
                $(".right, .left").remove();
            });
        });
        router.addRoute(":iso/book/:id", function(iso,id) {
            if (!window.localStorage.bible){
                initializeBibleLocalStorage();
            }
            service.findBookById(iso, parseInt(id)).done(function(book) {
                var chart = service.chapterTable(book);
                var chaptersList = new ChapterListView(chart).render().$el;
                slider.slidePage(chaptersList);
            });
        });
        router.addRoute("book/:id", function(id) {
            var iso = 'en';
            service.findBookById(iso, parseInt(id)).done(function(book) {
                var chart = service.chapterTable(book);
                var chaptersList = new ChapterListView(chart).render().$el;
                slider.slidePage(chaptersList);
            });
        });
        router.addRoute(":iso/chapter/:id", function(iso, id) {
            service.findChapterById('chapter',iso, id).done(function(chapter) {
                var chapterContent = new ChapterView(chapter).render().$el;
                slider.slidePage(chapterContent);
            });
        });
        router.addRoute("chapter/:id", function(id) {
            var iso ='en';
            service.findChapterById('chapter',iso, id).done(function(chapter) {
                var chapterContent = new ChapterView(chapter).render().$el;
                slider.slidePage(chapterContent);
            });
        });
        router.addRoute(":iso/newcreation", function(iso) {
            localStorage.removeItem("ebookChapter");
            page.findFile(iso + "/basic.html", iso).done(function(page) {
                slider.slidePage(new EbookView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("newcreation", function() {
            var iso = 'en';
            localStorage.removeItem("ebookChapter");
            page.findFile(iso + "/basic.html", iso).done(function(page) {
                slider.slidePage(new EbookView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute(":iso/newchapter/:id", function(iso, id) {
            localStorage.setItem("ebookChapter", id);
            page.findFile("basic.html", iso).done(function(page) {
                slider.slidePage(new EbookView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("newchapter/:id", function(id) {
            var iso = 'en';
            localStorage.setItem("ebookChapter", id);
            page.findFile("basic.html", iso).done(function(page) {
                slider.slidePage(new EbookView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute(":iso/principles", function(iso) {
            page.findFile( iso + "/principles.html", iso).done(function(page) {
                slider.slidePage(new PageView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        router.addRoute("principles", function() {
            var iso = 'en';
            page.findFile( iso + "/principles.html", iso).done(function(page) {
                slider.slidePage(new PageView(page).render().$el);
            });
            $(".right, .left").remove();
        });
        
        router.start();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    const LATEST_VERSION = "2.18";
    
    $(window).on("hashchange", $.proxy(this.route, this));
    
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("./service-worker.js");
        });
        if (localStorage.newcreationVersion){
            var storedVersion = localStorage.getItem('newcreationVersion', null);
            if (storedVersion){
                if (storedVersion != LATEST_VERSION){
                    clearCachesAndLocalStorage();
                }
            }
        }
        localStorage.setItem('newcreationVersion', LATEST_VERSION);
    }

    //todo: check to see if item downloaded (Bible or Book)

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

    function clearCachesAndLocalStorage() {
        console.log("I want to clear ALL caches and Local Storage");
        window.localStorage.clear();
        localStorage.setItem('newcreationVersion', LATEST_VERSION);
        window.caches.keys().then(function (cacheNames) {
          cacheNames.forEach(function (cacheName) {
            window.caches
              .open(cacheName)
              .then(function (cache) {
                return cache.keys();
              })
              .then(function (requests) {
                requests.forEach(function (request) {
                  console.log(cacheName);
                  return caches.delete(cacheName);
                });
              });
          });
        });
        localStorage.setItem('newcreationVersion', LATEST_VERSION);
        location.reload();
      }
})();
