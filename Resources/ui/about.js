var winAbout = (function() {
    var l_about_reset_data = L('about_reset_data'),
        l_about_alert = L('about_alert'),
        l_about_yes = L('about_yes'),
        l_about_no = L('about_no'),
        l_about_contact_webmaster = L('about_contact_webmaster'),
        l_about_tell_a_friend = L('about_tell_a_friend'),
        l_about_visit_website = L('about_visit_website'),
        l_about_terms_and_conditions = L('about_terms_and_conditions'),
        l_about_privacy_policy = L('about_privacy_policy'),        
        l_webmaster_subject = L('webmaster_subject'),
        l_webmaster_body = L('webmaster_body'),
        l_tell_friend_subject = L('tell_friend_subject'),
        l_tell_friend_body = L('tell_friend_body');

    var Window = Ti.UI.createWindow({
        navBarHidden: false,
        barColor: skin.ABOUT_BAR_COLOR,
        barImage: skin.ABOUT_BAR_IMAGE,
        titleid: 'about',
    });

    var alertDialog = Titanium.UI.createAlertDialog({
        title: l_about_reset_data,
        message: l_about_alert,
        buttonNames: [l_about_yes, l_about_no],
        cancel: 1
    });;

    alertDialog.addEventListener('click', function(e) {

        if (e.index==0) {
            db = Titanium.Database.open(config.DB_NAME);
            db.execute('DELETE FROM POSTS');
            db.execute('DELETE FROM PAGES');
            db.execute('DELETE FROM FETCH_LOG');
            db.close();

            Ti.App.fireEvent(
            winRecent.events.RESET_TABLEVIEW_RECENT);

            Ti.App.fireEvent(
            winCategBlogList.events.RESET_TABLEVIEW);
        }
    });

    var data = [];

    data[0] = Ti.UI.createTableViewSection({});
    data[0].add(Ti.UI.createTableViewRow({title: l_about_contact_webmaster, backgroundColor: '#fff'}));
    data[0].add(Ti.UI.createTableViewRow({title: l_about_tell_a_friend, backgroundColor: '#fff'}));
    data[0].add(Ti.UI.createTableViewRow({title: l_about_visit_website, backgroundColor: '#fff'}));
    data[1] = Ti.UI.createTableViewSection({});
    data[1].add(Ti.UI.createTableViewRow({title: l_about_terms_and_conditions, backgroundColor: '#fff'}));
    data[1].add(Ti.UI.createTableViewRow({title: l_about_privacy_policy, backgroundColor: '#fff'}));
    data[2] = Ti.UI.createTableViewSection({});
    data[2].add(Ti.UI.createTableViewRow({title: l_about_reset_data, backgroundColor: '#fff'}));

    var tb_height;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.iphoneh) {
      tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;
    }
    else {
      tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT;
    }

    var tableview = Titanium.UI.createTableView({
        backgroundColor: '#ccc',
        data:data,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
        top: 0,
        height: tb_height,
        width: Titanium.Platform.displayCaps.platformWidth
    });

    tableview.addEventListener('click', function(e) {
        if (e.index==0) {
            var emailDialog = Titanium.UI.createEmailDialog();
            emailDialog.toRecipients = [config.WEBMASTER_EMAIL];
            emailDialog.subject = l_webmaster_subject;
            emailDialog.messageBody = l_webmaster_body;
            emailDialog.html = true;
            emailDialog.open();
        }
        else if (e.index==1) {
            var emailDialog = Titanium.UI.createEmailDialog();
            emailDialog.subject = l_tell_friend_subject;
            emailDialog.messageBody = l_tell_friend_body;
            emailDialog.html = true;
            emailDialog.open();
        }
        else if (e.index==2) {
            Ti.Platform.openURL(config.BLOG_URL);
        }
        else if (e.index==3) {
            Window.tabGroup.activeTab.open(createWebView('web/terms.html'), { animated: true });
        }
        else if (e.index==4) {
            Window.tabGroup.activeTab.open(createWebView('web/privacy.html'), { animated: true });
        }
        else if (e.index==5) {
            alertDialog.show();
        }
    });

    Window.add(tableview);

    // create_admob(Window, 0);

    return Window;
})();