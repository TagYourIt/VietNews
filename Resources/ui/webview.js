var createWebView = function(url, title) {
    var tb_height;

    tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPHONE_HEIGHT;

    if (Titanium.Platform.displayCaps.platformHeight==xscreen.ipadh) {
      tb_height = Titanium.Platform.displayCaps.platformHeight-110-config.ADMOB_IPAD_HEIGHT;
    }

    var Window = Ti.UI.createWindow({
            navBarHidden: false,
            barColor: skin.WEBVIEW_BAR_COLOR,
            barImage: skin.WEBVIEW_BAR_IMAGE,
            title: title
        }),
        web = Ti.UI.createWebView({
            visible: false,
            top:0,
            height: tb_height,
            width: Titanium.Platform.displayCaps.platformWidth,
            url: url
        });
	create_admob(Window);
    Window.add(web);
    web.show();

    

    return Window;
};