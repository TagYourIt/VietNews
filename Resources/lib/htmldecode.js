function wpappHtmlDecode(str) {
    // source: http://www.w3schools.com/tags/ref_symbols.asp
    str = html_entity_decode(str);
    str = str_replace(
            ['&#8216;','&#8221;','&#038;','&#8211;','&#8217;'], 
            ["'",'"','&','-',"'"], 
            str);
    return str;
}