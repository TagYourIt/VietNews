

var winRecent = (function() {
    var l_recent_post = L('recent_news');
    
    var tb_height;
    
  	tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.ipadh) {
    	tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT;
    }
    
    url = json_url_recent;
    title = l_recent_post;
    section = 'recent_post';

	var Window = Ti.UI.createWindow({
        navBarHidden: false, //true for custom tab bar
        title: title,
        barColor: skin.RECENT_BAR_COLOR,
        barImage: skin.RECENT_BAR_IMAGE,
    }),
    viewBlogListRecent = Ti.UI.createTableView({
        top: 0,
        bottom: 0,
        height: tb_height,
        width: Titanium.Platform.displayCaps.platformWidth,
        separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
        separatorColor: skin.RECENT_TV_SEPARATOR_COLOR
    });



    var events = {
        "RESET_TABLEVIEW": "createBlogPostList : RESET_TABLEVIEW_RECENT",
        "ADD_NEW_BLOG_LIST_RECENT": "createBlogPostList : ADD_NEW_BLOG_LIST_RECENT",
        "SET_BLOG_LIST_RECENT": "createBlogPostList : SET_BLOG_LIST_RECENT"
    };

    Window.add(viewBlogListRecent);

    Ti.App.addEventListener(
    events.SET_BLOG_LIST_RECENT, function(e) {
        create_blog_list_recent(e.list_data);
    });

    Ti.App.addEventListener(
    events.ADD_NEW_BLOG_LIST_RECENT, function(e) {
        add_new_blog_list_recent(e.list_data);
    });

    Ti.App.addEventListener(
    events.RESET_TABLEVIEW_RECENT, function() {
        viewBlogListRecent.setData([]);
    });

    Window.addEventListener("focus", function(e) {
        seconds = '-'+config.FORCE_RELOAD_TIME;
        db = Titanium.Database.open(config.DB_NAME);
        row = db.execute("SELECT COUNT(*) FROM FETCH_LOG WHERE SECTION = ? AND UPDATED_AT > DATETIME('now',?) ", section, seconds);
        count = row.field(0);
        db.close();

        if (count == 0) {
          WpApp.load(Window, url, section);
        }

        WpApp.load_db(Window, section);
    });

    function create_blog_list_rows(id, title, description, content, meta, image, alt_bgcolor) {
        
        var max_title_length, title_width;

        if (Titanium.Platform.displayCaps.platformHeight==xscreen.iphoneh) {
          max_title_length = 52;
          title_width = Titanium.Platform.displayCaps.platform-100;
        }
        else {
          max_title_length = 130;
          title_width = Titanium.Platform.displayCaps.platform-100;
        }

        title = wpappHtmlDecode(title);

        if (title.length > max_title_length) {
            title = title.substring(0, max_title_length) + '...';
        }
        
        if (alt_bgcolor) {
          bgcolor = skin.RECENT_TV_BGCOLOR;
        }
        else {
          bgcolor = skin.RECENT_TV_BGCOLOR_ALT;
        }
        
        image = encodeURI(image);
        
        var row = Ti.UI.createTableViewRow({
                className: "blog_list_rows",
                height: 62,
                backgroundColor: bgcolor, 
                hasChild: false
            }),
            img = Ti.UI.createImageView({
                image: image,
                height: 56,
                left: 3,
                width: 75,
                top: 3,
                preventDefaultImage: false,
                defaultImage: config.DEFAULT_IMAGE
            }),
            title = Ti.UI.createLabel({
                text: title,
                width: title_width,
                height: 'auto',
                left: 82,
                top: 4,
                color: skin.RECENT_TV_TITLE_COLOR,
                font: {
                    fontSize: 14,
                    fontWeight: "normal"
                   
                }
            }),
            body = Ti.UI.createLabel({
                text: meta,
                width: 210,
                height: 30,
                left: 82,
                top: 22 + 12,
                color: skin.RECENT_TV_META_COLOR,
                font: {
                    fontSize: 12
                }
            });

        if (title.height == 18) {
            body.top = 18;
        }

        if (skin.RECENT_TV_GRADIENT) {
            row.backgroundGradient = skin.RECENT_TV_GRADIENT;
        }

        row.add(img);
        row.add(title);
        row.add(body);

        row.addEventListener("click", function(e) {
            if (section == 'recent_post') {
                WpApp.fireEvent(
                WpApp.events.SHOW_BLOG_POST, {
                    "id": id,
                    "tab": "recent_post"
                });
            }
            else {
                WpApp.fireEvent(
                WpApp.events.SHOW_BLOG_POST, {
                    "id": id,
                    "tab": "categories"
                });
            }
        });

        return row;
    }

    function create_blog_list_recent(list) {
        var rows = [];

        for (var i = 0, l = list.length; i < l; i++) {
            alt_bgcolor = i % 2;
            title = html_entity_decode(list[i].title);
            rows.push(
            create_blog_list_rows(
            list[i].id, title, list[i].description, list[i].content, list[i].meta, list[i].image, alt_bgcolor));
        }
        viewBlogListRecent.setData(rows);
    }

    function add_new_blog_list_recent(list) {
        create_blog_list_recent(list);

        // reserved for appendRow / insertRowBefore
        load_indicator_stop(Window);
    }

    Window.events = events;

    pull_to_refresh(Window, viewBlogListRecent, url, section);
    
    create_admob(Window);

    Titanium.UI.iPhone.appBadge = 0; // reset

    return Window;
})();