var EbookView = function(page) {
  this.initialize = function() {
    this.$el = $("<div/>");
    console.log (localStorage.getItem("currentSectionIndex", undefined));
    var params =
      URLSearchParams &&
      new URLSearchParams(document.location.search.substring(1));
    var url =
      params && params.get("url") && decodeURIComponent(params.get("url"));
    var currentSectionIndex =
      params && params.get("loc") ? params.get("loc") : undefined;

    // Load the opf
    var book = ePub(url || "files/epub3/NewCreation.epub");
    var rendition = book.renderTo("viewer", {
      width: "100%",
      height: "100%",
      spread: "always"
    });
    localStorage.setItem("currentSectionIndex", currentSectionIndex);
    rendition.display(currentSectionIndex);
    console.log (currentSectionIndex);

    book.ready.then(() => {
      var next = document.getElementById("next");

      next.addEventListener(
        "click",
        function(e) {
          book.package.metadata.direction === "rtl"
            ? rendition.prev()
            : rendition.next();
          e.preventDefault();
        },
        false
      );

      var prev = document.getElementById("prev");
      prev.addEventListener(
        "click",
        function(e) {
          book.package.metadata.direction === "rtl"
            ? rendition.next()
            : rendition.prev();
          e.preventDefault();
        },
        false
      );

      var keyListener = function(e) {
        // Left Key
        if ((e.keyCode || e.which) == 37) {
          book.package.metadata.direction === "rtl"
            ? rendition.next()
            : rendition.prev();
        }

        // Right Key
        if ((e.keyCode || e.which) == 39) {
          book.package.metadata.direction === "rtl"
            ? rendition.prev()
            : rendition.next();
        }
      };

      rendition.on("keyup", keyListener);
      document.addEventListener("keyup", keyListener, false);
    });

    var title = document.getElementById("title");

    rendition.on("rendered", function(section) {
      var current = book.navigation && book.navigation.get(section.href);

      if (current) {
        var $select = document.getElementById("toc");
        var $selected = $select.querySelector("option[selected]");
        if ($selected) {
          $selected.removeAttribute("selected");
        }

        var $options = $select.querySelectorAll("option");
        for (var i = 0; i < $options.length; ++i) {
          let selected = $options[i].getAttribute("ref") === current.href;
          if (selected) {
            $options[i].setAttribute("selected", "");
          }
        }
      }
    });

    rendition.on("relocated", function(location) {

      var next =
        book.package.metadata.direction === "rtl"
          ? document.getElementById("prev")
          : document.getElementById("next");
      var prev =
        book.package.metadata.direction === "rtl"
          ? document.getElementById("next")
          : document.getElementById("prev");

      if (location.atEnd) {
        next.style.visibility = "hidden";
      } else {
        next.style.visibility = "visible";
      }

      if (location.atStart) {
        prev.style.visibility = "hidden";
      } else {
        prev.style.visibility = "visible";
      }
    });

    rendition.on("layout", function(layout) {
      let viewer = document.getElementById("viewer");

      if (layout.spread) {
        viewer.classList.remove("single");
      } else {
        viewer.classList.add("single");
      }
    });

    window.addEventListener("unload", function() {
      console.log("unloading");
      this.book.destroy();
    });

    book.loaded.navigation.then(function(toc) {
      var $select = document.getElementById("toc"),
        docfrag = document.createDocumentFragment();

      toc.forEach(function(chapter) {
        var option = document.createElement("option");
        option.textContent = chapter.label;
        option.setAttribute("ref", chapter.href);

        docfrag.appendChild(option);
      });

      $select.appendChild(docfrag);

      $select.onchange = function() {
        var index = $select.selectedIndex,
          url = $select.options[index].getAttribute("ref");
        rendition.display(url);
        return false;
      };
    });
  };
  this.render = function() {
    //called on initial load and shows skeleton with <div id = "area"></div>
    var content = this.template(page);
    this.$el.html(content);
    return this;
  };
  this.initialize();
};

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
