var express = require('express');
var router = express.Router();

var https = require('https');
// var https = require('http')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:subcal/:calurl', function(req, res, next) {

  var subreq = https.get("https://canvas.wustl.edu/feeds/calendars/"+req.params.calurl+".ics", function(subres) {

    var rawcal = ''

    subres.on('data', function(d){
      rawcal += d
    });
    subres.on('end', function(){
      header = rawcal.slice(0, rawcal.indexOf("BEGIN:VEVENT"))
      rawevents = rawcal.split("END:VEVENT")

      var events = []

      for (var i = 0; i < rawevents.length; i++) {
        var this_event = rawevents[i].split(/\s+/).join(" ")
        var summary = this_event.slice(this_event.indexOf("SUMMARY:")+"SUMMARY:".length, 
                                       this_event.indexOf("UID:"))

        var tag = summary.slice(summary.indexOf('[')+1, summary.indexOf(']'))
        tag = tag.replace(/ /g, '')

        if (tag == req.params.subcal.replace(/ /g, '')){
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

        muxed_cal += "\nEND:VCALENDAR"
      }

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
