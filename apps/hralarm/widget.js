(() => {
  var settings = require('Storage').readJSON("hralarm.json", true) || {};
  if (!settings.enabled){ Bangle.setHRMPower(0, 'hralarm'); return; }
  Bangle.setHRMPower(1, 'hralarm');
  var hitLimit = 0;
  var checkHr = function(hr){
    if (hr.bpm > settings.warning && hr.bpm <= settings.upper){
      Bangle.buzz(100, 1);
      Bluetooth.println(JSON.stringify({t:"intent", target:"activity", action:"android.media.action.MEDIA_PLAY_FROM_SEARCH", flags:["FLAG_ACTIVITY_NEW_TASK"], categories:["android.intent.category.DEFAULT"], extra:{"query":'track:"Sittin\' on the Dock of the Bay" artist:"Otis Redding"'}}))
    }
    if (hitLimit < getTime() && hr.bpm > settings.upper){
      hitLimit = getTime() + 10;
      Bangle.buzz(2000, 1);
      Bluetooth.println(JSON.stringify({t:"intent", target:"activity", action:"android.media.action.MEDIA_PLAY_FROM_SEARCH", flags:["FLAG_ACTIVITY_NEW_TASK"], categories:["android.intent.category.DEFAULT"], extra:{"query":'track:"Sittin\' on the Dock of the Bay" artist:"Otis Redding"'}}))
    }
    if (hitLimit > 0 && hr.bpm < settings.lower){
      hitLimit = 0;
      Bangle.buzz(500, 1);
      Bluetooth.println(JSON.stringify({t:"intent", target:"activity", action:"android.media.action.MEDIA_PLAY_FROM_SEARCH", flags:["FLAG_ACTIVITY_NEW_TASK"], categories:["android.intent.category.DEFAULT"], extra:{"query":'track:"Sittin\' on the Dock of the Bay" artist:"Otis Redding"'}}))
    }
  };
  Bangle.on("HRM", checkHr);
  Bangle.on("BTHRM", checkHr);

  WIDGETS["hralarm"]={
    area:"tl",
    width: 0,
    draw: function(){}
  };
})()
