var PageService = function() {
  this.initialize = function() {};
  this.findFile = function(name,iso) {
    var deferred = $.Deferred();
    var fileName = "./files/" + name;
    var pagefile = {
      name: name,
      file: fileName
    };

    $.ajax({
      url: pagefile.file,
      success: function(result) {
        pagefile.text = result;
        pagefile.iso = iso
        deferred.resolve(pagefile);
      }
    });

    return deferred.promise();
  };
};
