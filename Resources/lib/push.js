
if (config.APNS_USE_URBAN_AIRSHIP!='1') {
  
    // USE any apns script, or DDAPNS
    
    Titanium.Network.registerForPushNotifications({
        types: [
            Titanium.Network.NOTIFICATION_TYPE_BADGE,
            Titanium.Network.NOTIFICATION_TYPE_ALERT,
            Titanium.Network.NOTIFICATION_TYPE_SOUND,
            Titanium.Network.NOTIFICATION_TYPE_NEWSSTAND
        ],
        success:function(e)
        {
            var deviceToken = e.deviceToken;
            Ti.API.info("Push notification device token is: "+deviceToken);
            Ti.API.info("Push notification types: "+Titanium.Network.remoteNotificationTypes);
            Ti.API.info("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);

            // save to server
            var apns_key = '123456';
            var url = config.DDAPNS_URL+"subscribe.php?key="+config.DDAPNS_ACCESS_KEY+"&token="+deviceToken;
                var xhr = Titanium.Network.createHTTPClient();
                xhr.onload = function() {
                    var url = [];
                    var json = JSON.parse(this.responseText);
        
                    set_blog_post_data(win, json, section);
                };
                xhr.open("GET", url);
                xhr.send();

        },
        error:function(e)
        {
            Ti.API.info("Error during registration: "+e.error);
        },
        callback:function(e)
        {
            // called when a push notification is received.
            // alert(JSON.stringify(e.data));

            var a = Titanium.UI.createAlertDialog({
              title:Ti.App.name,
              message:e.data.alert
            });
            
            a.show();
        }
    }); 
    
} 

// this is for URBAN AIRSHIP
else
{

    var APP_KEY = config.URBAN_AIRSHIP_APP_KEY;
    var APP_SECRET = config.URBAN_AIRSHIP_MASTER_SECRET; 
     
    Titanium.Network.registerForPushNotifications({
        types:[
            Titanium.Network.NOTIFICATION_TYPE_BADGE,
            Titanium.Network.NOTIFICATION_TYPE_ALERT,
            Titanium.Network.NOTIFICATION_TYPE_SOUND
        ],
        success: successCallback,
        error: errorCallback,
        callback: messageCallback
    });
    
    function successCallback(e) {
        var request = Titanium.Network.createHTTPClient({
            onload:function(e) {
                if (request.status != 200 && request.status != 201) {
                    request.onerror(e);
                    return;
                }
            },
            onerror:function(e) {
                Ti.API.info("Register with Urban Airship Push Service failed. Error: "
                    + e.error);
            }
        });
     
        // Register device token with UA
        request.open('PUT', 'https://go.urbanairship.com/api/device_tokens/'
            + e.deviceToken, true);
        request.setRequestHeader('Authorization','Basic '  +
            Titanium.Utils.base64encode(APP_KEY + ':' + APP_SECRET));
        request.send();
    }
    
    function errorCallback(e) {
        Ti.API.info("Error during registration: " + e.error);
    }
    
    function messageCallback(e) {
         var message;
         if(e['aps'] != undefined) {
              if(e['aps']['alert'] != undefined){
                   if(e['aps']['alert']['body'] != undefined){
                        message = e['aps']['alert']['body'];
                   } else {
                        message = e['aps']['alert'];
                   }
              } else {
                   message = 'No Alert content';
              }
         } else {
              message = 'No APS content';
         }
         // alert(message);
    }    
};