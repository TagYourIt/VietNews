var WpApp = (function() {

    var WpApp = Ti.UI.createTabGroup({}),
        
   	  Recent = Ti.UI.createTab({
            titleid : 'wpapp_recent',
            icon : "imgs/categ/newspaper.png",
            window : winRecent
        }),
        Categ = Ti.UI.createTab({
            titleid : 'wpapp_categories',
            icon : "imgs/categ/categ.png",
            window : winCateg
        });
        
    var events = {
        "SHOW_BLOG_POST": "WpApp : SHOW_BLOG_POST"
    };

    var blog_post = {};

    WpApp.addTab(Recent);
    WpApp.addTab(Categ);
    // WpApp.addTab(Pages);
    // WpApp.addTab(Twit);
    // WpApp.addTab(Fb);
    // WpApp.addTab(Yt);
    // WpApp.addTab(Flickr);
     //WpApp.addTab(About);

    WpApp.addEventListener(
    events.SHOW_BLOG_POST, function(e) {

        if (e.tab == "recent_post") {
            Recent.open(createBlogDetail(blog_post[e.id]), { animated: true });
        }
        else if (e.tab == "categories") {
            Categ.open(createBlogDetail(blog_post[e.id]), { animated: true });
        }
    });

    function load_db(win, section) {
        var data = [];
        db = Titanium.Database.open(config.DB_NAME);
        rows = db.execute("SELECT POST_ID, TITLE, DESCRIPTION, CONTENT, AUTHOR, IMAGE, URL, DATE, SECTION FROM POSTS WHERE SECTION = ? ORDER BY DATE DESC", section);

        var dataArray = [];
        i = 0;

        while (rows.isValidRow()) {

            var remote_image = get_first_image_src(rows.fieldByName('CONTENT'));

            if (remote_image == null) {
                remote_image = config.DEFAULT_IMAGE;
            }

            if (prettyDate(rows.fieldByName('DATE')) == null) {
                pretty_date = date("F j, Y", strtotime(rows.fieldByName('DATE')));
            }
            else {
                pretty_date = prettyDate(rows.fieldByName('DATE'));
            }

            dataArray.push({
                id: rows.fieldByName('POST_ID'),
                title: rows.fieldByName('TITLE'),
                description: rows.fieldByName('DESCRIPTION'),
                content: rows.fieldByName('CONTENT'),
                // meta: pretty_date + ' | ' + rows.fieldByName('AUTHOR'),
                meta: pretty_date,
                
                image: remote_image,
                url: rows.fieldByName('URL'),
                date: rows.fieldByName('DATE')
            });

            var p = new Object();

            p.id = rows.fieldByName('POST_ID');
            p.title = rows.fieldByName('TITLE');
            p.description = rows.fieldByName('DESCRIPTION');
            p.content = rows.fieldByName('CONTENT');
            p.meta = pretty_date + ' | ' + rows.fieldByName('AUTHOR'), p.image = remote_image, p.url = rows.fieldByName('URL');
            p.date = rows.fieldByName('DATE');
            p.author = {
                nickname: rows.fieldByName('AUTHOR')
            };

            blog_post[p.id] = p;

            rows.next();

            i++;
        };

        rows.close()
        db.close()

        if (section == 'recent_post') {
            Ti.App.fireEvent(
            winRecent.events.SET_BLOG_LIST_RECENT, {
                list_data: dataArray
            });
        }
        else {
            Ti.App.fireEvent(
            win.events.SET_BLOG_LIST, {
                list_data: dataArray
            });
        }
    }

    function load(win, data, section) {
        load_indicator_start(win);

        db = Titanium.Database.open(config.DB_NAME);
        db.execute("INSERT INTO FETCH_LOG (SECTION, UPDATED_AT) values (?, CURRENT_TIMESTAMP)", section);
        db.close();

        var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function() {
            var data = [];
            var json = JSON.parse(this.responseText);

            set_blog_post_data(win, json, section);
        };
        xhr.open("GET", data);
        xhr.send();
    }

    function set_blog_post_data(win, data, section) {
        var p = data.posts || data;
        var valid_title;
        var blog_post_temp = [];

        for (var i = 0; i < p.length; i++) {
            valid_title = p[i].title_plain;
            blog_post[p[i].id] = p[i];

            // save to db, check whenever post_id is exist
            db = Titanium.Database.open(config.DB_NAME);
            row = db.execute("SELECT COUNT(*) FROM POSTS WHERE POST_ID = ? AND SECTION = ?", p[i].id, section);
            count = row.field(0);

            if (count == 0) {
                var remote_image = get_first_image_src(p[i].content);

                if (remote_image == null) {
                    remote_image = config.DEFAULT_IMAGE;
                }

                db.execute("INSERT INTO POSTS (POST_ID, TITLE, DESCRIPTION, CONTENT, AUTHOR, IMAGE, URL, DATE, SECTION) VALUES (?,?,?,?,?,?,?,?,?)", p[i].id, valid_title, p[i].excerpt, p[i].content, p[i].author.nickname, remote_image, p[i].url, p[i].date, section);
            }

            db.close();
        }

        load_indicator_stop(win);
        load_db(win, section);
    }

    function init_db() {
        var db = Titanium.Database.open(config.DB_NAME);
        db.execute('CREATE TABLE IF NOT EXISTS POSTS (POST_ID INTEGER, TITLE VARCHAR(255), DESCRIPTION TEXT, CONTENT TEXT, AUTHOR TEXT, IMAGE VARCHAR(255), URL VARCHAR(255), DATE VARCHAR(255), SECTION VARCHAR(255))');
        db.execute('CREATE TABLE IF NOT EXISTS FETCH_LOG (SECTION VARCHAR(255), UPDATED_AT VARCHAR(255))');
        db.execute('CREATE TABLE IF NOT EXISTS PAGES (PAGE_ID INTEGER, TITLE VARCHAR(255), CONTENT TEXT, AUTHOR TEXT, URL VARCHAR(255), DATE VARCHAR(255), SECTION VARCHAR(255))');
        db.execute('CREATE INDEX IF NOT EXISTS POSTID ON POSTS (POST_ID)');
        db.execute('CREATE INDEX IF NOT EXISTS POSTSECTION ON POSTS (SECTION)');
        db.execute('CREATE INDEX IF NOT EXISTS PAGEID ON PAGES (PAGE_ID)');
        db.execute('CREATE INDEX IF NOT EXISTS PAGESECTION ON POSTS (SECTION)');
        
        db.close();
    }

    function get_first_image_src(html) {
        String.prototype.reverse = function() {
            return this.split('').reverse().join('');
        };

        var input = html;
        var matches = input.reverse().match(/(gepj|gpj|fig|gnp)\..+?\/\/:ptth(?=\"\=crs)/g);

        if (Array.isArray(matches)) {
            for (i = 0; i < matches.length; i++) {
                matches[i] = matches[i].reverse();
            }

            return matches[0];
        }
        else {
            return null;
        }
    }

    WpApp.events = events;
    WpApp.load = load;
    WpApp.load_db = load_db;
    WpApp.init_db = init_db;
    //WpApp.About = About;
    //WpApp.Pages = Pages;

    return WpApp;
})();