var toolActInd = Titanium.UI.createActivityIndicator();

function load_indicator_start(win) {
    var l_indicator_loading = L('indicator_loading');
    toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
    toolActInd.font = {
        fontFamily: 'Helvetica Neue',
        fontSize: 15,
        fontWeight: '100'
    };
    toolActInd.color = 'white';
    toolActInd.message = l_indicator_loading;
    win.setToolbar([toolActInd], { animated: true });
    toolActInd.show();
}

function load_indicator_stop(win) {
    toolActInd.hide();
    win.setToolbar(null, { animated: true });
}