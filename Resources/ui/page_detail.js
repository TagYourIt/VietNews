var createPageDetail = function(title, slug) {
    var l_post_source = L('post_source');

    var tb_height;

    tb_height = Titanium.Platform.displayCaps.platformHeight-60-config.ADMOB_IPHONE_HEIGHT;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.ipadh) {
      tb_height = Titanium.Platform.displayCaps.platformHeight-60-config.ADMOB_IPAD_HEIGHT;
    }

    var Window = Ti.UI.createWindow({
            backgroundColor: '#fff',
            navBarHidden: false,
            barColor: skin.POST_BAR_COLOR,
            barImage: skin.POST_BAR_IMAGE,
            layout: "vertical",
        }),
        webview = Ti.UI.createWebView({
            visible: false,
            height: tb_height,
            width: Titanium.Platform.displayCaps.platformWidth
        });

    var page_data = new Object;

    Window.add(webview);

    Window.addEventListener("focus", function(e) {
        seconds = '-' + config.FORCE_RELOAD_TIME;
        db = Titanium.Database.open(config.DB_NAME);
        row = db.execute("SELECT COUNT(*) FROM FETCH_LOG WHERE SECTION = ? AND UPDATED_AT > DATETIME('now',?) ", slug, seconds);
        count = row.field(0);
        db.close();

        if (count == 0) {
            webview.html = '';
            var json_url_page = config.BLOG_URL + "?json=get_page&slug=" + slug + "&apikey=" + config.JSON_API_KEY;

            load(json_url_page, slug);
        }
        else {
            load_db(slug);
        }
    });

    function load_db(section) {
        db = Titanium.Database.open(config.DB_NAME);
        row = db.execute("SELECT PAGE_ID, TITLE, CONTENT, AUTHOR, URL, DATE, SECTION FROM PAGES WHERE SECTION = ?", section);

        page = new Object;
        page.id = row.field(0);
        page.title = row.field(1);
        page.title_plain = row.field(1);
        page.content = row.field(2);
        page.author = row.field(3);
        page.url = row.field(4);
        page.date = row.field(5);
        page.section = row.field(6);

        db.close();

        page_data = page;

        show(page);
    }

    function load(data, section) {
        load_indicator_start(Window);

        db = Titanium.Database.open(config.DB_NAME);
        db.execute("INSERT INTO FETCH_LOG (SECTION, UPDATED_AT) values (?, CURRENT_TIMESTAMP)", slug);
        db.close();

        var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function() {
            var data = [];
            var json = JSON.parse(this.responseText);
            var page_data = page = json.page;

            save(page);
            show(page);
            load_indicator_stop(Window);
        };
        xhr.open("GET", data);
        xhr.send();
    }

    function save(page) {
        db = Titanium.Database.open(config.DB_NAME);
        row = db.execute("SELECT COUNT(*) FROM PAGES WHERE PAGE_ID = ? AND SECTION = ?", page.id, page.slug);
        count = row.field(0);

        if (count == 0) {
            db.execute("INSERT INTO PAGES (PAGE_ID, TITLE, CONTENT, AUTHOR, URL, DATE, SECTION) VALUES (?,?,?,?,?,?,?)", page.id, page.title_plain, page.content, page.author.nickname, page.url, page.date, page.slug);
        }

        db.close();
    }

    function show(page) {
        style = '<link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css">';
        style = style + "<style>body {margin:10px} h1 {margin-bottom:0;} h5 { margin-bottom:10px;color: #444444; }</style>";

        if (config.FIX_IMG_POST == '1') {
            style = style + "<style>img { display:block; margin: 10px 0; max-width: 300px;}</style>";
        }

        header = "<h1>" + page.title_plain + "</h1>";

        var webcontent = style + header + page.content;

        webview.html = webcontent;
        webview.show();

        var url = page.url;
        var email_subject = page.title_plain;
        var email_body = '<p>' + l_post_source + ': <a href="' + url + '">' + url + "</a></p>\n\n" + webcontent;

        create_share_button(Window, url, email_subject, email_body);
    }
    //create_admob(Window);

    return Window;
};