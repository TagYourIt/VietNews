function str_replace (search, replace, subject, count) {
    // Replaces all occurrences of search in haystack with replace  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/str_replace
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Gabriel Paderni
    // +   improved by: Philip Peterson
    // +   improved by: Simon Willison (http://simonwillison.net)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   bugfixed by: Anton Ongson
    // +      input by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    tweaked by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   input by: Oleg Eremeev
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Oleg Eremeev
    // %          note 1: The count parameter must be passed as a string in order
    // %          note 1:  to find a global variable in which the result will be given
    // *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    // *     returns 1: 'Kevin.van.Zonneveld'
    // *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    // *     returns 2: 'hemmo, mars'
    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }
 
    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }
    return sa ? s : s[0];
}

function date (format, timestamp) {
    // http://kevin.vanzonneveld.net
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +      parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: MeEtc (http://yass.meetcweb.com)
    // +   improved by: Brad Touesnard
    // +   improved by: Tim Wiel
    // +   improved by: Bryan Elliott
    //
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: David Randall
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +  derived from: gettimeofday
    // +      input by: majak
    // +   bugfixed by: majak
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alex
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Thomas Beaucourt (http://www.webapp.fr)
    // +   improved by: JT
    // +   improved by: Theriault
    // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // +   bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
    // +      input by: Martin
    // +      input by: Alex Wilson
    // %        note 1: Uses global: php_js to store the default timezone
    // %        note 2: Although the function potentially allows timezone info (see notes), it currently does not set
    // %        note 2: per a timezone specified by date_default_timezone_set(). Implementers might use
    // %        note 2: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    // %        note 2: in order to adjust the dates in this function (or our other date functions!) accordingly
    // *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    // *     returns 1: '09:09:40 m is month'
    // *     example 2: date('F j, Y, g:i a', 1062462400);
    // *     returns 2: 'September 2, 2003, 2:26 am'
    // *     example 3: date('Y W o', 1062462400);
    // *     returns 3: '2003 36 2003'
    // *     example 4: x = date('Y m d', (new Date()).getTime()/1000); 
    // *     example 4: (x+'').length == 10 // 2009 01 09
    // *     returns 4: true
    // *     example 5: date('W', 1104534000);
    // *     returns 5: '53'
    // *     example 6: date('B t', 1104534000);
    // *     returns 6: '999 31'
    // *     example 7: date('W U', 1293750000.82); // 2010-12-31
    // *     returns 7: '52 1293750000'
    // *     example 8: date('W', 1293836400); // 2011-01-01
    // *     returns 8: '52'
    // *     example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    // *     returns 9: '52 2011-01-02'
    var that = this,
        jsdate, f, formatChr = /\\?([a-z])/gi,
        formatChrCb,
        // Keep this here (works, but for code commented-out
        // below for file size reasons)
        //, tal= [],
        _pad = function (n, c) {
            if ((n = n + '').length < c) {
                return new Array((++c) - n.length).join('0') + n;
            }
            return n;
        },
        txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    f = {
        // Day
        d: function () { // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () { // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function () { // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () { // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () { // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            return j < 4 | j > 20 && ['st', 'nd', 'rd'][j%10 - 1] || 'th'; 
        },
        w: function () { // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () { // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j()),
                b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5) + 1;
        },

        // Week
        W: function () { // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
                b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function () { // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () { // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () { // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function () { // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () { // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getDate();
        },

        // Year
        L: function () { // Is leap year?; 0 or 1
            var j = f.Y();
            return j%4==0 & j%100!=0 | j%400==0;
        },
        o: function () { // ISO-8601 year
            var n = f.n(),
                W = f.W(),
                Y = f.Y();
            return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
        },
        Y: function () { // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () { // Last two digits of year; 00...99
            return (f.Y() + "").slice(-2);
        },

        // Time
        a: function () { // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function () { // AM or PM
            return f.a().toUpperCase();
        },
        B: function () { // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2,
                // Hours
                i = jsdate.getUTCMinutes() * 60,
                // Minutes
                s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () { // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () { // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () { // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () { // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () { // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () { // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () { // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
/*              return this.date_default_timezone_get();
*/
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () { // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0),
                // Jan 1
                c = Date.UTC(f.Y(), 0),
                // Jan 1 UTC
                b = new Date(f.Y(), 6),
                // Jul 1
                d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return 0 + ((a - c) !== (b - d));
        },
        O: function () { // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset(),
                a = Math.abs(tzo);
            return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () { // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.
/*              var abbr = '', i = 0, os = 0, default = 0;
            if (!tal.length) {
                tal = that.timezone_abbreviations_list();
            }
            if (that.php_js && that.php_js.default_timezone) {
                default = that.php_js.default_timezone;
                for (abbr in tal) {
                    for (i=0; i < tal[abbr].length; i++) {
                        if (tal[abbr][i].timezone_id === default) {
                            return abbr.toUpperCase();
                        }
                    }
                }
            }
            for (abbr in tal) {
                for (i = 0; i < tal[abbr].length; i++) {
                    os = -jsdate.getTimezoneOffset() * 60;
                    if (tal[abbr][i].offset === os) {
                        return abbr.toUpperCase();
                    }
                }
            }
*/
            return 'UTC';
        },
        Z: function () { // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () { // ISO-8601 date.
            return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () { // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () { // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (timestamp == null ? new Date() : // Not provided
        (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function strtotime (str, now) {
    // Convert string representation of date and time to a timestamp  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/strtotime    // +   original by: Caio Ariede (http://caioariede.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: David
    // +   improved by: Caio Ariede (http://caioariede.com)
    // +   improved by: Brett Zamir (http://brett-zamir.me)    // +   bugfixed by: Wagner B. Soares
    // +   bugfixed by: Artur Tchernychev
    // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    // *     example 1: strtotime('+1 day', 1129633200);
    // *     returns 1: 1129719600    // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    // *     returns 2: 1130425202
    // *     example 3: strtotime('last month', 1129633200);
    // *     returns 3: 1127041200
    // *     example 4: strtotime('2009-05-04 08:30:00');    // *     returns 4: 1241418600
    var i, match, s, strTmp = '',
        parse = '';
 
    strTmp = str;    strTmp = strTmp.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
    strTmp = strTmp.replace(/[\t\r\n]/g, ''); // unecessary chars
    if (strTmp == 'now') {
        return (new Date()).getTime() / 1000; // Return seconds, not milli-seconds
    } else if (!isNaN(parse = Date.parse(strTmp))) {        return (parse / 1000);
    } else if (now) {
        now = new Date(now * 1000); // Accept PHP-style seconds
    } else {
        now = new Date();    }
 
    strTmp = strTmp.toLowerCase();
 
    var __is = {        day: {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,            'thu': 4,
            'fri': 5,
            'sat': 6
        },
        mon: {            'jan': 0,
            'feb': 1,
            'mar': 2,
            'apr': 3,
            'may': 4,            'jun': 5,
            'jul': 6,
            'aug': 7,
            'sep': 8,
            'oct': 9,            'nov': 10,
            'dec': 11
        }
    };
     var process = function (m) {
        var ago = (m[2] && m[2] == 'ago');
        var num = (num = m[0] == 'last' ? -1 : 1) * (ago ? -1 : 1);
 
        switch (m[0]) {        case 'last':
        case 'next':
            switch (m[1].substring(0, 3)) {
            case 'yea':
                now.setFullYear(now.getFullYear() + num);                break;
            case 'mon':
                now.setMonth(now.getMonth() + num);
                break;
            case 'wee':                now.setDate(now.getDate() + (num * 7));
                break;
            case 'day':
                now.setDate(now.getDate() + num);
                break;            case 'hou':
                now.setHours(now.getHours() + num);
                break;
            case 'min':
                now.setMinutes(now.getMinutes() + num);                break;
            case 'sec':
                now.setSeconds(now.getSeconds() + num);
                break;
            default:                var day;
                if (typeof(day = __is.day[m[1].substring(0, 3)]) != 'undefined') {
                    var diff = day - now.getDay();
                    if (diff == 0) {
                        diff = 7 * num;                    } else if (diff > 0) {
                        if (m[0] == 'last') {
                            diff -= 7;
                        }
                    } else {                        if (m[0] == 'next') {
                            diff += 7;
                        }
                    }
                    now.setDate(now.getDate() + diff);                }
            }
            break;
 
        default:            if (/\d+/.test(m[0])) {
                num *= parseInt(m[0], 10);
 
                switch (m[1].substring(0, 3)) {
                case 'yea':                    now.setFullYear(now.getFullYear() + num);
                    break;
                case 'mon':
                    now.setMonth(now.getMonth() + num);
                    break;                case 'wee':
                    now.setDate(now.getDate() + (num * 7));
                    break;
                case 'day':
                    now.setDate(now.getDate() + num);                    break;
                case 'hou':
                    now.setHours(now.getHours() + num);
                    break;
                case 'min':                    now.setMinutes(now.getMinutes() + num);
                    break;
                case 'sec':
                    now.setSeconds(now.getSeconds() + num);
                    break;                }
            } else {
                return false;
            }
            break;        }
        return true;
    };
 
    match = strTmp.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);    if (match != null) {
        if (!match[2]) {
            match[2] = '00:00:00';
        } else if (!match[3]) {
            match[2] += ':00';        }
 
        s = match[1].split(/-/g);
 
        for (i in __is.mon) {            if (__is.mon[i] == s[1] - 1) {
                s[1] = i;
            }
        }
        s[0] = parseInt(s[0], 10); 
        s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
        return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
    }
     var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';
 
    match = strTmp.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
    if (match == null) {
        return false;    }
 
    for (i = 0; i < match.length; i++) {
        if (!process(match[i].split(' '))) {
            return false;        }
    }
 
    return (now.getTime() / 1000);
}

function get_html_translation_table (table, quote_style) {
    // Returns the internal translation table used by htmlspecialchars and htmlentities  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/get_html_translation_table    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    var entities = {},
        hash_map = {},        decimal;
    var constMappingTable = {},
        constMappingQuoteStyle = {};
    var useTable = {},
        useQuoteStyle = {}; 
    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';
 
    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT'; 
    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: " + useTable + ' not supported');
        // return false;
    } 
    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['130'] = '&sbquo;';    // Single Low-9 Quotation Mark
        entities['131'] = '&fnof;';     // Latin Small Letter F With Hook
        entities['132'] = '&bdquo;';    // Double Low-9 Quotation Mark
        entities['133'] = '&hellip;';   // Horizontal Ellipsis
        entities['134'] = '&dagger;';   // Dagger
        entities['135'] = '&Dagger;';   // Double Dagger
        entities['136'] = '&circ;';     // Modifier Letter Circumflex Accent
        entities['137'] = '&permil;';   // Per Mille Sign
        entities['138'] = '&Scaron;';   // Latin Capital Letter S With Caron
        entities['139'] = '&lsaquo;';   // Single Left-Pointing Angle Quotation Mark
        entities['140'] = '&OElig;';    // Latin Capital Ligature OE
        entities['145'] = '&lsquo;';    // Left Single Quotation Mark
        entities['146'] = '&rsquo;';    // Right Single Quotation Mark
        entities['147'] = '&ldquo;';    // Left Double Quotation Mark
        entities['148'] = '&rdquo;';    // Right Double Quotation Mark
        entities['149'] = '&bull;';     // Bullet
        entities['150'] = '&ndash;';    // En Dash
        entities['151'] = '&mdash;';    // Em Dash
        entities['152'] = '&tilde;';    // Small Tilde
        entities['153'] = '&trade;';    // Trade Mark Sign
        entities['154'] = '&scaron;';   // Latin Small Letter S With Caron
        entities['155'] = '&rsaquo;';   // Single Right-Pointing Angle Quotation Mark
        entities['156'] = '&oelig;';    // Latin Small Ligature OE
        entities['159'] = '&Yuml;';     // Latin Capital Letter Y With Diaeresis

        entities['160'] = '&nbsp;';     // Non-breaking space
        entities['161'] = '&iexcl;';        // Inverted exclamation mark
        entities['162'] = '&cent;';     // Cent sign
        entities['163'] = '&pound;';        // Pound sign
        entities['164'] = '&curren;';   // Currency sign
        entities['165'] = '&yen;';      // Yen sign
        entities['166'] = '&brvbar;';   // Broken vertical bar
        entities['167'] = '&sect;';     // Section sign
        entities['168'] = '&uml;';      // Diaeresis
        entities['169'] = '&copy;';     // Copyright sign
        entities['170'] = '&ordf;';     // Feminine ordinal indicator
        entities['171'] = '&laquo;';        // Left-pointing double angle quotation mark
        entities['172'] = '&not;';      // Not sign
        entities['173'] = '&shy;';      // Soft hyphen
        entities['174'] = '&reg;';      // Registered sign
        entities['175'] = '&macr;';     // Macron
        entities['176'] = '&deg;';      // Degree sign
        entities['177'] = '&plusmn;';   // Plus-minus sign
        entities['178'] = '&sup2;';     // Superscript two
        entities['179'] = '&sup3;';     // Superscript three
        entities['180'] = '&acute;';        // Acute accent
        entities['181'] = '&micro;';        // Micro sign
        entities['182'] = '&para;';     // Pilcrow sign
        entities['183'] = '&middot;';   // Middle dot
        entities['184'] = '&cedil;';        // Cedilla
        entities['185'] = '&sup1;';     // Superscript one
        entities['186'] = '&ordm;';     // Masculine ordinal indicator
        entities['187'] = '&raquo;';        // Right-pointing double angle quotation mark
        entities['188'] = '&frac14;';   // Vulgar fraction one-quarter
        entities['189'] = '&frac12;';   // Vulgar fraction one-half
        entities['190'] = '&frac34;';   // Vulgar fraction three-quarters
        entities['191'] = '&iquest;';   // Inverted question mark
        entities['192'] = '&Agrave;';   // A with grave
        entities['193'] = '&Aacute;';   // A with acute
        entities['194'] = '&Acirc;';        // A with circumflex
        entities['195'] = '&Atilde;';   // A with tilde
        entities['196'] = '&Auml;';     // A with diaeresis
        entities['197'] = '&Aring;';        // A with ring above
        entities['198'] = '&AElig;';        // AE
        entities['199'] = '&Ccedil;';   // C with cedilla
        entities['200'] = '&Egrave;';   // E with grave
        entities['201'] = '&Eacute;';   // E with acute
        entities['202'] = '&Ecirc;';        // E with circumflex
        entities['203'] = '&Euml;';     // E with diaeresis
        entities['204'] = '&Igrave;';   // I with grave
        entities['205'] = '&Iacute;';   // I with acute
        entities['206'] = '&Icirc;';        // I with circumflex
        entities['207'] = '&Iuml;';     // I with diaeresis
        entities['208'] = '&ETH;';      // Eth
        entities['209'] = '&Ntilde;';   // N with tilde
        entities['210'] = '&Ograve;';   // O with grave
        entities['211'] = '&Oacute;';   // O with acute
        entities['212'] = '&Ocirc;';        // O with circumflex
        entities['213'] = '&Otilde;';   // O with tilde
        entities['214'] = '&Ouml;';     // O with diaeresis
        entities['215'] = '&times;';        // Multiplication sign
        entities['216'] = '&Oslash;';   // O with stroke
        entities['217'] = '&Ugrave;';   // U with grave
        entities['218'] = '&Uacute;';   // U with acute
        entities['219'] = '&Ucirc;';        // U with circumflex
        entities['220'] = '&Uuml;';     // U with diaeresis
        entities['221'] = '&Yacute;';   // Y with acute
        entities['222'] = '&THORN;';        // Thorn
        entities['223'] = '&szlig;';        // Sharp s. Also known as ess-zed
        entities['224'] = '&agrave;';   // a with grave
        entities['225'] = '&aacute;';   // a with acute
        entities['226'] = '&acirc;';        // a with circumflex
        entities['227'] = '&atilde;';   // a with tilde
        entities['228'] = '&auml;';     // a with diaeresis
        entities['229'] = '&aring;';        // a with ring above
        entities['230'] = '&aelig;';        // ae. Also known as ligature ae
        entities['231'] = '&ccedil;';   // c with cedilla
        entities['232'] = '&egrave;';   // e with grave
        entities['233'] = '&eacute;';   // e with acute
        entities['234'] = '&ecirc;';        // e with circumflex
        entities['235'] = '&euml;';     // e with diaeresis
        entities['236'] = '&igrave;';   // i with grave
        entities['237'] = '&iacute;';   // i with acute
        entities['238'] = '&icirc;';        // i with circumflex
        entities['239'] = '&iuml;';     // i with diaeresis
        entities['240'] = '&eth;';      // eth
        entities['241'] = '&ntilde;';   // n with tilde
        entities['242'] = '&ograve;';   // o with grave
        entities['243'] = '&oacute;';   // o with acute
        entities['244'] = '&ocirc;';        // o with circumflex
        entities['245'] = '&otilde;';   // o with tilde
        entities['246'] = '&ouml;';     // o with diaeresis
        entities['247'] = '&divide;';   // Division sign
        entities['248'] = '&oslash;';   // o with stroke. Also known as o with slash
        entities['249'] = '&ugrave;';   // u with grave
        entities['250'] = '&uacute;';   // u with acute
        entities['251'] = '&ucirc;';        // u with circumflex
        entities['252'] = '&uuml;';     // u with diaeresis
        entities['253'] = '&yacute;';   // y with acute
        entities['254'] = '&thorn;';        // thorn
        entities['255'] = '&yuml;';     // y with diaeresis
        entities['264'] = '&#264;';     // Latin capital letter C with circumflex
        entities['265'] = '&#265;';     // Latin small letter c with circumflex
        entities['338'] = '&OElig;';        // Latin capital ligature OE
        entities['339'] = '&oelig;';        // Latin small ligature oe
        entities['352'] = '&Scaron;';   // Latin capital letter S with caron
        entities['353'] = '&scaron;';   // Latin small letter s with caron
        entities['372'] = '&#372;';     // Latin capital letter W with circumflex
        entities['373'] = '&#373;';     // Latin small letter w with circumflex
        entities['374'] = '&#374;';     // Latin capital letter Y with circumflex
        entities['375'] = '&#375;';     // Latin small letter y with circumflex
        entities['376'] = '&Yuml;';     // Latin capital letter Y with diaeresis
        entities['402'] = '&fnof;';     // Latin small f with hook, function, florin
        entities['710'] = '&circ;';     // Modifier letter circumflex accent
        entities['732'] = '&tilde;';        // Small tilde
        entities['913'] = '&Alpha;';        // Alpha
        entities['914'] = '&Beta;';     // Beta
        entities['915'] = '&Gamma;';        // Gamma
        entities['916'] = '&Delta;';        // Delta
        entities['917'] = '&Epsilon;';  // Epsilon
        entities['918'] = '&Zeta;';     // Zeta
        entities['919'] = '&Eta;';      // Eta
        entities['920'] = '&Theta;';        // Theta
        entities['921'] = '&Iota;';     // Iota
        entities['922'] = '&Kappa;';        // Kappa
        entities['923'] = '&Lambda;';   // Lambda
        entities['924'] = '&Mu;';       // Mu
        entities['925'] = '&Nu;';       // Nu
        entities['926'] = '&Xi;';       // Xi
        entities['927'] = '&Omicron;';  // Omicron
        entities['928'] = '&Pi;';       // Pi
        entities['929'] = '&Rho;';      // Rho
        entities['931'] = '&Sigma;';        // Sigma
        entities['932'] = '&Tau;';      // Tau
        entities['933'] = '&Upsilon;';  // Upsilon
        entities['934'] = '&Phi;';      // Phi
        entities['935'] = '&Chi;';      // Chi
        entities['936'] = '&Psi;';      // Psi
        entities['937'] = '&Omega;';        // Omega
        entities['945'] = '&alpha;';        // alpha
        entities['946'] = '&beta;';     // beta
        entities['947'] = '&gamma;';        // gamma
        entities['948'] = '&delta;';        // delta
        entities['949'] = '&epsilon;';  // epsilon
        entities['950'] = '&zeta;';     // zeta
        entities['951'] = '&eta;';      // eta
        entities['952'] = '&theta;';        // theta
        entities['953'] = '&iota;';     // iota
        entities['954'] = '&kappa;';        // kappa
        entities['955'] = '&lambda;';   // lambda
        entities['956'] = '&mu;';       // mu
        entities['957'] = '&nu;';       // nu
        entities['958'] = '&xi;';       // xi
        entities['959'] = '&omicron;';  // omicron
        entities['960'] = '&pi;';       // pi
        entities['961'] = '&rho;';      // rho
        entities['962'] = '&sigmaf;';   // sigmaf
        entities['963'] = '&sigma;';        // sigma
        entities['964'] = '&tau;';      // tau
        entities['965'] = '&upsilon;';  // upsilon
        entities['966'] = '&phi;';      // phi
        entities['967'] = '&chi;';      // chi
        entities['968'] = '&psi;';      // psi
        entities['969'] = '&omega;';        // omega
        entities['977'] = '&thetasym;'; // Theta symbol
        entities['978'] = '&upsih;';        // Greek upsilon with hook symbol
        entities['982'] = '&piv;';      // Pi symbol
        entities['8194'] = '&ensp;';        // En space
        entities['8195'] = '&emsp;';        // Em space
        entities['8201'] = '&thinsp;';  // Thin space
        entities['8204'] = '&zwnj;';        // Zero width non-joiner
        entities['8205'] = '&zwj;';     // Zero width joiner
        entities['8206'] = '&lrm;';     // Left-to-right mark
        entities['8207'] = '&rlm;';     // Right-to-left mark
        entities['8211'] = '&ndash;';   // En dash
        entities['8212'] = '&mdash;';   // Em dash
        entities['8216'] = '&lsquo;';   // Left single quotation mark
        entities['8217'] = '&rsquo;';   // Right single quotation mark
        entities['8218'] = '&sbquo;';   // Single low-9 quotation mark
        entities['8220'] = '&ldquo;';   // Left double quotation mark
        entities['8221'] = '&rdquo;';   // Right double quotation mark
        entities['8222'] = '&bdquo;';   // Double low-9 quotation mark
        entities['8224'] = '&dagger;';  // Dagger
        entities['8225'] = '&Dagger;';  // Double dagger
        entities['8226'] = '&bull;';        // Bullet
        entities['8230'] = '&hellip;';  // Horizontal ellipsis
        entities['8240'] = '&permil;';  // Per mille sign
        entities['8242'] = '&prime;';   // Prime
        entities['8243'] = '&Prime;';   // Double Prime
        entities['8249'] = '&lsaquo;';  // Single left-pointing angle quotation
        entities['8250'] = '&rsaquo;';  // Single right-pointing angle quotation
        entities['8254'] = '&oline;';   // Overline
        entities['8260'] = '&frasl;';   // Fraction Slash
        entities['8364'] = '&euro;';        // Euro sign
        entities['8472'] = '&weierp;';  // Script capital
        entities['8465'] = '&image;';   // Blackletter capital I
        entities['8476'] = '&real;';        // Blackletter capital R
        entities['8482'] = '&trade;';   // Trade mark sign
        entities['8501'] = '&alefsym;'; // Alef symbol
        entities['8592'] = '&larr;';        // Leftward arrow
        entities['8593'] = '&uarr;';        // Upward arrow
        entities['8594'] = '&rarr;';        // Rightward arrow
        entities['8595'] = '&darr;';        // Downward arrow
        entities['8596'] = '&harr;';        // Left right arrow
        entities['8629'] = '&crarr;';   // Downward arrow with corner leftward. Also known as carriage return
        entities['8656'] = '&lArr;';        // Leftward double arrow. ISO 10646 does not say that lArr is the same as the 'is implied by' arrow but also does not have any other character for that function. So ? lArr can be used for 'is implied by' as ISOtech suggests
        entities['8657'] = '&uArr;';        // Upward double arrow
        entities['8658'] = '&rArr;';        // Rightward double arrow. ISO 10646 does not say this is the 'implies' character but does not have another character with this function so ? rArr can be used for 'implies' as ISOtech suggests
        entities['8659'] = '&dArr;';        // Downward double arrow
        entities['8660'] = '&hArr;';        // Left-right double arrow
        // Mathematical Operators
        entities['8704'] = '&forall;';  // For all
        entities['8706'] = '&part;';        // Partial differential
        entities['8707'] = '&exist;';   // There exists
        entities['8709'] = '&empty;';   // Empty set. Also known as null set and diameter
        entities['8711'] = '&nabla;';   // Nabla. Also known as backward difference
        entities['8712'] = '&isin;';        // Element of
        entities['8713'] = '&notin;';   // Not an element of
        entities['8715'] = '&ni;';      // Contains as member
        entities['8719'] = '&prod;';        // N-ary product. Also known as product sign. Prod is not the same character as U+03A0 'greek capital letter pi' though the same glyph might be used for both
        entities['8721'] = '&sum;';     // N-ary summation. Sum is not the same character as U+03A3 'greek capital letter sigma' though the same glyph might be used for both
        entities['8722'] = '&minus;';   // Minus sign
        entities['8727'] = '&lowast;';  // Asterisk operator
        entities['8729'] = '&#8729;';   // Bullet operator
        entities['8730'] = '&radic;';   // Square root. Also known as radical sign
        entities['8733'] = '&prop;';        // Proportional to
        entities['8734'] = '&infin;';   // Infinity
        entities['8736'] = '&ang;';     // Angle
        entities['8743'] = '&and;';     // Logical and. Also known as wedge
        entities['8744'] = '&or;';      // Logical or. Also known as vee
        entities['8745'] = '&cap;';     // Intersection. Also known as cap
        entities['8746'] = '&cup;';     // Union. Also known as cup
        entities['8747'] = '&int;';     // Integral
        entities['8756'] = '&there4;';  // Therefore
        entities['8764'] = '&sim;';     // tilde operator. Also known as varies with and similar to. The tilde operator is not the same character as the tilde, U+007E, although the same glyph might be used to represent both
        entities['8773'] = '&cong;';        // Approximately equal to
        entities['8776'] = '&asymp;';   // Almost equal to. Also known as asymptotic to
        entities['8800'] = '&ne;';      // Not equal to
        entities['8801'] = '&equiv;';   // Identical to
        entities['8804'] = '&le;';      // Less-than or equal to
        entities['8805'] = '&ge;';      // Greater-than or equal to
        entities['8834'] = '&sub;';     // Subset of
        entities['8835'] = '&sup;';     // Superset of. Note that nsup, 'not a superset of, U+2283' is not covered by the Symbol font encoding and is not included.
        entities['8836'] = '&nsub;';        // Not a subset of
        entities['8838'] = '&sube;';        // Subset of or equal to
        entities['8839'] = '&supe;';        // Superset of or equal to
        entities['8853'] = '&oplus;';   // Circled plus. Also known as direct sum
        entities['8855'] = '&otimes;';  // Circled times. Also known as vector product
        entities['8869'] = '&perp;';        // Up tack. Also known as orthogonal to and perpendicular
        entities['8901'] = '&sdot;';        // Dot operator. The dot operator is not the same character as U+00B7 middle dot
        // Miscellaneous Technical
        entities['8968'] = '&lceil;';   // Left ceiling. Also known as an APL upstile
        entities['8969'] = '&rceil;';   // Right ceiling
        entities['8970'] = '&lfloor;';  // left floor. Also known as APL downstile
        entities['8971'] = '&rfloor;';  // Right floor
        entities['9001'] = '&lang;';        // Left-pointing angle bracket. Also known as bra. Lang is not the same character as U+003C 'less than'or U+2039 'single left-pointing angle quotation mark'
        entities['9002'] = '&rang;';        // Right-pointing angle bracket. Also known as ket. Rang is not the same character as U+003E 'greater than' or U+203A 'single right-pointing angle quotation mark'
        // Geometric Shapes
        entities['9642'] = '&#9642;';   // Black small square
        entities['9643'] = '&#9643;';   // White small square
        entities['9674'] = '&loz;';     // Lozenge
        // Miscellaneous Symbols
        entities['9702'] = '&#9702;';   // White bullet
        entities['9824'] = '&spades;';  // Black (filled) spade suit
        entities['9827'] = '&clubs;';   // Black (filled) club suit. Also known as shamrock
        entities['9829'] = '&hearts;';  // Black (filled) heart suit. Also known as shamrock
        entities['9830'] = '&diams;';   // Black (filled) diamond suit        
    } 
    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';
  
    // ascii decimals to real symbols
    for (decimal in entities) {
        if (entities.hasOwnProperty(decimal)) {
            hash_map[String.fromCharCode(decimal)] = entities[decimal];        }
    }
 
    return hash_map;
}

function html_entity_decode (string, quote_style) {
    // Convert all HTML entities to their applicable characters  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/html_entity_decode    // +   original by: john (http://www.jd-tech.net)
    // +      input by: ger
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman    // +   improved by: marc andreu
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Ratheous
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Nick Kolosov (http://sammy.ru)    // +   bugfixed by: Fox
    // -    depends on: get_html_translation_table
    // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    // *     returns 1: 'Kevin & van Zonneveld'
    // *     example 2: html_entity_decode('&amp;lt;');    // *     returns 2: '&lt;'
    var hash_map = {},
        symbol = '',
        tmp_str = '',
        entity = '';    tmp_str = string.toString();
 
    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    } 
    // fix &amp; problem
    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
    delete(hash_map['&']);
    hash_map['&'] = '&amp;'; 
    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
    }    tmp_str = tmp_str.split('&#039;').join("'");
 
    return tmp_str;
}
