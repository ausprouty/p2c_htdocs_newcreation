var BibleService = function() {
    this.initialize = function() {
        var deferred = $.Deferred();
        window.localStorage.setItem(
            "bible",
            JSON.stringify([
                {
                    bid: 1,
                    book_name: "Genesis",
                    number_of_chapters: 50,
                    testament: "OT"
                },
                {
                    bid: 2,
                    book_name: "Exodus",
                    number_of_chapters: 40,
                    testament: "OT"
                },
                {
                    bid: 3,
                    book_name: "Leviticus",
                    number_of_chapters: 27,
                    testament: "OT"
                },
                {
                    bid: 4,
                    book_name: "Numbers",
                    number_of_chapters: 36,
                    testament: "OT"
                },
                {
                    bid: 5,
                    book_name: "Deuteronomy",
                    number_of_chapters: 34,
                    testament: "OT"
                },
                {
                    bid: 6,
                    book_name: "Joshua",
                    number_of_chapters: 24,
                    testament: "OT"
                },
                {
                    bid: 7,
                    book_name: "Judges",
                    number_of_chapters: 21,
                    testament: "OT"
                },
                {
                    bid: 8,
                    book_name: "Ruth",
                    number_of_chapters: 4,
                    testament: "OT"
                },
                {
                    bid: 9,
                    book_name: "1 Samuel",
                    number_of_chapters: 31,
                    testament: "OT"
                },
                {
                    bid: 10,
                    book_name: "2 Samuel",
                    number_of_chapters: 24,
                    testament: "OT"
                },
                {
                    bid: 11,
                    book_name: "1 Kings",
                    number_of_chapters: 22,
                    testament: "OT"
                },
                {
                    bid: 12,
                    book_name: "2 Kings",
                    number_of_chapters: 25,
                    testament: "OT"
                },
                {
                    bid: 13,
                    book_name: "1 Chronicles",
                    number_of_chapters: 29,
                    testament: "OT"
                },
                {
                    bid: 14,
                    book_name: "2 Chronicles",
                    number_of_chapters: 36,
                    testament: "OT"
                },
                {
                    bid: 15,
                    book_name: "Ezra",
                    number_of_chapters: 10,
                    testament: "OT"
                },
                {
                    bid: 16,
                    book_name: "Nehemiah",
                    number_of_chapters: 13,
                    testament: "OT"
                },
                {
                    bid: 17,
                    book_name: "Esther",
                    number_of_chapters: 10,
                    testament: "OT"
                },
                {
                    bid: 18,
                    book_name: "Job",
                    number_of_chapters: 42,
                    testament: "OT"
                },
                {
                    bid: 19,
                    book_name: "Psalms",
                    number_of_chapters: 150,
                    testament: "OT"
                },
                {
                    bid: 20,
                    book_name: "Proverbs",
                    number_of_chapters: 31,
                    testament: "OT"
                },
                {
                    bid: 21,
                    book_name: "Ecclesiastes",
                    number_of_chapters: 12,
                    testament: "OT"
                },
                {
                    bid: 22,
                    book_name: "Song of Solomon",
                    number_of_chapters: 8,
                    testament: "OT"
                },
                {
                    bid: 23,
                    book_name: "Isaiah",
                    number_of_chapters: 66,
                    testament: "OT"
                },
                {
                    bid: 24,
                    book_name: "Jeremiah",
                    number_of_chapters: 52,
                    testament: "OT"
                },
                {
                    bid: 25,
                    book_name: "Lamentations",
                    number_of_chapters: 5,
                    testament: "OT"
                },
                {
                    bid: 26,
                    book_name: "Ezekiel",
                    number_of_chapters: 48,
                    testament: "OT"
                },
                {
                    bid: 27,
                    book_name: "Daniel",
                    number_of_chapters: 12,
                    testament: "OT"
                },
                {
                    bid: 28,
                    book_name: "Hosea",
                    number_of_chapters: 14,
                    testament: "OT"
                },
                {
                    bid: 29,
                    book_name: "Joel",
                    number_of_chapters: 3,
                    testament: "OT"
                },
                {
                    bid: 30,
                    book_name: "Amos",
                    number_of_chapters: 9,
                    testament: "OT"
                },
                {
                    bid: 31,
                    book_name: "Obadiah",
                    number_of_chapters: 1,
                    testament: "OT"
                },
                {
                    bid: 32,
                    book_name: "Jonah",
                    number_of_chapters: 4,
                    testament: "OT"
                },
                {
                    bid: 33,
                    book_name: "Micah",
                    number_of_chapters: 7,
                    testament: "OT"
                },
                {
                    bid: 34,
                    book_name: "Nahum",
                    number_of_chapters: 3,
                    testament: "OT"
                },
                {
                    bid: 35,
                    book_name: "Habakkuk",
                    number_of_chapters: 3,
                    testament: "OT"
                },
                {
                    bid: 36,
                    book_name: "Zephaniah",
                    number_of_chapters: 3,
                    testament: "OT"
                },
                {
                    bid: 37,
                    book_name: "Haggai",
                    number_of_chapters: 2,
                    testament: "OT"
                },
                {
                    bid: 38,
                    book_name: "Zechariah",
                    number_of_chapters: 14,
                    testament: "OT"
                },
                {
                    bid: 39,
                    book_name: "Malachi",
                    number_of_chapters: 4,
                    testament: "OT"
                },
                {
                    bid: 40,
                    book_name: "Matthew",
                    number_of_chapters: 28,
                    testament: "NT"
                },
                {
                    bid: 41,
                    book_name: "Mark",
                    number_of_chapters: 16,
                    testament: "NT"
                },
                {
                    bid: 42,
                    book_name: "Luke",
                    number_of_chapters: 24,
                    testament: "NT"
                },
                {
                    bid: 43,
                    book_name: "John",
                    number_of_chapters: 21,
                    testament: "NT"
                },
                {
                    bid: 44,
                    book_name: "Acts",
                    number_of_chapters: 28,
                    testament: "NT"
                },
                {
                    bid: 45,
                    book_name: "Romans",
                    number_of_chapters: 16,
                    testament: "NT"
                },
                {
                    bid: 46,
                    book_name: "1 Corinthians",
                    number_of_chapters: 16,
                    testament: "NT"
                },
                {
                    bid: 47,
                    book_name: "2 Corinthians",
                    number_of_chapters: 13,
                    testament: "NT"
                },
                {
                    bid: 48,
                    book_name: "Galatians",
                    number_of_chapters: 6,
                    testament: "NT"
                },
                {
                    bid: 49,
                    book_name: "Ephesians",
                    number_of_chapters: 6,
                    testament: "NT"
                },
                {
                    bid: 50,
                    book_name: "Philippians",
                    number_of_chapters: 4,
                    testament: "NT"
                },
                {
                    bid: 51,
                    book_name: "Colossians",
                    number_of_chapters: 4,
                    testament: "NT"
                },
                {
                    bid: 52,
                    book_name: "1 Thessalonians",
                    number_of_chapters: 5,
                    testament: "NT"
                },
                {
                    bid: 53,
                    book_name: "2 Thessalonians",
                    number_of_chapters: 3,
                    testament: "NT"
                },
                {
                    bid: 54,
                    book_name: "1 Timothy",
                    number_of_chapters: 6,
                    testament: "NT"
                },
                {
                    bid: 55,
                    book_name: "2 Timothy",
                    number_of_chapters: 4,
                    testament: "NT"
                },
                {
                    bid: 56,
                    book_name: "Titus",
                    number_of_chapters: 3,
                    testament: "NT"
                },
                {
                    bid: 57,
                    book_name: "Philemon",
                    number_of_chapters: 1,
                    testament: "NT"
                },
                {
                    bid: 58,
                    book_name: "Hebrews",
                    number_of_chapters: 13,
                    testament: "NT"
                },
                {
                    bid: 59,
                    book_name: "James",
                    number_of_chapters: 5,
                    testament: "NT"
                },
                {
                    bid: 60,
                    book_name: "1 Peter",
                    number_of_chapters: 5,
                    testament: "NT"
                },
                {
                    bid: 61,
                    book_name: "2 Peter",
                    number_of_chapters: 3,
                    testament: "NT"
                },
                {
                    bid: 62,
                    book_name: "1 John",
                    number_of_chapters: 5,
                    testament: "NT"
                },
                {
                    bid: 63,
                    book_name: "2 John",
                    number_of_chapters: 1,
                    testament: "NT"
                },
                {
                    bid: 64,
                    book_name: "3 John",
                    number_of_chapters: 1,
                    testament: "NT"
                },
                {
                    bid: 65,
                    book_name: "Jude",
                    number_of_chapters: 1,
                    testament: "NT"
                },
                {
                    bid: 66,
                    book_name: "Revelation",
                    number_of_chapters: 22,
                    testament: "NT"
                }
            ])
        );
        deferred.resolve();
        return deferred.promise();
    };
    this.setup = function() {
        if (!window.localStorage.getItem("newcreationVersion")) {
            window.localStorage.clear();
            window.localStorage.setItem("newcreationVersion", "1.01");
        }
        this.findChapterById("book1--chapter1.txt");
    };
    this.findBookById = function(id) {
        var deferred = $.Deferred(),
            bibles = JSON.parse(window.localStorage.getItem("bible"));
        (book = null), (chapters = null);
        l = bibles.length;
        for (var i = 0; i < l; i++) {
            if (bibles[i].bid === id) {
                book = bibles[i];
                break;
            }
        }
        deferred.resolve(book);
        return deferred.promise();
    };
    this.chapterTable = function(book) {
        var chap = book.number_of_chapters;
        var row = "";
        var table =
            '<div class = "bible_background"> <h1 class = "bible_book_heading" align = "center">' +
            book.book_name +
            '</h1><p class ="bible_select_chapters" align = "center" >Select Chapter<p><table class = "bible_chapters"><tr>';
        var chapter = "";
        for (var i = 1; i <= chap; i++) {
            chapter = "book" + book.bid + "--chapter" + i + ".txt";
            row =
                table +
                '<td class = "bible_chapter"><a class = "bible_link" href = "#chapter/' +
                chapter +
                '">' +
                i +
                "</a></td>";
            table = row;
            if (i % 5 == 0) {
                row = table + "</tr><tr>";
                table = row;
            }
        }
        if (i % 5 != 0) {
            while (i % 5 != 0) {
                row = table + "<td></td>";
                table = row;
                i++;
            }
            row = table + "</tr><tr>";
            table = row;
        }
        row = table.substring(0, table.length - 5) + "</table>";
        table = row + "</div>";
        return table;
    };

    this.findBookByName = function(searchKey) {
		if (!window.localStorage.getItem("bible")){
			this.initialize();
		}
        var deferred = $.Deferred(),
            lessons = JSON.parse(window.localStorage.getItem("bible")),
            results = lessons.filter(function(element) {
                var name = element.name;
                return name.toLowerCase().indexOf(searchKey.toLowerCase()) == 0;
            });
        results.sort(SortByName);
        deferred.resolve(results);
        return deferred.promise();
    };
    this.findAllBooks = function() {
		// make sure we have something we can work with.
        if (!window.localStorage.getItem("bible")){
            this.initialize();
        }
        var deferred = $.Deferred(),
            results = JSON.parse(window.localStorage.getItem("bible"));
        deferred.resolve(results);
        return deferred.promise();
    };
    this.findChapterById = function(id) {
        var deferred = $.Deferred();

        if (!GetBibleChapterFromStorage("bible_" + id)) {
            // Do I need to get entire Bible or only this book?
           if (
                window.localStorage.getItem("bible_books_downloaded") === null
            ) {
                var book_name = "all";
               console.log("I am going to get all book");
                window.localStorage.setItem("bible_books_downloaded", "all");
            } else {
                var book_name = id.split("--")[0];
            }
			var url = window.location.href;
			console.log('url is ' + url);
			var i = url.indexOf('#');
			var website = url.substring(0,i) + 'bible/';
			console.log('website is ' + website);
			console.log(website + book_name);
            JSZipUtils.getBinaryContent(
                website + book_name,
                function(err, data) {
                    if (err) {
                        chapter = "There was an error attempting to download " + book_name;
                        deferred.resolve(chapter);
                    }

                    JSZip.loadAsync(data).then(function(zip) {
                        Object.keys(zip.files).forEach(function(file_name) {
                            zip.file(file_name)
                                .async("text")
                                .then(function(file_content) {
                                    compressed = SetBibleChapterToStorage(
                                        "bible_" + file_name,
                                        file_content
                                    );
									var uncompressed = LZString.decompress(compressed);
                                    deferred.resolve(uncompressed);
                                });
                        });
                    });
                }
            );
        } else {
            chapter = GetBibleChapterFromStorage("bible_" + id);
            deferred.resolve(chapter);
        }
        return deferred.promise();
    };
};

