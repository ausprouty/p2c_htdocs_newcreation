const STANDARD_DELAY = 1000;


var BibleService = function() {
    this.initialize =  function() {
        var deferred = $.Deferred();
        initializeBibleLocalStorage();
        deferred.resolve();
        return deferred.promise();
    };
    this.setup = function() {
        console.log ('setup');
    };
    this.findBookById =  function(iso, id) {
        var deferred = $.Deferred();
        if (typeof iso === 'undefined'){
            iso = 'en';
        }
        var bibles = '';
        if (!window.localStorage.bible){
            initializeBibleLocalStorage();
        }
        bibles = JSON.parse(window.localStorage.getItem("bible")); 
     
         var   select_chapter = getTerm(iso, 'select_chapter');
        (book = null), (chapters = null);
        l = bibles.length;
        for (var i = 0; i < l; i++) {
            if (bibles[i].bid === id) {
                book = bibles[i];
                book ['book_name_selected'] = bibles[i]['book_name_' + iso];
                book['select_chapter'] = select_chapter;
                book['iso']= iso;
                break;
            }
        }
        deferred.resolve(book);
        return deferred.promise();
    };
    this.chapterDivs = function(book) {
        var result = {};
        result.iso = book.iso;
        result.bid = book.bid;
        result.chapters = book.number_of_chapters;
        result.book_name = book.book_name_selected;
        result.file_name = book.iso + '--book' + book.bid;
        result.dir = setDirection(book.iso);
        var chap = book.number_of_chapters;
        var link_start = '<a class = "bible_link" href = "#' + book.iso +'/chapter/' +  book.iso + '--book' + book.bid ;
        var links = []
        for (var i = 1; i <= chap; i++) {
            link =  link_start + '--chapter' + i + '.txt">';
            links.push(link + i + '</a>');
        }
        result.links = links;
        console.log (result);
        return result;
    };
    this.chapterTable = function(book) {
        var result = {};
        result.iso = book.iso;
        result.bid = book.bid;
        result.chapters = book.number_of_chapters;
        result.book_name = book.book_name_selected;
        result.file_name = book.iso + '--book' + book.bid;
        result.dir = setDirection(book.iso);
        var chap = book.number_of_chapters;
        var row = "";
        var table =
            '<div class = "bible_background ' + result.dir + '" dir="' +  result.dir +'" > <h1 class = "bible_book_heading" align = "center">' +
            book.book_name_selected +
            '</h1><p class ="bible_select_chapters" align = "center" >'+ book.select_chapter + '</p>'  +
            '<table class = "bible_chapters '   + result.dir + '"><tr>';
        var chapter = "";
        for (var i = 1; i <= chap; i++) {
            link = '#' + book.iso +'/chapter/' +  book.iso + "--book" + book.bid + "--chapter" + i + ".txt";
            row =
                table +
                '<td class = "bible_chapter"><a class = "bible_link" href = "' +
                link +
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
        row = table.substring(0, table.length - 4) + "</table>";
        table = row + "</div>";
        result.table = table;
        return result;
    };

    this.findBookByName = function(searchKey) {
		if (!window.localStorage.getItem("bible")){
			this.initialize();
		}
        var deferred = $.Deferred(),
            lessons = JSON.parse(window.localStorage.getItem("bible")),
            results = lessons.filter(function(element) {
                var name = element.book_name_en;
                return name.toLowerCase().indexOf(searchKey.toLowerCase()) == 0;
            });
        results.sort(SortByName);
        deferred.resolve(results);
        return deferred.promise();
    };
    this.findAllBooks = function(iso = 'en') {
		// make sure we have something we can work with.
        if (!window.localStorage.bible){
             initializeBibleLocalStorage();
        }
        if (typeof iso == 'undefined'){
            iso = 'en';
        }
        var deferred = $.Deferred();
        var books = JSON.parse(window.localStorage.getItem("bible"));
        var len = books.length;
        for (var i=0; i< len;  i++){
            books[i]['book_name_selected'] = books[i][ 'book_name_' + iso];
            books[i]['link'] = '#' + iso +'/book/' + books[i]['bid'];
        }
        var result = {};
        result.books = books;
        result.dir = setDirection(iso);
        result.iso = iso
        result.title =getTerm(iso, 'select_book');
    
        deferred.resolve(result);
        return deferred.promise();
    };
    this.findChapterById = function(scope, iso = 'en', id, number_of_files =1) {
        var deferred = $.Deferred();
        var chapter = {}
        var bible_book = null;
        // need to cut langauge off of id to get page
        chapter.page = id.substring(4);
        chapter.dir = setDirection(iso);
        chapter.iso = iso;
        chapter.id = id;
        console.log ('I am looking for ' + id);
        if (!GetBibleChapterFromStorage(id)) {
            console.log ('I did not find  ' + id + ' in local storage');
            var downloading = getTerm(iso,'downloading');
            var downloading_chapter = getTerm(iso,'downloading_chapter');
            var finished_download = getTerm(iso, 'finished_download');
            // setup progress meter from https://www.w3schools.com/howto/howto_js_progressbar.asp
            var elem = null;
            var clean_url = download_clean_url();
            if (scope == 'book'){
                bible_book = id;
                file_name = id + '.zip';
                url =clean_url + 'bible/book/' + file_name;
                elem = document.getElementById("download-book");
            }
            else{
                file_name = id;
                number_of_files = 1;
                url = clean_url + 'bible/chapter/' + file_name;
            }
            if (elem !== null){
                elem.innerHTML = downloading;
                var width = 1;
            }
            console.log('url is ' + url);
             // see also https://stuk.github.io/jszip/documentation/howto/read_zip.html
            JSZipUtils.getBinaryContent(
                url ,
                function(err, data) {
                    if (err) {
                        chapter.text = "There was an error attempting to download " + file_name;
                        deferred.resolve(chapter);
                    }
                    // uncompress data and store in local storage, but use LZString to compress each chapter as much as possible
                    JSZip.loadAsync(data)
                    .then(function(zip) {
                        var count = 1;
                        Object.keys(zip.files).forEach(function(file_name) {
                            zip.file(file_name)
                                .async("text")
                                .then(function(file_content) {
                                    compressed = SetBibleChapterToStorage(
                                        file_name,
                                        file_content
                                    );
                                    if (elem !== null){
                                        width = count / number_of_files * 100;
                                        elem.style.width = width + "%"
                                    }
                                    if (elem !== null){
                                        elem.innerHTML = downloading_chapter + ' ' + count;
                                    }
                                    // this will resolve for chapter
									if (file_name == id){
                                        chapter.text = file_content; 
                                    }
                                    if (count == number_of_files){
                                        updateReferenceToStoredBibleFiles(bible_book);
                                        console.log ('I am letting you know I finished with ' + bible_book );
                                        if (elem !== null){
                                            elem.innerHTML = finished_download;
                                        }
                                        if (document.getElementById("book-downloaded")){
                                            var downloaded = document.getElementById("book-downloaded");
                                            downloaded.classList.remove("hide");
                                            downloaded.classList.add("show");
                                        }
                                        deferred.resolve(chapter);
                                    }
                                    count++;
                                    // how resolve for book?
                                });
                        });
                       
                    })
                }
            );
        } else {
            console.log ('I have ' + id + ' in local storage');
            chapter.text = GetBibleChapterFromStorage(id);
            console.log (chapter);
            deferred.resolve(chapter);
        }
        return deferred.promise();
    };
    
};
function clean_url(){
    var url = window.location.href;
    var website = url;
    var i = url.indexOf('#');
    if (i != -1){
        website = url.substring(0,i);
    }
    return website;

}





function setDirection(iso = 'en'){
	const ltr = ['en', 'bn','id'];
    var dir = 'rtl';
    if (ltr.includes(iso)){
        dir = 'ltr';
    }
    return dir;
}

function SetBibleChapterToStorage(bible_id, blob) {
    // need to compress more so use
    // https://pieroxy.net/blog/pages/lz-string/index.html
    var compressed = LZString.compress(blob);
    localStorage[bible_id] = compressed;
    return localStorage[bible_id];
}

function GetBibleChapterFromStorage(id) {
    if (localStorage.getItem(id)) {
        var compressed = localStorage.getItem(id);
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
function getBibleData(){
    if (localStorage.bible) {
        return JSON.parse(localStorage.bible);
    } else {
        var Bible = new BibleService;
        return JSON.parse(localStorage.bible);
    }
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

function getTerm(iso = 'en', key){
    if (!window.localStorage.translation){
        initializeBibleLocalStorage();
    }
    var terms = JSON.parse(window.localStorage.getItem("translation", null));
    for (var i = 0; i< terms.length; i++){
        if (terms[i]['iso'] == iso){
            return terms[i][key];
        }
    }
    // if language is wrong; try english
    if (iso != 'en'){
        for (var i = 0; i< terms.length; i++){
            if (terms[i]['iso'] == 'en'){
                return terms[i][key];
            }
        }
    }
    return null;
}
function initializeBibleLocalStorage(){
    window.localStorage.setItem(
        "translation",
        JSON.stringify(  [
        {   "iso": "ar",
            "available_offline": "متاح للاستخدام دون اتصال",
            "bible": "الكتاب المقدس",
            "bible_downloaded": "تحميل الكتاب المقدس",
            "bible_ready": "الكتاب المقدس جاهز للاستخدام في وضع عدم الاتصال",
            "book_ready": "% جاهز للاستخدام في وضع عدم الاتصال",
            "download_bible": "تحميل الكتاب المقدس للاستخدام دون اتصال",
            "download_book": "تحميل % للاستخدام دون اتصال.",
            "downloading": "جارى التحميل",
            "downloading_chapter": "تحميل الفصل ",
            "link_to_app": "هذا هو الرابط لتطبيق New Creations:",
            "finished_download": "انتهى التنزيل",
            "remove_item": "إزالة%  من التخزين المحلي",
            "resume": "استئنف % ",
            "select_book": "حدد الكتاب",
            "select_chapter": "حدد الفصل"
        },
        {   "iso": "bn",
            "available_offline": "অফলাইনে ব্যবহারের জন্য উপলব্ধ",
            "bible": "বাইবেল",
            "bible_downloaded": "বাইবেল ডাউনলোড করা হয়েছে",
            "bible_ready": "বাইবেল ডাউনলোড করা হয়েছে",
            "book_ready": "অফলাইন ব্যবহারের জন্য % প্রস্তুত",
            "download_bible": "অফলাইনে ব্যবহারের জন্য বাইবেল ডাউনলোড করুন",
            "download_book": "অফলাইন ব্যবহারের জন্য % ডাউনলোড করুন।",
            "downloading": "ডাউনলোড হচ্ছে",
            "downloading_chapter": "অধ্যায় ডাউনলোড করা হচ্ছে",
            "link_to_app": "এখানে নতুন ক্রিয়েশন অ্যাপের লিঙ্ক দেওয়া হল:",
            "finished_download": "ডাউনলোড শেষ",
            "remove_item": "স্থানীয় স্টোরেজ থেকে % সরান",
            "resume": "স্থানীয় স্টোরেজ থেকে % সরান",
            "select_book": "বই নির্বাচন করুন",
            "select_chapter": "অধ্যায় নির্বাচন করুন"
        },
        {   "iso": "en",
            "available_offline": "Available for offline use",
            "bible": "Bible",
            "bible_downloaded": "Bible downloaded",
            "bible_ready": "Bible ready for offline use",
            "book_ready": "% ready for offline use",
            "download_bible": "Download Bible for offline use",
            "download_book": "Download % for offline use.",
            "downloading": "Downloading",
            "downloading_chapter": "Downloading Chapter ",
            "link_to_app": "Here is the link to the New Creations App:",
            "finished_download": "Finished downloading",
            "remove_item": "Remove % from local storage",
            "resume": "Resume %",
            "select_book": "Select Book",
            "select_chapter": "Select Chapter"
        },
        {   "iso": "fa",
            "available_offline": "برای استفاده آفلاین موجود است",
            "bible": "کتاب مقدس",
            "bible_downloaded": "کتاب مقدس بارگیری شد",
            "bible_ready": "کتاب مقدس آماده استفاده آفلاین است",
            "book_ready": "% برای استفاده آفلاین آماده است",
            "download_bible": "کتاب مقدس را برای استفاده آفلاین بارگیری کنید",
            "download_book": "% را برای استفاده آفلاین بارگیری کنید.",
            "downloading": "در حال بارگیری",
            "downloading_chapter": "باب ڈاؤن لوڈ کرنا ",
            "link_to_app": "در اینجا پیوند به برنامه New Creations وجود دارد:",
            "finished_download": "بارگیری به پایان رسید",
            "remove_item": "% را از حافظه محلی حذف کنید",
            "resume": "از سرگیری %",
            "select_book": "کتاب را انتخاب کنید",
            "select_chapter": "فصل را انتخاب کنید"
        },
        {   "iso": "id",
            "available_offline": "Tersedia untuk penggunaan offline",
            "bible": "Alkitab",
            "bible_downloaded": "Alkitab diunduh",
            "bible_ready": "Alkitab siap untuk penggunaan offline",
            "book_ready": "% siap untuk penggunaan offline",
            "download_bible": "Unduh Alkitab untuk penggunaan offline",
            "download_book": "Unduh % untuk penggunaan offline.",
            "downloading": "Mengunduh",
            "downloading_chapter": "Mengunduh Bab",
            "link_to_app": "Berikut ini tautan ke Aplikasi Kreasi Baru:",
            "finished_download": "Selesai mengunduh",
            "remove_item": "Hapus % dari penyimpanan lokal",
            "resume": "Melanjutkan %",
            "select_book": "Pilih Buku",
            "select_chapter": "Pilih Bab"
        },
        {   "iso": "ps",
            "available_offline": "د آفلاین کارونې لپاره شتون لري",
            "bible": "بائبل",
            "bible_downloaded": "انجیل ډاونلوډ شوی",
            "bible_ready": "انجیل د آفلاین کارونې لپاره چمتو دی",
            "book_ready": "offline د آفلاین کارونې لپاره چمتو دی",
            "download_bible": "د آفلاین کارونې لپاره انجیل ډاونلوډ کړئ",
            "download_book": "د آفلاین کارونې لپاره Download ډاونلوډ کړئ.",
            "downloading": "کښته کول",
            "downloading_chapter": "د فصل کښته کول",
            "link_to_app": "د فصل کښته کول",
            "finished_download": "ډاونلوډ بشپړ شو",
            "remove_item": "local له محلي ذخیره څخه لرې کړئ",
            "resume": "بیا پیل کول ٪",
            "select_book": "کتاب غوره کړئ",
            "select_chapter": "څپرکی غوره کړئ"
        },
        {   "iso": "ur",
            "available_offline": "آف لائن استعمال کے لئے دستیاب ہے",
            "bible": "بائبل",
            "bible_downloaded": "بائبل ڈاؤن لوڈ کی گئی",
            "bible_ready": "بائبل آف لائن استعمال کے لئے تیار ہے",
            "book_ready": "% آف لائن استعمال کے لئے تیار ہے",
            "download_bible": "آف لائن استعمال کے لئے بائبل ڈاؤن لوڈ کریں",
            "download_book": "آف لائن استعمال کے لئے% ڈاؤن لوڈ کریں۔",
            "downloading": "ڈاؤن لوڈ ہو رہا ہے",
            "downloading_chapter": "باب ڈاؤن لوڈ کرنا ",
            "link_to_app": "نئی تخلیقات ایپ کا لنک یہ ہے:",
            "finished_download": "ڈاؤن لوڈ مکمل ہوگیا",
            "remove_item": "مقامی اسٹوریج سے% ہٹا دیں",
            "resume": "دوبارہ شروع کریں%",
            "select_book": "کتاب منتخب کریں",
            "select_chapter": "باب منتخب کریں"
        }])
    );
    window.localStorage.setItem(
        "bible",
        JSON.stringify(
        [{
			"bid": 1,
			"book_name_en": "Genesis",
			"number_of_chapters": 50,
			"testament": "OT",
			"book_name_ar": " \u0627\u0644\u062a\u0643\u0648\u064a\u0646",
			"book_name_bn": "\u0986\u09a6\u09bf\u09aa\u09c1\u09b8\u09cd\u09a4\u0995",
			"book_name_fa": "\u067e\u062f\u0627\u06cc\u0634",
			"book_name_id": "Kejadian",
			"book_name_ps": "\u062f \u067e\u064a\u062f\u0627\u064a\u069a\u062a \u06a9\u062a\u0627\u0628",
			"book_name_ur": " \u067e\u06cc\u064e\u062f\u0627\u06cc\u0634 "
		}, {
			"bid": 2,
			"book_name_en": "Exodus",
			"number_of_chapters": 40,
			"testament": "OT",
			"book_name_ar": " \u0644\u062e\u0631\u0648\u062c",
			"book_name_bn": "\u09af\u09be\u09a4\u09cd\u09b0\u09be\u09aa\u09c1\u09b8\u09cd\u09a4\u0995",
			"book_name_fa": "\u062e\u0631\u0648\u062c",
			"book_name_id": "Keluaran",
			"book_name_ps": "\u062f \u0647\u062c\u0631\u062a \u06a9\u062a\u0627\u0628",
			"book_name_ur": " \u062e\u064f\u0631\u0648\u062c"
		}, {
			"bid": 3,
			"book_name_en": "Leviticus",
			"number_of_chapters": 27,
			"testament": "OT",
			"book_name_ar": " \u0627\u0644\u0644\u0627\u0648\u064a\u064a\u0646",
			"book_name_bn": "\u09b2\u09c7\u09ac\u09c0\u09af\u09bc \u09aa\u09c1\u09b8\u09cd\u09a4\u0995",
			"book_name_fa": "\u0644\u0627\u0648\u06cc\u0627\u0646",
			"book_name_id": "Imamat",
			"book_name_ps": "\u062f \u0644\u0627\u0648\u064a\u0627\u0646\u0648 \u06a9\u062a\u0627\u0628",
			"book_name_ur": " \u0627\u062d\u0628\u0627\u0631"
		}, {
			"bid": 4,
			"book_name_en": "Numbers",
			"number_of_chapters": 36,
			"testament": "OT",
			"book_name_ar": "\u0627\u0644\u0639\u062f\u062f",
			"book_name_bn": "\u0997\u09a3\u09a8\u09be \u09aa\u09c1\u09b8\u09cd\u09a4\u0995",
			"book_name_fa": "\u0627\u0639\u062f\u0627\u062f",
			"book_name_id": "Bilangan",
			"book_name_ps": "\u062f \u0634\u0645\u06d0\u0631 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u06af\u0646\u062a\u06cc"
		}, {
			"bid": 5,
			"book_name_en": "Deuteronomy",
			"number_of_chapters": 34,
			"testament": "OT",
			"book_name_ar": "\u0627\u0644\u062a\u062b\u0646\u064a\u0629",
			"book_name_bn": "\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc \u09ac\u09bf\u09ac\u09b0\u09a3",
			"book_name_fa": "\u062a\u0634\u0646\u06cc\u0647",
			"book_name_id": "Ulangan",
			"book_name_ps": "\u062f \u062a\u062b\u0646\u064a\u06d0 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0627\u0633\u062a\u062b\u0646\u0627"
		}, {
			"bid": 6,
			"book_name_en": "Joshua",
			"number_of_chapters": 24,
			"testament": "OT",
			"book_name_ar": "\u064a\u0634\u0648\u0639",
			"book_name_bn": "\u09af\u09cb\u09b6\u09c1\u09af\u09bc\u09be",
			"book_name_fa": "\u06cc\u0648\u0634\u0639",
			"book_name_id": "Yosua",
			"book_name_ps": "\u062f \u064a\u0648\u0634\u0639 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u06cc\u0634\u0648\u0614\u0639"
		}, {
			"bid": 7,
			"book_name_en": "Judges",
			"number_of_chapters": 21,
			"testament": "OT",
			"book_name_ar": "\u0627\u0644\u0642\u0636\u0627\u0629",
			"book_name_bn": "\u09ac\u09bf\u099a\u09be\u09b0\u0995\u099a\u09b0\u09bf\u09a4",
			"book_name_fa": "\u062f\u0627\u0648\u0631\u0627\u0646",
			"book_name_id": "Hakim-hakim",
			"book_name_ps": "\u062f \u0642\u0627\u0636\u064a\u0627\u0646 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0642\u0636\u0627\u0629"
		}, {
			"bid": 8,
			"book_name_en": "Ruth",
			"number_of_chapters": 4,
			"testament": "OT",
			"book_name_ar": "\u0631\u0627\u0639\u0648\u062b",
			"book_name_bn": "\u09b0\u09c1\u09a5",
			"book_name_fa": "\u0631\u0648\u062a",
			"book_name_id": "Rut",
			"book_name_ps": "\u062f \u0631\u0648\u062a \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0631\u064f\u0648\u062a"
		}, {
			"bid": 9,
			"book_name_en": "1 Samuel",
			"number_of_chapters": 31,
			"testament": "OT",
			"book_name_ar": "1 \u0635\u0645\u0648\u0626\u064a\u0644 \u0627\u0644\u0623\u0648\u0644",
			"book_name_bn": "\u09b8\u09be\u09ae\u09c1\u09af\u09bc\u09c7\u09b2 \u09e7",
			"book_name_fa": "\u0627\u0648\u0644 \u0633\u0645\u0648\u06cc\u06cc\u0644",
			"book_name_id": "1Samuel",
			"book_name_ps": "\u062f \u0627\u0648\u0644 \u0633\u0645\u0648\u0626\u064a\u0644 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0633\u0645\u0648\u0626\u06cc\u0644 \u06f1"
		}, {
			"bid": 10,
			"book_name_en": "2 Samuel",
			"number_of_chapters": 24,
			"testament": "OT",
			"book_name_ar": "2 \u0635\u0645\u0648\u0626\u064a\u0644 \u0627\u0644\u062b\u0627\u0646\u064a",
			"book_name_bn": "\u09b8\u09be\u09ae\u09c1\u09af\u09bc\u09c7\u09b2 \u09e8",
			"book_name_fa": "\u062f\u0648\u0645 \u0633\u0645\u0648\u06cc\u06cc\u0644",
			"book_name_id": "2Samuel",
			"book_name_ps": "\u062f \u062f\u0648\u0647\u0645 \u0633\u0645\u0648\u0626\u064a\u0644 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0633\u0645\u0648\u0626\u06cc\u0644 \u06f2"
		}, {
			"bid": 11,
			"book_name_en": "1 Kings",
			"number_of_chapters": 22,
			"testament": "OT",
			"book_name_ar": "1 \u0627\u0644\u0645\u0644\u0648\u0643 \u0627\u0644\u0623\u0648\u0644",
			"book_name_bn": "\u09b0\u09be\u099c\u09be\u09ac\u09b2\u09bf \u09e7",
			"book_name_fa": "\u0627\u0648\u0644 \u067e\u0627\u062f\u0634\u0627\u0647\u0627\u0646",
			"book_name_id": "1Raja-raja",
			"book_name_ps": "\u062f \u0627\u0648\u0644 \u067e\u0627\u062f\u0634\u0627\u0647\u0627\u0646 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0633\u0644\u0627\u0637\u0650\u06cc\u0646 \u06f1"
		}, {
			"bid": 12,
			"book_name_en": "2 Kings",
			"number_of_chapters": 25,
			"testament": "OT",
			"book_name_ar": "2 \u0644\u0645\u0644\u0648\u0643 \u0627\u0644\u062b\u0627\u0646\u064a",
			"book_name_bn": "\u09b0\u09be\u099c\u09be\u09ac\u09b2\u09bf \u09e8",
			"book_name_fa": "\u062f\u0648\u0645  \u067e\u0627\u062f\u0634\u0627\u0647\u0627\u0646",
			"book_name_id": "2Raja-raja",
			"book_name_ps": "\u062f \u067e\u0627\u0686\u0627\u0647\u0627\u0646\u0648 \u062f\u0648\u06cc\u0645 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0633\u0644\u0627\u0637\u06cc\u0646 \u06f2"
		}, {
			"bid": 13,
			"book_name_en": "1 Chronicles",
			"number_of_chapters": 29,
			"testament": "OT",
			"book_name_ar": "1 \u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u0623\u064a\u0627\u0645 \u0627\u0644\u0623\u0648\u0644",
			"book_name_bn": "\u09ac\u0982\u09b6\u09be\u09ac\u09b2\u09bf \u09e7",
			"book_name_fa": "\u0627\u0648\u0644 \u062a\u0648\u0627\u0631\u06cc\u062e",
			"book_name_id": "1Tawarikh",
			"book_name_ps": "\u062f \u062a\u0648\u0627\u0631\u064a\u062e \u0627\u0648\u0644 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u06d4\u062a\u0648\u0627\u0631\u06cc\u062e \u06f1"
		}, {
			"bid": 14,
			"book_name_en": "2 Chronicles",
			"number_of_chapters": 36,
			"testament": "OT",
			"book_name_ar": "2  \u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u0623\u064a\u0627\u0645 \u0627\u0644\u062b\u0627\u0646\u064a",
			"book_name_bn": "\u09ac\u0982\u09b6\u09be\u09ac\u09b2\u09bf \u09e8",
			"book_name_fa": "\u062f\u0648\u0645 \u062a\u0648\u0627\u0631\u06cc\u062e",
			"book_name_id": "2Tawarikh",
			"book_name_ps": "\u062f \u062a\u0648\u0627\u0631\u064a\u062e \u062f\u0648\u06d0\u0645 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u06d4\u062a\u0648\u0627\u0631\u0650\u06cc\u062e 2"
		}, {
			"bid": 15,
			"book_name_en": "Ezra",
			"number_of_chapters": 10,
			"testament": "OT",
			"book_name_ar": "\u0639\u0632\u0631\u0627",
			"book_name_bn": "\u098f\u099c\u09b0\u09be",
			"book_name_fa": "\u0639\u0632\u0631\u0627",
			"book_name_id": "Ezra",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0639\u0632\u0631\u0627 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0639\u0632\u0631\u0627"
		}, {
			"bid": 16,
			"book_name_en": "Nehemiah",
			"number_of_chapters": 13,
			"testament": "OT",
			"book_name_ar": "\u0646\u062d\u0645\u064a\u0627",
			"book_name_bn": "\u09a8\u09c7\u09b9\u09c7\u09ae\u09bf\u09af\u09bc\u09be",
			"book_name_fa": "\u0646\u062d\u0645\u06cc\u0627",
			"book_name_id": "Nehemia",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0646\u062d\u0645\u064a\u0627\u0647 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0646\u062d\u0645\u06cc\u0627\u06c1"
		}, {
			"bid": 17,
			"book_name_en": "Esther",
			"number_of_chapters": 10,
			"testament": "OT",
			"book_name_ar": "\u0623\u0633\u062a\u064a\u0631",
			"book_name_bn": "\u098f\u09b8\u09cd\u09a5\u09be\u09b0",
			"book_name_fa": "\u0627\u0633\u062a\u0631",
			"book_name_id": "Ester",
			"book_name_ps": "\u062f \u0627\u0650\u0633\u062a\u064e\u0631 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0622\u0633\u062a\u0631"
		}, {
			"bid": 18,
			"book_name_en": "Job",
			"number_of_chapters": 42,
			"testament": "OT",
			"book_name_ar": "\u0623\u064a\u0648\u0628",
			"book_name_bn": "\u09af\u09cb\u09ac",
			"book_name_fa": "\u0627\u06cc\u0648\u0628",
			"book_name_id": "Ayub",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0627\u064a\u064f\u0648\u0628 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0627\u06cc\u0651\u0648\u0628"
		}, {
			"bid": 19,
			"book_name_en": "Psalms",
			"number_of_chapters": 150,
			"testament": "OT",
			"book_name_ar": "\u0627\u0644\u0645\u0632\u0627\u0645\u064a\u0631",
			"book_name_bn": "\u09b8\u09be\u09ae\u09b8\u0999\u09cd\u0997\u09c0\u09a4",
			"book_name_fa": "\u0645\u0632\u0627\u0645\u06cc\u0631",
			"book_name_id": "Mazmur",
			"book_name_ps": "\u062f \u0632\u0628\u0648\u0631\u0648\u0646\u0648 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0632\u0628\u064f\u0648\u0631"
		}, {
			"bid": 20,
			"book_name_en": "Proverbs",
			"number_of_chapters": 31,
			"testament": "OT",
			"book_name_ar": "\u0627\u0644\u0623\u0645\u062b\u0627\u0644",
			"book_name_bn": "\u09aa\u09cd\u09b0\u09ac\u099a\u09a8",
			"book_name_fa": "\u0627\u0645\u062b\u0627\u0644",
			"book_name_id": "Amsal",
			"book_name_ps": "\u062f \u0633\u0644\u06cc\u0645\u0627\u0646 \u062f \u0645\u062a\u0644\u0648\u0646\u0648 \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0627\u0650\u0645\u062b\u0627\u0644"
		}, {
			"bid": 21,
			"book_name_en": "Ecclesiastes",
			"number_of_chapters": 12,
			"testament": "OT",
			"book_name_ar": "\u0627\u0644\u062c\u0627\u0645\u0639\u0629",
			"book_name_bn": "\u0989\u09aa\u09a6\u09c7\u09b6\u0995",
			"book_name_fa": "\u062c\u0627\u0645\u0639\u0647",
			"book_name_id": "Pengkhotbah",
			"book_name_ps": "\u062f \u0685\u06d0\u0693\u0648\u0646\u06a9\u064a \u06a9\u062a\u0627\u0628",
			"book_name_ur": "\u0648\u0627\u0639\u0638"
		}, {
			"bid": 22,
			"book_name_en": "Song of Solomon",
			"number_of_chapters": 8,
			"testament": "OT",
			"book_name_ar": "\u0646\u0634\u064a\u062f \u0627\u0644\u0623\u0646\u0634\u0627\u062f",
			"book_name_bn": "\u09aa\u09b0\u09ae \u0997\u09c0\u09a4  Song of Songs",
			"book_name_fa": "\u063a\u0632\u0644 \u063a\u0632\u0644\u0647\u0627",
			"book_name_id": "KidungAgung",
			"book_name_ps": "\u062f \u063a\u0632\u0644\u0648 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u063a\u0632\u0644\u064f \u0627\u0644\u063a\u0632\u0644\u0627\u062a"
		}, {
			"bid": 23,
			"book_name_en": "Isaiah",
			"number_of_chapters": 66,
			"testament": "OT",
			"book_name_ar": "\u0623\u0634\u0639\u064a\u0627\u0621",
			"book_name_bn": "\u0987\u09b8\u09be\u0987\u09af\u09bc\u09be",
			"book_name_fa": "\u0627\u0634\u0639\u06cc\u0627",
			"book_name_id": "Yesaya",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u064a\u0634\u0639\u064a\u0627\u0647 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0623\u06cc\u0633\u0639\u06cc\u0627\u06c1"
		}, {
			"bid": 24,
			"book_name_en": "Jeremiah",
			"number_of_chapters": 52,
			"testament": "OT",
			"book_name_ar": "\u0623\u0631\u0645\u064a\u0627\u0621",
			"book_name_bn": "\u09af\u09c7\u09b0\u09c7\u09ae\u09bf\u09af\u09bc\u09be",
			"book_name_fa": "\u0627\u0631\u0645\u06cc\u0627",
			"book_name_id": "Yeremia",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u064a\u0631\u0645\u064a\u0627\u0647 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u06cc\u0631\u0645\u06cc\u0627\u06c1"
		}, {
			"bid": 25,
			"book_name_en": "Lamentations",
			"number_of_chapters": 5,
			"testament": "OT",
			"book_name_ar": "\u0645\u0631\u0627\u062b\u064a \u0623\u0631\u0645\u064a\u0627\u0621",
			"book_name_bn": "\u09ac\u09bf\u09b2\u09be\u09aa\u0997\u09be\u09a5\u09be",
			"book_name_fa": "\u0645\u0631\u0627\u062b\u06cc \u0627\u0631\u0645\u06cc\u0627",
			"book_name_id": "Ratapan",
			"book_name_ps": "\u062f \u0645\u0631\u062b\u064a\u0648 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0645\u0646\u064e\u0648\u062d\u06c1"
		}, {
			"bid": 26,
			"book_name_en": "Ezekiel",
			"number_of_chapters": 48,
			"testament": "OT",
			"book_name_ar": "\u062d\u0632\u0642\u064a\u0627\u0644",
			"book_name_bn": "\u098f\u099c\u09c7\u0995\u09bf\u09af\u09bc\u09c7\u09b2",
			"book_name_fa": "\u062d\u0632\u0642\u06cc\u0627\u0644",
			"book_name_id": "Yehezkiel",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u062d\u0632\u0642\u0649\u200c\u0627\u064a\u0644 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u062d\u0632\u0642\u06cc \u0627\u06cc\u0644"
		}, {
			"bid": 27,
			"book_name_en": "Daniel",
			"number_of_chapters": 12,
			"testament": "OT",
			"book_name_ar": "\u062f\u0627\u0646\u064a\u0627\u0644",
			"book_name_bn": "\u09a6\u09be\u09a8\u09bf\u09af\u09bc\u09c7\u09b2",
			"book_name_fa": "\u062f\u0627\u0646\u06cc\u0627\u0644",
			"book_name_id": " Daniel",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u062f\u0627\u0646\u064a\u0627\u0644 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u062f\u0627\u0646\u06cc \u0627\u06cc\u0644"
		}, {
			"bid": 28,
			"book_name_en": "Hosea",
			"number_of_chapters": 14,
			"testament": "OT",
			"book_name_ar": "\u0647\u0648\u0634\u0639",
			"book_name_bn": "\u09b9\u09cb\u09b8\u09c7\u09af\u09bc\u09be",
			"book_name_fa": "\u0647\u0648\u0634\u0639",
			"book_name_id": "Hosea",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0647\u0648\u0633\u064a\u0639 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u06c1\u0648\u0633\u06cc\u0639"
		}, {
			"bid": 29,
			"book_name_en": "Joel",
			"number_of_chapters": 3,
			"testament": "OT",
			"book_name_ar": "\u064a\u0648\u0626\u064a\u0644",
			"book_name_bn": "\u09af\u09cb\u09af\u09bc\u09c7\u09b2",
			"book_name_fa": "\u06cc\u0648\u06cc\u06cc\u0644",
			"book_name_id": "Yoel",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u064a\u0648\u0627\u064a\u0644 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u06cc\u064f\u0648\u0627\u06cc\u0644"
		}, {
			"bid": 30,
			"book_name_en": "Amos",
			"number_of_chapters": 9,
			"testament": "OT",
			"book_name_ar": "\u0639\u0627\u0645\u0648\u0633",
			"book_name_bn": "\u0986\u09ae\u09cb\u09b8",
			"book_name_fa": "\u0639\u0627\u0645\u0648\u0633",
			"book_name_id": "Amos",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0639\u0627\u0645\u0648\u0633 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0639\u0627\u0645\u064f\u0648\u0633"
		}, {
			"bid": 31,
			"book_name_en": "Obadiah",
			"number_of_chapters": 1,
			"testament": "OT",
			"book_name_ar": "\u0639\u0648\u0628\u062f\u064a\u0627",
			"book_name_bn": "\u0993\u09ac\u09be\u09a6\u09bf\u09af\u09bc\u09be",
			"book_name_fa": "\u0639\u0648\u0628\u062f\u06cc\u0627",
			"book_name_id": "Obaja",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0639\u0628\u062f\u064a\u0627\u0647 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0639\u0628\u062f\u06cc\u0627\u06c1"
		}, {
			"bid": 32,
			"book_name_en": "Jonah",
			"number_of_chapters": 4,
			"testament": "OT",
			"book_name_ar": "\u064a\u0648\u0646\u0627\u0646",
			"book_name_bn": "\u09af\u09cb\u09a8\u09be",
			"book_name_fa": "\u06cc\u0648\u0646\u0633",
			"book_name_id": "Yunus",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u064a\u064f\u0648\u0646\u0633 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u06cc\u064f\u0648\u0646\u0627\u06c1"
		}, {
			"bid": 33,
			"book_name_en": "Micah",
			"number_of_chapters": 7,
			"testament": "OT",
			"book_name_ar": "\u0645\u064a\u062e\u0627",
			"book_name_bn": "\u09ae\u09bf\u0996\u09be",
			"book_name_fa": "\u0645\u06cc\u06a9\u0627\u0647",
			"book_name_id": "Mikha",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0645\u064a\u06a9\u0627\u0647 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0645\u06cc\u06a9\u0627\u06c1"
		}, {
			"bid": 34,
			"book_name_en": "Nahum",
			"number_of_chapters": 3,
			"testament": "OT",
			"book_name_ar": "\u0646\u0627\u062d\u0648\u0645",
			"book_name_bn": "\u09a8\u09be\u09b9\u09c1\u09ae",
			"book_name_fa": "\u0646\u0627\u062d\u0648\u0645",
			"book_name_id": "Nahum",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0646\u0627\u062d\u0648\u0645 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0646\u0627 \u062d\u064f\u0648\u0645"
		}, {
			"bid": 35,
			"book_name_en": "Habakkuk",
			"number_of_chapters": 3,
			"testament": "OT",
			"book_name_ar": "\u062d\u0628\u0642\u0648\u0642",
			"book_name_bn": "\u09b9\u09be\u09ac\u09be\u0995\u09c1\u0995",
			"book_name_fa": "\u062d\u0628\u0642\u0648\u0642",
			"book_name_id": "Habakuk",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u062d\u0628\u0642\u064f\u0648\u0642 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u062d\u0628\u0642\u064f\u0648\u0642"
		}, {
			"bid": 36,
			"book_name_en": "Zephaniah",
			"number_of_chapters": 3,
			"testament": "OT",
			"book_name_ar": "\u0635\u0641\u0646\u064a\u0627",
			"book_name_bn": "\u099c\u09c7\u09ab\u09be\u09a8\u09bf\u09af\u09bc\u09be",
			"book_name_fa": "\u0635\u0641\u0646\u06cc\u0627",
			"book_name_id": "Zefanya",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0635\u0641\u0646\u064a\u0627\u0647 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0635\u0641\u0646\u06cc\u0627\u06c1"
		}, {
			"bid": 37,
			"book_name_en": "Haggai",
			"number_of_chapters": 2,
			"testament": "OT",
			"book_name_ar": "\u062d\u062c\u064a",
			"book_name_bn": "\u09b9\u0997\u09af\u09bc",
			"book_name_fa": "\u062d\u062e\u06cc",
			"book_name_id": "Hagai",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u062d\u062c\u0649 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u062d\u062c\u064e\u0651\u06cc"
		}, {
			"bid": 38,
			"book_name_en": "Zechariah",
			"number_of_chapters": 14,
			"testament": "OT",
			"book_name_ar": "\u0632\u0643\u0631\u064a\u0627",
			"book_name_bn": "\u099c\u09be\u0996\u09be\u09b0\u09bf\u09af\u09bc\u09be",
			"book_name_fa": "\u0632\u06a9\u0631\u06cc\u0627",
			"book_name_id": "Zakharia",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0632\u06a9\u0631\u064a\u0627\u0647 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0632\u06a9\u0631\u06cc\u0627\u06c1"
		}, {
			"bid": 39,
			"book_name_en": "Malachi",
			"number_of_chapters": 4,
			"testament": "OT",
			"book_name_ar": "\u0645\u0644\u0627\u062e\u064a",
			"book_name_bn": "\u09ae\u09be\u09b2\u09be\u0996\u09bf",
			"book_name_fa": "\u0645\u0644\u0627\u06a9\u06cc",
			"book_name_id": "Maleakhi",
			"book_name_ps": "\u062f \u062d\u0636\u0631\u062a \u0645\u0644\u0627\u06a9\u0649 \u0646\u0628\u0649 \u06a9\u0650\u062a\u0627\u0628",
			"book_name_ur": "\u0645\u0644\u0627\u06a9\u06cc"
		}, {
			"bid": 40,
			"book_name_en": "Matthew",
			"number_of_chapters": 28,
			"testament": "NT",
			"book_name_ar": "\u0645\u062a\u0649",
			"book_name_bn": "\u09ae\u09a5\u09bf",
			"book_name_fa": "\u0645\u062a\u06cc",
			"book_name_id": "Matius",
			"book_name_ps": "\u062f \u0639\u06cc\u0633\u06cc\u0670 \u0627\u0644\u0645\u0633\u06cc\u062d\ufdfa \u0670\u067e\u0647 \u0647\u06a9\u0644\u0647 \u062f \u0645\u062a\u064a \u0627\u0646\u062c\u06cc\u0644",
			"book_name_ur": "\u0645\u062a\u0651\u06cc"
		}, {
			"bid": 41,
			"book_name_en": "Mark",
			"number_of_chapters": 16,
			"testament": "NT",
			"book_name_ar": "\u0645\u0631\u0642\u0633",
			"book_name_bn": "\u09ae\u09be\u09b0\u09cd\u0995",
			"book_name_fa": "\u0645\u0631\u0642\u0633",
			"book_name_id": "Markus",
			"book_name_ps": "\u062f \u0639\u06cc\u0633\u06cc\u0670 \u0627\u0644\u0645\u0633\u06cc\u062d\ufdfa  \u067e\u0647 \u0647\u06a9\u0644\u0647 \u062f \u0645\u0631\u0642\u0648\u0633 \u0627\u0646\u062c\u06cc\u0644",
			"book_name_ur": "\u0645\u0631\u0642\u0633"
		}, {
			"bid": 42,
			"book_name_en": "Luke",
			"number_of_chapters": 24,
			"testament": "NT",
			"book_name_ar": "\u0644\u0648\u0642\u0627",
			"book_name_bn": "\u09b2\u09c1\u0995",
			"book_name_fa": "\u0644\u0648\u0642\u0627",
			"book_name_id": "Lukas",
			"book_name_ps": "\u062f \u0639\u06cc\u0633\u06cc\u0670 \u0627\u0644\u0645\u0633\u06cc\u062d\ufdfa  \u067e\u0647 \u0647\u06a9\u0644\u0647 \u062f \u06cc\u0648\u062d\u0646\u0627 \u0627\u0646\u062c\u06cc\u0644",
			"book_name_ur": "\u0644\u064f\u0648\u0642\u0627"
		}, {
			"bid": 43,
			"book_name_en": "John",
			"number_of_chapters": 21,
			"testament": "NT",
			"book_name_ar": "\u064a\u0648\u062d\u0646\u0627",
			"book_name_bn": "\u09af\u09cb\u09b9\u09a8",
			"book_name_fa": "\u06cc\u0648\u062d\u0646\u0627",
			"book_name_id": "Yohanes",
			"book_name_ps": "\u062f \u0639\u06cc\u0633\u06cc\u0670 \u0627\u0644\u0645\u0633\u06cc\u062d\ufdfa   \u067e\u0647 \u0647\u06a9\u0644\u0647 \u062f \u0644\u0648\u0642\u0627 \u0627\u0646\u062c\u06cc\u0644",
			"book_name_ur": "\u06cc\u064f\u0648\u062d\u0646\u0651\u0627"
		}, {
			"bid": 44,
			"book_name_en": "Acts",
			"number_of_chapters": 28,
			"testament": "NT",
			"book_name_ar": "\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0631\u0633\u0644",
			"book_name_bn": "\u092a\u09b6\u09bf\u09b7\u09cd\u09af\u099a\u09b0\u09bf\u09a4",
			"book_name_fa": "\u0627\u0639\u0645\u0627\u0644 \u0631\u0633\u0648\u0644\u0627\u0646",
			"book_name_id": "Kisah",
			"book_name_ps": "\u062f \u0631\u0633\u0648\u0644\u0627\u0646\u0648 \u0639\u0645\u0644\u0648\u0646\u0647",
			"book_name_ur": "\u0627\u0639\u0645\u0627\u0644"
		}, {
			"bid": 45,
			"book_name_en": "Romans",
			"number_of_chapters": 16,
			"testament": "NT",
			"book_name_ar": "\u0631\u0648\u0645\u064a\u0629",
			"book_name_bn": "\u09b0\u09cb\u09ae\u09c0\u09af\u09bc",
			"book_name_fa": "\u0631\u0648\u0645\u06cc\u0627\u0646",
			"book_name_id": "Roma",
			"book_name_ps": "\u062f\u064e \u0631\u064f\u0648\u0645\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u0631\u0648\u0645\u06cc\u0648\u06ba"
		}, {
			"bid": 46,
			"book_name_en": "1 Corinthians",
			"number_of_chapters": 16,
			"testament": "NT",
			"book_name_ar": "1 \u0643\u0648\u0631\u0646\u062b\u0648\u0633",
			"book_name_bn": "\u0995\u09b0\u09bf\u09a8\u09cd\u09a5\u09c0\u09af\u09bc \u09e7",
			"book_name_fa": "\u0627\u0648\u0644 \u0642\u0631\u0646\u062a\u06cc\u0627\u0646",
			"book_name_id": "1Korintus",
			"book_name_ps": "\u062f\u064e \u06a9\u0648\u0631\u0646\u062a\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u0627\u0648\u0644 \u062e\u0637",
			"book_name_ur": " \u06a9\u064f\u0631\u0646\u062a\u06be\u0650\u06cc\u0648\u06ba \u06f1"
		}, {
			"bid": 47,
			"book_name_en": "2 Corinthians",
			"number_of_chapters": 13,
			"testament": "NT",
			"book_name_ar": "2 \u0643\u0648\u0631\u0646\u062b\u0648\u0633",
			"book_name_bn": "\u0995\u09b0\u09bf\u09a8\u09cd\u09a5\u09c0\u09af\u09bc \u09e8",
			"book_name_fa": "\u062f\u0648\u0645 \u0642\u0631\u0646\u062a\u06cc\u0627\u0646",
			"book_name_id": "2Korintus",
			"book_name_ps": "\u062f\u064e \u06a9\u0648\u0631\u0646\u062a\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062f\u0648\u064a\u0645 \u062e\u0637",
			"book_name_ur": " \u00a0\u06a9\u064f\u0631\u0646\u062a\u06be\u0650\u06cc\u0648\u06ba \u06f2"
		}, {
			"bid": 48,
			"book_name_en": "Galatians",
			"number_of_chapters": 6,
			"testament": "NT",
			"book_name_ar": "\u063a\u0644\u0627\u0637\u064a\u0629",
			"book_name_bn": "\u0997\u09be\u09b2\u09be\u09a4\u09c0\u09af\u09bc",
			"book_name_fa": "\u0639\u0644\u0627\u0637\u06cc\u0627\u0646",
			"book_name_id": "Galatia",
			"book_name_ps": "\u063a\u0644\u0627\u062a\u06cc\u0627\u0646\u0648 \u062a\u0647 \u062f \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u0648\u0644 \u0644\u06cc\u06a9",
			"book_name_ur": "\u06af\u0644\u062a\u06cc\u0648\u06ba"
		}, {
			"bid": 49,
			"book_name_en": "Ephesians",
			"number_of_chapters": 6,
			"testament": "NT",
			"book_name_ar": "\u0623\u0641\u0633\u0633",
			"book_name_bn": "\u098f\u09ab\u09c7\u09b8\u09c0\u09af\u09bc",
			"book_name_fa": "\u0627\u0641\u0633\u06cc\u0627\u0646",
			"book_name_id": "Efesus",
			"book_name_ps": "\u062f\u064e \u0627\u0650\u0641\u0650\u0633\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u0627\u0641\u0633\u06cc\u0648\u06ba"
		}, {
			"bid": 50,
			"book_name_en": "Philippians",
			"number_of_chapters": 4,
			"testament": "NT",
			"book_name_ar": "\u0641\u064a\u0644\u064a\u0628\u064a",
			"book_name_bn": "\u09ab\u09bf\u09b2\u09bf\u09aa\u09cd\u09aa\u09c0\u09af\u09bc",
			"book_name_fa": "\u0641\u0644\u06cc\u067e\u06cc\u0627\u0646",
			"book_name_id": "Filipi",
			"book_name_ps": "\u062f\u064e \u0641\u064a\u0644\u064a\u067e\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u0641\u0644\u067e\u06cc\u0648\u06ba"
		}, {
			"bid": 51,
			"book_name_en": "Colossians",
			"number_of_chapters": 4,
			"testament": "NT",
			"book_name_ar": "\u0643\u0648\u0644\u0648\u0633\u064a",
			"book_name_bn": "\u0995\u09b2\u09b8\u09c0\u09af\u09bc",
			"book_name_fa": "\u06a9\u0648\u0644\u0633\u06cc\u0627\u0646",
			"book_name_id": "Kolose",
			"book_name_ps": "\u062f\u064e \u06a9\u0648\u0644\u0648\u0633\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u06a9\u064f\u0644\u0633\u0651\u06cc\u0648\u06ba"
		}, {
			"bid": 52,
			"book_name_en": "1 Thessalonians",
			"number_of_chapters": 5,
			"testament": "NT",
			"book_name_ar": "1 \u062a\u0633\u0627\u0644\u0648\u0646\u064a\u0643\u064a",
			"book_name_bn": "\u09a5\u09c7\u09b8\u09be\u09b2\u09cb\u09a8\u09bf\u0995\u09c0\u09af\u09bc \u09e7",
			"book_name_fa": "\u0627\u0648\u0644 \u062a\u0633\u0627\u0644\u0648\u0646\u06cc\u06a9\u06cc\u0627\u0646",
			"book_name_id": "1Tesalonika",
			"book_name_ps": "\u062a\u0633\u0627\u0644\u0648\u0646\u06cc\u06a9\u06cc\u0627\u0646\u0648 \u062a\u0647 \u062f \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u0648\u0644 \u0644\u0648\u0645\u0693\u06cc \u0644\u06cc\u06a9",
			"book_name_ur": " \u00a0\u062a\u06be\u0650\u0633\u0644\u064f\u0646\u06cc\u06a9\u06cc\u0648\u06ba \u06f1"
		}, {
			"bid": 53,
			"book_name_en": "2 Thessalonians",
			"number_of_chapters": 3,
			"testament": "NT",
			"book_name_ar": "2 \u062a\u0633\u0627\u0644\u0648\u0646\u064a\u0643\u064a",
			"book_name_bn": "\u09a5\u09c7\u09b8\u09be\u09b2\u09cb\u09a8\u09bf\u0995\u09c0\u09af\u09bc \u09e8",
			"book_name_fa": "\u062f\u0648\u0645 \u062a\u0633\u0627\u0644\u0648\u0646\u06cc\u06a9\u06cc\u0627\u0646",
			"book_name_id": "2Tesalonika  ",
			"book_name_ps": "\u062a\u0633\u0627\u0644\u0648\u0646\u06cc\u06a9\u06cc\u0627\u0646\u0648 \u062a\u0647 \u062f \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u0648\u0644 \u062f\u0648\u0647\u0645 \u0644\u06cc\u06a9",
			"book_name_ur": " \u00a0\u062a\u06be\u0650\u0633\u0644\u064f\u0646\u06cc\u06a9\u06cc\u0648\u06ba \u06f2"
		}, {
			"bid": 54,
			"book_name_en": "1 Timothy",
			"number_of_chapters": 6,
			"testament": "NT",
			"book_name_ar": "1 \u062a\u064a\u0645\u0648\u062b\u0627\u0648\u0633",
			"book_name_bn": "\u09a4\u09bf\u09ae\u09a5\u09bf \u09e7",
			"book_name_fa": "\u0627\u0648\u0644 \u062a\u06cc\u0645\u0648\u062a\u0627\u06cc\u0648\u0633",
			"book_name_id": "1Timotius",
			"book_name_ps": "\u062f\u064e \u062a\u064a\u0645\u0648\u062a\u064a\u0648\u0633 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u0627\u0648\u0644 \u062e\u0637",
			"book_name_ur": " \u062a\u06cc\u0645\u0650\u062a\u06be\u064f\u06cc\u0633 \u06f1 "
		}, {
			"bid": 55,
			"book_name_en": "2 Timothy",
			"number_of_chapters": 4,
			"testament": "NT",
			"book_name_ar": "2 \u062a\u064a\u0645\u0648\u062b\u0627\u0648\u0633",
			"book_name_bn": "\u09a4\u09bf\u09ae\u09a5\u09bf \u09e8",
			"book_name_fa": "\u062f\u0648\u0645 \u062a\u0633\u0627\u0644\u0648\u0646\u06cc\u06a9\u06cc\u0627\u0646",
			"book_name_id": "2Timotius",
			"book_name_ps": "\u062f\u064e \u062a\u064a\u0645\u0648\u062a\u064a\u0648\u0633 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062f\u0648\u064a\u0645 \u062e\u0637",
			"book_name_ur": " \u062a\u06cc\u0645\u0650\u062a\u06be\u064f\u06cc\u0633 \u06f2"
		}, {
			"bid": 56,
			"book_name_en": "Titus",
			"number_of_chapters": 3,
			"testament": "NT",
			"book_name_ar": "\u062a\u064a\u0637\u0633",
			"book_name_bn": "\u09a4\u09c0\u09a4",
			"book_name_fa": "\u062a\u06cc\u0637\u0648\u0633",
			"book_name_id": "Titus",
			"book_name_ps": "\u062f\u064e \u062a\u064a\u0637\u0648\u0633 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u0637\u0650\u0637\u064f\u0633"
		}, {
			"bid": 57,
			"book_name_en": "Philemon",
			"number_of_chapters": 1,
			"testament": "NT",
			"book_name_ar": "\u0641\u064a\u0644\u064a\u0645\u0648\u0646",
			"book_name_bn": "\u09ab\u09bf\u09b2\u09c7\u09ae\u09a8",
			"book_name_fa": "\u0641\u0644\u06cc\u0645\u0648\u0646",
			"book_name_id": "Flmon",
			"book_name_ps": "\u062f\u064e \u0641\u064a\u0644\u064a\u0645\u0648\u0646 \u067e\u0647 \u0646\u064f\u0648\u0645 \u062f\u064e \u067e\u0648\u0644\u0648\u0633 \u0631\u0633\u064f\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u0641\u0644\u06cc\u0645\u0648\u0646"
		}, {
			"bid": 58,
			"book_name_en": "Hebrews",
			"number_of_chapters": 13,
			"testament": "NT",
			"book_name_ar": "\u0627\u0644\u0639\u0628\u0631\u0627\u0646\u064a\u064a\u0646",
			"book_name_bn": "\u09b9\u09bf\u09ac\u09cd\u09b0\u09c1\u09a6\u09c7\u09b0 \u0995\u09be\u099b\u09c7 \u09aa\u09a4\u09cd\u09b0",
			"book_name_fa": "\u0639\u0628\u0631\u0627\u0646\u06cc\u0627\u0646",
			"book_name_id": "Ibrani",
			"book_name_ps": "\u062f \u0639\u0628\u0631\u0627\u0646\u064a\u0627\u0646\u0648 \u067e\u0647 \u0646\u0648\u0645 \u062e\u0637",
			"book_name_ur": "\u0627\u0644\u0639\u0628\u0631\u0627\u0646\u064a\u064a\u0646"
		}, {
			"bid": 59,
			"book_name_en": "James",
			"number_of_chapters": 5,
			"testament": "NT",
			"book_name_ar": "\u064a\u0639\u0642\u0648\u0628",
			"book_name_bn": "\u09af\u09be\u0995\u09cb\u09ac\u09c7\u09b0 \u09aa\u09a4\u09cd\u09b0",
			"book_name_fa": "\u06cc\u0639\u0642\u0648\u0628",
			"book_name_id": "Yakobus",
			"book_name_ps": "\u062f \u06cc\u0639\u0642\u0648\u0628 \u0644\u06cc\u06a9",
			"book_name_ur": "\u06cc\u0639\u0642\u064f\u0648\u0628"
		}, {
			"bid": 60,
			"book_name_en": "1 Peter",
			"number_of_chapters": 5,
			"testament": "NT",
			"book_name_ar": "1 \u0628\u0637\u0631\u0633",
			"book_name_bn": "\u09aa\u09bf\u09a4\u09b0\u09c7\u09b0 \u09e7\u09ae \u09aa\u09a4\u09cd\u09b0",
			"book_name_fa": "\u0627\u0648\u0644 \u067e\u0637\u0631\u0633",
			"book_name_id": "1Petrus",
			"book_name_ps": "\u062f \u067e\u0637\u0631\u0648\u0633 \u0631\u0633\u0648\u0644 \u0644\u0648\u0645\u0693\u06cc \u0644\u06cc\u06a9",
			"book_name_ur": " \u067e\u0637\u0631\u0633 \u06f1"
		}, {
			"bid": 61,
			"book_name_en": "2 Peter",
			"number_of_chapters": 3,
			"testament": "NT",
			"book_name_ar": "2 \u0628\u0637\u0631\u0633",
			"book_name_bn": "\u09aa\u09bf\u09a4\u09b0\u09c7\u09b0 \u09e8\u09af\u09bc \u09aa\u09a4\u09cd\u09b0",
			"book_name_fa": "\u062f\u0648\u0645 \u067e\u0637\u0631\u0633",
			"book_name_id": "2Petrus",
			"book_name_ps": "\u062f \u067e\u0637\u0631\u0648\u0633 \u0631\u0633\u0648\u0644 \u062f\u0648\u0647\u0645 \u0644\u06cc\u06a9",
			"book_name_ur": " \u067e\u0637\u0631\u0633 \u06f2"
		}, {
			"bid": 62,
			"book_name_en": "1 John",
			"number_of_chapters": 5,
			"testament": "NT",
			"book_name_ar": "1 \u064a\u0648\u062d\u0646\u0627",
			"book_name_bn": "\u09af\u09cb\u09b9\u09a8\u09c7\u09b0 \u09e7\u09ae \u09aa\u09a4\u09cd\u09b0",
			"book_name_fa": "\u0627\u0648\u0644 \u06cc\u062d\u0646\u0627",
			"book_name_id": "1Yohanes",
			"book_name_ps": "\u062f\u064e \u064a\u0648\u062d\u0646\u0627 \u0631\u0633\u064f\u0648\u0644 \u0627\u0648\u0644 \u062e\u0637",
			"book_name_ur": "\u06cc\u064f\u0648\u062d\u0646\u0651\u0627 \u06f1 "
		}, {
			"bid": 63,
			"book_name_en": "2 John",
			"number_of_chapters": 1,
			"testament": "NT",
			"book_name_ar": "2 \u064a\u0648\u062d\u0646\u0627",
			"book_name_bn": "\u09af\u09cb\u09b9\u09a8\u09c7\u09b0 \u09e8\u09af\u09bc \u09aa\u09a4\u09cd",
			"book_name_fa": "\u062f\u0648\u0645 \u06cc\u062d\u0646\u0627",
			"book_name_id": "2Yohanes",
			"book_name_ps": "\u062f\u064e \u064a\u0648\u062d\u0646\u0627 \u0631\u0633\u064f\u0648\u0644 \u062f\u0648\u064a\u0645 \u062e\u0637",
			"book_name_ur": " \u06cc\u064f\u0648\u062d\u0646\u0651\u0627 \u06f2"
		}, {
			"bid": 64,
			"book_name_en": "3 John",
			"number_of_chapters": 1,
			"testament": "NT",
			"book_name_ar": "3 \u064a\u0648\u062d\u0646\u0627",
			"book_name_bn": "\u09af\u09cb\u09b9\u09a8\u09c7\u09b0 \u09e9\u09af\u09bc \u09aa\u09a4\u09cd",
			"book_name_fa": "\u0633\u0648\u0645 \u06cc\u062d\u0627\u0646\u0627",
			"book_name_id": "3Yohanes",
			"book_name_ps": "\u062f\u064e \u064a\u0648\u062d\u0646\u0627 \u0631\u0633\u064f\u0648\u0644 \u062f\u0631\u064a\u0645 \u062e\u0637",
			"book_name_ur": " \u06cc\u064f\u0648\u062d\u0646\u0651\u0627 \u06f3"
		}, {
			"bid": 65,
			"book_name_en": "Jude",
			"number_of_chapters": 1,
			"testament": "NT",
			"book_name_ar": "\u064a\u0647\u0648\u0630\u0627",
			"book_name_bn": "\u09af\u09c1\u09a6\u09c7\u09b0 \u09aa\u09a4\u09cd\u09b0",
			"book_name_fa": "\u06cc\u0647\u0648\u062f\u0627",
			"book_name_id": "Yudas",
			"book_name_ps": "\u062f \u06cc\u0647\u0648\u062f\u0627 \u0644\u06cc\u06a9",
			"book_name_ur": "\u06cc\u06c1\u064f\u0648\u062f\u0627\u06c1 "
		}, {
			"bid": 66,
			"book_name_en": "Revelation",
			"number_of_chapters": 22,
			"testament": "NT",
			"book_name_ar": "\u0631\u0624\u064a\u0627",
			"book_name_bn": "\u092a\u09aa\u09cd\u09b0\u09a4\u09cd\u09af\u09be\u09a6\u09c7\u09b6",
			"book_name_fa": "\u0645\u06a9\u0627\u0634\u0641\u0647",
			"book_name_id": "Wahyu",
			"book_name_ps": "\u062f\u064e \u064a\u0648\u062d\u0646\u0627 \u0645\u064f\u06a9\u0627\u0634\u0641\u0627\u062a",
			"book_name_ur": "\u0645\u064f\u06a9\u0627\u0634\u0641\u06c1"
		}
	    ]
	));
}
