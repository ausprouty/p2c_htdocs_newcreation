
const STANDARD_DOWNLOAD_URL = 'http://localhost/laravel_newcreation/bible/book/';


function downloadBook(iso, book, number_of_chapters){
    var service = new BibleService;
    service.findChapterById('book',iso,book, number_of_chapters).done(function() {
    });

}
function downloadBible(iso){
    elem = document.getElementById("download-bible");
    elem.innerHTML = 'Downloading';
   downloadBiblebyBook(iso);
    return;
}
function downloadBiblebyBook (iso){
    var que = [];
    if (window.localStorage.getItem("downloadQue")){
        que = JSON.parse( window.localStorage.getItem("downloadQue"));
    }
    for (var i = 1; i < 67; i++){
        que.push(iso + '--book' + i + '.zip');
    }
    window.localStorage.setItem("downloadQue", JSON.stringify(que));
    downloadNextItem();
    return;
}
function downloadNextItem(){
    if (!navigator.onLine) {
        return;
    }
    if (!window.localStorage.getItem("downloadQue")){
        return;
    }
    var que = JSON.parse(window.localStorage.getItem("downloadQue"));
    downloadAndStoreBibleBook(que[0]);
}
function  updateDownloadQue(book){
    var que = JSON.parse(window.localStorage.getItem("downloadQue"));
    var index = que.indexOf(book);
    if (index !== -1) {
        que.splice(index, 1);
    }
    if (que.length > 0){
        window.localStorage.setItem("downloadQue", JSON.stringify(que));
    }
    else {
        window.localStorage.removeItem("downloadQue");
        elem = document.getElementById("download-bible");
        elem.innerHTML = 'Download Complete';
    }
    setTimeout(downloadNextItem, 100);
}

async function downloadAndStoreBibleBook(book){
    result = {};
    var url = STANDARD_DOWNLOAD_URL + book;
    var book_details = await findBookDetails(book);
    var number_of_chapters =  book_details['number_of_chapters'];
    elem = document.getElementById("download-bible");
    elem.innerHTML = 'Downloading ' + book_details['name_selected'];
    await JSZipUtils.getBinaryContent(
        url ,
        function(err, data) {
            if (err) {
                result.text = "There was an error attempting to download " + url;
                deferred.resolve(result);
            }
            // uncompress data and store in local storage using LZString to compress each chapter as much as possible
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
                            if (count == number_of_chapters){
                                result.text = 'success';
                                console.log ('finished storing ' +  file_name);
                                updateDownloadQue(book);
                                return(result);
                            }
                            count++;
                        });
                });
            })
        }
    );
}

async function findBookDetails(book){
    if (!window.localStorage.getItem("bible")) {
        initializeBibleLocalStorage()
    }
    var pos_start = book.indexOf('book');
    var pos_end = book.indexOf('.zip');
    var id = book.substring(pos_start + 4, pos_end );
    var iso = book.substring(0,2);
    console.log (id + ' is id and iso is ' + iso);
    books = JSON.parse(window.localStorage.getItem("bible"));
    console.log (books);
    var l = books.length;
    for (var i = 0; i < l; i++) {
        if (books[i].bid == id) {
            books[i]['name_selected'] =  books[i]['book_name_' + iso];
            return books[i];
            break;
        }
    }
    return null;
}

async function find_number_of_chapters(book){
    if (!window.localStorage.getItem("bible")) {
        initializeBibleLocalStorage()
    }
    var pos_start = book.indexOf('book');
    var pos_end = book.indexOf('.zip');
    id = book.substring(pos_start + 4, pos_end );
    console.log (id + ' is id');
    bibles = JSON.parse(window.localStorage.getItem("bible"));
    console.log (bibles);
    var l = bibles.length;
    for (var i = 0; i < l; i++) {
        if (bibles[i].bid == id) {
            return bibles[i]['number_of_chapters'];
            break;
        }
    }
    return null;
}
function download_clean_url(){
    var url = window.location.href;
    var website = url;
    var i = url.indexOf('#');
    if (i != -1){
        website = url.substring(0,i);
    }
    return website;
}