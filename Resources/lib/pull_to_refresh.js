function formatDate() {
    var date = new Date();
    var datestr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();

    if (date.getHours() >= 12) {
        datestr += ' ' + (date.getHours() == 12 ? date.getHours() : date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
    }
    else {
        datestr += ' ' + date.getHours() + ':' + date.getMinutes() + ' AM';
    }

    return datestr;
}

function pull_to_refresh(win, tableview, url, section) {
    var l_ptr_pull_to_reload = L('ptr_pull_to_reload'),
        l_ptr_last_updated = L('ptr_last_updated'),
        l_ptr_pull_down_to_refresh = L('ptr_pull_down_to_refresh'),
        l_ptr_release_to_refresh = L('ptr_release_to_refresh'),
        l_ptr_reloading = L('ptr_reloading');

    var border = Ti.UI.createView({
        backgroundColor: "#000000",
        height: 2,
        bottom: 0
    });

    var tableHeader = Ti.UI.createView({
        backgroundColor: "#000000",
        width: 320,
        height: 60
    });

    tableHeader.add(border);

    var arrow = Ti.UI.createView({
        backgroundImage: "imgs/whiteArrow.png",
        width: 23,
        height: 60,
        bottom: 10,
        left: 20
    });

    var statusLabel = Ti.UI.createLabel({
        text: l_ptr_pull_to_reload,
        left: 55,
        width: 200,
        bottom: 30,
        height: "auto",
        color: "#c1c1c1", //Pull to refresh color
        textAlign: "center",
        font: {
            fontSize: 13,
            fontWeight: "bold"
        },
        shadowColor: "#5d5d5d",
        shadowOffset: {
            x: 0,
            y: 1
        }
    });

    var lastUpdatedLabel = Ti.UI.createLabel({
        text: l_ptr_last_updated + formatDate(),
        left: 55,
        width: 200,
        bottom: 15,
        height: "auto",
        color: "#c1c1c1", //Last Updated color
        textAlign: "center",
        font: {
            fontSize: 12
        },
        shadowColor: "#5d5d5d",
        shadowOffset: {
            x: 0,
            y: 1
        }
    });

    var actInd = Titanium.UI.createActivityIndicator({
        left: 20,
        bottom: 13,
        width: 30,
        height: 30
    });

    tableHeader.add(arrow);
    tableHeader.add(statusLabel);
    tableHeader.add(lastUpdatedLabel);
    tableHeader.add(actInd);

    tableview.headerPullView = tableHeader;

    var pulling = false;
    var reloading = false;

    function beginReloading() {
        WpApp.load(win, url, section);
        setTimeout(endReloading, 1000);
    }

    function endReloading() {
        tableview.setContentInsets({ top: 0 }, { animated: true });
        reloading = false;
        lastUpdatedLabel.text = l_ptr_last_updated + formatDate();
        statusLabel.text = l_ptr_pull_down_to_refresh;
        actInd.hide();
        arrow.show();
    }
    
    

    var offset = 0;
    tableview.addEventListener('scroll', function (e) {
        offset = e.contentOffset.y;
        if (offset <= -65.0 && !pulling) {
            var t = Ti.UI.create2DMatrix();
            t = t.rotate(-180);
            pulling = true;
            arrow.animate({ transform: t, duration: 180 });
            statusLabel.text = l_ptr_release_to_refresh;
        }
        else if (pulling && offset > -65.0 && offset < 0) {
            pulling = false;
            var t = Ti.UI.create2DMatrix();
            arrow.animate({ transform: t, duration: 180 });
            statusLabel.text = l_ptr_pull_down_to_refresh;
        }
    });

    tableview.addEventListener('dragEnd', function (e) {
        if (pulling && !reloading && offset <= -65.0) {
            load_indicator_start(win);
            reloading = true;
            pulling = false;
            arrow.hide();
            actInd.show();
            statusLabel.text = l_ptr_reloading;
            tableview.setContentInsets({ top: 60 }, { animated: true });
            arrow.transform = Ti.UI.create2DMatrix();
            beginReloading();
        }
    });
    
}

function pull_to_refresh_twitter(win, tableview) {
    var l_ptr_pull_to_reload = L('ptr_pull_to_reload'),
        l_ptr_last_updated = L('ptr_last_updated'),
        l_ptr_pull_down_to_refresh = L('ptr_pull_down_to_refresh'),
        l_ptr_release_to_refresh = L('ptr_release_to_refresh'),
        l_ptr_reloading = L('ptr_reloading');

    var border = Ti.UI.createView({
        backgroundColor: "#ffcc15",
        height: 2,
        bottom: 0
    });

    var tableHeader = Ti.UI.createView({
        backgroundColor: "#000000",
        width: 320,
        height: 60
    });

    tableHeader.add(border);

    var arrow = Ti.UI.createView({
        backgroundImage: "imgs/whiteArrow.png",
        width: 23,
        height: 60,
        bottom: 10,
        left: 20
    });

    var statusLabel = Ti.UI.createLabel({
        text: l_ptr_pull_to_reload,
        left: 55,
        width: 200,
        bottom: 30,
        height: "auto",
        color: "#ffcc15",
        textAlign: "center",
        font: {
            fontSize: 13,
            fontWeight: "bold"
        },
        shadowColor: "#5d5d5d",
        shadowOffset: {
            x: 0,
            y: 1
        }
    });

    var lastUpdatedLabel = Ti.UI.createLabel({
        text: l_ptr_last_updated + formatDate(),
        left: 55,
        width: 200,
        bottom: 15,
        height: "auto",
        color: "#ffcc15",
        textAlign: "center",
        font: {
            fontSize: 12
        },
        shadowColor: "#5d5d5d",
        shadowOffset: {
            x: 0,
            y: 1
        }
    });

    var actInd = Titanium.UI.createActivityIndicator({
        left: 20,
        bottom: 13,
        width: 30,
        height: 30
    });

    tableHeader.add(arrow);
    tableHeader.add(statusLabel);
    tableHeader.add(lastUpdatedLabel);
    tableHeader.add(actInd);

    tableview.headerPullView = tableHeader;

    var pulling = false;
    var reloading = false;

    function beginReloading() {
        winTwit.load(config.TWITTER_ACCOUNT);
        setTimeout(endReloading, 1000);
    }

    function endReloading() {
        tableview.setContentInsets({ top: 0 }, { animated: true });
        reloading = false;
        lastUpdatedLabel.text = l_ptr_last_updated + formatDate();
        statusLabel.text = l_ptr_pull_down_to_refresh;
        actInd.hide();
        arrow.show();
    }

    var offset = 0;
    tableview.addEventListener('scroll', function (e) {
        offset = e.contentOffset.y;

        if (offset <= -65.0 && !pulling) {
            var t = Ti.UI.create2DMatrix();
            t = t.rotate(-180);
            pulling = true;
            arrow.animate({ transform: t, duration: 180 });
            statusLabel.text = l_ptr_release_to_refresh;
        }
        else if (pulling && offset > -65.0 && offset < 0) {
            pulling = false;
            var t = Ti.UI.create2DMatrix();
            arrow.animate({ transform: t, duration: 180 });
            statusLabel.text = l_ptr_pull_down_to_refresh;
        }
    });

    tableview.addEventListener('dragEnd', function(e) {
        if (pulling && !reloading && offset <= -65.0) {
            load_indicator_start(win);
            reloading = true;
            pulling = false;
            arrow.hide();
            actInd.show();
            statusLabel.text = l_ptr_reloading;
            tableview.setContentInsets({ top: 60 }, { animated: true });
            arrow.transform = Ti.UI.create2DMatrix();
            beginReloading();
        }
    });
}