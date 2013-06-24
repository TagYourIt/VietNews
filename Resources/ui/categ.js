var winCateg = (function() {
    var Window = Ti.UI.createWindow({
            navBarHidden: false,
            titleid: 'categ_categories',
            barColor: skin.CATEG_BAR_COLOR,
            barImage: skin.CATEG_BAR_IMAGE,
            backgroundColor: skin.CATEG_DASHBOARD_BGCOLOR
        });

    var categ = categ_list.categs;
    var data = [];

    for (var i = 0; i < categ.length; i++) {
        var item = Titanium.UI.createDashboardItem({
            image: categ[i].icon_off,
            selectedImage: categ[i].icon_on,
            label: categ[i].label,
            slug: categ[i].slug,
            json_url: config.BLOG_URL + "?json=get_category_posts&count=" + config.JSON_POST_COUNT + "&apikey=" + config.JSON_API_KEY + "&slug=" + categ[i].slug
        });

        data.push(item);
    }

    var tb_height, dashboard_top;

    tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;
    dashboard_top = 10;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.ipadh) {
      tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT;
      dashboard_top = 0;
    }

    var dashboard = Titanium.UI.createDashboardView({
        data: data,
        top: dashboard_top,
        height: tb_height,
        width: Titanium.Platform.displayCaps.platformWidth,
        canDelete: false
    });

    Window.add(dashboard);
    dashboard.stopEditing();

    var cancel = Titanium.UI.createButton({
        backgroundColor: skin.CATEG_BAR_COLOR,
        systemButton: Titanium.UI.iPhone.SystemButton.DONE
    });

    cancel.addEventListener('click', function() {
        dashboard.stopEditing();
    });

    dashboard.addEventListener('edit', function() {
        Window.rightNavButton = cancel;
    });

    dashboard.addEventListener('commit', function() {
        Window.rightNavButton = null;
    });

    dashboard.addEventListener('dragStart', function(e) {
        Window.rightNavButton = null;
    });

    dashboard.addEventListener('dragEnd', function(e) {
        Window.rightNavButton = cancel;
    });

    dashboard.addEventListener('click', function(e) {
        winCategBlogList = createBlogPostList(e.item.json_url, e.item.label, e.item.slug);
        Window.tabGroup.activeTab.open(winCategBlogList, { animated: true });
    });

     create_admob(Window);

    return Window;
})();