function SetBibleChapterToStorage(bible_id, blob) {
    // need to compress more so use
    // https://pieroxy.net/blog/pages/lz-string/index.html
    var compressed = LZString.compress(blob);
    localStorage[bible_id] = compressed;
    return localStorage[bible_id];
}

function GetBibleChapterFromStorage(bible_id) {
    if (localStorage.getItem(bible_id)) {
        var compressed = localStorage.getItem(bible_id);
		var uncompressed = LZString.decompress(compressed);
        return uncompressed;
    } else return false;
}

function ToggleBibleNote(note){
	var toggle = document.getElementById('toggle_' + note).innerHTML;
	var x = document.getElementById(note);
	if (x.className == 'note_hidden') {
		console.log ('set note_hidden');
		x.className = "note_visible";
		var message = toggle.replace("See", "Hide");
		document.getElementById('toggle_' + note).innerHTML = message;

	} else {
		x.className = "note_hidden";
		var message = toggle.replace("Hide", "See");
		
		document.getElementById('toggle_' + note).innerHTML = message;
	}
}
function BibleNoteShow(note){
	document.getElementById(note).className = "note_visible";
	document.getElementById('see_' + note).className = "note_hidden";
}
function BibleNoteHide(note){
	document.getElementById(note).className = "note_hidden";
	document.getElementById('see_' + note).className = "note_toggle";
	
}


function SortByName(a, b) {
    var aName = a.title.toLowerCase();
    var bName = b.title.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
}

function SortByNumber(a, b) {
    var aName = a.id;
    var bName = b.id;
    return aName < bName ? -1 : aName > bName ? 1 : 0;
}
function GetNotes(id) {
    if (localStorage.notes) {
        var notes = JSON.parse(localStorage.notes);
    } else {
        var notes = [];
    }
    return notes[id];
}
