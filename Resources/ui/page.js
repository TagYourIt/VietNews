var winPages = (function() {
    var l_pages_available = L('pages_available');

    var Window = Ti.UI.createWindow({
        navBarHidden: false,
        titleid: 'pages',
        barColor: skin.PAGES_BAR_COLOR,
        barImage: skin.PAGES_BAR_IMAGE
    });

    var tb_height;

    tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.ipadh) {
      tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT;
    }

    var tableview = Titanium.UI.createTableView({
        backgroundColor: '#ccc',
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
        top: 0,
        height: tb_height,
        width: Titanium.Platform.displayCaps.platformWidth
    });

    var events = {
        "SHOW_PAGE": "winPages : SHOW_PAGE"
    };

    var pages = pages_list.pages;
    var data = [];
    
    data[0] = Ti.UI.createTableViewSection({
        headerTitle: l_pages_available
    });

    for (var i = 0; i < pages.length; i++) {
        if (pages[i].image == null) {
            pages[i].image = config.DEFAULT_PAGES_IMAGE;
        }

        if (i % 2) {
            bgcolor = skin.PAGES_TV_BGCOLOR;
        }
        else {
            bgcolor = skin.PAGES_TV_BGCOLOR_ALT;
        }

        var title = pages[i].label;
        var slug = pages[i].slug;

        data[0].add(createPageRow(title, pages[i].image, slug));
    }

    tableview.setData(data);

    Window.add(tableview);

    Window.addEventListener(
    events.SHOW_PAGE, function(e) {
        Window.tabGroup.activeTab.open(createPageDetail(e.title, e.slug), {
            animated: true
        });
    });

    function createPageRow(title, image, slug) {
        var row = Ti.UI.createTableViewRow({
                title: title,
                leftImage: pages[i].image,
                backgroundColor: bgcolor,
                color: skin.PAGES_TV_TITLE_COLOR
            });

        row.addEventListener("click", function(e) {
            Window.fireEvent(
            Window.events.SHOW_PAGE, {
                "title": title,
                "slug": slug
            });
        });

        return row;
    }

     create_admob(Window);

    Window.events = events;

    return Window;
})();