function create_share_button(win, url, subject, body) {
    var l_share_this_on = L('share_this_on'),
        l_share_email = L('share_email'),
        l_share_cancel = L('share_cancel');

    var shareBtn = Ti.UI.createButton({
        titleid: 'share',
        width: 40,
        height: 25,
        font: {
            fontFamily: 'Helvetica',
            fontSize: 11,
            fontWeight: 'bold'
        }
    });

    win.setRightNavButton(shareBtn);

    shareBtn.addEventListener('click', function(e) {
        var dialog = Titanium.UI.createOptionDialog({
            title: l_share_this_on, 
            options: ['Facebook', l_share_email, l_share_cancel],
            destructive: 2
        });

        dialog.show();

        dialog.addEventListener('click', function(e) {

            if (e.index == 0) {
                Ti.Platform.openURL('http://m.facebook.com/sharer.php?u=' + encodeURIComponent(url));
            }
            else if (e.index == 1) {

                var emailDialog = Titanium.UI.createEmailDialog();
                emailDialog.subject = subject;
                emailDialog.messageBody = body;
                emailDialog.html = true;
                emailDialog.open();
            }
            else if (e.index == 2) {} else {
                // Do nothing
            }
        });
    });
}