function findLastPage(iso){
    var stored = localStorage.getItem('currentSectionIndex', undefined);
    if (stored){
        console.log ('stored');
        console.log (stored);
        var index = JSON.parse(stored);
        for (var i = 0; i < index.length; i++){
            if (index[i].iso == iso){
                return index[i].page;
            }
        }
    }
    return null;
}
function storeLastPage(iso, page){
    console.log (page);
    var stored = [];
    var index = [];
    var last_page = {};
    last_page.iso = iso;
    last_page.page = page;
    // remove old value
    if (localStorage.currentSectionIndex){
        stored = localStorage.getItem('currentSectionIndex', undefined);
        index = JSON.parse(stored);
        for (var i = 0; i < index.length; i++){
            if (index[i].iso == iso){
                index.splice(i,1);
            }
        }
    }
    index.push (last_page);
    console.log (index);
    localStorage.setItem('currentSectionIndex', JSON.stringify(index));
    return null;
}