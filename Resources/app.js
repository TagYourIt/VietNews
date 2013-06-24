// load module
var Admob = require('ti.admob');

Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.TRANSLUCENT_BLACK;

// load config
Ti.include("config.js");
Ti.include("skin/"+config.SKIN+".js");
Ti.include("categ_list.js");
Ti.include("pages_list.js");

var json_url_recent = config.BLOG_URL + "?json=get_recent_posts&count=" + 
                      config.JSON_POST_COUNT + "&apikey=" + 
                      config.JSON_API_KEY;

var winCategBlogList;

Ti.include(
    "lib/php.js",
    "lib/prettydate.js",
    "lib/load_indicator.js",
    "lib/pull_to_refresh.js",
    "lib/share.js",
    "lib/admob.js",
    "lib/htmldecode.js",
    "lib/push.js",
    "ui/recent.js",
    "ui/list.js",
    "ui/categ.js",
    "ui/about.js",
    "ui/post.js",  
    "ui/webview.js",
    //"ui/twitter.js",
    //"ui/page.js",
    //"ui/page_detail.js",
    "ui/wpapp.js"
);

WpApp.init_db();
WpApp.open();