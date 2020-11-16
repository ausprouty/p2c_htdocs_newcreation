var EbookView = function(page) {
  this.initialize = function() {
    this.$el = $("<div/>");
    var debugMode = localStorage.getItem("debugMode", "FALSE");
    //if (debugMode == "TRUE") {
    //  alert("I just initialized EbookView");
    //}
    // from https://github.com/futurepress/epub.js/tree/master/documentation
    //https://github.com/futurepress/epub.js/blob/master/documentation/README.md
    //Book = ePub("files/newcreation.epub", {spreads:false, restore:true}); //this works well.
    Book = ePub("files/newcreation/", {
      spreads: false,
      restore: true
    }); //this works well.
    // removed from https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks for swiping
  };
  this.render = function() {
    //called on initial load and shows skeleton with <div id = "area"></div>
    var content = this.template(page);
    this.$el.html(content);
    return this;
  };
  this.initialize();
};
function EbookNextPage() {
  var debugMode = localStorage.getItem("debugMode", "FALSE");
  if (debugMode != "TRUE") {
    Book.on("renderer:locationChanged", function(locationCfi) {
      // store last for return
      var last = localStorage.getItem("ebookLocation", "");
      localStorage.setItem("ebookLocationLast", last);
      localStorage.setItem("ebookLocation", locationCfi);
    });
    localStorage.removeItem("ebookIndex");

    Book.nextPage(); // goes to EPUBJS.Book.prototype.nextPage
  }
  if (debugMode == "TRUE") {
    //alert ('I am going to nextPage');
    Book.nextPage(); // goes to EPUBJS.Book.prototype.nextPage
  }
}
function EbookPrevPage() {
  var debugMode = localStorage.getItem("debugMode", "FALSE");
  if (debugMode == "TRUE") {
    alert("Starting EbookPrevPage");
  }
  Book.on("renderer:locationChanged", function(locationCfi) {
    localStorage.setItem("ebookLocation", locationCfi);
  });
  localStorage.removeItem("ebookIndex");
  Book.prevPage();
}
function EbookIndex() {
  localStorage.setItem("ebookIndex", "True");
  Book.goto("epubcfi(/6/4[toc]!/4/2/1:0)");
}

function EbookNote(note) {
  localStorage.setItem(
    "ebookLocationReturn",
    localStorage.getItem("ebookLocation", "")
  );
  location["href"] = window[note];
}

function EbookReturn() {
  var location = localStorage.getItem("ebookLocationReturn");
  var debugMode = localStorage.getItem("debugMode", "FALSE");
  if (debugMode == "TRUE") {
    alert(location + " in return");
  }
  Book.goto(location);
}
