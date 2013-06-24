var winSearch = (function() {
    var Window = Ti.UI.createWindow({
        navBarHidden: false,
        // titleid: 'search',
        // barColor: skin.SEARCH_BAR_COLOR,
        // barImage: skin.SEARCH_BAR_IMAGE
    });
    
    var search = Titanium.UI.createSearchBar({
         barColor:'#000',
        showCancel:true,
        hintText: 'Type a search term',
        height:43,
        top:0
    });
    
    search.addEventListener('return', function(e) {
        search.blur(); 
        do_search(e.value);
    });
    
    search.addEventListener('cancel', function(e) {
        search.blur();
    });


    function do_search(keyword) {
        var json_search = config.BLOG_URL + "?json=get_search_results&count=" + 
                          config.JSON_POST_COUNT + "&apikey=" + 
                          config.JSON_API_KEY + "&search=" + encodeURIComponent(keyword);
                          
        // WpApp.load(Window, json_search, encodeURIComponent(keyword));
        
        section = 'search_'+encodeURIComponent(keyword);
        
        seconds = '-'+config.FORCE_RELOAD_TIME;
        db = Titanium.Database.open(config.DB_NAME);
        row = db.execute("SELECT COUNT(*) FROM FETCH_LOG WHERE SECTION = ? AND UPDATED_AT > DATETIME('now',?) ", section, seconds);
        count = row.field(0);
        db.close();

        if (count == 0) {
          WpApp.load(Window, json_search, section);
        }

        WpApp.load_db(Window, section);


    }

    Window.add(search);


    return Window;

})();