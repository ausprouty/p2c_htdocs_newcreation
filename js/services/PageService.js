var PageService = function() {
  this.initialize = function() {};
  this.findFile = function(name, iso = 'en') {
    var deferred = $.Deferred();
    var fileName = "./files/" + name;
    var pagefile = {
      name: name,
      file: fileName,
      iso: iso
    };

    $.ajax({
      url: pagefile.file,
    }).done(function(data){
        pagefile.text = data;
        var fileName = "./files/" + iso + "/nav.html";
        var navfile = {
          name: iso +'/nav.html',
          file: fileName,
          iso: iso
        };
        $.ajax({
          url: navfile.file,
          success: function(result) {
            pagefile.nav = result;
            console.log (pagefile)
            deferred.resolve(pagefile);
          }
        });
    });
    return deferred.promise();
  };
};

