function create_admob(win) {
 
  var ad;
	var ad_top, ad_left, ad_height, ad_width;
	
	if (Titanium.Platform.displayCaps.platformHeight==xscreen.iphoneh) {
		ad_top = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;
		ad_left = 0;
		ad_height = config.ADMOB_IPHONE_HEIGHT;
		ad_width = config.ADMOB_IPHONE_WIDTH;
	}
	else {
		ad_top = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT; 
		ad_left = (Titanium.Platform.displayCaps.platformWidth-config.ADMOB_IPAD_WIDTH)/2;
    ad_height = config.ADMOB_IPAD_HEIGHT;
    ad_width = config.ADMOB_IPAD_WIDTH;
	}
	
  ad = Admob.createView({
      top: ad_top, left: ad_left,
      width: ad_width, height: ad_height,
      publisherId: config.ADMOB_PUBLISHER_ID, // You can get your own at http: //www.admob.com/
      adBackgroundColor: config.ADMOB_BGCOLOR,
      testing: config.ADMOB_TESTING,
      dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
      gender: 'male',
      keywords: ''
  });
  
  
  
  
 /*
ad.addEventListener('didReceiveAd', function() {
    alert('Did receive ad!');
});
ad.addEventListener('didFailToReceiveAd', function() {
    alert('Failed to receive ad!');
});
ad.addEventListener('willPresentScreen', function() {
    alert('Presenting screen!');
});
ad.addEventListener('willDismissScreen', function() {
    alert('Dismissing screen!');
});
ad.addEventListener('didDismissScreen', function() {
    alert('Dismissed screen!');
});
ad.addEventListener('willLeaveApplication', function() {
    alert('Leaving the app!');
});


*/

//User current location
/*
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 0;
Ti.Geolocation.purpose = 'To show you local ads, of course!';
Ti.Geolocation.getCurrentPosition(function reportPosition(e) {
    if (!e.success || e.error) {
        // aw, shucks...
    }
    else {
        win.add(Admob.createView({
            top: 100, left: 0,
            width: 320, height: 50,
            publisherId: config.ADMOB_PUBLISHER_ID, // You can get your own at http: //www.admob.com/
            adBackgroundColor: config.ADMOB_BGCOLOR,
            testing: config.ADMOB_TESTING,
            dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
            gender: config.ADMOB_GENDER,
            keywords: config.ADMOB_KEYWORD,
            location: e.coords
        }));
    }
});


win.add(Ti.UI.createLabel({
    text: 'Loading the ads now! ' +
        'Note that there may be a several minute delay ' +
        'if you have not viewed an ad in over 24 hours.',
    bottom: 40,
    height: Ti.UI.SIZE || 'auto', width: Ti.UI.SIZE || 'auto'
}));
win.open();


*/

  

  win.add(ad);  
 
}
