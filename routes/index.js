var express = require('express');
var router = express.Router();

var https = require('https');
// var https = require('http')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var suggest_tags = function(rawcal){
}

var strip_edit_event = function(rawcal){
  // Strip all [Edit Event] links.
  // rmstr = "[Edit Event]"
  // for(var i = 1; i <= rmstr.length - 1; i++){
  //   search_str = rmstr.slice(0, i) + "\r\n " + rmstr.slice(i)
  //   while(rawcal.indexOf("[Edit Event]") != -1){
  //     begin = rawcal.indexOf("[Edit Event]");
  //     rawcal = rawcal.slice(0, begin)+rawcal.slice(rawcal.indexOf(")", begin)+3);
  //   }
  // }

  // the above code sometimes contracts DTEND lines into description.
  // this puts them back.
  // rawcal = rawcal.replace(/\\n\\nDTEND/g, "\r\nDTEND")

  // the above solution is incomplete. This is getting super ugly and there
  // must be a better solution, but here we are. The regex below seems like it
  // shoudl work but it doesn't so I just make all the combos I observe.
  // rawcal = rawcal.replace(/^([n]|[ ]|[\\])+DTEND/g, "DTEND")
  // rawcal = rawcal.replace(/ n\\nDTEND/g, "DTEND")
  // rawcal = rawcal.replace(/ \\nDTEND/g, "DTEND")
  // rawcal = rawcal.replace(/ nDTEND/g, "DTEND")
  // rawcal = rawcal.replace(/ DTEND/g, "DTEND")
}

router.get('/:subcal/:calurl', function(req, res, next) {

  // We want to be permissive about the way we parse URLs, allowing both with and without *.ics
  var canvas_url = "https://canvas.wustl.edu/feeds/calendars/"+req.params.calurl
  if( !(canvas_url.slice(-4) === ".ics") ){
    canvas_url += ".ics"
  }

  var subreq = https.get(canvas_url, function(subres) {

    var rawcal = ''

    subres.on('data', function(d){
      rawcal += d
    });
    subres.on('end', function(){

      header = rawcal.slice(0, rawcal.indexOf("BEGIN:VEVENT"))
      rawevents = rawcal.split("END:VEVENT")
      PROC_REGEXP = /[ \/]/g;

      var events = []

      for (var i = 0; i < rawevents.length; i++) {
        var this_event = rawevents[i].split(/\s+/).join(" ")
        var summary = this_event.slice(this_event.indexOf("SUMMARY:")+"SUMMARY:".length, 
                                       this_event.indexOf("UID:"))

        var tag = summary.slice(summary.indexOf('[')+1, summary.indexOf(']'))
        tag = tag.replace(PROC_REGEXP, '')

        // strip spaces and slashes b/c they interfere w/ URLs
        if (tag == req.params.subcal.replace(PROC_REGEXP, '')){
          events.push(rawevents[i])
        }
      }

      var muxed_cal = ""

      // check that there are events with this tag.
      if(events.length > 0){
        // if the first event doesn't include a header, add the header.
        if(events[0].indexOf(header) >= 0){
          muxed_cal = events.join("END:VEVENT")+"END:VEVENT"
        }else {
          muxed_cal = header+events.join("END:VEVENT")+"END:VEVENT"
        }

        muxed_cal += "\r\nEND:VCALENDAR"
      }

      res.setHeader('content-type', 'text/calendar');
      // maybe also Content-Disposition:inline;filename=my_ical.ics?
      res.send(muxed_cal)
    })
    subres.on('error', function(e){
      console.error(e)
    })
  }).on('error', function(e){
    console.error('Error!')
  });
});


module.exports = router;
