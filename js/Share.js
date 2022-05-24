function share(iso= 'en') {
    var text = getTerm(iso, 'link_to_app');
    var subject = "New Creations";
    if ("share" in navigator) {
      navigator.share({
        title: subject,
        text: text,
        url: location.href
      });
    } else {
      var body = text + ' ' + location.href;
  
      // Here we use the WhatsApp API as fallback; remember to encode your text for URI
      //location.href = 'mailto:?body=' + encodeURIComponent(text + ' - ') + location.href + ';subject=' + encodeURIComponent(title);
      location.href = getMailtoUrl("", subject, body);
    }
  }
  function getMailtoUrl(to, subject, body) {
    var args = [];
    if (typeof subject !== "undefined") {
      args.push("subject=" + encodeURIComponent(subject));
    }
    if (typeof body !== "undefined") {
      args.push("body=" + encodeURIComponent(body));
    }
  
    var url = "mailto:" + encodeURIComponent(to);
    if (args.length > 0) {
      url += "?" + args.join("&");
    }
    return url;
  }
