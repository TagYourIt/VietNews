var winTwit = (function() {
    var Window = Ti.UI.createWindow({
        navBarHidden: false,
        barColor: skin.TWITTER_BAR_COLOR,
        barImage: skin.TWITTER_BAR_IMAGE,
        titleid: 'twitter',
    });

    var tb_height;

    tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.ipadh) {
      tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT;
    }
    
    var tableview = Titanium.UI.createTableView({
        minRowHeight: 60,
        top: 0,
        left: 0,
        width: Titanium.Platform.displayCaps.platformWidth,
        height: tb_height,
        separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
        separatorColor: skin.TWITTER_TV_SEPARATOR_COLOR
    });
    
    Window.add(tableview);

    Ti.App.addEventListener('twmob', function(e) { alert(e.id);
        Window.tabGroup.activeTab.open(createWebView('https://mobile.twitter.com/dodyrw/status/'+e.id), { animated: true });      
    });
    
    function create_twitter_row(id, tweet, user, avatar, date, bgcolor) {
        var row = Ti.UI.createTableViewRow({
            hasChild: false,
            height: 'auto',
            backgroundColor: bgcolor
        });

        var av = Ti.UI.createImageView({
            image: avatar,
            left: 5,
            top: 5,
            height: 48,
            width: 48
        });
        
        var user_label = Ti.UI.createLabel({
            text: user,
            left: 60,
            width: 120,
            top: 5,
            bottom: 2,
            height: 'auto',
            textAlign: 'left',
            color: skin.TWITTER_TV_TITLE_COLOR,
            font: {
                fontSize: 14,
                fontWeight: 'bold'
            }
        });

        var date_label = Ti.UI.createLabel({
            text: date,
            top: 5,
            bottom: 2,
            height: 'auto',
            textAlign: 'right',
            width: 110,
            right: 5,
            color: skin.TWITTER_TV_META_COLOR,
            font: {
                fontSize: 12
            }
        });

        var tweet_text = Ti.UI.createLabel({
            text: tweet,
            left: 60,
            top: 25,
            bottom: 5,
            color: skin.TWITTER_TV_TITLE_COLOR,
            height: 'auto',
            width: Titanium.Platform.displayCaps.platformWidth-54,
            textAlign: 'left',
            font: {
                fontSize: 13
            }
        });

        row.add(av);  
        row.add(user_label);
        row.add(date_label);
        row.add(tweet_text);

        if (skin.TWITTER_TV_GRADIENT) {
            row.backgroundGradient = skin.TWITTER_TV_GRADIENT;
        }
        
        row.addEventListener("click", function(e) {
            Window.tabGroup.activeTab.open(createWebView('https://mobile.twitter.com/dodyrw/status/'+id), { animated: true });      
        });
            
        return row;        
    }

    function load(screen_name) {
        // var data = [];
        var rows = [];

        var xhr = Ti.Network.createHTTPClient();
        xhr.timeout = 1000000;
        xhr.open("GET", "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + screen_name);
    
        xhr.onload = function() {
            try {
                load_indicator_start(Window);
                
                var tweets = eval('(' + this.responseText + ')');
    
                for (var c = 0; c < tweets.length; c++) {
    
                    var tweet_id = tweets[c].id_str;  
                    var tweet = tweets[c].text;  
                    var user = tweets[c].user.screen_name;
                    var avatar = tweets[c].user.profile_image_url;
                    var created_at = tweets[c].created_at; 
                    var created_at = prettyDate_twitter(strtotime(tweets[c].created_at)); 
                    var bgcolor = (c % 2) == 0 ? skin.TWITTER_TV_BGCOLOR : skin.TWITTER_TV_BGCOLOR_ALT;
                    
                    rows.push(create_twitter_row(tweet_id, tweet, user, avatar, created_at, bgcolor));
                }
    
                createTwitterPost(rows);
                
                load_indicator_stop(Window);
            }
            catch (E) {
            }
        };
    
        xhr.send();
    }
    
    function createTwitterPost(list) {
        tableview.setData(list);
    }
    
    load(config.TWITTER_ACCOUNT);
    
    // create_admob(Window);
    
    pull_to_refresh_twitter(Window, tableview);
    
    Window.load = load;
    
    return Window;
})();