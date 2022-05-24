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
      success: function(result) {
        pagefile.text = result;
       
        deferred.resolve(pagefile);
      }
    });

    return deferred.promise();
  };
};
