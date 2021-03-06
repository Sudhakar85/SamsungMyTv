var widgetAPI = new Common.API.Widget();
var pluginAPI = new Common.API.Plugin();
var tvKey = new Common.API.TVKeyValue();
var Main = {
    setap_id: "",
    YaHTTP: null,
    Ya_ready_timeout: null,
    XML_URL: "",
    loading_pl: false,
    pre_selected_channel: 0,
    selected_channel: 0,
    selected_page: 0,
    chan_array_index: 0,
    play_selected_channel: 0,
    play_selected_page: 0,
    play_chan_array_index: 0,
    PlayerMode: "",
    yandextv_mode: false,
    ya_all_day: false,
    ya_base_info: false,
    Ya_flag_step: 0,
    Ya_flag_name: "",
    ya_prog_id: -1,
    temp_epg_info: "",
    epg_info_step: 0,
    epg_t1: 0,
    epg_t2: 0,
    ya_prog_info_arr: [],
    ya_epg_info_arr: [],
    temp_ya_epg_info_arr: [],
    ya_auto: false,
    guide: false,
    block_info: false,
    write: false,
    lost_date: "",
    scrolling: 0,
    load_timer: null,
    prev_pl_array: [],
    playlist_prev: false,
    prev_ch_array: [],
    url_arr: [],
    fav_name: "",
    fav_num: 1,
    fav_url: "",
    temp_fav_name: "",
    temp_fav_num: 1,
    temp_fav_url: "",
    block_fav: false,
    play_prev: true,
    help_step: 0,
    help_info: false,
    MAC: "",
    audio_output_device: "",
    hardware: "",
    hardware_type: "",
    ch_num: 0,
    name: "",
    url: "",
    pl_url: "",
    pre_pl_url: "",
    info: "",
    logo: "",
    ssize: -1,
    a_num: 0,
    buffer: 0,
    ibuffer: 0,
    timeshift: "",
    search_on: "",
    region: "",
    parser: "",
    playlist_name: "",
    Kill: "",
    nuber_p: 1,
    step_read_dir: 1,
    FAV: false,
    DEL: false,
    RED: false,
    ret: false,
    search: false,
    start: false,
    Foto: false,
    xxx: false,
    Emu: false,
    seriesC: false,
    seriesE: false,
    seriesD: false,
    FirstStart: true,
    Update_Page: false,
    SetZoom: false,
    Network: null,
    St: null,
    Audio: null,
    IntervalUpdateTime: null,
    SlideShowInterval: null,
    version: "1.0.5",
    ver: "2014",
    sort: false
};

Main.onLoad = function() {
    try {
        this.Network = getId("pluginNetwork");
        this.MAC = this.Network.GetMAC();
        this.St = getId("pluginStorage");
        this.Audio = getId("pluginAudio");
        this.audio_output_device = this.Audio.GetOutputDevice();
        var pluginTV = getId("pluginTV");
        this.hardware_type = pluginTV.GetProductType();
        this.hardware = pluginTV.GetProductCode(1);
        if (this.hardware == "LN40B650_KOR") {
            Main.Emu = true;
        } else {
            if (this.hardware.indexOf("C") > 1) {
                Main.seriesC = true;
            } else {
                if (this.hardware.indexOf("D") > 1) {
                    Main.seriesD = true;
                } else {
                    if (this.hardware.indexOf("E") > 1 || (this.hardware.indexOf("C") < 0 && this.hardware.indexOf("D") < 0)) {
                        Main.seriesE = true;
                    }
                }
            }
        }
        if (API.init() && Player.init()) {
            window.onShow = Main.onShowEventTVKey;
            widgetAPI.sendReadyEvent();
            Display.status("loading...!", 14000);
            Display.loadingshow();
            var src;
            if (Main.seriesC || Main.seriesD) {
                src = '$MANAGER_WIDGET/Common/IME/ime2.js';
            } else {
                src = '$MANAGER_WIDGET/Common/IME_XT9/ime.js';
            }
            var script = document.createElement('script');
            script.src = src;
            document.documentElement.children[0].appendChild(script);
            setTimeout(Main.Init(), 200);
        }
    } catch (b) {}
};

Main.Init = function() {
    Main.url_arr = [];
    if (API.star_url.indexOf("fav.dat") > 0) {
        Main.FAV = true;
        Main.opencommonFile(API.star_url);
    } else {
        if (API.star_url.indexOf("OpenFav") == 0) {
            if (API.fav_start_channels.length > 1) {
                Main.ReadPlArr("OpenFav", API.fav_start_channels);
            } else {
                Main.FAV = true;
                Main.opencommonFile(Main.fav_url);
            }
        } else {
            API.XML_URL = API.star_url;
            API.Request(API.star_url);
        }
    }
};
//key приходит кнопка
SetVolume = function(key) {
    if (Main.audio_output_device == 3 || Main.hardware_type == 2) {
        Display.status("Unavailable!");
    } else {
        Main.Audio.SetVolumeWithKey(key);
        var volume = Main.Audio.GetVolume();
        var symbol = "";
        var maxVolume = Math.round(0.44 + volume * (1 - volume / 360), 10);
        var strVolume = volume > 9 ? volume : ("0" + volume);
        for (var i = 0; i < maxVolume; i++) {
            symbol += "| ";
        }
        Display.status("<b style='color:#00ccff;'>Volume</b>  - " + strVolume + " - <b style='color:yellow;'>" + symbol + "</b>");
    }
};
Main.onShowEventTVKey = function() {
    pluginAPI.setOffScreenSaver();
    pluginAPI.setOffIdleEvent();
    pluginAPI.SetBannerState(1);
    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.unregistKey(tvKey.KEY_MUTE);
    pluginAPI.registKey(tvKey.KEY_MENU);
    pluginAPI.registKey(tvKey.KEY_GUIDE);
    pluginAPI.registKey(tvKey.KEY_SOURCE);
    pluginAPI.unregistKey(203);
    pluginAPI.unregistKey(204);
    pluginAPI.registKey(613);
    pluginAPI.registKey(105);
    pluginAPI.registKey(106);
    pluginAPI.registKey(309);
    pluginAPI.registKey(612);
    pluginAPI.registKey(1118);
    pluginAPI.registKey(1219);
    pluginAPI.registKey(84);
    pluginAPI.registKey(655);
    pluginAPI.registKey(1089);
    pluginAPI.registKey(1057);
    pluginAPI.registKey(1083);
    pluginAPI.registKey(1078);
    pluginAPI.registKey(1080);
    pluginAPI.registKey(1086);
    pluginAPI.registKey(78);
    pluginAPI.registKey(1249);
};
curWidget.onWidgetEvent = function() {
    Main.onShowEventTVKey();
};
Main.registVOLTVKey = function() {
    pluginAPI.registKey(tvKey.KEY_VOL_UP);
    pluginAPI.registKey(tvKey.KEY_VOL_DOWN);
    pluginAPI.registKey(tvKey.KEY_PANEL_VOL_UP);
    pluginAPI.registKey(tvKey.KEY_PANEL_VOL_DOWN);
    pluginAPI.registKey(tvKey.KEY_MUTE);
};
Main.ResetSelectedPosition = function() {
    this.selected_channel = 0;
    this.selected_page = 0;
    this.chan_array_index = 0;
    if (!this.guide && !Main.help_info) {
        this.prev_ch_array = [];
    }
};
Main.SaveSelectedPosition = function() {
    this.play_selected_channel = this.selected_channel;
    this.play_selected_page = this.selected_page;
    this.play_chan_array_index = this.chan_array_index;
};
Main.SetSelectedPosition = function() {
    this.selected_channel = this.play_selected_channel;
    this.selected_page = this.play_selected_page;
    this.chan_array_index = this.play_chan_array_index;
};
Main.SetFavSelectedPosition = function() {
    Main.fav_num = Main.temp_fav_num;
    Main.fav_name = Main.temp_fav_name;
    Main.fav_url = Main.temp_fav_url;
};
Main.showCategorySelector = function() {
    getIdn("rightHalf");
    KeyHandler.setFocus(4);
    Selectbox.setBox("КАТЕГОРИИ", API.categories);
    getId("selectbox").style.top = "60px";
    getId("selectbox").style.left = "550px";
};
Main.showFavSelector = function() {
    getIdn("rightHalf");
    KeyHandler.setFocus(4);
    Selectbox.setBox("Выбор избранного", API.favorites);
    getId("selectbox").style.top = "60px";
    getId("selectbox").style.left = "550px";
};
Main.showSiseSelector = function() {
    KeyHandler.setFocus(4);
    Selectbox.setBox("Выбор качества", Main.url_arr);
    getId("selectbox").style.top = "120px";
    getId("selectbox").style.left = "330px";
};
Main.Menu = function() {
    if (Main.FirstStart) {
        if ((API.Timemode == 0 || API.Timemode == 1)) {
            setTimeout("Display.status('Used Auto Sync Time!')", 1000);
        }
    }
    setTimeout("Main.FirstStart=false;", 3000);
    clearTimeout(this.load_timer);
    if (!Main.search && !Main.xxx) {
        Display.hidestatus();
    }
    getIdn("statusbar1");
    Display.hideplayer();
    Display.loadinghide();
    API.AsReqMode = true;
    this.FAV = false;
    this.xxx = false;
    this.help_info = false;
    this.block_info = false;
    this.loading_pl = false;
    this.block_fav = false;
    this.SetZoom = false;
    this.playlist_prev = true;
    this.pre_pl_url = API.XML_URL;
    getIdn("selectbox");
    getIdn("help_set_par");
    getIdb("rightHalf");
    getIdn("infoList");
    getIdn("ya_date");
    getIdn("ya_info");
    getIdn("ya_help");
    Main.UpdateHelpBar();
    if (this.RED) {
        KeyHandler.setFocus(5);
    } else {
        if (Main.guide) {
            KeyHandler.setFocus(6);
        } else {
            KeyHandler.setFocus(0);
        }
    }
    Main.updatePage();
    getIdb("channelList");
    getIdb("main");
};
Main.UpdateHelpBar = function() {
    getIdn("0_help");
    getIdn("1_help");
    getIdb("2_help");
    getIdn("3_help");
    getIdn("3.1_help");
    getIdn("3.1_help");
    getIdn("3.2_help");
    getIdn("3.21_help");
    getIdn("3.3_help");
    getIdn("3.4_help");
    getIdb("4_help");
    getIdn("4.1_help");
    getIdb("5_help");
    getIdn("5.1_help");
    getIdb("6_help");
    getIdn("7_help");
    getIdn("8_help");
    getIdn("9_help");
    getIdn("10_help");
    getIdn("10.1_help");
    getIdn("11_help");
    getIdn("12_help");
    if (API.XML_URL.indexOf("fav.dat") > 0 && !Main.guide) {
        Main.FAV = true;
        Main.fav_url = API.XML_URL;
        if (!this.RED) {
            var title = "Избранное №" + Main.fav_num + ' - "' + Main.fav_name + '"';
            if (API.favorites.length > 1) {
                getIdb("3.3_help");
            }
            getIdb("3.4_help");
        } else {
            title = "Редактирование. Избранное №" + Main.fav_num + ' - "' + Main.fav_name + '"';
            getIdn("2_help");
            getIdb("3.2_help");
            if (API.favorites.length > 1) {
                getIdb("3.21_help");
            }
            getIdn("5_help");
            getIdn("6_help");
        }
    } else {
        if (API.XML_URL.indexOf("/fiowidget.") > 0 && API.XML_URL.indexOf("help") > 0) {
            Main.help_info = true;
            title = "СПРАВКА";
            getIdn("2_help");
            getIdb("10_help");
            getIdb("4.1_help");
        } else {
            if (Main.guide) {
                title = "Подробное описание передач v." + this.version;
                this.yandextv_mode = true;
                getIdn("2_help");
                getIdn("5_help");
                getIdn("6_help");
                getIdb("4.1_help");
                getIdb("10.1_help");
                if (!Main.ya_all_day) {
                    this.selected_channel = 1;
                }
            } else {
                if (API.XML_URL.indexOf("Open") < 0) {
                    getIdb("3.1_help");
                }
                if (API.categories.length > 2) {
                    getIdb("3_help");
                }
                if (API.XML_URL.indexOf("history.dat") > 0) {
                    title = "ИСТОРИЯ";
                    getIdb("5.1_help");
                } else {
                    title = "nStreamEvo v." + Main.version;
                }
            }
        }
    }
    if (Player.state != Player.STOPPED) {
        getIdb("1_help");
        if (Player.state == Player.PLAYING_VOD && !this.RED) {
            getIdb("8_help");
        }
        getId("background").style.backgroundImage = "url(img/bg.png)";
    } else {
        KeyHandler.guide_step = 0;
        getIdb("0_help");
        getId("background").style.backgroundImage = "url(img/us_bg.png)";
        if (this.prev_pl_array.length > 0) {
            if (API.categories.length < 3 && !Main.FAV && !Main.guide && API.XML_URL.indexOf("history.dat") < 0) {
                getIdb("9_help");
            }
            if (API.XML_URL.indexOf("start.xml") == 0) {
                Display.status(API.XML_URL);
                if (Main.Kill != "") {
                    API.Xcode = Main.Kill;
                }
            }
        } else {
            if (API.XML_URL.indexOf("start.xml") != 0) {
                getIdn("6_help");
                if (!this.RED) {
                    getIdb("7_help");
                }
                if (API.categories.length < 3 && !Main.FAV && !Main.guide) {
                    getIdb("9_help");
                }
            } else {
                if (Main.Kill != "") {
                    API.Xcode = Main.Kill;
                }
                getIdn("6_help");
                getIdb("9_help");
            }
        }
    }
    if (Main.seriesE) {
        getId("widget_date").style.left = "540px";
        getId("widget_time").style.left = "850px";
    }
    getIdb("background");
    if (API.XML_URL.indexOf("OpenFav") == 0 || Main.help_info) {
        Main.block_fav = true;
    }
    widgetAPI.putInnerHTML(getId("version"), title);
};
//el - елемент, src - путь, flag - флаг
LogoStyle = function(el, src, flag) {
    var left, width;
    if (flag == 1 && (API.Forma == 1 || API.Forma == 3)) {
        left = "67px";
        width = "54px";
    } else {
        if (flag == 1) {
            left = "75px";
            width = "38px";
        } else {
            if (API.Forma == 1 || API.Forma == 3) {
                left = "80px";
                width = "66px";
                if (src != "") {
                    getId("p_bg_num_logo").style.backgroundImage = "url(img/bgn02.png)";
                } else {
                    getId("p_bg_num_logo").style.backgroundImage = "url(img/bgn03.png)";
                }
            } else {
                left = "90px";
                width = "46px";
                if (src != "") {
                    getId("p_bg_num_logo").style.backgroundImage = "url(img/bgn01.png)";
                } else {
                    getId("p_bg_num_logo").style.backgroundImage = "url(img/bgn03.png)";
                }
            }
        }
    }
    getId(el).src = src;
    getId(el).style.left = left;
    getId(el).style.width = width;
};
Main.updatePage = function() {
    try {
        clearTimeout(this.load_timer);
        this.Update_Page = false;
        this.ret = false;
        var channelCount = 10;
        this.selected_page = (this.selected_page > API.chan_pages - 1) ? 0 : (this.selected_page < 0) ? API.chan_pages - 1 : this.selected_page;
        for (var i = 0; i < 10; i++) {
            getIdb("ch" + i);
        }
        if (this.selected_page == API.chan_pages - 1) {
            channelCount = API.last_page_channels_counter;
            for (var i = channelCount; i < 10; i++) {
                getIdn("ch" + i);
            }
            if (this.selected_channel > API.last_page_channels_counter - 1) {
                this.selected_channel = API.last_page_channels_counter - 1;
            }
        }
        Main.UpdateChannelBar();
        for (var i = 0; i < channelCount; i++) {
            var id = 10 * this.selected_page + i;
            if (Main.guide) {
                widgetAPI.putInnerHTML(getId("number" + i), API.channels[id][10]);
            } else {
                widgetAPI.putInnerHTML(getId("number" + i), id + 1);
            }
            var src = (dPr(API.channels[id][2]) != "") ? getLogo1(dPr(API.channels[id][5]), dPr(API.channels[id][2])) : getLogo2(lrdPr(API.channels[id][0]), API.channels[id][3], dPr(API.channels[id][5]));
            LogoStyle("img" + i, src, 1);
            var message = (API.channels[id][0].toLowerCase().indexOf("установите оригинальную версию") >= 0) ? "Доступ заблокирован!" : API.channels[id][0];
            widgetAPI.putInnerHTML(getId("title" + i), message);
        }
        if ((API.prev_page_url == "") || (API.prev_page_text.indexOf("На  стр.") == 0 && API.next_page_text.indexOf("На 2 стр.") == 0)) {
            this.nuber_p = 1;
        }
        if (((API.prev_page_url != "" || API.next_page_url != "") && API.prev_page_text.indexOf("В Портал") == -1) && this.nuber_p > 0) {
            this.ret = true;
            var message = "";
            if (API.channels.length > 10) {
                message = '<b style="font-size:16px;"> (  Hа этой странице <font color=#00ccff>' + API.channels.length + "</font> позиций  )</b>";
            }
            widgetAPI.putInnerHTML(getId("version"), "<font color=#00ccff>" + this.nuber_p + "</font>-я страница " + message);
        }
        if (KeyHandler.Focus == 0 || KeyHandler.Focus == 5 || KeyHandler.Focus == 6) {
            Main.LoadTimer("Main.updateChannel();", 100);
        } else {
            Main.updateChannel();
        }
    } catch (f) {}
};
getLogo1 = function(url, src) {
    var path = "logos/";
    if (src.indexOf(":") >= 0) {
        if (API.Forma == 0 || API.Forma == 1) {
            path = "";
        } else {
            src = (url != "") ? "logos/open.png" : "logos/image.png";
        }
    }
    src = path + src;
    return src;
};
// title - имя листа, desc - описание листа, url - урл листа
getLogo2 = function(title, desc, url) {
    title = lrdPr(title);
    var src = "";
    if (API.XML_URL.indexOf("help") > 0) {
        src = "logos/help.png";
    } else {
        if (url != "") {
            src = "logos/open.png";
        } else {
            if (API.Forma == 0 || API.Forma == 1) {
                if (Main.ya_auto && !isNaN(desc) && desc > 0 && desc < 2000) {
                    src = Ya_icon_index_url_obj[desc];
                }
                if (Main.ya_auto && lrdPr(title) != "" && (src == undefined || isNaN(desc) || desc < 1 || desc > 1999)) {
                    src = Ya_icon_name_url_obj[lrdPr(title).toLowerCase().replace(/\_/g, " ")];
                }
                if (src == undefined || !Main.ya_auto) {
                    src = (lrdPr(title) != "" && dPr(desc) != "") ? "logos/" + lrdPr(title) + ".png" : "logos/image.png";
                }
            } else {
                src = "logos/image.png";
            }
        }
    }
    return src;
};
Main.UpdateChannelBar = function() {
    getId("number" + this.pre_selected_channel).style.backgroundImage = "";
    getId("chan" + this.pre_selected_channel).style.backgroundImage = "";
    getId("title" + this.pre_selected_channel).style.color = "#FFFFFF";
    getId("number" + this.selected_channel).style.backgroundImage = "url(img/number_bar.png)";
    getId("chan" + this.selected_channel).style.backgroundImage = "url(img/chan_bar.png)";
    getId("title" + this.selected_channel).style.color = "#FA8258";
    this.pre_selected_channel = this.selected_channel;
};
Main.updateChannel = function() {
    clearTimeout(this.load_timer);
    if (KeyHandler.Focus == 0 || KeyHandler.Focus == 5 || KeyHandler.Focus == 6) {
        YaAbort();
        getIdn("infoList");
        getIdn("ya_date");
        getIdn("ya_info");
        Main.UpdateChannelBar();
    }
    Main.Update_Page = true;
    if (KeyHandler.Focus == 0 && !this.block_info) {
        Main.LoadTimer("Main.UpdateChannelInfo()", 200);
    } else {
        Main.UpdateChannelInfo();
    }
};
Main.UpdateChannelInfo = function() {
    Main.scrolling = 0;
    Main.ya_base_info = false;
    this.chan_array_index = 10 * this.selected_page + this.selected_channel;
    this.ch_num = this.chan_array_index + 1;
    this.name = Ach(0);
    if (!Main.s_url) {
        this.url = Ach(1);
        this.pl_url = Ach(5);
    }
    this.logo = Ach(2);
    if (Player.state == Player.STOPPED) {
        this.ssize = Ach(6);
        this.a_num = Ach(7);
    }
    this.buffer = Ach(8);
    this.ibuffer = Ach(9);
    this.timeshift = Ach(10);
    this.region = Ach(11);
    this.parser = decLongUrl(Ach(12));
    this.search_on = Ach(13);
    if (!Main.block_info && KeyHandler.Focus != 5 && KeyHandler.Focus != 1) {
        var yandexUrl = "";
        if (this.url != "") {
            yandexUrl = GetYindex();
        }
        if (yandexUrl != "") {
            Main.yandextv_mode = true;
            Main.ya_all_day = false;
            T.delta = 0;
            Main.Ya_flag_step = 0;
            if (!Main.FirstStart) {
                YandexGetUrl(yandexUrl);
            } else {
                Main.LoadTimer("YandexGetUrl(GetYindex());", 1000);
            }
        } else {
            this.yandextv_mode = false;
            Main.showinfoList(Ach(3));
        }
    }
    this.block_info = false;
};
GetYindex = function() {
    var url = (Ach(3) != "" && Ach(3).indexOf("/m.tv.yandex.") > 0) ? Ach(3) : (!isNaN(Ach(3)) && Ach(3) > 0 && Ach(3) < 2000) ? Ach(3) : (Main.ya_auto && Main.name != "") ? Ya_name_index_obj[Main.name.toLowerCase().replace(/\_/g, " ")] : "";
    if (url == undefined) {
        url = "";
    }
    return url;
};
Main.UpdatePlayerStatusbar = function() {
    widgetAPI.putInnerHTML(getId("ch_number"), this.ch_num);
    widgetAPI.putInnerHTML(getId("ch_name"), Main.name);
    var src = (Main.logo != "") ? getLogo1(Main.pl_url, Main.logo) : getLogo2(Main.name, Ach(3), Main.pl_url);
    LogoStyle("ch_img", src, 0);
};
Main.LoadTimer = function(b, a) {
    clearTimeout(this.load_timer);
    this.load_timer = setTimeout(b, a);
};
Main.showinfoList = function(b) {
    if (KeyHandler.Focus == 0 || KeyHandler.Focus == 6) {
        getIdn("infoList");
        getIdn("ya_date");
        getIdn("ya_info");
        widgetAPI.putInnerHTML(getId("infoList"), "");
        if (!this.yandextv_mode || Main.guide) {
            getIdn("ya_help");
            var a = "";
            var c = "";
            if (API.playlist_name != "") {
                c = '<table width="100%"><tr><td style="text-align:center;font-size:20px;color:#00ccff">' + API.playlist_name + '</td></tr></table><table width="100%"><tr height="4px" bgcolor="#cccccc"><td></td></tr></table>';
            }
            if (API.prev_page_text != "" && (API.prev_page_url != "" || (this.url == "" && API.prev_page_text.indexOf("В портал") == -1))) {
                a += "<td><img src='img/buttons/rew.png'></img></td><td>" + API.prev_page_text + "</td>";
            } else {
                if (API.prev_page_url != "") {
                    a += "<td><img src='img/buttons/rew.png'></img></td><td>Назад</td>";
                }
            }
            if (API.next_page_text != "" && (API.next_page_url != "" || (this.url == "" && API.next_page_text.indexOf("В портал") == -1))) {
                a += "<td><img src='img/buttons/ff.png'></img></td><td>" + API.next_page_text + "</td>";
            } else {
                if (API.next_page_url != "") {
                    a += "<td><img src='img/buttons/ff.png'></img></td><td>Вперёд</td>";
                }
            }
            if (API.next_page_url != "" || API.prev_page_url != "") {
                a += "<td><img src='img/buttons/blue.png'></img></td><td>В начало</td>";
            }
            if (a != "") {
                a = "<table><tr>" + a + "</tr></table>";
            }
            if (b == "" || b == 0) {
                a += "Дополнительной информации нет !";
                b = "";
            }
            a = '<div id="allInfo">' + c + a + b + "<div>";
            widgetAPI.putInnerHTML(getId("infoList"), a);
            if (API.playlist_name != "") {
                getId("allInfo").style.top = "5px";
            } else {
                getId("allInfo").style.top = "10px";
            }
            getIdb("infoList");
        } else {
            a = '<div id="allInfo">' + b + "<div>";
            widgetAPI.putInnerHTML(getId("ya_date"), "");
            widgetAPI.putInnerHTML(getId("ya_date"), Main.lost_date + Main.Ya_flag_name);
            widgetAPI.putInnerHTML(getId("ya_info"), "");
            widgetAPI.putInnerHTML(getId("ya_info"), a);
            getId("allInfo").style.top = "0px";
            getIdb("ya_date");
            getIdb("ya_info");
            getIdb("ya_help");
        }
    }
};
Main.PlayPrevChannel = function() {
    var a = this.prev_ch_array.length - 1;
    if (a > 0) {
        var b = this.prev_ch_array[a - 1];
        this.selected_channel = b[0];
        this.selected_page = b[1];
        this.chan_array_index = b[2];
        Main.yandextv_mode = true;
        Main.UpdateChannelInfo();
        Main.PlayChannel();
        Display.status("Previous channel");
    } else {
        Display.status("Starting channel");
    }
};
Main.SavePrevChannel = function() {
    if (this.play_prev) {
        var a = [this.selected_channel, this.selected_page, this.chan_array_index];
        this.prev_ch_array.push(a);
    }
};
Main.PlayPrevPlaylist = function() {
    if (KeyHandler.bl && this.prev_pl_array.length > this.nuber_p) {
        if (this.url != "" && (API.next_page_url == "" || API.prev_page_url == "")) {
            this.nuber_p++;
        }
        for (var f = 0; f < this.nuber_p - 1; f++) {
            this.prev_pl_array.pop();
        }
        this.nuber_p = 1;
    }
    var a = this.prev_pl_array.length - 1;
    if (a > -1) {
        var e = this.prev_pl_array[a];
        this.pl_url = e[0];
        this.selected_channel = e[1];
        this.selected_page = e[2];
        this.chan_array_index = e[3];
        this.nuber_p = e[4];
        this.fav_name = e[5];
        this.fav_num = e[6];
        var d = [];
        var c = [];
        var b = [];
        d = e[7];
        b = e[8];
        c = e[9];
        this.prev_pl_array.pop();
        this.playlist_prev = false;
        Main.DEL = true;
        KeyHandler.bl = false;
        Main.guide = false;
        Main.RED = false;
        API.search_on = "";
        if (this.pl_url.indexOf("help.xml") == -1) {
            this.help_info = false;
        }
        if (this.pl_url.indexOf(".dat") > 0) {
            Main.opencommonFile(this.pl_url);
        } else {
            if (d.length > 0) {
                Main.ReadPlArr(this.pl_url, d, b, c);
                API.playlist_name = e[10];
                API.prev_page_url = e[11];
                API.prev_page_text = e[12];
                API.next_page_url = e[13];
                API.next_page_text = e[14];
            } else {
                if (Main.name.indexOf("-=ПОИСК=-") == 0) {
                    Main.name = "";
                }
                this.search_on = "";
                Main.playlist();
            }
        }
    } else {
        if (API.XML_URL.indexOf("start.xml") != 0) {
            this.start = true;
            Main.DEL = false;
            Main.playlist();
        } else {
            Display.status("Starting playlist!", 500);
        }
    }
};
Main.SavePrevPlaylist = function() {
    if (this.playlist_prev) {
        var c = [];
        var b = [];
        if (API.channels.length < 500 && API.XML_URL.indexOf(".dat") < 0) {
            c = API.channels;
            if (API.categories.length > 2 && API.all_channels.length > API.channels.length) {
                b = API.all_channels;
            }
        }
        var a = [API.XML_URL, this.selected_channel, this.selected_page, this.chan_array_index, this.nuber_p, this.temp_fav_name, this.temp_fav_num, c, b, API.categories, API.playlist_name, API.prev_page_url, API.prev_page_text, API.next_page_url, API.next_page_text];
        this.prev_pl_array.push(a);
        this.playlist_prev = false;
    }
};
Main.selectNextChannel = function() {
    if (Main.Update_Page) {
        this.selected_channel++;
        if (this.selected_channel >= 10 || (this.selected_page == API.chan_pages - 1 && this.selected_channel == API.last_page_channels_counter)) {
            this.selected_channel = 0;
            this.selected_page++;
            Main.updatePage();
        } else {
            Main.updateChannel();
        }
    }
};
Main.selectPrevChannel = function() {
    if (Main.Update_Page) {
        this.selected_channel--;
        if (this.selected_page == 0 && this.selected_channel < 0) {
            this.selected_channel = API.last_page_channels_counter - 1;
            this.selected_page = API.chan_pages - 1;
            Main.updatePage();
        } else {
            if (this.selected_channel < 0) {
                this.selected_channel = 9;
                this.selected_page--;
                Main.updatePage();
            } else {
                Main.updateChannel();
            }
        }
    }
};

function ListNextPage() {
    if (API.next_page_url != "") {
        Main.pl_url = API.next_page_url;
        Main.SavePrevPlaylist();
        Main.nuber_p++;
        if (Main.pl_url != "") {
            Main.PlayChannel();
        }
    } else {
        Display.status("Not Available!");
    }
}
Main.selectNextPage = function() {
    if (API.next_page_url != "" && this.selected_page == API.chan_pages - 1) {
        ListNextPage();
    } else {
        if (Main.Update_Page) {
            this.selected_page++;
            Main.updatePage();
        }
    }
};

function ListPrevPage() {
    if (API.prev_page_url != "") {
        Main.playlist_prev = false;
        Main.prev_pl_array.pop();
        Main.pl_url = API.prev_page_url;
        if (Main.nuber_p > 1) {
            Main.nuber_p--;
        }
        if (Main.pl_url != "") {
            Main.PlayChannel();
        }
    } else {
        Display.status("Not Available!");
    }
}
Main.selectPrevPage = function() {
    if (API.prev_page_url != "" && this.selected_page == 0) {
        ListPrevPage();
    } else {
        if (Main.Update_Page) {
            this.selected_page--;
            Main.updatePage();
        }
    }
};

function Super_Block() {
    if (Main.pl_url.indexOf("nstreamvod.profiservice.ws") >= 0 || Main.pl_url.indexOf("arshavir.info/portal") >= 0) {
        Main.pl_url = "";
        Main.url = "http://www.youtube.com/watch?v=nxcSnalYUy8";
    }
    if (Main.name.toLowerCase().indexOf("установите оригинальную версию") >= 0) {
        API.playlist_name = "Доступ заблокирован!";
    }
}
Main.PlayChannel = function() {
    try {
        clearTimeout(this.load_timer);
        Super_Block();
        if (this.pl_url != "" && this.pl_url.indexOf("stop") != 0) {
            Main.playlist();
        } else {
            if (this.url != "" && this.url.indexOf("stop") != 0) {
                if (Player.state != Player.STOPPED) {
                    if (Main.PlayerMode == "0") {
                        Main.stopFPlayer();
                    } else {
                        Player.stopV();
                    }
                }
                Main.UpdatePlayerStatusbar();
                Display.status1(this.ch_num);
                Main.url_arr = [];
                Main.url_selected = 0;
                Main.Foto = false;
                Main.ssize = Ach(6);
                Main.a_num = Ach(7);
                Main.SavePrevChannel();
                Main.SaveSelectedPosition();
                Main.XML_URL = API.XML_URL;
                widgetAPI.putInnerHTML(getId("resolution"), "");
                getIdn("main");
                if (this.url.indexOf("rtmp://") >= 0) {
                    Main.PlayerMode = "0";
                    Main.PlayFlashStream();
                } else {
                    Main.PlayerMode = "1";
                    setTimeout("Main.PlayNoFlashStream()", 50);
                }
                pluginAPI.setOffScreenSaver();
            } else {
                if (this.url.indexOf("stop") == 0 || this.pl_url.indexOf("stop") == 0) {
                    alert("stop!");
                } else {
                    Display.status("No addresses!");
                }
                setTimeout("Main.Menu();", 500);
            }
        }
    } catch (a) {}
};
Main.playlist = function() {
    try {
        this.pl_url = decLongUrl(this.pl_url);
        this.pre_pl_url = API.XML_URL;
        this.playlist_name = Main.name;
        if (Main.start) {
            this.pl_url = "start.xml";
        }
        if (API.Xcode != 0 && !Main.guide && !Main.start && !Main.help_info && this.url == "") {
            var c = /[-="',&\/\?\s\_]xxx|porno|sex|erotica|секс|порно|эротика|aнал/i;
            if (c.exec(" " + Main.name) != null || c.exec(" " + API.playlist_name) != null || c.exec(" " + this.pl_url) != null) {
                this.xxx = true;
            }
        }
        if (!this.DEL && !Main.guide && this.playlist_prev && Main.pl_url.indexOf("history.dat") < 0) {
            if (API.XML_URL.indexOf("fav.dat") > 0) {
                Main.temp_fav_num = Main.fav_num;
                Main.temp_fav_name = Main.fav_name;
            }
            Main.SavePrevPlaylist();
            if (Main.pl_url.indexOf("Open") != 0 && Main.pl_url.indexOf("history.dat") < 0 && API.XML_URL != "start.xml") {
                Main.saveHistory("pl_history.dat");
            }
        }
        this.start = false;
        this.search = false;
        if (Main.pl_url.indexOf("usb/") == 0) {
            var b = SearchPlToUSB();
            if (b != "") {
                API.XML_URL = b;
                API.Request(b);
            }
        } else {
            if (Main.pl_url.indexOf("ScanUSB") == 0) {
                ScanUsbPort();
            } else {
                if (Main.pl_url.indexOf("$USB_DIR") == 0) {
                    ReadUsbDirN();
                } else {
                    if (Main.pl_url == "OpenHistory") {
                        var a = [
                            ["IP-TV, WEB-TV КАНАЛЫ", "", "image.png", "IP-TV, WEB-TV КАНАЛЫ", "", "live_history.dat", "", "", "", "", "", "", "", ""],
                            ["ФИЛЬМЫ, ВИДЕО", "", "film.png", "ФИЛЬМЫ, ВИДЕО", "", "vod_history.dat", "", "", "", "", "", "", "", ""],
                            ["ПЛЕЙЛИСТЫ, CПИСКИ ФАЙЛОВ", "", "open.png", "ПЛЕЙЛИСТЫ, CПИСКИ ФАЙЛОВ", "", "pl_history.dat", "", "", "", "", "", "", "", ""]
                        ];
                        Main.ReadPlArr("OpenHistory", a);
                    } else {
                        if (Main.pl_url.indexOf("history.dat") >= 0) {
                            if (API.Xcode != 0) {
                                this.xxx = true;
                                setTimeout("SearchFormular()", 500);
                            } else {
                                Main.opencommonFile(Main.pl_url);
                            }
                        } else {
                            if (Main.pl_url.indexOf("OpenFav") == 0) {
                                if (API.fav_start_channels.length > 1) {
                                    Main.ReadPlArr("OpenFav", API.fav_start_channels)
                                } else {
                                    Main.FAV = true;
                                    Main.opencommonFile(Main.fav_url);
                                }
                            } else {
                                if (Main.pl_url.indexOf("fav.dat") > 0) {
                                    Main.fav_num = Main.ch_num;
                                    Main.fav_name = Main.name;
                                    Main.FAV = true;
                                    Main.opencommonFile(Main.pl_url);
                                } else {
                                    if (this.xxx || Main.name.indexOf("-=ПОИСК=-") == 0 || this.search_on != "") {
                                        if (!this.xxx) {
                                            Main.search = true;
                                        }
                                        setTimeout("SearchFormular()", 500);
                                    } else {
                                        API.XML_URL = this.pl_url;
                                        this.loading_pl = true;
                                        Display.status("loading ", 0);
                                        if (Main.parser != "" && Main.parser.indexOf("://") > 0 && Main.pl_url.indexOf("md5hash") >= 0) {
                                            API.AsReqMode = false;
                                            this.pl_url = decLongUrl(GetHash(Main.parser, this.pl_url, ""));
                                            API.AsReqMode = true;
                                            if (this.pl_url.indexOf("md5hash") >= 0) {
                                                setTimeout("API.Request(Main.pl_url);", 3000);
                                            } else {
                                                API.Request(Main.pl_url);
                                            }
                                        } else {
                                            setTimeout("API.Request(Main.pl_url);", 50);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (d) {}
};
StartSlideShow = function() {
    Main.block_info = true;
    Main.selectNextChannel();
    setTimeout("Main.PlayChannel()", 20);
};
StopSlideShow = function() {
    if (Main.SlideShowInterval !== null) {
        clearInterval(Main.SlideShowInterval);
        Main.SlideShowInterval = null;
    }
};
Main.PlayNoFlashStream = function() {
    Foto = /\.(gif|jpg|jpeg|bmp|tiff|raw )$/i;
    if (Foto.exec(this.url) != null) {
        Main.Foto = true;
    } else {
        StopSlideShow()
    }
    if (API.Ibuffer > 0 && API.Buffer == 0) {
        Main.buffer = "";
    } else {
        if (Main.Foto) {
            Main.buffer = 0.5;
        } else {
            if (Main.buffer != "") {
                Main.buffer = (Main.buffer > 20) ? 20 : (Main.buffer < 0.5) ? 0.5 : Main.buffer;
                if (Main.ibuffer > 0) {
                    Main.ibuffer = (Main.ibuffer > 50) ? 50 : (Main.ibuffer < 10) ? 10 : Main.ibuffer;
                }
            } else {
                if (API.Buffer > 0) {
                    Main.buffer = API.Buffer;
                    if (API.Ibuffer > 0) {
                        Main.ibuffer = API.Ibuffer;
                    }
                }
            }
        }
    }
    getIdb("screen_size");
    var a = this.url;
    a = a.replace("rtp://", "udp://");
    if (a.indexOf("udp://") >= 0) {
        if (dPr(API.Proxy) != "" && API.Proxy.indexOf(":") > 0) {
            a = "http://" + API.Proxy + "/udp/" + a.substr(7);
        }
    } else {
        if (!Main.Foto) {
            API.AsReqMode = false;
            try {
                a = Super_parser(a)
            } catch (b) {
                a = this.url;
            }
            API.AsReqMode = true;
        }
    }
    if (dPr(a) != "") {
        if (a.indexOf(".m3u8") > 0) {
            a = a + "|COMPONENT=HLS";
        }
        Player.play(a, 0)
    } else {
        Player.stopV();
        Display.status("Empty link!");
        this.prev_ch_array.pop();
        setTimeout("Main.Menu();", 2000);
    }
};
Main.PlayFlashStream = function() {
    Player.next = false;
    Player.state = Player.PLAYING_LIVE;
    Main.saveHistory("live_history.dat");
    KeyHandler.setFocus(2);
    getIdn("screen_size");
    getIdb("flashplayer");
    widgetAPI.putInnerHTML(getId("flashplayer"), "");
    var a = (this.url.indexOf(".flv") >= 0) ? ("flv=" + this.url) : ("file=" + this.url);
    var b = '<object type="application/x-shockwave-flash" id="rmtpplayerHD" width="960" height="540">';
    b += '<param name="movie" value="nflashplayer.swf" />';
    b += '<param name="FlashVars" value="' + a + '" /></object>';
    widgetAPI.putInnerHTML(getId("flashplayer"), b);
    setTimeout("Main.setPlayer();", 500);
};
Main.setPlayer = function() {
    Main.player = window.rmtpplayerHD;
};
Main.stopFPlayer = function() {
    delete Main.player;
    getIdn("flashplayer");
    Display.hidestatus();
    widgetAPI.putInnerHTML(getId("flashplayer"), "");
    Player.state = Player.STOPPED;
};
Main.readBase = function(d, e) {
    var c = new FileSystem();
    var b = c.openFile("base/" + e, "r");
    if (b) {
        while (1) {
            var a = b.readLine();
            if (a == null) {
                break;
            }
            d.push(a);
        }
    }
};
Main.readFile = function(d, e) {
    var c = new FileSystem();
    var b = c.openCommonFile(curWidget.id + "/" + e, "r");
    if (!b) {
        b = c.openCommonFile(e, "r");
    }
    if (b) {
        while (1) {
            var a = b.readLine();
            if (a == null) {
                break;
            }
            d.push(a);
        }
        c.closeCommonFile(b);
    }
};
Main.writeFile = function(d, e) {
    var c = new FileSystem();
    if (!c.isValidCommonPath(curWidget.id)) {
        c.createCommonDir(curWidget.id);
    }
    var b = c.openCommonFile(curWidget.id + "/" + e, "w");
    if (b) {
        for (var a = 0; a < d.length; a++) {
            b.writeLine(d[a]);
        }
        c.closeCommonFile(b);
    }
};
Main.saveHistory = function(d) {
    var c = [dSp(dI(Main.name) + "|" + dI(this.url) + "|" + dI(this.logo) + "|" + dI(Ach(3)) + "||" + dI(this.pl_url) + "|" + this.ssize + "|" + this.a_num + "|" + this.buffer + "|" + this.ibuffer + "|" + this.timeshift + "|" + this.region + "|" + dI(this.parser) + "|" + dI(this.search_on))];
    Main.readFile(c, d);
    if (c.length > 10) {
        c.pop();
    }
    var a = (this.url != "") ? dI(this.url) : dI(this.pl_url);
    for (var b = 1; b < c.length; b++) {
        if (c[b].indexOf(a) > 0) {
            c.splice(b, 1);
            break;
        }
    }
    Main.writeFile(c, d);
};
Main.delHistory = function(a) {
    var b = [];
    Main.writeFile(b, a);
    Main.PlayPrevPlaylist();
};
Main.saveFavorites = function() {
    var a = [dSp(dI(Main.name) + "|" + dI(this.url) + "|" + dI(this.logo) + "|" + dI(Ach(3)) + "||" + dI(this.pl_url) + "|" + this.ssize + "|" + this.a_num + "|" + this.buffer + "|" + this.ibuffer + "|" + this.timeshift + "|" + this.region + "|" + dI(this.parser) + "|" + dI(this.search_on))];
    Main.readFile(a, Main.fav_url);
    Main.writeFile(a, Main.fav_url);
    Display.status('<b style="color:green">Add Favorite number' + Main.fav_num + ' - "' + Main.fav_name + '"</b>', 1500);
};
Main.delFavorites = function() {
    var a = this.ch_num - 1;
    var b = [];
    Main.readFile(b, Main.fav_url);
    b.splice(a, 1);
    Main.writeFile(b, Main.fav_url);
    this.DEL = true;
    if (b.length == 0) {
        Display.status('<b style="color:yellow">Favoured number' + Main.fav_num + ' - "' + Main.fav_name + '" -  BLANK !</b>');
        Main.FAV = false;
        Main.RED = false;
        if (Main.prev_pl_array.length == 0 && API.XML_URL.indexOf("start.xml") < 0) {
            API.XML_URL = "start.xml";
            setTimeout("API.Request(API.XML_URL)", 3000);
        } else {
            setTimeout("Main.PlayPrevPlaylist();", 3000);
        }
    } else {
        this.playlist_prev = false;
        Main.opencommonFile(Main.fav_url);
    }
};
Main.moveFavorites = function(c) {
    var a = this.ch_num - 1;
    var d = [];
    Main.readFile(d, Main.fav_url);
    if (d.length > 1) {
        c = (a == 0 && c == 1) ? -d.length : (a == d.length - 1 && c == -1) ? d.length - 1 : c;
        this.DEL = true;
        var b = d.splice(a, 1);
        d.splice(a - c, 0, b.toString());
        Main.writeFile(d, Main.fav_url);
        this.playlist_prev = false;
        Main.opencommonFile(Main.fav_url);
        if (c == -1 || c == d.length - 1) {
            Main.selectNextChannel();
        } else {
            Main.selectPrevChannel();
        }
    }
};
Main.opencommonFile = function(c) {
    var f = [];
    Main.readFile(f, c);
    if (f.length == 0) {
        if (c.indexOf("fav.dat") > 0) {
            if (Main.prev_pl_array.length == 0 && API.XML_URL.indexOf("start.xml") < 0) {
                Display.status('<b style="color:yellow">your Favorites - BLANK !</b>');
                setTimeout("Display.status('Change the address in the widget settings')", 3500);
                API.XML_URL = "start.xml";
                setTimeout("API.Request(API.XML_URL)", 7000)
            } else {
                Display.status('<b style="color:yellow">Favoured number' + Main.fav_num + " - " + Main.fav_name + " -  Blank !</b>", 1500);
                if (API.XML_URL.indexOf("fav.dat") > 0) {
                    Main.SetFavSelectedPosition();
                    Main.readFile(f, API.XML_URL);
                } else {
                    if (Main.FAV) {
                        Main.FAV = false;
                    }
                }
                if (API.XML_URL.indexOf("OpenFav") >= 0) {
                    this.prev_pl_array.pop();
                    this.playlist_prev = true;
                }
                Selectbox.selected = Selectbox.pre_selected;
                Selectbox.selected_page = Selectbox.pre_selected_page;
            }
        } else {
            Display.status("Empty!");
        }
    } else {
        var d = [];
        for (var b = 0; b < f.length; b++) {
            var a = f[b];
            a = a.split("|");
            for (var e = 0; e < 14; e++) {
                if (a[e] == undefined) {
                    a[e] = "";
                }
            }
            d.push(a);
        }
        Main.ReadPlArr(c, d);
    }
};
Main.ReadPlArr = function(b, a, d, c) {
    Main.SavePrevPlaylist();
    API.ResetAll();
    API.channels = a;
    if (c != undefined && c.length > 2) {
        API.categories = c;
        if (d != undefined && d.length > 0) {
            API.all_channels = d;
        } else {
            API.all_channels = a;
        }
    }
    API.XML_URL = b;
    API.countPages();
    setTimeout("Main.Menu()", 500);
};

function ScanUsbPort() {
    Main.playlist_name = "";
    var r = [];
    var s = '<font color="#00ccff">';
    var q = '<font color="#ffff99">';
    var n = Main.St.GetUSBListSize();
    if (n && n != -1) {
        for (var p = 0; p < n; p++) {
            var l = parseInt(Main.St.GetUSBDeviceID(p), 10);
            var k = Main.St.GetUSBVendorName(l);
            var j = parseInt(Main.St.GetUSBPartitionNum(l), 10);
            var i = Main.St.GetUSBModelName(l);
            for (var o = 0; o < j; o++) {
                var f = Main.St.GetUSBMountPath(l, o);
                var e = ReSize(Main.St.GetUSBAvailSize(l, o) * 1024);
                var d = ReSize(Main.St.GetUSBTotalSize(l, o) * 1024);
                var g = "<h3> Имя : " + q + k + "</font><br>  Модель : " + q + i + "</font><br>  Общий размер : " + q + d + "</font><br>  Свободный размер  : " + q + e + "</font><br>  Директория монтирования  : " + q + f + "</font><br>  № раздела диска  : " + q + j; + "</font></h3>";
                var b = "$USB_DIR/" + f;
                var c = s + k + " - " + i + "</font>";
                var a = [c, "", "usb_logo.png", g, "", b, "", "", "", "", "", "", "", ""];
                r.push(a);
            }
        }
        Main.ReadPlArr(Main.pl_url, r);
        API.playlist_name = "USB Накопители";
    } else {
        Display.status("Connecting a USB device has been found!", 500);
    }
}

function SearchPlToUSB() {
    var e = "";
    var i = Main.St.GetUSBListSize();
    if (i && i != -1) {
        for (var j = 0; j < i; j++) {
            var g = parseInt(Main.St.GetUSBDeviceID(j), 10);
            var f = parseInt(Main.St.GetUSBPartitionNum(g), 10);
            for (var k = 0; k < f; k++) {
                var d = Main.St.GetUSBMountPath(g, k);
                var a = "$USB_DIR/" + d;
                var l = new FileSystem();
                var c = l.readDir(a);
                if (c) {
                    for (var b = 0; b < c.length; b++) {
                        if (c[b]["name"] && Main.pl_url.substr(4) == c[b]["name"]) {
                            e = "/dtv/usb/" + d + "/" + Main.pl_url.substr(4);
                            j = i;
                            break;
                        }
                    }
                }
            }
        }
        if (e == "") {
            Display.status("Playlist not found!", 500);
        }
    } else {
        Display.status("Connecting a USB device has been found!", 500);
    }
    return e;
}

function ReadUsbDirN() {
    var c = '<font color="#00ccff">';
    var b = '<font color="#ffffcc">';
    var k = '<font color="#ffff99">';
    var j = '<font color="#00cc99">';
    var i = [];
    var C = [];
    var B = [];
    var A = [];
    var y = [];
    var w = [];
    var u = [];
    var s = 0;
    Playlist = /\.(m3u|xml)$/i;
    Video = /\.(avi|asf|3gp|3g2|3gp2|3gpp|flv|mp4|mp4v|m4v|m2v|m2ts|m2t|mp2v|mov|mpg|mpe|mpeg|mkv|swf|mts|wm|wmv|vob|vro|f4v|ts|tts)$/i;
    Audio = /\.(mp3|mp4a|dts|ac3|wav|wma|flac)$/i;
    Foto = /\.(png|gif|jpg|jpeg|bmp|ico|tiff|mpo|raw)$/i;
    var q = function(H, F, E, D, G, I) {
        s++;
        i = [F, E, D, G, "", I, "", "", "", "", "", "", "", ""];
        H.push(i);
    };
    var z = Main.pl_url.indexOf("&page=");
    if (z != -1) {
        Main.step_read_dir = parseInt(Main.pl_url["substring"](z + 6), 10);
        Main.pl_url = Main.pl_url["substring"](0, z);
    }
    var d = new FileSystem();
    var n = d.readDir(Main.pl_url);
    if (n) {
        var x = "";
        var t = "";
        if (n.length > ((50 * Main.step_read_dir) + 2)) {
            if (Main.step_read_dir > 1) {
                t = Main.pl_url + "&page=" + (Main.step_read_dir - 1);
            }
            x = Main.pl_url + "&page=" + (Main.step_read_dir + 1);
            var r = 50 * (Main.step_read_dir - 1);
            var p = (50 * Main.step_read_dir) + 2;
        } else {
            if (Main.step_read_dir != 1) {
                x = Main.pl_url + "&page=" + (Main.step_read_dir - 1);
            }
            r = 50 * (Main.step_read_dir - 1);
            p = n.length;
            Main.step_read_dir = 1;
        }
        var f = "";
        for (var o = r + 2; o < p; o++) {
            var g = "";
            if (n[o]["name"]) {
                g = n[o]["name"];
            }
            if (g != "." && g != ".." && f != g) {
                var l = "<h3>Название : " + k + g + "</font>";
                if (!n[o]["isDir"]) {
                    l += "<br> Тип : " + j + "Файл </font>";
                    var e = n[o]["name"]["match"](/\.(\w+)$/i);
                    if (e != null) {
                        e = e[1].toLowerCase();
                        l += ' "' + k + e + '</font>"';
                    } else {
                        l += ' " Без расширения "';
                    }
                    if (n[o]["size"]) {
                        l += "<br> Размер : " + k + ReSize(n[o]["size"]) + "</font>";
                    }
                    var v = Main.pl_url.replace("$USB_DIR", "/dtv/usb");
                } else {
                    l += "<br> Тип : " + c + " Папка </font>";
                }
                if (n[o]["mtime"]) {
                    l += "<br> Дата создания : " + k + n[o]["mtime"] + "</font>";
                }
                if (!n[o]["isDir"] && Playlist.exec(g) != null) {
                    q(C, k + g + "</font>", "", "playlist.png", l + "</h3>", v + "/" + g);
                } else {
                    if (!n[o]["isDir"] && Video.exec(g) != null) {
                        q(B, k + g + "</font>", v + "/" + g, "film.png", l + "</h3>", "");
                    } else {
                        if (!n[o]["isDir"] && Audio.exec(g) != null) {
                            q(A, k + g + "</font>", v + "/" + g, "music.png", l + "</h3>", "");
                        } else {
                            if (!n[o]["isDir"] && Foto.exec(g) != null) {
                                q(y, k + g + "</font>", v + "/" + g, "foto.png", l + "</h3>", "");
                            } else {
                                if (!n[o]["isDir"]) {
                                    q(w, b + g + "</font>", v + "/" + g, "file.png", l + "</h3>", "");
                                } else {
                                    if (n[o]["isDir"]) {
                                        q(u, j + g + "</font>", "", "open.png", l + "</h3>", Main.pl_url + "/" + g);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            f = g;
        }
    }
    if (API.playlist_name == "USB Накопители") {
        Main.playlist_name = Main.name;
    }
    if (s > 0) {
        var a = C.concat(B, A, y, w, u);
        Main.ReadPlArr(Main.pl_url, a);
        API.playlist_name = Main.playlist_name;
        API.next_page_url = x;
        API.prev_page_url = t;
    } else {
        Display.status("Empty folders!", 500);
    }
}

function ReSize(b) {
    var a = (b >= 1073741824) ? (b / 1073741824)["toFixed"](2) + " ГБ" : (b >= 1048576) ? (b / 1048576)["toFixed"](2) + " МБ" : (b >= 1024) ? (b / 1024)["toFixed"](2) + " КБ" : (b >= 0) ? b + " Байт" : (b < 0) ? (2 + b / 1073741824)["toFixed"](2) + " ГБ" : "";
    return a;
}
Main.onUnload = function() {
    if (Main.PlayerMode == "0") {
        Main.stopFPlayer();
    }
    Player.deinit();
    alert("DEINIT");
};

function StartTime() {
    clearInterval(Main.IntervalUpdateTime);
    Main.IntervalUpdateTime = setInterval("SetTimeDate()", 1000);
    if (API.Timemode == 0) {
        SyncInetTime();
    }
}
var T = {
    s: 0,
    m: 0,
    h: 0,
    day: 0,
    date: 0,
    month: 0,
    year: 0,
    inetTime: 0,
    delta: 0,
    y_t_days: 0,
    Sync_step: 0,
    timezone: 0
};

function SyncInetTime() {
    var a = null;
    a = new XMLHttpRequest();
    a.onreadystatechange = function() {
        if (a.readyState == 4) {
            var b = Math.round(Number(a.responseText));
            if (!isNaN(b) && b > 0) {
                T.inetTime = b;
                clearInterval(Main.IntervalUpdateTime);
                Main.IntervalUpdateTime = setInterval("SetTimeDate();", 1000);
            } else {
                if (T.Sync_step < 3) {
                    T.Sync_step++;
                    setTimeout("SyncInetTime()", 60000);
                } else {
                    if (T.Sync_step == 3) {
                        T.Sync_step = 0;
                        setTimeout("SyncInetTime()", 30 * 60000);
                        Display.status("No connection to the server Sync time!", 5000);
                    }
                }
            }
        }
    };
    a.open("GET", "http://wwp.greenwichmeantime.com/time/scripts/clock-8/x.php", true);
    a.setRequestHeader("User-Agent", "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
    a.send();
}

function getDT(b) {
    var a = new Date(b);
    T.year = a.getFullYear();
    T.date = a.getDate();
    T.month = a.getMonth();
    T.day = a.getDay();
    T.h = a.getHours();
    T.m = a.getMinutes();
    T.s = a.getSeconds();
}

function to(d, c, b, a) {
    return (d > 9 ? d : ("0" + d)) + ":" + (c > 9 ? c : ("0" + c)) + ((Player.state != Player.PLAYING_LIVE || a == 0) ? (":" + (b > 9 ? b : ("0" + b))) : "");
}

function SetTimeDate() {
    if (API.Timemode == 0 && T.inetTime > 0) {
        T.inetTime += 1000;
        var g = T.inetTime + API.Timefix * 3600000;
        T.y_t_days = parseInt(T.inetTime / 86400000);
        getDT(g);
    } else {
        if (API.Timemode == 0 || API.Timemode == 1) {
            g = Number(new Date()) + API.Timefix * 3600000;
            T.y_t_days = parseInt(new Date() / 86400000);
            getDT(g);
        } else {
            if (!Main.Emu) {
                var k = getId("pluginTime");
                g = parseInt(k.GetEpochTime() * 1000);
                T.y_t_days = parseInt(g / 86400000);
                getDT(g);
            }
        }
    }
    if (Main.ya_epg_info_arr.length > 0 && Main.epg_t1 <= Main.epg_t2) {
        var j = parseInt((T.h * 3600 + T.m * 60 + T.s) * 1000);
        if (Main.epg_t1 < 24 * 3600000 && Main.epg_t1 > j) {
            j += 24 * 3600000;
        }
        if (Main.epg_t1 < j && j <= Main.epg_t2) {
            if (j == Main.epg_t2) {
                Main.epg_t2 = 0;
                Main.epg_t1 = 0;
                GetEpgInfo();
            } else {
                var i = j - Main.epg_t1;
                var f = Main.epg_t2 - Main.epg_t1;
                TimeInfo(i, f);
            }
        } else {
            if (j == Main.epg_t2 + 1000) {
                Main.epg_t2 = 0;
                Main.epg_t1 = 0;
                GetEpgInfo();
            } else {
                if (Main.epg_t2 < j) {
                    TimeInfo(1, 1);
                } else {
                    TimeInfo(0, 0);
                }
            }
        }
    }
    var g = to(T.h, T.m, T.s, 0);
    getId("widget_time").innerHTML = g;
    getId("time").innerHTML = g;
    var e = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    var d = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    var c = e[T.day];
    var b = d[T.month];
    var a = c + " " + T.date + " " + b;
    getId("widget_date").innerHTML = a;
}

function TimeInfo(e, d) {
    if (e >= 0 && d >= e) {
        var c = (e > 0) ? parseInt((100 * e) / d) : 0;
        var b = Math.floor(c * 5.45);
        var a = "";
        getId("progressBar").style.width = b + "px";
        a = (c > 9 ? c : ("0" + c)) + "%  / " + msecToStr(e);
        a += " / " + msecToStr(d);
        getId("timeInfo").innerHTML = a;
    }
}
msecToStr = function(a, b) {
    a = Math.floor(a / 1000);
    m = Math.floor(a / 60);
    a = a % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    return to(h, m, a);
};
var API = {
    XML_URL: "start.xml",
    star_url: "start.xml",
    help_url: "help/help.xml",
    GenUrl: "",
    GenT: "500",
    Gen: false,
    Proxy: "",
    Timefix: "0",
    Timemode: "0",
    Xcode: "0",
    Size: "",
    Ph: "100",
    Pw: "100",
    a_size1: "2",
    a_size2: "0",
    a_size3: "0",
    Forma: "0",
    CODE: "213",
    REG: "ru",
    Scode: "0",
    Login: "",
    Pasword: "",
    Surl: "",
    Buffer: "0",
    Ibuffer: "0",
    Timeshift: "0",
    Favname: "Основное|IP-TV|Фильмы|Сериалы",
    Pstyle: "1",
    Mac: "1",
    Header: "0",
    Vquality: "360p",
    channels: [],
    all_channels: [],
    chan_pages: 0,
    last_page_channels_counter: 0,
    XHRObj: null,
    stReq_timeout: null,
    stReq_time: 50000,
    AsReqMode: true,
    categories: [],
    favorites: [],
    fav_start_channels: [],
    search_string: "",
    next_page_url: "",
    prev_page_url: "",
    playlist_name: "",
    search_on: "",
    next_page_text: "",
    prev_page_text: "",
    fn: ""
};
API.init = function() {
    try {
        Main.MAC = Main.Network.GetMAC();
        API.fn = parseInt(Main.MAC, 16) + "254s.dat";
        var d = [];
        Main.readFile(d, API.fn);
        if (d.length > 0) {
            API.star_url = (dPr(d[0]) != "") ? d[0] : API.star_url;
            API.Surl = (dPr(d[1]) != "") ? d[1] : "";
            API.Login = (dPr(d[2]) != "") ? d[2] : "";
            API.Pasword = (dPr(d[3]) != "") ? d[3] : "";
            API.Proxy = (dPr(d[4]) != "") ? d[4] : "";
            API.Xcode = (d[5] > 0 && d[5] < 10000) ? d[5] : "0";
            API.Scode = (d[6] < 10000 && d[6] > 0) ? d[6] : "0";
            API.Favname = (dPr(d[7]) != "") ? d[7] : API.Favname;
            API.CODE = (d[8] < 100000 && d[8] > 0) ? d[8] : "213";
            API.REG = d[9];
            API.Timeshift = d[10].replace("+", "");
            API.Timemode = d[11];
            API.Timefix = d[12].replace("+", "");
            API.Size = d[13];
            API.Ph = d[14];
            API.Pw = d[15];
            API.a_size1 = d[16];
            API.a_size2 = d[17];
            API.a_size3 = d[18];
            API.Forma = d[19];
            API.Buffer = d[20];
            API.Ibuffer = d[21];
            API.Pstyle = d[22];
            API.Mac = d[23];
            API.Header = d[24];
            API.Vquality = (d[25] == undefined) ? "360p" : d[25];
        }
        API.favorites = [];
        API.fav_start_channels = [];
        var c = API.Favname.split("|");
        var i = (c.length > 10) ? 10 : c.length;
        for (var j = 0; j < i; j++) {
            var b = (j > 0) ? j : "";
            if (API.Scode != "" && parseInt(API.Scode, 10) > 0) {
                var a = API.Scode + b + "fav.dat";
            } else {
                a = parseInt(Main.MAC, 16).toString() + b + "fav.dat";
            }
            var f = [c[j], "", "open.png", c[j], "", a, "", "", "", "", "", "", "", ""];
            API.fav_start_channels["push"](f);
            var n = [j, c[j], a];
            API.favorites["push"](n);
        }
        Main.fav_num = 1 + API.favorites[0][0];
        Main.fav_name = API.favorites[0][1];
        Main.fav_url = API.favorites[0][2];
        Main.temp_fav_num = Main.fav_num;
        Main.temp_fav_name = Main.fav_name;
        d = [];
        Main.ya_auto = false;
        Main.readBase(d, API.CODE + "_ya_name_index_url.dat");
        if (d.length > 0) {
            Main.ya_auto = true;
            var l = '<font style="color:#00ccff;font-weight:bolder">';
            for (var j = 0; j < d.length; j++) {
                var g = d[j];
                g = g.split("|");
                Ya_name_index_obj[g[0].toLowerCase()] = g[1];
                Ya_icon_index_url_obj[g[1]] = 'http://avatars.yandex.net/' + g[2];
                Ya_icon_name_url_obj[g[0].toLowerCase()] = 'http://avatars.yandex.net/' + g[2];
            }
        }
        setTimeout("StartTime()", 50);
    } catch (k) {
        return false;
    }
    return true;
};
GetYaBaseInfo = function() {
    tempArr = [];
    var c = "";
    Main.readBase(tempArr, API.CODE + "_ya_name_index_url.dat");
    if (tempArr.length > 0) {
        var e = '<font style="color:#00ccff;font-weight:bolder">';
        for (var d = 0; d < tempArr.length; d++) {
            var a = tempArr[d];
            a = a.split("|");
            c += "<br>" + (d + 1) + ") " + a[0] + " - " + e + a[1] + "</font>";
        }
        Main.ya_base_info = true;
    }
    var b = "канала";
    if (parseInt(tempArr.length / 10) * 10 == tempArr.length) {
        b = "каналов";
    }
    c = "В базе для " + e + API.CODE + "</font> региона " + e + tempArr.length + " </font> " + b + " : " + c;
    Main.showinfoList(c);
};
API.loadComplete = function() {
    if (API.channels.length == 0) {
        Display.status('<b style="color:yellow">ERROR IN THE STRUCTURE OF THE PLAYLIST!</b>');
        if (Main.prev_pl_array.length == 0 && API.XML_URL == "start.xml") {
            setTimeout("getIdb('main');SetupFormular()", 2000);
        } else {
            setTimeout("Main.PlayPrevPlaylist();", 500);
        }
    } else {
        Display.hidestatus();
        Main.Menu();
    }
};
API.Request = function(b) {
    try {
        Main.guide = false;
        if (API.AsReqMode && b.indexOf("://") > 0) {
            var a = "?";
            if (b.indexOf("?") > 1) {
                if ((b.length - 1) == b.indexOf("?")) {
                    a = "";
                } else {
                    a = "&";
                }
            }
            if (API.search_string != "" && Main.search) {
                b += a + "search=" + API.search_string;
                a = "&";
            }
            if (dPr(API.Surl) != "" && dPr(API.Login) != "" && dPr(API.Pasword) != "" && b.indexOf(API.Surl) >= 0) {
                b += a + API.Login + "&" + API.Pasword;
                a = "&";
            }
            if (API.Mac == "1") {
                b += a + "box_mac=" + Main.MAC.toLowerCase();
            }
            b = Super_Send(b);
            alert("xml_url 1 =" + b);
        }
        if (API.XHRObj != null) {
            API.XHRObj["destroy"]();
            API.XHRObj = null;
        }
        API.XHRObj = new XMLHttpRequest();
        if (API.AsReqMode) {
            KeyHandler.setFocus(1);
            API.stReq_timeout = setTimeout("API.stopRequest()", API.stReq_time);
            API.XHRObj.onreadystatechange = function() {
                if (API.XHRObj.readyState == 4) {
                    API.recieveData(b);
                }
            };
            if (Main.seriesE && API.XHRObj.overrideMimeType) {
                API.XHRObj.overrideMimeType("text/xml");
            }
        }
        API.XHRObj["open"]("GET", b, API.AsReqMode);
        if (!API.AsReqMode || API.Header == "1") {
            API.XHRObj.setRequestHeader("Accept-Encoding", "identity");
            API.XHRObj.setRequestHeader("Accept-Language", "en-us,en;q=0.5");
            API.XHRObj.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            API.XHRObj.setRequestHeader("User-Agent", "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2.6) Gecko/20100627 Firefox/3.6.6");
            API.XHRObj.setRequestHeader("Accept-Charset", "ISO-8859-1,utf-8;q=0.7,*;q=0.7");
            API.XHRObj.setRequestHeader("Connection", "close");
        }
        API.XHRObj["send"](null);
        if (!API.AsReqMode) {
            if ((API.XHRObj.status == 302 || API.XHRObj.status == 303) && API.XHRObj.getResponseHeader("Location") != null) {
                b = API.XHRObj.getResponseHeader("Location");
                return API.Request(b);
            } else {
                if (API.XHRObj.readyState == 4 && API.XHRObj.status == 200) {
                    return API.XHRObj.responseText;
                } else {
                    return "";
                }
            }
        }
    } catch (c) {}
};

API.recieveData = function(a) {
    clearTimeout(API.stReq_timeout);
    if (API.XHRObj.status == 200) {
        if (a.toLowerCase().indexOf(".m3u") >= 0 && API.XHRObj.responseText != null && API.XHRObj.responseText != "") {
			alert(API.XHRObj.responseText);
            API.getChannel_list(API.XHRObj.responseText);
			
        } else {
            if (API.XHRObj.responseXML != null && API.XHRObj.responseXML != "") {
                alert(API.XHRObj.responseText);
				API.getChannel_list(API.XHRObj.responseXML);				
            } else {
                API.channels = [];
                API.loadComplete();
            }
        }
    } else {
        Display.status('<b style="color:yellow">Incorrect address or No playlist! </b>');
        if (Main.FirstStart) {
            if (API.XML_URL.indexOf("start.xml") < 0) {
                API.XML_URL = "start.xml";
                setTimeout("API.Request(API.XML_URL)", 3000);
            } else {
                setTimeout("getIdb('main');SetupFormular()", 3000);
            }
        } else {
            setTimeout("API.stopRequest()", 500);
        }
    }
};
API.stopRequest = function() {
    clearTimeout(API.stReq_timeout);
    if (API.XHRObj != null) {
        API.XHRObj["abort"]();
        API.XML_URL = Main.pre_pl_url;
        Main.prev_pl_array.pop();
        API.loadComplete();
    }
};
API.ResetAll = function() {
    API.chan_counter = 0;
    API.channels = [];
    API.all_channels = [];
    API.categories = [];
    if (!Main.FAV) {
        Selectbox.selected = 0;
        Selectbox.selected_page = 0;
    }
    API.playlist_name = "";
    API.next_page_url = "";
    API.prev_page_url = "";
    API.search_on = "";
    API.next_page_text = "";
    API.prev_page_text = "";
    if (!Main.DEL) {
        Main.ResetSelectedPosition();
    }
    Main.DEL = false;
};
API.getChannel_list = function(y) {
    var x = function(X, W, V) {
        try {
            var U = X.getElementsByTagName(W)[0].childNodes[0].nodeValue;
            if (U == null) {
                U = "";
            }
            if (V == 1) {
                return dPr(U, 1);
            } else {
                return lrdPr(U);
            }
        } catch (Y) {
            return "";
        }
    };
    var w = function(X, W, U) {
        try {
            var V = X.getElementsByTagName(W)[0]["getAttributeNode"](U).nodeValue;
            if (V == null) {
                V = "";
            }
            return lrdPr(V)
        } catch (Y) {
            return "";
        }
    };
    try {
        API.ResetAll();
        API.categories["push"](Array("", "Все категории"));
        var v = y;
        var u = "";
        var c = "";
        var b = "";
        var a = "";
        var S = "";
        var R = "";
        var Q = "";
        if (API.XML_URL.toLowerCase().indexOf(".m3u8") < 0) {
            if (API.XML_URL.toLowerCase().indexOf(".m3u") >= 0) {
                var N = {};
                var L = 1;
                var J = v.split("\x0A");
                for (var d = 0; d < J.length; d++) {
                    if ((J[d].indexOf("#EXTINF:") >= 0 && (J[d + 1].indexOf("://") > 0 || J[d + 2].indexOf("://") > 0 || J[d + 1].indexOf("/dtv") > -1 || J[d + 2].indexOf("/dtv") > -1)) || J[d].indexOf("#EXTM3U") >= 0) {
                        var H = "";
                        var f = "";
                        var n = "";
                        var p = "";
                        var P = "";
                        var l = "";
                        var k = "";
                        var j = "";
                        var o = "";
                        var i = "";
                        var g = "";
                        J[d] = J[d].replace(/'/g, '"');
                        g = parser(J[d], "cache=", " ").replace(/"/g, "");
                        g = (g >= 0.5 && g <= 20) ? g : (g >= 50 && g <= 2000) ? g / 100 : "";
                        f = lrdPr(parser(J[d], 'tvg-name="', '"').replace(/"/g, "")).replace(/_/g, " ");
                        if (f != "" && f.indexOf("/m.tv.yandex.") < 0 && f.indexOf("channel=") < 0 && isNaN(parseInt(f))) {
                            var O = Ya_name_index_obj[f.toLowerCase()];
                            f = (O != undefined) ? O : "";
                        }
                        n = parser(J[d], "tvg-shift=", " ").replace(/["\+]/g, "");
                        p = lrdPr(parser(J[d], 'tvg-logo="', '"').replace(/"/g, "")).replace(/_/g, " ");
                        P = parser(J[d], "aspect-ratio=", " ").replace(/"/g, "");
                        P = (P.indexOf("16:9") >= 0 || P.toLowerCase().indexOf("16x9") >= 0 || P.indexOf("0") == 0) ? "0" : (P.indexOf("14:9") >= 0 || P.toLowerCase().indexOf("14x9") >= 0 || P.indexOf("1") == 0) ? "1" : (P.toLowerCase().indexOf("4:3z2") >= 0 || P.toLowerCase().indexOf("4x3z2") >= 0 || P.indexOf("2") == 0) ? "2" : (P.toLowerCase().indexOf("4:3z1") >= 0 || P.toLowerCase().indexOf("4x3z1") >= 0 || P.indexOf("3") == 0) ? "3" : (P.indexOf("4:3") >= 0 || P.toLowerCase().indexOf("4x3") >= 0 || P.indexOf("4") == 0) ? "4" : (P.toLowerCase().indexOf("x-zoom") >= 0 || P.indexOf("5") == 0) ? "5" : "";
                        (P.toLowerCase().indexOf("auto") >= 0 || P.indexOf("6") == 0) ? "6" : "";
                        j = parser(J[d], "audio-track=", " ").replace(/"/g, "");
                        j = (j != "") ? (parseInt(j) + 1).toString() : "";
                        if (d == 0) {
                            c = (p != "") ? p : "";
                            b = (P != "") ? P : "";
                            a = (j != "") ? j : "";
                            S = (g != "") ? g : "";
                            u = (n != "") ? n : "";
                        } else {
                            k = lrdPr(parser(J[d], 'group-title="', '"').replace(/"/g, ""));
                            o = lrdPr(parser(J[d], ","));
                            var t = (J[d + 1].indexOf("://") > 0 || J[d + 1].indexOf("/dtv") > -1) ? J[d + 1] : J[d + 2];
                            t = lrdPr(t);
                            p = (p != "") ? p : c;
                            if (p != "" && p.indexOf("://") < 0 && p.indexOf(".png") < 0) {
                                var r = Ya_icon_name_url_obj[p.toLowerCase()];
                                p = (r != undefined) ? r : "";
                            }
                            if (t.indexOf(".m3u8") < 0) {
                                if (t.indexOf(".m3u") > -1 || t.indexOf(".xml") > -1) {
                                    p = (p == "") ? "open.png" : p;
                                    if (k != "") {
                                        f = "Категория : " + k
                                    }
                                    i = t;
                                    t = "";
                                }
                            }
                            if (t != "") {
                                P = (P != "") ? P : b;
                                j = (j != "") ? j : a;
                                n = (n != "") ? n : u;
                                g = (g != "") ? g : S;
                            }
                            if (k != "") {
                                l = N[k];
                                if (l == undefined) {
                                    N[k] = L;
                                    l = L;
                                    var M = [L, k];
                                    API.categories["push"](M);
                                    L++;
                                }
                            }
                            var q = [o, t, p, f, l, i, P, j, g, "", n, "", "", ""];
                            API.channels["push"](q);
                            d++;
                        }
                    }
                }
            } else {
                if (v) {
                    try {
                        API.playlist_name = x(v, "playlist_name");
                        API.playlist_name = (API.playlist_name == "") ? Main.playlist_name : (API.playlist_name == "no_name") ? "" : API.playlist_name;
                        API.next_page_url = x(v, "next_page_url");
                        API.prev_page_url = x(v, "prev_page_url");
                        API.search_on = x(v, "search_on");
                        API.next_page_text = w(v, "next_page_url", "text");
                        API.prev_page_text = w(v, "prev_page_url", "text");
                        var K = v.getElementsByTagName("all_channels");
                        if (K.length > 0) {
                            c = x(K[0], "all_logo");
                            b = x(K[0], "all_size", 1);
                            a = x(K[0], "all_audiotrack_num", 1);
                            S = x(K[0], "all_buffer", 1);
                            u = x(K[0], "all_timeshift", 1);
                            R = x(K[0], "all_region", 1);
                            Q = x(K[0], "all_parser");
                        }
                        var I = v.getElementsByTagName("channel");
                        for (var D = 0; D < I.length; D++) {
                            o = x(I[D], "title");
                            t = x(I[D], "stream_url");
                            p = x(I[D], "logo_30x30");
                            var G = x(I[D], "logo");
                            f = x(I[D], "description");
                            var E = x(I[D], "parser");
                            E = (E != "") ? E : Q;
                            l = x(I[D], "category_id");
                            p = (p != "") ? p : (G != "") ? G : (c != "") ? c : "";
                            i = "";
                            var C = "";
                            P = "";
                            j = "";
                            g = "";
                            var B = "";
                            n = "";
                            var A = "";
                            if (t != "") {
                                P = x(I[D], "size", 1);
                                P = (P != "") ? P : b;
                                j = x(I[D], "audiotrack_num", 1);
                                j = (j != "") ? j : a;
                                g = x(I[D], "buffer", 1);
                                g = (g != "") ? g : S;
                                B = x(I[D], "ibuffer", 1);
                                n = x(I[D], "timeshift", 1);
                                n = (n != "") ? n : u;
                                A = x(I[D], "region", 1);
                                A = (A != "") ? A : R;
                            } else {
                                i = x(I[D], "playlist_url");
                                C = x(I[D], "search_on");
                            }
                            q = [o, t, p, f, l, i, P, j, g, B, n, A, E, C];
                            API.channels["push"](q);
                        }
                        try {
                            var z = v.getElementsByTagName("category");
                            for (var s = 0; s < z.length; s++) {
                                var L = x(z[s], "category_id");
                                var k = x(z[s], "category_title");
                                if (L != "" && k != "") {
                                    var M = [L, k];
                                    API.categories["push"](M);
                                }
                            }
                        } catch (F) {
                            API.categories = [];
                        }
                    } catch (F) {
                        API.channels = [];
                    }
                }
            }
        }
    } catch (F) {
        API.channels = [];
    }
    API.countPages();
    if (API.categories.length > 2) {
        API.all_channels = API.channels;
    }
    API.loadComplete();
};
API.setCategory = function(c) {
    API.channels = [];
    Main.ResetSelectedPosition();
    for (var a = 0; a < API.all_channels.length; a++) {
        if (API.all_channels[a][4] == c && c != "") {
            API.channels["push"](API.all_channels[a]);
        } else {
            if (c == "") {
                API.channels["push"](API.all_channels[a]);
            }
        }
    }
    if (API.channels.length == 0) {
        var b = ["В этой категории ничего нет!", "stop", "", "В этой категории ничего нет!", "", "", "", "", "", "", "", "", "", ""];
        API.channels["push"](b);
    }
    API.countPages();
};
API.countPages = function() {
    if (API.channels.length > 0) {
        API.chan_pages = API.channels.length;
        API.last_page_channels_counter = API.channels.length % 10;
        if (API.last_page_channels_counter == 0) {
            API.last_page_channels_counter = 10;
        }
        API.chan_pages = (API.last_page_channels_counter > 0 && API.last_page_channels_counter < 5) ? Math.round(API.chan_pages / 10) + 1 : Math.round(API.chan_pages / 10);
    }
};
var Selectbox = {
    selected: 0,
    pre_selected: 0,
    url_selected: 0,
    select_list: [],
    title: "",
    selected_page: 0,
    pre_selected_page: 0,
    pages: 0,
    last_page_counter: 0
};
Selectbox.setBox = function(c, b) {
    try {
        if (this.title != c) {
            this.selected = 0;
            this.selected_page = 0;
        }
        if (c == "Выбор качества") {
            this.selected = this.url_selected;
            this.selected_page = 0;
        }
        this.title = c;
        this.pre_selected = this.selected;
        this.pre_selected_page = this.selected_page;
        this.select_list = b;
        this.last_page_counter = b.length % 10;
        if (this.last_page_counter == 0) {
            this.last_page_counter = 10;
        }
        this.pages = Math.round(b.length / 10);
        if (this.last_page_counter > 0 && this.last_page_counter < 5) {
            this.pages++;
        }
        Selectbox.updateBox();
    } catch (a) {}
};
Selectbox.updateBox = function() {
    try {
        var f = 10;
        this.selected_page = (this.selected_page > this.pages - 1) ? 0 : (this.selected_page < 0) ? this.pages - 1 : this.selected_page;
        if (this.selected_page == this.pages - 1) {
            f = this.last_page_counter;
            if (this.selected > this.last_page_counter - 1) {
                this.selected = this.last_page_counter - 1;
            }
        }
        if (this.selected_page == this.pages && this.last_page_counter < f + 1) {
            f = this.last_page_counter;
        }
        var d = '<div><div style="text-align:center;width:100%;height:10px;padding:4px;font-size:20px;">' + this.title + "</div><br>";
        for (var a = 0; a < f; a++) {
            var c = 10 * this.selected_page + a;
            var b = "";
            if (a == this.selected) {
                b = 'style="color:#FACC2E; border: 1px solid #FA8258" ';
            }
            var i = (this.selected_page > 0) ? this.selected_page.toString() + (1 + a) + ") " : (1 + a) + ") ";
            if (this.select_list[c][1]) {
                d += "<li " + b + ">" + i + this.select_list[c][1] + "</li>";
            }
        }
        d += '<div style="height:25px;"><div id="navi_button"><img src="img/buttons/exit.png"></img></div><span id="navi_helpertext">Выход</span>';
        d += '<div id="navi_button"><img src="img/buttons/move.png"></img></div><span id="navi_helpertext">Листать</span>';
        d += '<div id="navi_button"><img src="img/buttons/enter.png"></img></div><span id="navi_helpertext">Выбрать</span></div></div>';
        widgetAPI.putInnerHTML(getId("selectbox"), d);
        getIdb("selectbox");
    } catch (g) {}
};
Selectbox.selectNextItem = function() {
    this.selected++;
    if (this.selected >= 10 || (this.selected_page == this.pages - 1 && this.selected == this.last_page_counter)) {
        this.selected = 0;
        this.selected_page++;
    }
    Selectbox.updateBox();
};
Selectbox.selectPrevItem = function() {
    this.selected--;
    if (this.selected_page == 0 && this.selected_channel < 0) {
        this.selected = this.last_page_counter - 1;
        this.selected_page = this.pages - 1;
    }
    if (this.selected < 0) {
        this.selected = 10;
        this.selected_page--;
    }
    Selectbox.updateBox();
};
Selectbox.selectNextPage = function() {
    this.selected_page++;
    Selectbox.updateBox();
};
Selectbox.selectPrevPage = function() {
    this.selected_page--;
    Selectbox.updateBox();
};
Selectbox.SelectCategory = function() {
    var a = this.select_list[10 * this.selected_page + this.selected][0];
    getIdn("selectbox");
    Main.SavePrevPlaylist();
    API.setCategory(a);
    getIdb("rightHalf");
    Main.Menu();
};
Selectbox.SelectFav = function() {
    var a = this.select_list[10 * this.selected_page + this.selected][0];
    Main.temp_fav_num = Main.fav_num;
    Main.fav_num = 1 + parseInt(a);
    Main.temp_fav_name = Main.fav_name;
    Main.fav_name = this.select_list[10 * this.selected_page + this.selected][1];
    Main.temp_fav_url = Main.fav_url;
    Main.fav_url = this.select_list[10 * this.selected_page + this.selected][2];
    if (Main.FAV && !Main.RED) {
        Main.opencommonFile(Main.fav_url);
    } else {
        Main.saveFavorites();
    }
    if (Main.RED) {
        Main.SetFavSelectedPosition();
        Main.delFavorites();
        KeyHandler.setFocus(5)
    } else {
        KeyHandler.setFocus(0);
    }
    getIdn("selectbox");
    getIdb("rightHalf");
};
Selectbox.SelectSize = function() {
    this.url_selected = this.selected;
    var a = this.select_list[10 * this.selected_page + this.selected][0];
    a = decLongUrl(a);
    getIdn("selectbox");
    Player.ch_t = Player.cur_time;
    Player.play(a, 0);
    Player.ch = true;
};
var Display = {
    status_timer: null,
    status1_timer: null,
    loadingshow_timer: null,
    index: 1,
    run: false
};
Display.loadingshow = function() {
    if (!this.run) {
        getIdb("loading");
        Display.loadingshowTimer();
        this.run = true;
        Display.loadingstep();
    }
};
Display.loadinghide = function() {
    this.run = false;
    clearTimeout(this.loadingshow_timer);
    getIdn("loading");
};
Display.loadingstep = function() {
    if (this.index < 10) {
        getId("imgAnim").src = "img/loading/loading_0" + this.index + ".png";
    } else {
        getId("imgAnim").src = "img/loading/loading_" + this.index + ".png";
    }
    this.index++;
    if (this.index > 12) {
        this.index = 1;
    }
    if (this.run) {
        setTimeout("Display.loadingstep();", 200);
    }
};
Display.loadingshowTimer = function() {
    this.loadingshow_timer = setTimeout("Player.ReturnMenu();", 60000);
};
Display.showplayer = function() {
    if (KeyHandler.Focus != 0) {
        if (Player.state == Player.PLAYING_VOD || Player.state == Player.PAUSA_VOD) {
            Main.ya_epg_info_arr = [];
            Main.epg_t1 = 0;
            Main.epg_t2 = 0;
            getIdn("help_navi_l_player");
            getIdn("p_epg_line");
            if (Main.seriesE) {
                getId("progressBarBG").style.left = "0px";
                getId("timeInfo").style.left = "560px";
                getId("resolution").style.left = "725px";
                getId("time").style.left = "850px";
            } else {
                getId("progressBarBG").style.left = "10px";
                getId("timeInfo").style.left = "580px";
                getId("resolution").style.left = "745px";
                getId("time").style.left = "860px";
            }
            getIdb("p_info_line");
            getIdb("help_navi_vod_player");
            getId("statusbar").style.top = "68px";
            if (Player.state == Player.PAUSA_VOD) {
                getIdn("vod_pause");
                getIdb("vod_play");
                if (Main.seriesE) {
                    getId("help_navi_vod_player").style.left = "39px";
                } else {
                    getId("help_navi_vod_player").style.left = "48px";
                }
            } else {
                getIdb("vod_pause");
                getIdn("vod_play");
                if (Main.seriesE) {
                    getId("help_navi_vod_player").style.left = "30px"
                } else {
                    getId("help_navi_vod_player").style.left = "40px"
                }
                if (Player.repeat) {
                    Display.status("The repeat mode.");
                } else {
                    if (Player.next) {
                        Display.status("Sequential Playback");
                    }
                }
            }
        } else {
            if (Player.state == Player.PLAYING_LIVE) {
                getIdn("help_navi_vod_player");
                getIdn("p_info_line");
                getIdn("p_epg_line");
                if (Main.seriesE) {
                    if (Main.PlayerMode == "1") {
                        getId("help_navi_l_player").style.left = "70px";
                    } else {
                        getId("help_navi_l_player").style.left = "130px";
                    }
                    getId("progressBarBG").style.left = "10px";
                    getId("timeInfo").style.left = "595px";
                    getId("resolution").style.left = "740px";
                    getId("time").style.left = "850px";
                } else {
                    if (Main.PlayerMode == "1") {
                        getId("help_navi_l_player").style.left = "80px";
                    } else {
                        getId("help_navi_l_player").style.left = "140px";
                    }
                    getId("progressBarBG").style.left = "20px";
                    getId("timeInfo").style.left = "605px";
                    getId("resolution").style.left = "750px";
                    getId("time").style.left = "860px";
                }
                getIdb("help_navi_l_player");
                if (Main.PlayerMode == "1") {
                    if (Main.ya_epg_info_arr.length > 0 && Main.ya_prog_id == Main.chan_array_index) {
                        getIdb("p_info_line");
                        getIdb("p_epg_line");
                        var a = 302;
                        if (Main.seriesE) {
                            a = 280;
                        }
                        if (getId("epg_info").innerHTML.length > a) {
                            getId("statusbar").style.top = "120px";
                        } else {
                            getId("statusbar").style.top = "100px";
                        }
                    } else {
                        getId("statusbar").style.top = "70px";
                        setTimeout("Main.UpdateChannelInfo()", 400);
                    }
                }
            }
        }
        if (Main.PlayerMode == "1") {
            getIdb("resolution");
        } else {
            getIdn("resolution");
        }
        if (API.Pstyle == "1") {
            getIdb("p_second_line");
        } else {
            getIdn("p_second_line");
        }
        getIdn("statusbar1");
        getIdb("player");
        clearTimeout(this.infobar_timer);
        if (Player.state != Player.PAUSA_VOD) {
            Display.infobarTimer();
        }
    }
};
Display.hideplayer = function() {
    getIdn("player");
    getId("statusbar").style.top = "10px";
    if (Main.epg_info_step != 0) {
        Main.epg_info_step = 0;
        GetNextEpgInfo();
    }
};
Display.infobarTimer = function() {
    this.infobar_timer = setTimeout("Display.hideplayer()", 8000);
};
Display.status = function(b, a) {
    getIdn("version");
    getIdb("statusbar");
    widgetAPI.putInnerHTML(getId("status"), b);
    clearTimeout(this.status_timer);
    if (a == undefined) {
        Display.statusTimer(3000);
    } else {
        if (a != 0) {
            Display.statusTimer(a);
        }
    }
};
Display.status1 = function(a) {
    getIdb("statusbar1");
    widgetAPI.putInnerHTML(getId("status1"), a);
    clearTimeout(this.status1_timer);
    Display.status1Timer();
};
Display.hidestatus = function() {
    getIdn("statusbar");
    getIdb("version");
};
Display.statusTimer = function(a) {
    this.status_timer = setTimeout("Display.hidestatus()", a);
};
Display.status1Timer = function() {
    this.status1_timer = setTimeout('getIdn("statusbar1")', 3000);
};
var KeyHandler = {
    NumberEntered: "",
    ChSelectorTimeout: null,
    Menu: 0,
    Focus: 1,
    guide_step: 0,
    black_line: false,
    bl: false,
    send_Return: false
};

function ShowMenuTV() {
    if (KeyHandler.Menu == 0) {
        Main.registVOLTVKey();
        pluginAPI.ShowTools(1);
        if (Main.serieC || Player.state == Player.STOPPED) {
            KeyHandler.Menu = 1;
        }
    } else {
        Main.registVOLTVKey();
        pluginAPI.ShowTools(0);
        KeyHandler.Menu = 0;
    }
}

function SmartExit() {
    widgetAPI.blockNavigation(event);
    if (Player.state == Player.STOPPED) {
        if (KeyHandler.send_Return) {
            widgetAPI.sendReturnEvent();
        }
        KeyHandler.send_Return = true;
        Display.status('<b style="color:yellow">To exit, press again EXIT!</b>', 3000);
        setTimeout("KeyHandler.send_Return=false;", 5000);
    } else {
        Player.ReturnMenu();
    }
}
KeyHandler.setFocus = function(a) {
    KeyHandler.Focus = a;
    switch (a) {
        case 0:
            getId("MainMenu_Anchor")["focus"]();
            if (!Main.seriesC) {
                pluginAPI.registKey(tvKey.KEY_TOOLS);
            }
            break;
        case 1:
            getId("LoadingPlayer_Anchor")["focus"]();
            break;
        case 2:
            getId("LivePlayer_Anchor")["focus"]();
            if (!Main.seriesC) {
                pluginAPI.unregistKey(tvKey.KEY_TOOLS);
            }
            break;
        case 3:
            getId("VODPlayer_Anchor")["focus"]();
            if (!Main.seriesC) {
                pluginAPI.unregistKey(tvKey.KEY_TOOLS);
            }
            break;
        case 4:
            getId("Selectbox_Anchor")["focus"]();
            break;
        case 5:
            getId("RedFav_Anchor")["focus"]();
            break;
        case 6:
            getId("Guide_Anchor")["focus"]();
            break;
        case 7:
            getId("Setap_Anchor")["focus"]();
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.KanalSelector = function() {
    if (KeyHandler.NumberEntered > API.channels.length) {
        Display.status("Input Error");
    } else {
        if (KeyHandler.NumberEntered > 0) {
            Main.selected_channel = (KeyHandler.NumberEntered < 11) ? KeyHandler.NumberEntered - 1 : ((KeyHandler.NumberEntered % 10) > 0) ? (KeyHandler.NumberEntered % 10) - 1 : 9;
            Main.selected_page = Math.round(KeyHandler.NumberEntered / 10);
            if (Main.selected_channel > 3) {
                Main.selected_page--;
            }
            Main.chan_array_index = parseInt(KeyHandler.NumberEntered - 1);
            if (Main.loading_pl) {
                Player.ReturnMenu();
            } else {
                Main.block_info = true;
                Main.UpdateChannelInfo();
                setTimeout("Main.PlayChannel()", 20);
            }
        }
    }
    KeyHandler.NumberEntered = "";
};
KeyHandler.Keys10 = function(b) {
    var a = "";
    switch (b) {
        case tvKey.KEY_1:
            a = "1";
            break;
        case tvKey.KEY_2:
            a = "2";
            break;
        case tvKey.KEY_3:
            a = "3";
            break;
        case tvKey.KEY_4:
            a = "4";
            break;
        case tvKey.KEY_5:
            a = "5";
            break;
        case tvKey.KEY_6:
            a = "6";
            break;
        case tvKey.KEY_7:
            a = "7";
            break;
        case tvKey.KEY_8:
            a = "8";
            break;
        case tvKey.KEY_9:
            a = "9";
            break;
        case tvKey.KEY_0:
            a = "0";
            break;
        default:
            alert("Unhandled key");
            break;
    }
    KeyHandler.NumberEntered = KeyHandler.NumberEntered + a;
    if (KeyHandler.NumberEntered != "") {
        Display.hideplayer();
        if (Main.PlayerMode == "0" && Player.state != Player.STOPPED) {
            Main.player["info"](KeyHandler.NumberEntered);
        } else {
            Display.status1(KeyHandler.NumberEntered);
        }
        clearTimeout(this.ChSelectorTimeout);
        this.ChSelectorTimeout = setTimeout("KeyHandler.KanalSelector()", 2000);
    }
};
KeyHandler.RedFavKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case tvKey.KEY_EXIT:
            SmartExit();
            break;
        case 106:
        case tvKey.KEY_DOWN:
            Main.selectNextChannel();
            break;
        case 105:
        case tvKey.KEY_UP:
            Main.selectPrevChannel();
            break;
        case tvKey.KEY_LEFT:
            Main.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Main.selectNextPage();
            break;
        case tvKey.KEY_RED:
            Main.delFavorites();
            break;
        case tvKey.KEY_GREEN:
            Main.moveFavorites(1);
            break;
        case tvKey.KEY_YELLOW:
            Main.moveFavorites(-1);
            break;
        case tvKey.KEY_BLUE:
            if (API.favorites.length > 1) {
                Main.showFavSelector()
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            Main.RED = false;
            Main.Menu();
            break;
        case tvKey.KEY_STOP:
            widgetAPI.blockNavigation(event);
            if (Player.state != Player.STOPPED) {
                Player.stopV()
            }
            setTimeout("getIdn('main')", 100);
            Main.LoadTimer("ChannelSetupFormular()", 600);
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.GuideKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case 256:
        case 1057:
        case tvKey.KEY_RETURN:
        case tvKey.KEY_GUIDE:
            widgetAPI.blockNavigation(event);
            Main.PlayPrevPlaylist();
            if (Player.state == Player.PLAYING_LIVE) {
                this.guide_step = 1
            }
            break;
        case tvKey.KEY_EXIT:
            SmartExit();
            break;
        case 106:
        case tvKey.KEY_DOWN:
            Main.selectNextChannel();
            break;
        case 105:
        case tvKey.KEY_UP:
            Main.selectPrevChannel();
            break;
        case tvKey.KEY_LEFT:
            Main.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Main.selectNextPage();
            break;
        case 68:
        case 1078:
            Scrol("allInfo", -28);
            break;
        case 65:
        case 1080:
            Scrol("allInfo", 28);
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.MainMenuKeyDown = function() {
    var b = event.keyCode;
    KeyHandler.Keys10(b);
    switch (b) {
        case tvKey.KEY_SOURCE:
            if (!Main.FirstStart) {
                Main.pl_url = "ScanUSB";
                Main.playlist();
            }
            break;
        case 1086:
        case 84:
            if (API.XML_URL.indexOf("start.xml") != 0) {
                Main.start = true;
                Main.playlist();
            } else {
                Main.PlayPrevPlaylist();
            }
            break;
        case 256:
        case 1057:
        case tvKey.KEY_GUIDE:
            widgetAPI.blockNavigation(event);
            if (Main.play_chan_array_index != Main.chan_array_index) {
                this.guide_step = 0;
            }
            if (Main.yandextv_mode && this.guide_step == 0 && Main.ya_prog_info_arr.length > 0) {
                Main.guide = true;
                Main.ReadPlArr(API.XML_URL, Main.ya_prog_info_arr);
            } else {
                if (Player.state == Player.PLAYING_LIVE && this.guide_step == 1) {
                    this.guide_step = 0;
                    Main.SetSelectedPosition();
                    getIdn("main");
                    Display.hidestatus();
                    KeyHandler.setFocus(2);
                    Display.showplayer();
                } else {
                    Display.status("No more applets!");
                }
            }
            break;
        case tvKey.KEY_INFO:
            if (API.channels.length < 1000) {
                if (Main.help_info) {
                    for (var a = 0; a < Main.help_step; a++) {
                        Main.prev_pl_array.pop();
                    }
                    Main.help_step = 0;
                    Main.PlayPrevPlaylist();
                } else {
                    Main.pl_url = API.help_url;
                    Main.help_info = true;
                    Main.playlist();
                }
            } else {
                Display.status("Not Available!");
                setTimeout("Display.status('Big playlist!')", 500);
            }
            break;
        case tvKey.KEY_TOOLS:
            if (!Main.FirstStart && !Main.help_info) {
                if (Player.state != Player.STOPPED) {
                    Player.stopV();
                    setTimeout("getIdn('main')", 700);
                    Main.LoadTimer("SetupFormular();", 1500);
                } else {
                    getIdn("main");
                    Main.LoadTimer("SetupFormular();", 600);
                }
            }
            break;
        case 1118:
        case tvKey.KEY_PANEL_MENU:
        case tvKey.KEY_MENU:
            widgetAPI.blockNavigation(event);
            ShowMenuTV();
            break;
        case 78:
        case 259:
            if (!Main.help_info) {
                Main.PlayPrevChannel();
            }
            break;
        case tvKey.KEY_EXIT:
            SmartExit();
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (Player.state != Player.STOPPED && Main.XML_URL == API.XML_URL) {
                this.guide_step = 0;
                Main.SetSelectedPosition();
                getIdn("main");
                Display.hidestatus();
                if (Player.state == Player.PLAYING_LIVE) {
                    KeyHandler.setFocus(2);
                } else {
                    KeyHandler.setFocus(3);
                }
                Display.showplayer();
            } else {
                Main.PlayPrevPlaylist();
            }
            break;
        case 106:
        case tvKey.KEY_DOWN:
            Main.selectNextChannel();
            break;
        case 105:
        case tvKey.KEY_UP:
            Main.selectPrevChannel();
            break;
        case tvKey.KEY_LEFT:
            Main.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Main.selectNextPage();
            break;
        case 612:
        case 309:
        case tvKey.KEY_ENTER:
            if (KeyHandler.NumberEntered != "") {
                clearTimeout(this.ChSelectorTimeout);
                KeyHandler.KanalSelector();
            } else {
                if (Main.help_info) {
                    Main.help_step++;
                }
                Main.PlayChannel();
            }
            break;
        case tvKey.KEY_RED:
            if (!Main.help_info && !Main.FAV && API.categories.length > 2) {
                Main.showCategorySelector();
            } else {
                if (API.XML_URL.indexOf("history.dat") > 0) {
                    Main.delHistory(API.XML_URL);
                } else {
                    Display.status("Not Available!");
                }
            }
            break;
        case tvKey.KEY_GREEN:
            if (!Main.FAV && !Main.block_fav && API.XML_URL.indexOf("Open") < 0) {
                if (API.favorites.length > 1) {
                    Main.showFavSelector();
                } else {
                    Main.saveFavorites();
                }
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_YELLOW:
            if (!Main.block_fav && API.XML_URL.indexOf("Open") < 0) {
                if (API.favorites.length < 2 && !Main.FAV) {
                    Main.FAV = true;
                    Main.opencommonFile(Main.fav_url);
                } else {
                    if (API.favorites.length > 1) {
                        Main.FAV = true;
                        Main.showFavSelector();
                    }
                }
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_BLUE:
            if (Main.FAV && !Main.block_fav) {
                Main.RED = true;
                Main.Menu();
            } else {
                if (Player.state == Player.STOPPED) {
                    if (Main.ret) {
                        this.bl = true;
                    }
                    Main.PlayPrevPlaylist();
                }
            }
            break;
        case tvKey.KEY_FF:
            widgetAPI.blockNavigation(event);
            if (Main.yandextv_mode) {
                T.delta++;
                if (T.delta == 101) {
                    T.delta = 0;
                }
                YandexGetUrl(GetYindex());
            } else {
                ListNextPage();
            }
            break;
        case tvKey.KEY_PAUSE:
            widgetAPI.blockNavigation(event);
            if (Player.total_time != 0) {
                if (Player.state == Player.PAUSA_VOD) {
                    Player.resumeVideo();
                } else {
                    Player.pauseVideo();
                }
            } else {
                if (Main.yandextv_mode) {
                    Main.Ya_flag_step++;
                    YandexGetUrl(GetYindex());
                } else {
                    if (API.XML_URL.indexOf("start.xml") == 0) {
                        if (Main.ya_auto && !Main.ya_base_info) {
                            GetYaBaseInfo();
                        }
                    }
                }
            }
            break;
        case tvKey.KEY_RW:
            widgetAPI.blockNavigation(event);
            if (Main.yandextv_mode) {
                T.delta--;
                if (T.delta == 99) {
                    T.delta = 0;
                }
                YandexGetUrl(GetYindex());
            } else {
                ListPrevPage();
            }
            break;
        case 68:
        case 1078:
            Scrol("allInfo", -31);
            break;
        case 65:
        case 1080:
            Scrol("allInfo", 31);
            break;
        case tvKey.KEY_PLAY:
            widgetAPI.blockNavigation(event);
            if (Player.state == Player.PAUSA_VOD) {
                Player.resumeVideo();
            } else {
                if (Main.yandextv_mode) {
                    if (!Main.ya_all_day) {
                        Main.ya_all_day = true;
                    } else {
                        Main.ya_all_day = false;
                    }
                    YandexGetUrl(GetYindex());
                } else {
                    if (Player.state == Player.STOPPED) {
                        Main.PlayChannel();
                    } else {
                        if (Player.total_time != 0) {
                            if (!Player.next && !Player.repeat) {
                                Player.next = true;
                                Display.status("Sequential playback");
                            } else {
                                if (Player.next && !Player.repeat) {
                                    Player.repeat = true;
                                    Display.status("Repeat Play");
                                } else {
                                    if (Player.next && Player.repeat) {
                                        Player.next = false;
                                        Player.repeat = false;
                                        Display.status("All modes are disabled!");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            break;
        case tvKey.KEY_REC:
            if (Main.sort == false) {
                API.channels.sort();
                Main.updatePage();
                Main.sort = true;
            } else if (Main.sort == true) {
                API.channels.reverse();
                Main.updatePage();
                Main.sort = false;
            } else {
                Main.sort = false;
            }
            break;
        case tvKey.KEY_STOP:
            widgetAPI.blockNavigation(event);
            if (Main.FAV) {
                if (Player.state != Player.STOPPED) {
                    Player.stopV();
                }
                setTimeout("getIdn('main')", 100);
                Main.LoadTimer("ChannelSetupFormular()", 600);
            } else {
                if (!Main.help_info) {
                    if (Player.state != Player.STOPPED) {
                        Player.stopV();
                    }
                    setTimeout("getIdn('main')", 100);
                    Main.LoadTimer("SearchFormular()", 600);
                } else {
                    if (Player.state != Player.STOPPED) {
                        Player.ReturnMenu();
                    }
                }
            }
            break;
        case 1249:
        case 192:
            widgetAPI.blockNavigation(event);
            break;
        case 1236:
        case 1089:
        case tvKey.KEY_SUBTITLE:
            Player.SEFSetNextAudioStream();
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.LoadingPlayerKeyDown = function() {
    var a = event.keyCode;
    KeyHandler.Keys10(a);
    switch (a) {
        case tvKey.KEY_UP:
        case 105:
        case 68:
        case 1078:
            if (!Main.loading_pl) {
                Main.block_info = true;
                Main.selectNextChannel();
                setTimeout("Main.PlayChannel()", 50);
            }
            break;
        case tvKey.KEY_DOWN:
        case 106:
        case 65:
        case 1080:
            if (!Main.loading_pl) {
                Main.block_info = true;
                Main.selectPrevChannel();
                setTimeout("Main.PlayChannel()", 50);
            }
            break;
        case 78:
        case 259:
            if (!Main.loading_pl) {
                Main.PlayPrevChannel();
            }
            break;
        case tvKey.KEY_EXIT:
            widgetAPI.blockNavigation(event);
            if (!Main.loading_pl) {
                Player.ReturnMenu();
            } else {
                API.stopRequest();
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (!Main.loading_pl) {
                Player.ReturnMenu();
            }
            break;
        case tvKey.KEY_STOP:
            widgetAPI.blockNavigation(event);
            if (!Main.loading_pl) {
                Player.ReturnMenu();
            }
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.SelectboxKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case tvKey.KEY_DOWN:
            Selectbox.selectNextItem();
            break;
        case tvKey.KEY_UP:
            Selectbox.selectPrevItem();
            break;
        case tvKey.KEY_ENTER:
            if (Selectbox.title == "Выбор качества") {
                Selectbox.SelectSize();
            } else {
                if (Selectbox.title == "Выбор избранного") {
                    Selectbox.SelectFav();
                } else {
                    Selectbox.SelectCategory();
                }
            }
            break;
        case tvKey.KEY_LEFT:
            Selectbox.selectPrevPage();
            break;
        case tvKey.KEY_RIGHT:
            Selectbox.selectNextPage();
            break;
        case tvKey.KEY_EXIT:
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (API.XML_URL != Main.fav_url) {
                Main.FAV = false;
            }
            getIdn("selectbox");
            getIdb("rightHalf");
            if (Selectbox.title == "Выбор качества") {
                KeyHandler.setFocus(3);
            } else {
                if (!Main.RED) {
                    KeyHandler.setFocus(0);
                } else {
                    KeyHandler.setFocus(5);
                }
            }
            break;
        case tvKey.KEY_GREEN:
            if (Selectbox.title == "Выбор избранного") {
                Selectbox.SelectFav();
            }
            break;
        case tvKey.KEY_YELLOW:
            if (Selectbox.title == "Выбор избранного") {
                Selectbox.SelectFav();
            }
            break;
        case tvKey.KEY_BLUE:
            if (Selectbox.title == "Выбор избранного") {
                Selectbox.SelectFav();
            }
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.LivePlayerKeyDown = function() {
    var a = event.keyCode;
    KeyHandler.Keys10(a);
    switch (a) {
        case 1086:
        case 84:
            if (Player.size == 5) {
                if (Main.SetZoom) {
                    Main.SetZoom = false;
                } else {
                    Main.SetZoom = true;
                    Display.status('<table><tr><td><img src="img/buttons/move_m.png"></img></td><td>- Resize</td></tr></table>', 0);
                }
            }
            break;
        case 1057:
        case 256:
        case tvKey.KEY_GUIDE:
            widgetAPI.blockNavigation(event);
            if (Main.yandextv_mode) {
                Display.hideplayer();
                Main.Menu();
            } else {
                Display.status("No Programme !");
            }
            break;
        case tvKey.KEY_TOOLS:
            if (Main.serieC) {
                widgetAPI.blockNavigation(event);
            }
            break;
        case 1118:
        case tvKey.KEY_PANEL_MENU:
        case tvKey.KEY_MENU:
            widgetAPI.blockNavigation(event);
            ShowMenuTV();
            break;
        case tvKey.KEY_GREEN:
            if (Main.hardware_type == 0 || Main.hardware_type == 1) {
                Main.registVOLTVKey();
                pluginAPI.ShowTools(0);
            } else {
                Player.SEFSetNextAudioStream();
            }
            break;
        case tvKey.KEY_YELLOW:
            Main.registVOLTVKey();
            pluginAPI.ShowTools(1);
            break;
        case 78:
        case 259:
            Main.PlayPrevChannel();
            break;
        case tvKey.KEY_BLUE:
        case 653:
        case 1249:
        case 1083:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "1") {
                if (Player.size >= 6) {
                    Player.setSize(0, 1, 0);
                } else {
                    Player.setSize(Player.size + 1, 1, 0);
                }
                Main.SetZoom = false;
            } else {
                Display.status("Not Available!");
            }
            break;
        case 1219:
            if (Main.PlayerMode == "1") {
                if (Player.get3DMode() >= 2) {
                    Player.change3DMode(0);
                } else {
                    Player.change3DMode(Player.get3DMode() + 1);
                }
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_UP:
        case 105:
        case 68:
        case 1078:
            if (Main.SetZoom) {
                if (Player.Ph < 150) {
                    Player.Ph++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Main.block_info = true;
                Main.selectNextChannel();
                setTimeout("Main.PlayChannel()", 20);
            }
            break;
        case tvKey.KEY_DOWN:
        case 106:
        case 65:
        case 1080:
            if (Main.SetZoom) {
                if (Player.Ph > 50) {
                    Player.Ph--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Main.block_info = true;
                Main.selectPrevChannel();
                setTimeout("Main.PlayChannel()", 20);
            }
            break;
        case tvKey.KEY_RIGHT:
            if (Main.SetZoom) {
                if (Player.Pw < 150) {
                    Player.Pw++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                SetVolume(0);
            }
            break;
        case tvKey.KEY_LEFT:
            if (Main.SetZoom) {
                if (Player.Pw > 50) {
                    Player.Pw--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                SetVolume(1);
            }
            break;
        case tvKey.KEY_INFO:
        case tvKey.KEY_ENTER:
            if (KeyHandler.NumberEntered != "") {
                clearTimeout(this.ChSelectorTimeout);
                KeyHandler.KanalSelector();
            } else {
                if (Main.PlayerMode == "0") {
                    Main.player["info"]("Флеш-Плеер");
                }
                Display.showplayer();
            }
            break;
        case 612:
        case 309:
        case tvKey.KEY_STOP:
        case tvKey.KEY_EXIT:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "0") {
                Main.stopFPlayer();
                Main.Menu();
            } else {
                Player.ReturnMenu();
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "0") {
                Main.stopFPlayer();
            } else {
                Display.hideplayer();
            }
            Main.Menu();
            break;
        case tvKey.KEY_PLAY:
            if (Main.Foto) {
                if (Main.SlideShowInterval == null) {
                    Main.SlideShowInterval = setInterval("StartSlideShow();", 8000);
                    Display.status("Start slideshow", 0);
                } else {
                    Display.status("Stop slideshow");
                    StopSlideShow();
                }
            } else {
                if (Main.PlayerMode == "1") {
                    Player.play(Player.url, 0);
                } else {
                    Display.status("Not Available!");
                }
            }
            break;
        case tvKey.KEY_FF:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "1") {
                if (Main.epg_info_step <= Main.ya_epg_info_arr.length - 1) {
                    Main.epg_info_step++;
                    GetNextEpgInfo();
                } else {
                    Display.status("No data!");
                }
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_PAUSE:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "1") {
                Main.epg_info_step = 0;
                GetNextEpgInfo();
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_RW:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "1") {
                if (Main.epg_info_step > 0) {
                    Main.epg_info_step--;
                    GetNextEpgInfo();
                } else {
                    Display.status("No Data!");
                }
            } else {
                Display.status("Not Available!");
            }
            break;
        case 192:
            if (this.black_line) {
                getIdn("black_line_top");
                this.black_line = false;
            } else {
                getIdb("black_line_top");
                this.black_line = true;
            }
            break;
        case 655:
        case 1089:
        case tvKey.KEY_SUBTITLE:
            if (Main.PlayerMode == "1") {
                Player.SEFSetNextAudioStream();
            } else {
                Display.status("Not Available!");
            }
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
KeyHandler.VODPlayerKeyDown = function() {
    var a = event.keyCode;
    switch (a) {
        case tvKey.KEY_0:
            Player.PercentJump(0);
            Display.status("0%");
            break;
        case tvKey.KEY_1:
            Player.PercentJump(1);
            break;
        case tvKey.KEY_2:
            Player.PercentJump(2);
            break;
        case tvKey.KEY_3:
            Player.PercentJump(3);
            break;
        case tvKey.KEY_4:
            Player.PercentJump(4);
            break;
        case tvKey.KEY_5:
            Player.PercentJump(5);
            break;
        case tvKey.KEY_6:
            Player.PercentJump(6);
            break;
        case tvKey.KEY_7:
            Player.PercentJump(7);
            break;
        case tvKey.KEY_8:
            Player.PercentJump(8);
            break;
        case tvKey.KEY_9:
            Player.PercentJump(9);
            break;
        case 1086:
        case 84:
            if (Player.size == 5) {
                if (Main.SetZoom) {
                    Main.SetZoom = false;
                } else {
                    Main.SetZoom = true;
                    Display.status('<table><tr><td><img src="img/buttons/move_m.png"></img></td><td>- Resize</td></tr></table>', 0);
                }
            }
            break;
        case 78:
        case 259:
            Main.PlayPrevChannel();
            break;
        case 105:
        case 68:
        case 1078:
            Main.block_info = true;
            Main.selectNextChannel();
            setTimeout("Main.PlayChannel()", 20);
            break;
        case 106:
        case 65:
        case 1080:
            Main.block_info = true;
            Main.selectPrevChannel();
            setTimeout("Main.PlayChannel()", 20);
            break;
        case tvKey.KEY_TOOLS:
            if (Main.serieC) {
                widgetAPI.blockNavigation(event);
            }
            break;
        case tvKey.KEY_INFO:
            Display.showplayer();
            break;
        case 1118:
        case tvKey.KEY_PANEL_MENU:
        case tvKey.KEY_MENU:
            widgetAPI.blockNavigation(event);
            ShowMenuTV();
            break;
        case tvKey.KEY_UP:
            if (Main.SetZoom) {
                if (Player.Ph > 50) {
                    Player.Ph++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(2);
            }
            break;
        case tvKey.KEY_DOWN:
            if (Main.SetZoom) {
                if (Player.Ph > 50) {
                    Player.Ph--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(-2);
            }
            break;
        case tvKey.KEY_LEFT:
            if (Main.SetZoom) {
                if (Player.Pw > 50) {
                    Player.Pw--;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(-0.1);
            }
            break;
        case tvKey.KEY_RIGHT:
            if (Main.SetZoom) {
                if (Player.Pw < 150) {
                    Player.Pw++;
                    Player.setSize(Player.size, 1, 0);
                }
            } else {
                Player.MinutesJump(0.1);
            }
            break;
        case tvKey.KEY_BLUE:
        case 653:
        case 1249:
        case 1083:
            widgetAPI.blockNavigation(event);
            if (Main.PlayerMode == "1") {
                if (Player.size >= 6) {
                    Player.setSize(0, 1, 0);
                } else {
                    Player.setSize(Player.size + 1, 1, 0);
                }
                Main.SetZoom = false
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_ENTER:
            if (Player.save_time != 0) {
                Player.PlaySeveTime();
            } else {
                if (Player.state == Player.PAUSA_VOD) {
                    Player.resumeVideo();
                } else {
                    Player.pauseVideo();
                }
            }
            break;
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            if (Player.total_time == 0) {
                Player.stopV();
            }
            Main.Menu();
            break;
        case 612:
        case 309:
        case tvKey.KEY_STOP:
        case tvKey.KEY_EXIT:
            widgetAPI.blockNavigation(event);
            Player.ReturnMenu();
            break;
        case tvKey.KEY_RED:
            if (Main.url_arr.length > 1) {
                Main.showSiseSelector();
                Main.LoadTimer("getIdn('selectbox');getIdb('rightHalf');KeyHandler.setFocus(3);", 20000);
            } else {
                Display.status("Not Available!");
            }
            break;
        case tvKey.KEY_GREEN:
            if (Main.hardware_type == 0 || Main.hardware_type == 1) {
                Main.registVOLTVKey();
                pluginAPI.ShowTools(0);
            } else {
                Player.SEFSetNextAudioStream();
            }
            break;
        case tvKey.KEY_YELLOW:
            Main.registVOLTVKey();
            pluginAPI.ShowTools(1);
            break;
        case 1219:
            if (Player.get3DMode() >= 2) {
                Player.change3DMode(0);
            } else {
                Player.change3DMode(Player.get3DMode() + 1);
            }
            break;
        case tvKey.KEY_FF:
            widgetAPI.blockNavigation(event);
            Player.MinutesJump(0.5);
            break;
        case tvKey.KEY_PAUSE:
            widgetAPI.blockNavigation(event);
            if (Player.state == Player.PAUSA_VOD) {
                Player.resumeVideo();
            } else {
                Player.pauseVideo();
            }
            break;
        case tvKey.KEY_RW:
            widgetAPI.blockNavigation(event);
            Player.MinutesJump(-0.5);
            break;
        case 192:
            if (this.black_line) {
                getIdn("black_line_top");
                this.black_line = false;
            } else {
                getIdb("black_line_top");
                this.black_line = true;
            }
            break;
        case tvKey.KEY_PLAY:
            if (Player.state == Player.PAUSA_VOD) {
                Player.resumeVideo();
            } else {
                if (!Player.next && !Player.repeat) {
                    Player.next = true;
                    Display.status("Sequential playback");
                } else {
                    if (Player.next && !Player.repeat) {
                        Player.repeat = true;
                        Display.status("Repeat Play");
                    } else {
                        if (Player.next && Player.repeat) {
                            Player.next = false;
                            Player.repeat = false;
                            Display.status("All off mode!");
                        }
                    }
                }
            }
            break;
        case 655:
        case 1089:
        case tvKey.KEY_SUBTITLE:
            Player.SEFSetNextAudioStream();
            break;
        default:
            alert("Unhandled key");
            break;
    }
};
var Player = {
    plugin: null,
    Screen3Dplugin: null,
    SefPlugin: null,
    buffering_timer: null,
    state: -1,
    w: 0,
    h: 0,
    Pw: 100,
    Ph: 100,
    message: "",
    size: 0,
    STOPPED: 0,
    LOADING: 1,
    PLAYING_LIVE: 2,
    PLAYING_VOD: 3,
    PAUSA_VOD: 4,
    statusmessage: "",
    total_time: 0,
    cur_time: 0,
    save_time: 0,
    delta_time: 0,
    next: false,
    repeat: false,
    Sef: false,
    jump: false,
    long_pause: false,
    mode3D: 0,
    status3D: "",
    tnum: 0,
    url: "",
    h_url: "",
    serr: 0,
    eerr: "",
    ch: false,
    ch_t: 0
};
Player.init = function() {
    var b = true;
    this.state = this.STOPPED;
    var a = getId("pluginObjectNNavi");
    var d = a.GetFirmware();
    d = d.split("-");
    if (d[1] && (d[1].indexOf("2011") != -1 || d[1].indexOf("2012") != -1 || d[1].indexOf("2013") != -1) || d[1].indexOf("2014") != -1) {
        this.SefPlugin = getId("pluginObjectSef");
    }
    if (this.SefPlugin != null) {
        this.Sef = true;
    } else {
        this.plugin = getId("pluginPlayer");
    }
    var c = getId("pluginObjectTVMW");
    if ((this.plugin != null || this.Sef) && c != null) {
        this.Screen3Dplugin = getId("pluginObjectScreen3D");
        c.SetMediaSource();
        if (this.plugin) {
            this.plugin.OnConnectionFailed = "Player.OnConnectionFailed";
            this.plugin.OnNetworkDisconnected = "Player.OnNetworkDisconnected";
            this.plugin.OnStreamNotFound = "Player.OnStreamNotFound";
            this.plugin.OnRenderError = "Player.OnRenderError";
            this.plugin.OnBufferingStart = "Player.OnBufferingStart";
            this.plugin.OnBufferingProgress = "Player.OnBufferingProgress";
            this.plugin.OnBufferingComplete = "Player.OnBufferingComplete";
            this.plugin.OnCurrentPlayTime = "Player.OnCurrentPlayTime"
        }
    } else {
        b = false;
    }
    return b;
};
Player.get3DMode = function() {
    try {
        if (this.Screen3Dplugin != null) {
            if (1 == this.Screen3Dplugin.Flag3DEffectSupport() || this.Screen3Dplugin.Flag3DTVConnect() == 1) {
                return this.mode3D;
            } else {
                return 0;
            }
        }
    } catch (a) {
        return 0;
    }
};
Player.change3DMode = function(a) {
    if (this.Screen3Dplugin != null) {
        this.mode3D = a;
        this.status3D = "";
        if (1 == this.Screen3Dplugin.Flag3DEffectSupport() || this.Screen3Dplugin.Flag3DTVConnect() == 1) {
            switch (a) {
                case 0:
                    this.status3D = "3D OFF";
                    break;
                case 1:
                    this.status3D = "SIDE - BY - SIDE";
                    break;
                case 2:
                    this.status3D = "TOP - BOTTOM";
                    break;
            }
            if (Main.seriesC) {
                if (this.Screen3Dplugin.Check3DEffectMode(a) == 1) {
                    this.Screen3Dplugin.Set3DEffectMode(a);
                }
            } else {
                Player.play(Player.url, 0);
            }
        }
    }
};
Player.OnConnectionFailed = function() {
    Player.error(9);
};
Player.OnNetworkDisconnected = function() {
    Player.error(8);
};
Player.OnStreamNotFound = function() {
    Player.error(7);
};
Player.OnRenderError = function(a) {
    Player.error(a);
};
Player.error = function(a) {
    if (this.state != this.STOPPED && a >= 1) {
        this.eerr = (a == 1) ? "Неподдерживаемый контейнер" : (a == 2) ? "Неподдерживаемый видео кодек" : (a == 3) ? "Неподдерживаемый аудио кодек" : (a == 4) ? "Неподдерживаемое разрешение видео" : (a == 5) ? "Неправильная частота кадров" : (a == 6) ? "Поток повреждён !" : (a == 7) ? "Файл не найден" : (a == 8) ? "Обрыв сетевого соединения" : (a == 9) ? "Подключиться не удалось" : this.eerr;
        if (a < 7 && this.serr < 3) {
            this.serr++;
            if (a < 3 && a != 6) {
                Player.play(this.url, 0);
            }
        } else {
            if (this.eerr == "8") {
                try {
                    setTimeout('Player.play(this.url, 0)', 5000);
                } finally {
                    setTimeout("Player.ReturnMenu()", 500);
                }
            } else {
                Display.status(Player.eerr);
                setTimeout("Player.ReturnMenu()", 1000);
            }
        }
    }
};
Player.AutoReStart = function() {
    if (this.state != this.LOADING && this.total_time == 0) {
        var a = 10000;
        if (Main.serieC && this.url.indexOf("udp://") >= 0) {
            a = 15000;
        }
        Player.BufferingTimer("Player.play(Player.url,0)", a);
        Display.status("Auto-Restart", 3000);
    }
};
Player.OnBufferingStart = function() {
    if (this.state != this.STOPPED) {
        Player.AutoReStart();
        if (!this.jump && !Main.Foto) {
            Display.status("Buffer : 1%");
        }
    }
};
Player.OnBufferingProgress = function(a) {
    if (this.state != this.STOPPED) {
        if (!this.jump && !Main.Foto) {
            Display.status("Buffer : " + a + "%", 5000);
        }
    }
};
Player.OnBufferingComplete = function() {
    clearTimeout(this.buffering_timer);
    if (this.state != this.STOPPED) {
        if (this.state == this.LOADING) {
            Player.message = "";
            getId("progressBar").style.width = "0px";
            try {
                this.total_time = parseInt((this.Sef) ? this.SefPlugin.Execute("GetDuration") : Player.plugin.GetDuration())
            } catch (a) {
                this.total_time = 0;
            }
            if ((this.total_time > 0 && this.url.indexOf("mms://") != 0 && this.url.indexOf(".m3u8") == -1) || this.url.indexOf(".mp4.m3u8") > 0 || this.url.indexOf(".mp3") > 0) {
                this.state = this.PLAYING_VOD;
                KeyHandler.setFocus(3);
                this.h_url = "vod_history.dat";
            } else {
                this.state = this.PLAYING_LIVE;
                KeyHandler.setFocus(2);
                this.h_url = "live_history.dat";
            }
            Player.GetResolution();
            setTimeout("Player.GetVideoSize();", 1000);
            if (!Main.Foto) {
                Player.GetAudioNum();
            }
            if (this.status3D != "") {
                Player.message = this.status3D;
            }
            if (Main.url_arr.length > 1) {
                Player.message += '<tr><table><tr><td><img src="img/buttons/red_m.png"></img></td><td>- change quality</td></tr></table></tr>';
            }
            Main.LoadTimer('if(Player.message!="")Display.status("<table>"+Player.message+"</table>",6000);Main.saveHistory(Player.h_url);if(Player.state==Player.PLAYING_VOD)Player.getSaveTime();', 2000);
            setTimeout('Player.message="";', 3000);
            Display.loadinghide();
            Display.showplayer();
        }
        if (this.jump) {
            Display.showplayer();
            setTimeout("Display.hideplayer();", 1500);
            this.jump = false;
        }
        Display.hidestatus();
    }
};
Player.BufferingTimer = function(b, a) {
    clearTimeout(this.buffering_timer);
    this.buffering_timer = setTimeout(b, a);
};
Player.SetBuffer = function() {
    if (Main.buffer != "") {
        var a = parseInt((Main.buffer * 1048576), 10);
        var b = (Main.ibuffer > 0) ? parseInt((Main.buffer * a / 100), 10) : parseInt((a / 5), 10);
        if (this.Sef) {
            this.SefPlugin.Execute("SetTotalBufferSize", a);
            this.SefPlugin.Execute("SetInitialBuffer", b);
            this.SefPlugin.Execute("SetInitialTimeOut", 20);
            this.SefPlugin.Execute("SetPendingBuffer", b);
        } else {
            this.plugin.SetTotalBufferSize(a);
            this.plugin.SetInitialBuffer(b);
            this.plugin.SetInitialTimeOut(20);
            this.plugin.SetPendingBuffer(b);
        }
    }
};
Player.ReturnMenu = function() {
    Player.stopV();
    Main.Menu();
};
Player.deinit = function() {
    Player.stop();
    alert("Player deinit");
};
Player.stop = function() {
    clearTimeout(this.buffering_timer);
    this.message = "";
    this.eerr = "";
    this.w = 0;
    this.h = 0;
    this.Pw = parseInt(API.Pw);
    this.Ph = parseInt(API.Ph);
    this.serr = 0;
    this.tnum = 0;
    this.total_time = 0;
    this.cur_time = 0;
    this.save_time = 0;
    this.ch = false;
    this.jump = false;
    this.long_pause = false;
    if (this.state != this.STOPPED) {
        this.state = this.STOPPED;
        Player.SaveUrl();
        if (this.Sef) {
            this.SefPlugin.Execute("Stop");
            this.SefPlugin.Execute("ClearScreen");
            this.SefPlugin.Close();
        } else {
            if (this.plugin != null) {
                this.plugin.Stop();
                this.plugin.ClearScreen();
            }
        }
    }
};
Player.stopV = function() {
    Player.stop();
    this.repeat = false;
    this.ch_t = 0;
    this.mode3D = 0;
    this.status3D = "";
    Selectbox.url_selected = 0;
    Main.ya_epg_info_arr = [];
    StopSlideShow();
    Display.loadinghide();
    Display.hideplayer();
    Display.hidestatus();
};
Player.play = function(a, b) {
    this.url = a;
    Player.stop();
    Player.state = Player.LOADING;
    KeyHandler.setFocus(1);
    if (!Main.Foto) {
        Display.loadingshow();
    }
    if (this.Sef) {
        this.SEFPlay(this.url, b)
    } else {
        if (this.url.indexOf(".mp3") > 0) {
            Main.buffer = 0.5;
        }
        Player.SetBuffer();
        Player.setSize(0, 0, 1);
        this.plugin.Play(this.url);
    }
};
Player.SaveUrl = function() {
    if (this.cur_time > 0) {
        var a = [this.url + "|" + this.cur_time];
        Main.readFile(a, "url.dat");
        if (a.length > 10) {
            a.pop();
        }
        for (var b = 1; b < a.length; b++) {
            if (a[b].indexOf(this.url) == 0) {
                a.splice(b, 1);
                break;
            }
        }
        Main.writeFile(a, "url.dat");
    }
};
Player.getSaveTime = function() {
    if (this.state == this.PLAYING_VOD) {
        if (this.ch_t > 0 && this.ch) {
            this.save_time = this.ch_t;
            Main.LoadTimer('Display.status(" Resume ?",5000);', 7000);
            setTimeout("Player.save_time=0", 15000);
        } else {
            var b = [];
            Main.readFile(b, "url.dat");
            for (var c = 0; c < b.length; c++) {
                if (b[c].indexOf(this.url) == 0) {
                    var a = b[c];
                    a = a.split("|");
                    this.save_time = a[1];
                    Main.LoadTimer('Display.status(" Resume ?",5000);', 7000);
                    setTimeout("Player.save_time=0", 20000);
                    break;
                }
            }
        }
    }
};
Player.PlaySeveTime = function() {
    if (this.state == this.PLAYING_VOD) {
        var a = (this.save_time - this.cur_time) / 1000;
        this.statusmessage = "Возобновляем!";
        if (a > 0 && !this.jump) {
            Player.JumpForward(a - 3);
        }
        Player.save_time = 0;
        Player.BufferingTimer('Display.status("Resume failed!",2000);Player.play(Player.url,0);', 10000);
    }
};
Player.GetResolution = function() {
    if (this.state != this.STOPPED) {
        if (this.url.indexOf(".mp3") < 0 && this.w == 0) {
            try {
                if (this.Sef) {
                    var b = this.SefPlugin.Execute("GetVideoResolution");
                    b = b.split("|");
                    if (b.length > 0) {
                        this.w = b[0];
                        this.h = b[1];
                    }
                } else {
                    this.h = this.plugin.GetVideoHeight();
                    this.w = this.plugin.GetVideoWidth();
                }
            } catch (c) {
                this.w = 0;
                this.h = 0;
            }
        }
        if (this.w == 5) {
            this.h = 432;
            this.w = 540;
        } else {
            if (this.w == 4) {
                this.h = 270;
                this.w = 480;
            } else {
                if (this.w == 3) {
                    this.h = 288;
                    this.w = 384;
                } else {
                    if (this.w < 128 || this.w == "") {
                        this.h = 0;
                        this.w = 0;
                    }
                }
            }
        }
        var a = this.w + "X" + this.h;
        if (this.url.indexOf(".mp3") > 0) {
            a = "- MP3 -";
        }
        widgetAPI.putInnerHTML(getId("resolution"), a);
    }
};
Player.GetVideoSize = function() {
    if (this.state != this.STOPPED) {
        if (this.w == 0 || this.w == "") {
            Player.GetResolution();
        }
        if (Player.mode3D == 0 && !Main.Foto) {
            Player.size = (Main.ssize != "") ? parseInt(Main.ssize) : (API.Size != "") ? parseInt(API.Size) : parseInt(this.size);
        } else {
            Player.size = 0;
        }
        if (this.url.indexOf(".mp3") < 0) {
            setTimeout("Player.setSize(Player.size,1,1);", 100);
        }
    }
};
Player.setSize = function(c, b, a) {
    if (this.state != this.STOPPED && this.state != this.PAUSA_VOD) {
        var d = this.w;
        var f = this.h;
        if (b > 0) {
            if (((d / f < 1.35 && API.a_size1 < 6) || (d / f < 1.79 && d / f >= 1.35 && API.a_size2 < 6) || (d / f >= 1.79 && API.a_size3 < 6)) && a == 0) {
                if (c > 5) {
                    c = 0;
                }
            }
            this.size = c;
            Main.ssize = c.toString();
            if (this.w == 0 || this.w == "") {
                Player.GetResolution();
            }
        }
        var p, n, l, k, j, i, g, o, e;
        p = 0;
        n = 0;
        l = 960;
        k = 540;
        j = 0;
        i = 0;
        g = d;
        o = f;
        switch (c) {
            case 0:
                if (d / f < 1.79 || this.w == 0) {
                    e = "16x9 FULL";
                } else {
                    e = "ORIGINAL";
                    k = 960 * f / d;
                    n = (540 - k) / 2;
                }
                break;
            case 1:
                if (d == 0) {
                    e = "w/h=1.67";
                    p = 30;
                    l = 900;
                } else {
                    e = "14x9";
                    i = 0.0625 * f;
                    g = d;
                    o = 0.875 * f;
                }
                break;
            case 2:
                if (d == 0) {
                    e = "w/h=1.56";
                    p = 60;
                    l = 840;
                } else {
                    if (d / f < 1.35) {
                        e = "4x3 ZOOM 2";
                        i = 0.115 * f;
                        g = d;
                        o = 0.77 * f;
                    } else {
                        return Player.setSize(5, b, a);
                    }
                }
                break;
            case 3:
                if (d == 0) {
                    e = "w/h=1.45";
                    p = 90;
                    l = 780;
                } else {
                    if (d / f < 1.35) {
                        e = "4x3 ZOOM 1";
                        p = 60;
                        l = 840;
                        i = 0.0625 * f;
                        g = d;
                        o = 0.875 * f;
                    } else {
                        return Player.setSize(5, b, a);
                    }
                }
                break;
            case 4:
                if (d / f < 1.35 || this.w == 0) {
                    e = "4x3";
                    p = 120;
                    l = 720;
                } else {
                    return Player.setSize(5, b, a);
                }
                break;
            case 5:
                if (d == 0) {
                    e = "w/h=2";
                    n = 30;
                    k = 480;
                } else {
                    if (Player.Pw <= 100) {
                        l = 9.6 * Player.Pw;
                        p = (960 - l) / 2;
                    } else {
                        g = d * (2 - Player.Pw / 100);
                        j = d * (Player.Pw / 200 - 0.5)
                    }
                    if (Player.Ph <= 100) {
                        k = 5.4 * Player.Ph;
                        n = (540 - k) / 2;
                    } else {
                        o = f * (2 - Player.Ph / 100);
                        i = f * (Player.Ph / 200 - 0.5);
                    }
                    e = "X-ZOOM - изменить размеры вы можете нажав на CH LIST";
                    if (Main.SetZoom) {
                        e = "X-ZOOM ширина=" + Player.Pw + "%  высота=" + Player.Ph + "%";
                    }
                }
                break;
            case 6:
                if (d == 0) {
                    return Player.setSize(0, 0, a);
                } else {
                    if (d / f < 1.35) {
                        return Player.setSize(parseInt(API.a_size1), 0, a);
                    } else {
                        if (d / f < 1.79) {
                            return Player.setSize(parseInt(API.a_size2), 0, a);
                        } else {
                            return Player.setSize(parseInt(API.a_size3), 0, a);
                        }
                    }
                }
                break;
            case 7:
                if (d / f >= 1.79) {
                    e = "ORIGINAL ZOOM 1";
                    k = 960 * f / (d * 0.85);
                    n = (540 - k) / 2;
                    j = 0.075 * d;
                    g = 0.85 * d;
                } else {
                    e = "16x9 ZOOM 1";
                    j = 0.0625 * d;
                    i = 0.0625 * f;
                    g = 0.875 * d;
                    o = 0.875 * f;
                }
                break;
            case 8:
                if (d / f >= 1.79) {
                    e = "ORIGINAL ZOOM 2";
                    k = 960 * f / (d * 0.75);
                    n = (540 - k) / 2;
                    j = 0.125 * d;
                    g = 0.75 * d;
                } else {
                    e = "16x9 ZOOM 2";
                    j = 0.125 * d;
                    i = 0.125 * f;
                    g = 0.75 * d;
                    o = 0.75 * f;
                }
                break;
            default:
                alert("Не определён");
                e = "Не определён!";
                break;
        }
        if ((b == 1 || (this.size == 6 && b == 0)) && a == 1) {
            Player.message = "<tr><center>" + e + "</center></tr>" + Player.message;
        } else {
            if ((b > 0 || (this.size == 6 && b == 0 && a == 0)) && !Main.Foto) {
                Display.status(e);
            }
        }
        if (this.Sef) {
            this.SefPlugin.Execute("SetDisplayArea", p, n, l, k);
            this.SefPlugin.Execute("SetCropArea", j, i, g, o);
        } else {
            this.plugin.SetDisplayArea(p, n, l, k);
            this.plugin.SetCropArea(j, i, g, o);
        }
    }
};
Player.JumpForward = function(a) {
    if (this.state == this.PLAYING_VOD) {
        Display.status(this.statusmessage, 2000);
        this.jump = true;
        if (this.Sef) {
            this.SefPlugin.Execute("JumpForward", a);
        } else {
            this.plugin.JumpForward(a);
        }
        this.statusmessage = "";
    }
};
Player.JumpBackward = function(b) {
    if (this.state == this.PLAYING_VOD) {
        if (b > 3) {
            Display.status(this.statusmessage, 2000);
        }
        this.jump = true;
        if (this.Sef) {
            if (this.url.indexOf(".mp3") > 0) {
                var a = (this.cur_time / 1000) - b;
                Player.play(this.url, a);
            } else {
                this.SefPlugin.Execute("JumpBackward", b);
            }
        } else {
            this.plugin.JumpBackward(b);
        }
        this.statusmessage = "";
    }
};
Player.MinutesJump = function(d) {
    if (this.state == this.PLAYING_VOD && !this.jump) {
        var b = this.cur_time / 60000 * -1;
        var a = this.delta_time / 60000;
        this.statusmessage = d + " мин.";
        var c = "";
        if (d >= 0) {
            this.statusmessage = "+" + this.statusmessage;
            if (d < a) {
                Player.JumpForward(d * 60);
            } else {
                this.delta_time = 0;
                Player.TestTime();
            }
        } else {
            if (d > b) {
                Player.JumpBackward(d * 60 * -1);
            } else {
                this.delta_time = 0;
                Player.TestTime();
            }
        }
    }
};
Player.PercentJump = function(b) {
    if (this.state == this.PLAYING_VOD && !this.jump) {
        this.statusmessage = b * 10 + "%";
        var a = (this.total_time * b / 10 - this.cur_time) / 1000;
        if (a > 0) {
            Player.JumpForward(a);
        } else {
            if (a < 0) {
                Player.JumpBackward(a * -1);
            }
        }
    }
};
Player.resumeVideo = function() {
    if (this.state == this.PAUSA_VOD) {
        Display.status(" > > > ");
        if (this.Sef) {
            this.SefPlugin.Execute("Resume");
        } else {
            this.plugin.Resume();
        }
        this.state = this.PLAYING_VOD;
        if (this.url.indexOf("http://") >= 0 && Player.long_pause) {
            setTimeout("Player.MinutesJump(-0.05);", 100);
        }
        Display.hideplayer();
        clearTimeout(this.buffering_timer);
        this.long_pause = false;
    }
};
Player.pauseVideo = function() {
    if (this.state == this.PLAYING_VOD) {
        if (this.Sef) {
            this.SefPlugin.Execute("Pause");
        } else {
            this.plugin.Pause();
        }
        this.state = this.PAUSA_VOD;
        Display.showplayer();
        Display.status("Pause", 0);
        Player.SaveUrl();
        Player.BufferingTimer("Player.long_pause=true;", 30000);
    }
};
Player.OnCurrentPlayTime = function(a) {
    if (this.total_time > 0) {
        this.cur_time = parseInt(a, 10);
        TimeInfo(this.cur_time, this.total_time);
        this.delta_time = this.total_time - this.cur_time;
        Player.TestTime();
    }
};
Player.TestTime = function() {
    if (this.delta_time == 0 && this.total_time != 0 && this.cur_time != 0) {
        if (this.repeat && this.next) {
            Player.play(this.url);
        } else {
            if (this.next) {
                Main.block_info = true;
                Main.selectNextChannel();
                setTimeout("Main.PlayChannel()", 20);
            } else {
                Player.ReturnMenu();
            }
        }
    } else {
        if (this.delta_time == 0) {
            Player.ReturnMenu();
            Display.status("Failed Network!");
        }
    }
};
Player.SEFPlay = function(a, b) {
    this.SefPlugin.Open("Player", "1.000", "Player");
    this.SefPlugin.Execute("InitPlayer", a);
    this.SefPlugin.OnEvent = "Player.SefOnEvent";
    if (Player.get3DMode() != 0) {
        if (Main.buffer > 10) {
            Main.buffer = 10;
        }
        this.SefPlugin.Execute("SetPlayerProperty", "2", "3", Player.get3DMode())
    } else {
        if (this.url.indexOf(".mp3") > 0) {
            if (Main.buffer > 0.5) {
                Main.buffer = 0.5;
            }
            this.SefPlugin.Execute("SetPlayerProperty", "5", "0", "0");
        }
    }
    Player.SetBuffer();
    Player.setSize(0, 0, 1);
    this.SefPlugin.Execute("StartPlayback", b);
};
Player.SefOnEvent = function(a, b) {
    switch (a) {
        case 1:
            Player.OnConnectionFailed();
            break;
        case 3:
            Player.OnStreamNotFound();
            break;
        case 4:
            Player.OnNetworkDisconnected();
            break;
        case 6:
            Player.OnRenderError(b);
        case 11:
            Player.OnBufferingStart();
            break;
        case 13:
            Player.OnBufferingProgress(b);
            break;
        case 12:
            Player.OnBufferingComplete();
            break;
        case 14:
            Player.OnCurrentPlayTime(b);
            break;
    }
};
Player.SEFSetNextAudioStream = function() {
    if (this.state != this.STOPPED) {
        if (!this.Sef) {
            Display.status("Not available!");
        } else {
            if (this.tnum < 2) {
                Display.status("Only one sound track!");
            } else {
                var a = this.SefPlugin.Execute("GetCurrentStreamID", 1);
                if (a >= 0) {
                    a++;
                    if (a > (this.tnum - 1)) {
                        a = 0;
                    }
                    Player.SetAudioStream(a, 1);
                }
            }
        }
    }
};
Player.LangCodes = {
    6514793: "Chinese",
    6647399: "English",
    6713957: "French",
    6776178: "German",
    6911073: "Italian",
    6975598: "Japanese",
    7040882: "Korean",
    7368562: "Portuguese",
    7501171: "Russian",
    7565409: "Spanish",
    8026747: "Ukrainian"
};
Player.SetAudioStream = function(d, b) {
    if (this.tnum > d) {
        Main.a_num = (d + 1).toString();
        this.SefPlugin.Execute("SetStreamID", 1, d);
        var a = this.SefPlugin.Execute("GetStreamLanguageInfo", 1, d);
        var c = Player.LangCodes[a];
        c = (c == null) ? "Неизвестная" : c;
        if (b > 0) {
            Display.status(c.toString() + " Soundtrack number" + (d + 1).toString());
        } else {
            Player.message += "<tr><td>" + c.toString() + " Soundtrack number" + (d + 1).toString() + "</td></tr>";
        }
    } else {
        Player.message += "<tr><td>Not the right number of sound tracks!</td></tr>";
    }
};
Player.GetAudioNum = function() {
    if (this.Sef) {
        try {
            this.tnum = this.SefPlugin.Execute("GetTotalNumOfStreamID", 1);
        } catch (a) {
            this.tnum = 0;
        }
        if (this.tnum > 1) {
            if (Main.a_num != "") {
                Player.SetAudioStream((parseInt(Main.a_num) - 1), 0);
            } else {
                if (Main.hardware_type == 2) {
                    Player.message += '<tr><table><tr><td><img src="img/buttons/green_m.png"></img></td><td> - Edit track</td></tr></table></tr>';
                } else {
                    Player.message += '<tr><td>"AD/SUBT" - Edit track</td></tr>';
                }
            }
        }
    }
};

function HelpSet() {
    Main.scrolling = 0;
    Display.loadinghide();
    Main.yandextv_mode = false;
    Main.ya_epg_info_arr = [];
    clearTimeout(Main.load_timer);
    getIdb("0_help");
    getIdb("6_help");
    getIdn("1_help");
    getIdn("2_help");
    getIdn("3_help");
    getIdn("3.1_help");
    getIdn("3.2_help");
    getIdn("3.3_help");
    getIdn("3.4_help");
    getIdn("4.1_help");
    getIdn("5_help");
    getIdn("7_help");
    getIdn("8_help");
    getIdn("9_help");
    getIdn("10_help");
    getIdn("10.1_help");
    getIdn("ya_date");
    getIdn("ya_info");
    getIdn("ya_help");
    getIdn("background");
    getIdn("channelList");
    if (Main.seriesE) {
        getIdn("0_help");
        getIdn("6_help");
    }
    getIdb("infoList");
    getIdb("main");
    widgetAPI.putInnerHTML(getId("infoList"), "");
}
SearchFormular = function() {
    var f = 7;
    var d = 34;
    var c = 44;
    if (Main.seriesE) {
        f = 6;
        d = 28;
        c = 36;
    }
    if (API.search_on != "" && !Main.xxx) {
        Main.search = true;
    }
    HelpSet();
    if (!Main.seriesE) {
        getIdb("12_help");
    }
    getIdn("4_help");
    var g = "search";
    if (Main.search || Main.xxx) {
        g = "search_h";
    }
    var b = '<div id="allInput"><form>';
    if (Main.xxx) {
        widgetAPI.putInnerHTML(getId("version"), "Enter access code.");
        b += '<span id="text_form0">Access Code "XXX" (0 to 9999): </span><input id="' + g + '" type="text" size="' + f + '" maxlength="4"></input>';
    } else {
        if (Main.search) {
            widgetAPI.putInnerHTML(getId("version"), "Enter the desired name.");
            b += '<span id="psearch"> Найти :  </span><input id="' + g + '" type="text" size="' + d + '" maxlength="200"></input>';
        } else {
            widgetAPI.putInnerHTML(getId("version"), "Введите адрес.");
            b += '<span id="psearch"> Адрес : </span><input id="' + g + '" type="text" size="' + c + '" maxlength="200"></input>';
        }
    }
    b += '</form><form><span>"ENTER" - confirm.</span></form><form><span>"EXIT" и "RETURN" - вернуться назад.</span></form>';
    if (!Main.xxx && !Main.search) {
        b += '<h3 style="padding-top:150px;text-align:center;"> ВНИМАНИЕ !<br>Если вы прописсываете адрес плейлиста<br> и в нём нет расширения ".xml" или ".m3u" ,<br>то перед адресом нужно прописать "#".</h3>';
    }
    b += "</div>";
    widgetAPI.putInnerHTML(getId("infoList"), b);
    var a = new IMEShell(g, ime_callback);
    if (Main.seriesC || Main.seriesD) {
        a.setKeypadPos(110, 75);
    } else {
        a.setKeypadPos(110, 75);
        a.setQWERTYPos(0, 75);
    }
    if (!Main.xxx) {
        var e = (Main.search) ? API.search_string : (Main.url != "") ? Main.url : Main.pl_url;
        a.setString(e);
    }
    a.setKeyFunc(tvKey.KEY_RETURN, function(i) {
        widgetAPI.blockNavigation(event);
        if (Main.xxx) {
            Main.prev_pl_array.pop();
        }
        Main.Menu();
        return false;
    });
    a.setKeyFunc(tvKey.KEY_EXIT, function(i) {
        widgetAPI.blockNavigation(event);
        if (Main.xxx) {
            Main.prev_pl_array.pop();
        }
        Main.Menu();
        return false;
    });
    a.setEnterFunc(Search_ok);
    getId(g)["focus"]();
};
Search_ok = function(b) {
    var b = "search";
    if (Main.search || Main.xxx) {
        b = "search_h";
    }
    var a = lrdPr(getId(b).value);
    if (a == "") {
        Main.Menu();
    } else {
        if (Main.xxx && API.Xcode != a) {
            Main.prev_pl_array.pop();
            Main.Menu();
            Display.status("Wrong code!");
        } else {
            if (Main.search || Main.xxx) {
                if (Main.pl_url.indexOf("history.dat") > 0) {
                    setTimeout("Main.opencommonFile(Main.pl_url)", 1000);
                } else {
                    API.XML_URL = Main.pl_url;
                    Main.loading_pl = true;
                    setTimeout("API.Request(API.XML_URL)", 500);
                }
                if (Main.search && !Main.xxx) {
                    API.search_string = a;
                    Display.status('<b style="color:#00ccff">Wait! There is a search</b>', 0);
                } else {
                    Main.Kill = API.Xcode;
                    API.Xcode = "0";
                    Display.status('<b style="color:#00ccff">Code Accepted!</b>');
                }
                KeyHandler.setFocus(0);
            } else {
                if (a.toLowerCase().indexOf(".m3u") > 0 || a.toLowerCase().indexOf(".xml") > 0 || a.toLowerCase().indexOf("#") == 0) {
                    if (a.toLowerCase().indexOf("#") == 0) {
                        a = a.replace("#", "");
                    }
                    Main.pl_url = a;
                    Main.url = "";
                } else {
                    Main.url = a;
                    Main.pl_url = "";
                }
                API.playlist_name = "";
                Main.name = "";
                KeyHandler.setFocus(0);
                Main.PlayChannel();
            }
        }
    }
};

function RunImeS(e, c) {
    var b = (e == "0") ? e : (parseInt(e) - 1).toString();
    var a = (parseInt(e) + 1).toString();
    var d = new IMEShell(e, ime_callback);
    if (Main.seriesC || Main.seriesD) {
        d.setKeypadPos(110, 75);
    } else {
        d.setKeypadPos(110, 75);
        d.setQWERTYPos(0, 75);
    }
    getId(e)["focus"]();
    d.setKeyFunc(tvKey.KEY_UP, function(f) {
        if (e != "0") {
            SetStyle1(e);
            Scrol("allInput", c[parseInt(b)]);
            SetStyle2(b);
            getId(b)["focus"]();
        }
    });
    d.setKeyFunc(tvKey.KEY_DOWN, function(f) {
        if (c[parseInt(e)] != 0 || e == "0" || e == "1") {
            SetStyle1(e);
            Scrol("allInput", -c[parseInt(e)]);
            SetStyle2(a);
            RunImeS(a, c);
        }
    });
    d.setKeyFunc(tvKey.KEY_RETURN, function(f) {
        widgetAPI.blockNavigation(event);
        Main.Menu();
        return false;
    });
    d.setKeyFunc(tvKey.KEY_EXIT, function(f) {
        widgetAPI.blockNavigation(event);
        Main.Menu();
        return false;
    });
    d.setEnterFunc(SaveValue);
}
ChannelSetupFormular = function() {
    var i = 52;
    var g = 6;
    if (Main.seriesE) {
        i = 46;
        g = 5;
    }
    HelpSet();
    if (!Main.seriesE) {
        getIdb("4_help");
        getIdb("11_help");
    } else {
        getIdn("4_help");
    }
    var f = Ach(3);
    if (f.length >= 1000) {
        f = "Редактировать не возможно! Слишком большой размер.";
    }
    var d = [];
    var k = parseInt(f.length / 100);
    for (var b = 0; b < k + 1; b++) {
        d[b] = f.substring(0, 100);
        f = f.replace(d[b], "");
    }
    var c = (Main.url == "") ? "плейлиста" : "стрима";
    widgetAPI.putInnerHTML(getId("version"), "Редактирование параметров " + c);
    var e = '<div id="allInput"><form><span>Название ' + c + ' : </span></form><form><input id="0" type="text" size="' + i + '" maxlength="200"/></form><form><span>URL адрес ' + c + ' : </span></form><form><input id="1" type="text" size="' + i + '" maxlength="200"/></form><form><span>Описание, дополнительная информация : </span></form>';
    for (var b = 2; b < k + 3; b++) {
        e += '<form><input id="' + b + '" type="text" size="' + i + '" maxlength="200"/></form>';
    }
    e += "<form><span>Адрес иконки " + c + ' : </span></form><form><input id="' + (k + 3) + '" type="text" size="' + i + '" maxlength="200"/></form>';
    if (Main.url != "") {
        e += '<form><span>Стартовая пропорция  размера видео :</span></form><form><span>"0"- 16X9 FULL или ORIGINAL , "1"- 14X9 ,</span></form><form><span>"2"- 4Х3 ZOOM 2 , "3"- 4Х3 ZOOM 1 ,"4"- 4Х3 , </span></form><form><span id="text_form0">"5"- X-ZOOM , "6"- АВТО . </span><input id="' + (k + 4) + '" type="text" size="' + g + '" maxlength="2"/></form><form><span id="text_form0">Номер звуковой дорожки ( 1, 2, 3 . . . ) : </span><input id="' + (k + 5) + '"  type="text" size="' + g + '" maxlength="2"/></form><form><span id="text_form0">Сдвиг времени в программке ( +/-12 ч.) : </span><input id="' + (k + 6) + '" type="text" size="' + g + '" maxlength="4"/></form><form><span>Общий размер буфера  0.5 - 20 ( Мб.).</span></form><form><span id="text_form0">Если не установлен, то "авто" : </span><input id="' + (k + 7) + '"  type="text" size="' + g + '" maxlength="3"/></form><form><span>Старт после прочтения  10 - 50 ( % ) буфера.</span></form><form><span id="text_form0">Если не установлен, то "авто" : </span><input id="' + (k + 8) + '"  type="text" size="' + g + '" maxlength="3"/></form><form><span id="text_form0"> Код региона Яндекс ( "213"- Москва ) : </span><input id="' + (k + 9) + '"  type="text" size="' + g + '" maxlength="6"/></form>';
    }
    e += "<form></form><form></form><form></form><form></form><form></form><form></form><form></form></div>";
    widgetAPI.putInnerHTML(getId("infoList"), e);
    var a = [0, 0];
    SetString("0", Main.name, 1);
    var j = (Main.pl_url != "") ? Main.pl_url : (Main.url != "") ? Main.url : "";
    SetString("1", j, 1);
    if (k == 0) {
        SetString("2", d[0], 1);
        a[2] = 72;
    } else {
        SetString("2", d[0], 1);
        a[2] = 36;
        for (var b = 1; b < k; b++) {
            SetString(b + 2, d[b], 1);
            a[b + 2] = 36;
        }
        SetString(k + 2, d[k], 1);
        a[k + 2] = 72;
    }
    if (Main.url != "") {
        if (k == 0) {
            SetString("3", Main.logo, 1);
        } else {
            SetString(k + 3, Main.logo, 1);
        }
        a[k + 3] = 144;
        SetString(k + 4, Main.ssize, 1);
        a[k + 4] = 36;
        SetString(k + 5, Main.a_num, 1);
        a[k + 5] = 36;
        SetString(k + 6, Main.timeshift, 1);
        a[k + 6] = 72;
        SetString(k + 7, Main.buffer, 1);
        a[k + 7] = 72;
        SetString(k + 8, Main.ibuffer, 1);
        a[k + 8] = 36;
        SetString(k + 9, Main.region, 1);
        a[k + 9] = 0;
    } else {
        if (k == 0) {
            SetString("3", Main.logo, 1);
        } else {
            SetString(k + 3, Main.logo, 1);
        }
        a[k + 3] = 0;
    }
    RunImeS("0", a);
    SetStyle2("0");
};
SaveValue = function() {
    try {
        var l = lrdPr(getId("0").value);
        if (Main.url != "") {
            var t = lrdPr(getId("1").value);
            var s = "";
        } else {
            s = lrdPr(getId("1").value);
            t = "";
        }
        if (Ach(3).length < 1000) {
            var r = parseInt(Ach(3).length / 100);
            var b = "";
            for (var k = 0; k < r + 1; k++) {
                b += getId(2 + k).value;
            }
            b = lrdPr(b);
        } else {
            b = Ach(3);
            r = 0;
        }
        var a = lrdPr(getId(r + 3).value);
        if (Main.url != "") {
            var q = dPr(getId(r + 4).value);
            var g = dPr(getId(r + 5).value);
            var o = dPr(getId(r + 6).value);
            var c = dPr(getId(r + 7).value);
            var j = dPr(getId(r + 8).value);
            var f = dPr(getId(r + 9).value);
        } else {
            q = "";
            g = "";
            o = "";
            c = "";
            j = "";
        }
        var i = Main.ch_num - 1;
        var p = [];
        Main.readFile(p, Main.fav_url);
        if (p.length > 0) {
            var d = dSp(dI(l) + "|" + dI(t) + "|" + dI(a) + "|" + dI(b) + "||" + dI(s) + "|" + dI(q) + "|" + dI(g) + "|" + dI(c) + "|" + dI(j) + "|" + dI(o) + "|" + dI(f) + "|" + Main.parser + "|" + Main.search_on);
            p.splice(i, 1, d);
            Main.writeFile(p, Main.fav_url);
            Main.playlist_prev = false;
            Main.DEL = true;
            Main.FAV = true;
            Main.opencommonFile(Main.fav_url);
        }
        Main.Menu();
    } catch (n) {}
};
Scrol = function(b, a) {
    Main.scrolling = Main.scrolling + a;
    getId(b).style.margin = Main.scrolling + "px 0px 0px 0px ";
};
KeyHandler.SetapKeyDown = function() {
    var f = function() {
        var l = getId(Main.setap_id).value;
        for (var k = 0; k < a.length; k++) {
            if (l == a[k]) {
                return k;
                break;
            }
        }
    };
    var a = [];
    var e = 0;
    var d = 0;
    var c = 0;
    switch (Main.setap_id) {
        case "9":
            a = ["ru", "ua", "by"];
            d = 36;
            e = 36;
            break;
        case "10":
            a = ["-12", "-11", "-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "+10", "+11", "+12"];
            d = 36;
            e = 36;
            break;
        case "11":
            a = ["авто-синхра", "авто-unix", "ручное из тв"];
            d = 36;
            e = 36;
            break;
        case "12":
            a = ["-12", "-11", "-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "+10", "+11", "+12"];
            d = 36;
            e = 36;
            break;
        case "13":
            a = ["16X9", "14X9", "4X3-ZOOM 2", "4X3-ZOOM 1", "4X3", "X-ZOOM", "АВТО", "Не установлен"];
            d = 36;
            e = 36;
            break;
        case "14":
            for (var j = 0; j < 101; j++) {
                a[j] = (j + 50).toString();
            }
            d = 36;
            e = 36;
            break;
        case "15":
            for (var j = 0; j < 101; j++) {
                a[j] = (j + 50).toString();
            }
            d = 36;
            e = 36;
            break;
        case "16":
            a = ["4X3", "4X3 ZOOM 1", "4X3 ZOOM 2", "14X9", "X-ZOOM"];
            d = 36;
            e = 36;
            break;
        case "17":
            a = ["16X9", "16X9 ZOOM 1", "16X9 ZOOM 2", "14X9", "X-ZOOM"];
            d = 36;
            e = 36;
            break;
        case "18":
            a = ["ORIGINAL", "ORIG.ZOOM 1", "ORIG.ZOOM 2"];
            d = 36;
            e = 36;
            break;
        case "19":
            a = ["квадратная", "прямоугольная"];
            d = 36;
            e = 36;
            break;
        case "20":
            a = ["вкл", "выкл"];
            d = 72;
            e = 36;
            break;
        case "21":
            a = ["0", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
            d = 108;
            e = 72;
            break;
        case "22":
            a = ["0", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
            d = 36;
            e = 108;
            break;
        case "23":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
        case "24":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
        case "25":
            a = ["вкл", "выкл"];
            d = 36;
            e = 36;
            break;
        case "26":
            a = ["240p", "360p", "480p", "720p", "1080p"];
            d = 36;
            e = 36;
            break;
        case "27":
            a = ["вкл", "выкл"];
            d = 0;
            e = 36;
            break;
    }
    var i = (parseInt(Main.setap_id) - 1).toString();
    var g = (Main.setap_id < 27) ? (parseInt(Main.setap_id) + 1).toString() : Main.setap_id;
    event.preventDefault();
    var b = event.keyCode;
    switch (b) {
        case tvKey.KEY_RETURN:
        case tvKey.KEY_EXIT:
            Return(0);
            break;
        case tvKey.KEY_ENTER:
            onEnter();
            break;
        case tvKey.KEY_RIGHT:
            c = f();
            if (c < a.length - 1) {
                c++;
            } else {
                c = 0;
            }
            SetString(Main.setap_id, a[c]);
            break;
        case tvKey.KEY_LEFT:
            c = f();
            if (c > 0) {
                c--;
            } else {
                c = a.length - 1;
            }
            SetString(Main.setap_id, a[c]);
            break;
        case tvKey.KEY_UP:
            SetStyle1(Main.setap_id);
            Scrol("allInput", e);
            SetStyle2(i);
            if (Main.setap_id == 9) {
                getId("8")["focus"]();
            } else {
                Main.setap_id = i;
            }
            break;
        case tvKey.KEY_DOWN:
            if (Main.setap_id < 27) {
                SetStyle1(Main.setap_id);
                Scrol("allInput", -d);
                SetStyle2(g);
            }
            Main.setap_id = g;
            break;
        default:
            alert("Unhandled key");
            break;
    }
    return false;
};
ime_callback = function() {};
RunIme = function(e) {
    var c = [0, 108, 72, 36, 36, 36, 36, 108, 36, 36];
    if (API.star_url == API.XML_URL) {
        c[1] = 72;
    }
    if (Main.pl_url == "") {
        c[2] = 36;
    }
    var b = (e == "0") ? e : (parseInt(e) - 1).toString();
    var a = (parseInt(e) + 1).toString();
    var d = new IMEShell(e, ime_callback, "en");
    if (Main.seriesC || Main.seriesD) {
        d.setKeypadPos(110, 75);
    } else {
        d.setKeypadPos(110, 75);
        d.setQWERTYPos(0, 75);
    }
    getId(e)["focus"]();
    d.setKeyFunc(tvKey.KEY_UP, function(f) {
        if (e != "0") {
            SetStyle1(e);
            Scrol("allInput", c[parseInt(e)]);
            SetStyle2(b);
            getId(b)["focus"]();
        }
    });
    d.setKeyFunc(tvKey.KEY_DOWN, function(f) {
        SetStyle1(e);
        Scrol("allInput", -c[parseInt(a)]);
        SetStyle2(a);
        if (e == "8") {
            Main.setap_id = a;
            KeyHandler.setFocus(7);
        } else {
            RunIme(a);
        }
    });
    d.setKeyFunc(tvKey.KEY_YELLOW, function(g) {
        widgetAPI.blockNavigation(event);
        var f = getId(e).value;
        f = (e == "0") ? API.XML_URL : (e == "1" && Main.pl_url != "") ? Main.pl_url : f;
        d.setString(f);
        return false;
    });
    d.setKeyFunc(tvKey.KEY_RETURN, function(f) {
        Return(0);
        return false;
    });
    d.setKeyFunc(tvKey.KEY_EXIT, function(f) {
        widgetAPI.sendReturnEvent();
    });
    d.setEnterFunc(onEnter);
};
var SSize = {
    0: "16X9",
    1: "14X9",
    2: "4X3-ZOOM 2",
    3: "4X3-ZOOM 1",
    4: "4X3",
    5: "X-ZOOM",
    6: "АВТО",
    7: "Не установлен"
};
var ASize1 = {
    1: "14X9",
    5: "X-ZOOM",
    4: "4X3",
    3: "4X3 ZOOM 1",
    2: "4X3 ZOOM 2"
};
var ASize2 = {
    0: "16X9",
    1: "14X9",
    5: "X-ZOOM",
    7: "16X9 ZOOM 1",
    8: "16X9 ZOOM 2"
};
var ASize3 = {
    0: "ORIGINAL",
    7: "ORIG.ZOOM 1",
    8: "ORIG.ZOOM 2"
};
var STimemode = {
    0: "авто-синхра",
    1: "авто-unix",
    2: "ручное из тв"
};
SetupFormular = function() {
    var n = 52;
    var l = 22;
    var k = 6;
    var d = 18;
    var c = 48;
    if (Main.seriesE) {
        n = 46;
        l = 18;
        k = 5;
        d = 15;
        c = 44;
    }
    Main.FirstStart = true;
    HelpSet();
    if (!Main.seriesE) {
        getIdb("4_help");
        getIdb("11_help");
    } else {
        getIdn("4_help");
    }
    getIdb("help_set_par");
    widgetAPI.putInnerHTML(getId("version"), " Настройка параметров , MAC = " + Main.MAC);
    var f = '</span></form><form style="color:#00ccff;font-size:17px;"><span>';
    if (API.XML_URL.length < 200) {
        var b = API.XML_URL;
        var a = "";
        if (API.XML_URL.length > d) {
            b = API.XML_URL.substr(0, d);
            var j = API.XML_URL.substr(d);
            var p = parseInt(j.length / c);
            for (var g = 0; g < p + 1; g++) {
                var e = j.substring(0, c);
                j = j.replace(e, "");
                a += f + e;
            }
        }
    } else {
        b = "";
        a = '</span></form><form style="color:#00ccff;font-size:20px;"><span>Адрес слишком большой!';
    }
    var i = '<div id="allInput"><form><span> URL адрес текущего плейлиста : <font style="color:#00ccff;font-size:17px;">"' + b + "</font>" + a + '"</span></form><form><span> URL адрес стартового плейлиста : </span></form><form><input id="0" type="text" size="' + n + '" maxlength="200"></input></form>';
    if (API.star_url != API.XML_URL) {
        i += '<form><img src="img/buttons/yellow_m.png"></img><span> - заменить адрес стартового на текущий</span></form>';
    }
    i += '<form><span> URL адрес закрытого плейлиста : </span></form><form><input id="1" type="text" size="' + n + '" maxlength="200"></input></form>';
    if (Main.pl_url != "") {
        i += '<form><img src="img/buttons/yellow_m.png"></img><span> - заполнить адресом плейлиста в фокусе</span></form>';
    }
    i += '<form><span id="text_form3"> Логин для закр. плейлиста :</span><input id="2" type="text" size="' + l + '" maxlength="40"></input></form><form><span id="text_form3">Пароль для закр. плейлиста :</span><input id="3" type="text" size="' + l + '" maxlength="40"></input></form><form><span id="text_form3">UDP прокси ( IP : порт ) :</span><input id="4" type="text" size="' + l + '" maxlength="40"></input></form><form><span id="text_form0">Код доступа к "XXX" ( 0 - 9999 ) : </span><input id="5" type="text" size="' + k + '" maxlength="4"></input></form><form><span id="text_form0">Код названия избранного  ( 0 - 9999 ) :</span><input id="6" type="text" size="' + k + '" maxlength="4"></input></form><form><span>Названия избранных папок, любые, по порядку</span></form><form><span>( название 1 | название 2 | название 3 . . . ) : </span></form><form><input id="7" type="text" size="' + n + '" maxlength="200"></input></form><form><span id="text_form0"> Код региона Яндекс ( "213"- Москва ) : </span><input id="8" type="text" size="' + k + '" maxlength="7"></input></form><form><span id="text_form1">Программка с сайта "m.tv.yandex.</span><img src="img/buttons/lr_m.png"></img><div id="9"></div></form><form><span id="text_form1">Сдвиг времени в программке (+/-12 ч.)</span><img src="img/buttons/lr_m.png"></img><div id="10"></div></form><form><span id="text_form2">Время в виджете : </span><img src="img/buttons/lr_m.png"></img><div id="11"></div></form><form><span id="text_form1">Часовой пояс для "авто." ( +/-12 ч.)</span><img src="img/buttons/lr_m.png"></img><div id="12"></div></form><form><span id="text_form2">Стартовый размер видео : </span><img src="img/buttons/lr_m.png"></img><div id="13"></div></form><form><span id="text_form1">Высота для "X-ZOOM" 50 - 150 ( % )</span><img src="img/buttons/lr_m.png"></img><div id="14"></div></form><form><span id="text_form1">Ширина для "X-ZOOM" 50 - 150 ( % ) </span><img src="img/buttons/lr_m.png"></img><div id="15"></div></form><form><span id="text_form2">ABTO для w/h<1.35 </span><img src="img/buttons/lr_m.png"></img><div id="16"></div></form><form><span id="text_form2">ABTO для 1.34 < w/h <1.79 </span><img src="img/buttons/lr_m.png"></img><div id="17"></div></form><form><span id="text_form2">ABTO для  w/h > 1.78 </span><img src="img/buttons/lr_m.png"></img><div id="18"></div></form><form><span id="text_form2">Форма иконок :</span><img src="img/buttons/lr_m.png"></img><div id="19"></div></form><form><span id="text_form1">Загрузка внешних иконок :</span><img src="img/buttons/lr_m.png"></img><div id="20"></div></form><form><span>Общий размер буфера плеера 0.5 - 20 ( Мб.).</span></form><form><span id="text_form1">"0"- авто. или значение из плейлиста :</span><img src="img/buttons/lr_m.png"></img><div id="21"></div></form><form><span>Начинать воспроизведение после прочтения </span></form><form><span> от 10 до 50 ( % ) от общего размера буфера.</span></form><form><span id="text_form1">"0"- авто. или значение из плейлиста :</span><img src="img/buttons/lr_m.png"></img><div id="22"></div></form><form><span id="text_form1">Нижняя панель подсказок плеера </span><img src="img/buttons/lr_m.png"></img><div id="23"></div></form><form><span id="text_form1">Посылка МАС адреса </span><img src="img/buttons/lr_m.png"></img><div id="24"></div></form><form><span id="text_form1">Маскировка ТВ под браузер </span><img src="img/buttons/lr_m.png"></img><div id="25"></div></form><form><span id="text_form1">Ограничить качество видео </span><img src="img/buttons/lr_m.png"></img><div id="26"></div></form><form><span id="text_form1">Сброс настроек по умолчанию </span><img src="img/buttons/lr_m.png"></img><div id="27"></div></form><form></form><form></form><form></form><form></form><form></form><form></form><form></form><form></form></div>';
    widgetAPI.putInnerHTML(getId("infoList"), i);
    SetString("0", API.star_url, 1);
    SetString("1", API.Surl, 1);
    SetString("2", API.Login, 1);
    SetString("3", API.Pasword, 1);
    SetString("4", API.Proxy, 1);
    var o = (API.Xcode == 0) ? "0" : (API.Xcode.length == 1) ? "#" : (API.Xcode.length == 2) ? "##" : (API.Xcode.length == 3) ? "###" : "####";
    SetString("5", o, 1);
    SetString("6", API.Scode, 1);
    SetString("7", API.Favname, 1);
    SetString("8", API.CODE, 1);
    SetString("9", API.REG, 2);
    o = (API.Timeshift.indexOf("-") < 0 && API.Timeshift != "0") ? "+" + API.Timeshift : API.Timeshift;
    SetString("10", o, 2);
    SetString("11", STimemode[parseInt(API.Timemode)], 3);
    o = (API.Timefix.indexOf("-") < 0 && API.Timefix != "0") ? "+" + API.Timefix : API.Timefix;
    SetString("12", o, 2);
    o = (API.Size == "") ? "7" : API.Size;
    SetString("13", SSize[parseInt(o)], 3);
    SetString("14", API.Ph, 2);
    SetString("15", API.Pw, 2);
    SetString("16", ASize1[parseInt(API.a_size1)], 3);
    SetString("17", ASize2[parseInt(API.a_size2)], 3);
    SetString("18", ASize3[parseInt(API.a_size3)], 3);
    o = (API.Forma == "0" || API.Forma == "2") ? "квадратная" : "прямоугольная";
    SetString("19", o, 3);
    o = (API.Forma == "0" || API.Forma == "1") ? "вкл" : "выкл";
    SetString("20", o, 2);
    SetString("21", API.Buffer, 2);
    SetString("22", API.Ibuffer, 2);
    o = (API.Pstyle == "1") ? "вкл" : "выкл";
    SetString("23", o, 2);
    o = (API.Mac == "1") ? "вкл" : "выкл";
    SetString("24", o, 2);
    o = (API.Header == "1") ? "вкл" : "выкл";
    SetString("25", o, 2);
    SetString("26", API.Vquality, 2);
    SetString("27", "выкл", 2);
    RunIme("0");
    SetStyle2("0");
};
SetString = function(c, b, a) {
    if (b == "") {
        b = " ";
    }
    widgetAPI.putInnerHTML(getId(c), b);
    getId(c).value = b;
    if (a == 1) {
        SetStyle1(c);
    } else {
        if (a == 2) {
            SetStyle1(c);
            getId(c).style.width = "52px";
        } else {
            if (a == 3) {
                SetStyle1(c);
                getId(c).style.width = "120px";
            }
        }
    }
};
SetStyle1 = function(a) {
    getId(a).style.color = "black";
    getId(a).style.background = "#999999";
    getId(a).style.border = "2px solid #ffffff";
};
SetStyle2 = function(a) {
    getId(a).style.color = "blue";
    getId(a).style.background = "#eeeeee";
    getId(a).style.border = "2px solid #999999";
};
Return = function(a) {
    widgetAPI.blockNavigation(event);
    if (API.channels.length > 0 && API.XML_URL == Main.pre_pl_url && a == 0) {
        Main.Menu();
    } else {
        location.reload(true);
    }
};
onEnter = function() {
    try {
        var w = getId("27").value;
        if (w == "вкл") {
            var b = ["start.xml", "", "", "", "", "0", "0", "Основное|IP-TV|Фильмы|Сериалы", "213", "ru", "0", "0", "0", "", "100", "100", "2", "0", "0", "0", "0", "0", "1", "1", "0", "360p"];
        } else {
            var G = lrdPr(getId("0").value);
            var v = lrdPr(getId("2").value);
            var t = lrdPr(getId("3").value);
            var r = (dPr(v) != "" && dPr(t) != "") ? lrdPr(getId("1").value) : r = "";
            var q = lrdPr(getId("4").value);
            var o = dPr(getId("5").value);
            o = (API.Xcode != 0 && (o == API.Xcode || o == Main.ver.substr(2))) ? "0" : (API.Xcode != 0) ? API.Xcode : o;
            var l = dPr(getId("6").value);
            var j = lrdPr(getId("7").value);
            var g = dPr(getId("8").value);
            var C = getId("9").value;
            var d = getId("10").value;
            var f = getId("11").value;
            for (var u in STimemode) {
                if (STimemode[u] == f) {
                    f = u.toString();
                    break;
                }
            }
            var s = getId("12").value;
            var c = getId("13").value;
            for (var u in SSize) {
                if (SSize[u] == c) {
                    c = u.toString();
                    break;
                }
            }
            c = (c == "7") ? "" : c;
            var p = getId("14").value;
            var n = getId("15").value;
            var k = getId("16").value;
            for (var u in ASize1) {
                if (ASize1[u] == k) {
                    k = u.toString();
                    break;
                }
            }
            var i = getId("17").value;
            for (var u in ASize2) {
                if (ASize2[u] == i) {
                    i = u.toString();
                    break;
                }
            }
            var F = getId("18").value;
            for (var u in ASize3) {
                if (ASize3[u] == F) {
                    F = u.toString();
                    break;
                }
            }
            var E = getId("19").value;
            var B = getId("20").value;
            E = (E == "квадратная" && B == "вкл") ? "0" : (E == "прямоугольная" && B == "вкл") ? "1" : (E == "квадратная" && B == "выкл") ? "2" : "3";
            var a = getId("21").value;
            var D = getId("22").value;
            var A = getId("23").value;
            A = (A == "вкл") ? "1" : "0";
            var z = getId("24").value;
            z = (z == "вкл") ? "1" : "0";
            var y = getId("25").value;
            y = (y == "вкл") ? "1" : "0";
            var x = getId("26").value;
            b = [G, r, v, t, q, o, l, j, g, C, d, f, s, c, p, n, k, i, F, E, a, D, A, z, y, x];
        }
        Main.writeFile(b, API.fn);
        API.init();
        if (C != API.REG) {
            Return(1);
        } else {
            Return(0);
        }
    } catch (H) {}
};

function getIdb(a) {
    try {
        return getId(a).style.display = "block";
    } catch (b) {
        return "";
    }
}

function getIdn(a) {
    try {
        return getId(a).style.display = "none";
    } catch (b) {
        return "";
    }
}

function getId(a) {
    try {
        return document.getElementById(a);
    } catch (b) {
        return "";
    }
}

function getTN(a) {
    try {
        return document.getElementsByTagName(a);
    } catch (b) {
        return "";
    }
}

function getCl(a) {
    try {
        return document.getElementsByClassName(a);
    } catch (b) {
        return "";
    }
}

function Ach(a) {
    try {
        return API.channels[Main.chan_array_index][a];
    } catch (b) {
        return "";
    }
}

function dI(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/\|/g, "") : "";
    return a;
}

function dTg(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/<\/?[^>]+>/g, "") : "";
    return a;
}

function dSp(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/[\n\r\t]/g, "") : "";
    return a;
}

function lrdPr(b) {
    var a = (typeof b == "string" && b != "") ? b.replace(/(^\s*)|(\s*)$/g, "").replace(/[\n\r\t]/g, "") : "";
    return a;
}

function dPr(b, c) {
    var a = (typeof b == "string" && b != "") ? b.replace(/\s/g, "") : "";
    if (c == 1) {
        a = (!isNaN(a)) ? a : "";
    }
    return a;
}

function getYoutubeUrl(n) {
    var j = ["&el=embedded", "&el=detailpage", "&el=vevo", ""];
    var f = "";
    var o = "";
    var flag = false;
    for (var i = 0; i < j.length; i++) {
        var e = j[i];
        var d = "http://www.youtube.com/get_video_info?&video_id=" + n + e + "&ps=default&eurl=&gl=US&hl=en";
        API.AsReqMode = false;
        var f = API.Request(d);
        f = f.match(/url_encoded_fmt_stream_map=(.*?)&/);
        if (f != null) {
            if (f[1].indexOf("itag") >= 0) {
                var a = f[1].split("%2C");
                if (decLongUrl(a[0]).indexOf('itag=43') > -1) {
                    a.splice(0, 1);
                }
                if (decLongUrl(a[1]).indexOf('itag=43') > -1) {
                    a.splice(1, 1);
                }
                for (var g = 0; g < a.length; g++) {
                    a[g] = decLongUrl(a[g]);
                    var l = parser(a[g], "itag=", "&");
                    if (l != "") {
                        var k = "";
                        var b = [];
                        switch (l) {
                            case "22":
                                k = "720p";
                                break;
                            case "18":
                                k = "480p";
                                break;
                            case "5":
                                k = "360p";
                                break;
                            case "36":
                                k = "240p";
                                break;
                        }
                        if (k != "") {
                            a[g] = a[g].replace("itag=" + l + "&", "");
                            if (a[g].indexOf("&url=") > 0) {
                                var c = a[g].split("&url=");
                                a[g] = c[1];
                            } else {
                                a[g] = a[g].replace("url=", "");
                            }
                            b = [a[g], k];
                            Main.url_arr["push"](b);
                            if (Main.ver > 2.53 && k.indexOf(API.Vquality) > -1) {
                                flag = true;
                                o = a[g];
                                Selectbox.url_selected = Main.url_arr.length - 1;
                            }
                            if (flag == false) {
                                if (k.indexOf(API.Vquality) < 0) {
                                    o = a[g];
                                    flag = true;
                                }
                            }
                        }
                        if (k == "240p") {
                            break;
                        }
                    }
                }
                if (Main.url_arr.length > 0 && o == "") {
                    o = Main.url_arr[1][1];
                }
            }
            break;
        }
    }
    return o;
}

function getVkUrl(j) {
    var i = "";
    var d = "";
    var a = [];
    var flag = false;
    j = j.replace("vkontakte.ru", "vk.com");
    d = API.Request(j);
    if (d.indexOf('www.youtube.com') + 1) {
        var f = d.split('ajax.preload');
        var q = f[1].match(/http:(.*?)?autoplay/);
        var c = q[1].replace(/\\/g, '');
        c = c.replace("?", '');
        c = c.replace("//www.youtube.com/embed/", '');
        return getYoutubeUrl(c);
    } else {
        var qual240 = 0;
        var qual360 = 0;
        var qual480 = 0;
        var qual720 = 0;
        if (d.indexOf('url240') + 1) qual240 = 1;
        if (d.indexOf('url360') + 1) qual360 = 1;
        if (d.indexOf('url480') + 1) qual480 = 1;
        if (d.indexOf('url720') + 1) qual720 = 1;
        count = qual240 + qual360 + qual480 + qual720;
        var f = d.split('url240');
        var q = f[1].match(/http:(.*?)?extra/);
        if (q != null) {
            var c = q[1].replace(/\\\\\\/g, '');
            c = c.replace("?", '');
            c = c.split("videos");
            c[0] = c[0].replace("//", '');
            c[1] = c[1].replace("240.mp4", '');
            for (var e = 0; e < count; e++) {
                switch (e) {
                    case 0:
                        var b = "240.mp4";
                        var g = "240p";
                        break;
                    case 1:
                        b = "360.mp4";
                        g = "360p";
                        break;
                    case 2:
                        b = "480.mp4";
                        g = "480p";
                        break;
                    case 3:
                        b = "720.mp4";
                        g = "720p";
                        break;
                }
                a = ["http://" + c[0] + "videos" + c[1] + b, g];
                Main.url_arr["push"](a);
                if (Main.ver > 2.53 && g.indexOf(API.Vquality) > -1) {
                    flag = true;
                    i = "http://" + c[0] + "videos" + c[1] + b;
                    Selectbox.url_selected = Main.url_arr.length - 1;
                }
                if (flag == false) {
                    if (g.indexOf(API.Vquality) < 0) {
                        i = "http://" + c[0] + "videos" + c[1] + b;
                        flag = true;
                    }
                }
            }
            if (Main.url_arr.length > 0 && i == "") {
                i = Main.url_arr[0][0];
            }
        }
        return i;
    }
}

function getRuTubeUrl(j) {
    var i = "";
    var d = "";
    var a = [];
    var flag = false;
    d = API.Request('http://rutube.ru/api/oembed/?url=' + j + '&format=xml');
    j = d.match(/embed\/(.*?)"/);
    d = API.Request('http://rutube.ru/play/embed/' + j[1]);
    d = d.split('"m3u8":');
    j = d[1].match(/"(.*?)"},/);
    d = API.Request(j[1]);
    f = d.match(/http:\/\/(.*?)\n/g);
    f.reverse();
    for (var e = 0; e < f.length; e++) {
        switch (e) {
            case 0:
                v = f[0];
                g = "720p";
                break;
            case 1:
                v = f[1];
                g = "480p";
                break;
            case 2:
                v = f[2];
                g = "360p";
                break;
            case 3:
                v = f[3];
                g = "240p";
                break;
        }
        a = [v + '|COMPONENT=HLS', g];
        Main.url_arr["push"](a);
        if (Main.ver > 2.53 && g.indexOf(API.Vquality) > -1) {
            flag = true;
            i = v + '|COMPONENT=HLS';
            Selectbox.url_selected = Main.url_arr.length - 1;
        }
        if (flag == false) {
            if (g.indexOf(API.Vquality) < 0) {
                i = v + '|COMPONENT=HLS';
                flag = true;
            }
        }
    }
    if (Main.url_arr.length > 0 && i == "") {
        i = Main.url_arr[0][0];
    }
    return i;
}
YandexGetUrl = function(a) {
    var e = "";
    if (Main.Ya_flag_step > 0 && Main.Ya_flag_step < 5) {
        var f = ["", "5", "4", "3", "7"];
        e = "&flag=" + f[Main.Ya_flag_step];
    } else {
        Main.Ya_flag_step = 0;
    }
    if (a.indexOf("/m.tv.yandex.") > 0 && a.indexOf("/program/") > 0) {
        var b = a;
    } else {
        if (a.indexOf("/m.tv.yandex.") > 0 && a.indexOf("channel=") > 0) {
            a = a.substr(a.indexOf("http:"));
            a = a.substr(22);
            var c = a.substr(0, a.indexOf("/"));
            a = a.substr(a.indexOf("channel="));
            var d = (a.indexOf("&") < 0) ? a.length : a.indexOf("&");
            a = a.substring(8, d);
        } else {
            c = (Main.region != "") ? Main.region : API.CODE;
        }
        b = "http://m.tv.yandex." + API.REG + "/" + c + "/?channel=" + a + "&when=2&day=";
        Main.ya_prog_info_arr = [];
    }
    Main.temp_ya_epg_info_arr = [];
    if (e == "" && T.delta == 0) {
        Main.lost_date = "pегион - <font color='#00ccff'>" + c + "</font>, индекс - <font color='#00ccff'>" + a + "</font>";
    }
    YandexParsing(b, c, a, e);
};

function YaAbort() {
    clearTimeout(Main.Ya_ready_timeout);
    if (Main.YaHTTP != null) {
        Main.YaHTTP["abort"]();
        Main.YaHTTP = null;
    }
}

function Err() {
    YaAbort();
    Main.yandextv_mode = false;
    Main.showinfoList("Ничего не найдено!");
}

function YandexParsing(b, c, f, e) {
    var a = "";
    if (T.delta < -6) {
        T.delta = 0;
    }
    var d = parseInt(T.y_t_days + T.delta);
    if (!Main.guide) {
        b = b + d;
    }
    YaAbort();
    Main.Ya_ready_timeout = setTimeout("Err();", 3000);
    Main.YaHTTP = new XMLHttpRequest();
    Main.YaHTTP.onreadystatechange = function() {
        if (Main.YaHTTP.readyState == 4 && Main.YaHTTP.status == 200) {
            clearTimeout(Main.Ya_ready_timeout);
            a = Main.YaHTTP.responseText;
            a = a.replace(/amp;/g, "");
            if (!Main.guide) {
                var t = ["", "Фильмы", "Сериалы", "Детям", "Спорт"];
                Main.Ya_flag_name = '<font style="color:#ff3300;padding-left:15px;font-size:17px;">' + t[Main.Ya_flag_step] + "</font>";
                var r = '</div><div class="b-select">';
                var p = a.indexOf(r);
                if (p < 0) {
                    Err();
                    return;
                }
                var n = '<div class="b-banner">';
                var l = a.indexOf(n);
                if (l > 0 && l < p) {
                    p = l;
                }
                n = '<div class="b-text">';
                l = a.indexOf(n);
                if (l > 0) {
                    r = a.indexOf('</div></div><div class="b-select">');
                    if (r < 0) {
                        Err();
                        return;
                    } else {
                        var l = a.substring(l + n.length, r);
                        if (l != "") {
                            if (e == "" && T.delta != 0) {
                                T.delta = 100;
                            }
                            Main.showinfoList(l);
                        } else {
                            T.delta = 0;
                            YandexGetUrl();
                        }
                    }
                } else {
                    n = '<a href="/' + c + "/?day=" + d + "&when=2" + e + "&channel=" + f + '">';
                    l = a.indexOf(n);
                    if (l < 0) {
                        Err();
                        return;
                    }
                    a = a.substring(l + n.length, p);
                    var j = a.substr(0, 2);
                    a = a.replace(j, "");
                    r = '</a><br /><a href="/' + c + "/?day=" + d + "&when=2" + e + "&channel=" + f + '" class="day">';
                    p = a.indexOf(r);
                    if (p < 0) {
                        Err();
                        return;
                    }
                    a = a.replace(r, "");
                    var x = a.substr(0, 2);
                    var v = parser(a, '<th class="channel">', "</th></tr>");
                    if (v == "") {
                        Err();
                        return;
                    }
                    a = a.substr(a.indexOf("</th></tr>") + 10);
                    var u = "";
                    var s = '<table><td style="vertical-align:top;color:#00ccff;font-weight:bolder;padding-right:8px"><u>';
                    var k = 1;
                    var q = "";
                    var o = "";
                    var P = "";
                    var O = "";
                    var M = "";
                    Main.ya_prog_info_arr = [];
                    var i = (Main.timeshift != "") ? Main.timeshift : (API.Timeshift != "") ? API.Timeshift : 0;
                    var K = a.split("</td></tr>");
                    for (var A = 0; A < K.length; A++) {
                        a = K[A];
                        var I = a.indexOf('<tr class="gone">');
                        var G = parser(a, '<td class="time"><a href="/' + c + "/program/", '">');
                        var E = "http://m.tv.yandex." + API.REG + "/" + c + "/program/" + G.replace("<tr>", "");
                        var y = parser(a, G + '">', "</a>");
                        var w = parser(a, "</a></td><td>");
                        if (G == "" || y == "" || w == "") {
                            break;
                        }
                        var D = y.split(":");
                        if (D.length == 2) {
                            var g = parseInt(D[0]) + parseInt(i);
                            D[0] = ((g > 23) ? (g - 24) : (g < 0) ? (g + 24) : g).toString();
                            if (D[0].length == 1) {
                                D[0] = "0" + D[0];
                            }
                            y = D.join(":");
                        }
                        k++;
                        var C = false;
                        var B = "<font>";
                        var L = "</u></td><td>" + B;
                        if (I > -1) {
                            C = true;
                            k = 1;
                            B = '<font style="color:#999999">';
                            L = "</u></td><td>" + B;
                            o = s + y + L + w + "</font></td></table>";
                            P = B + w + "</font>";
                            O = E;
                            M = y;
                        }
                        if (k == 2 && T.delta == 0) {
                            B = '<font style="color:#ffff99;font-weight:bold;">';
                            L = "</u></td><td>" + B;
                        }
                        if (k == 2 && T.delta == 0 && !Main.ya_all_day) {
                            u = o + s + y + L + w + "</font></td></table>";
                            q = B + w + "</font>";
                        } else {
                            if ((Main.ya_all_day && C) || T.delta < 0) {
                                u += s + y + L + w + "</font></td></table>";
                                q = B + w + "</font>";
                            } else {
                                if (!C) {
                                    u += s + y + L + w + "</font></td></table>";
                                    q = B + w + "</font>";
                                }
                            }
                        }
                        if (q != "") {
                            if (KeyHandler.Focus == 0) {
                                if (k == 2 && T.delta == 0 && !Main.ya_all_day && P != "") {
                                    var J = '<font style="position:absolute;left:9px;padding-top:1px;font-size:22px;color:#00ccff;text-align:center;">' + M + "</font>";
                                    var z = [P, "stop", "0.png", O, "", "", "", "", "", "", J, "", "", ""];
                                    Main.ya_prog_info_arr["push"](z);
                                }
                                J = '<font style="position:absolute;left:9px;padding-top:1px;font-size:22px;color:#00ccff;text-align:center;">' + y + "</font>";
                                z = [q, "stop", "0.png", E, "", "", "", "", "", "", J, "", "", ""];
                                Main.ya_prog_info_arr["push"](z);
                            }
                            if (T.delta == 0 && e == "") {
                                var N = dSp(q + "|" + y);
                                Main.temp_ya_epg_info_arr["push"](N);
                            }
                        }
                    }
                    if (Main.temp_ya_epg_info_arr.length > 0) {
                        if (Player.state == Player.STOPPED || (Player.state == Player.PLAYING_LIVE && Main.play_chan_array_index == Main.chan_array_index)) {
                            Main.ya_prog_id = Main.chan_array_index;
                            Main.ya_epg_info_arr = Main.temp_ya_epg_info_arr;
                            GetEpgInfo();
                        }
                    }
                    if (KeyHandler.Focus == 0 && Main.yandextv_mode) {
                        if (j != "" && x != "") {
                            Main.lost_date = '<font style="color:#00cc99; padding-left:5px;">' + j + ".- " + x + "</font>";
                        }
                        if (v != "") {
                            Main.lost_date += '<font style="color:#00ccff;padding-left:15px;">' + v + "</font>";
                        }
                        u = u.replace("<br>", "");
                        Main.showinfoList(u);
                    }
                }
            } else {
                var H = parser(a, '<div class="b-broadcast__time">', '</div></div><div class="b-pager">');
                if (H == "") {
                    Err();
                    return;
                }
                H = parser(H, '&when=2">');
                if (H != "") {
                    H = H.replace("</a>", "").replace('</div><div class="b-broadcast__info">', "</h3></td></tr></table>");
                    var F = parser(a, '<div class="b-broadcast">', '<div class="b-broadcast__time">');
                }
                if (F != "") {
                    F = F.replace('class="b-broadcast__img" alt="" title=""', "");
                }
                if (H != "" && Main.yandextv_mode) {
                    Main.showinfoList('<table style="font-size:20px;"><table><tr><td style="vertical-align:top;padding-right:8px;">' + F + '</td><td style="color:#00ccff;"><h3>' + H + "</table>");
                } else {
                    Main.showinfoList("Подробного описания нет!");
                }
            }
        }
    };
    if (Main.seriesC || Main.seriesD || Main.seriesE) {
        Main.YaHTTP["open"]("GET", 'http://nstreamevoo.atservers.net/evo/yandex.php?url=' + encodeURIComponent(b + e), true);
    } else {
        Main.YaHTTP["open"]("GET", b + e, true);
    }
    Main.YaHTTP["setRequestHeader"]("User-Agent", "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.9.168 Version/11.51");
    Main.YaHTTP["send"](null);
}
var Ya_name_index_obj = {};
var Ya_icon_index_url_obj = {};
var Ya_icon_name_url_obj = {};

GetEpgInfo = function() {
    if (Main.ya_epg_info_arr.length > 0) {
        var a = Main.ya_epg_info_arr[0].split("|");
        var e = a[0];
        var d = a[1];
        a = d.split(":");
        Main.epg_t1 = parseInt((a[0] * 60 * 60 + a[1] * 60) * 1000);
        if (Main.ya_epg_info_arr.length > 1) {
            a = Main.ya_epg_info_arr[1].split("|");
            var c = a[1];
            a = c.split(":");
            Main.epg_t2 = parseInt((a[0] * 60 * 60 + a[1] * 60) * 1000);
            Main.ya_epg_info_arr["splice"](0, 1);
        } else {
            Main.epg_t2 = Main.epg_t1;
            c = "Неизвестно";
        }
        if (Main.epg_t1 > Main.epg_t2) {
            Main.epg_t2 += 24 * 60 * 60 * 1000;
        }
        var b = "";
        if (dPr(e) != "") {
            b = "<font style='color:#ffff99;font-weight:bold;'>" + e + "</font><font style='color:#00ccff;font-weight:bolder;padding-left:10px;'>" + d + " - " + c + "</font>";
        }
        widgetAPI.putInnerHTML(getId("epg_info"), b);
        Display.showplayer();
    }
};
GetNextEpgInfo = function() {
    if (Main.ya_epg_info_arr.length > 0) {
        if (Main.epg_info_step == 1 && Main.temp_epg_info == "") {
            Main.temp_epg_info = getId("epg_info").innerHTML;
        }
        if (Main.epg_info_step > 0 && Main.epg_info_step <= Main.ya_epg_info_arr.length) {
            var a = Main.ya_epg_info_arr[Main.epg_info_step - 1].split("|");
            var d = a[0];
            var c = a[1];
            if (dPr(d) != "" && dPr(c) != "") {
                var b = d + "<font style='color:#00ccff;font-weight:bolder;padding-left:10px;'>" + c + "</font>";
            }
        } else {
            if (Main.temp_epg_info != "") {
                b = Main.temp_epg_info;
                Main.temp_epg_info = "";
            }
        }
        widgetAPI.putInnerHTML(getId("epg_info"), b);
        if (Main.epg_info_step > 0) {
            Display.showplayer();
        }
    }
};

function Super_Send(a) {
    if (a.indexOf("http://germet.net") >= 0 && API.search_string != "" && Main.search) {
        a = a.replace("search=", "q=");
    }
    return a;
}

function GetHash(c, b, f) {
    var a = "";
    if (f != "") {
        var e = decLongUrl(API.Request(c + "action=get_test_url&s_key=" + f + "&url=" + b));
    } else {
        e = c;
    }
    e = e.split("|");
    if (e[0] != "") {
        var d = API.Request(e[0]);
        d = parser(d, e[1], e[2]);
        if (f != "") {
            a = API.Request(c + "action=get_result_url_hash&s_key=" + f + "&hash=" + d + "&url=" + b);
        } else {
            a = b.replace("md5hash", d);
        }
    } else {
        a = b;
    }
    return a;
}

function parser(e, c, b) {
    var a = "";
    if (dPr(e) != "" && c != undefined) {
        var d = e.indexOf(c);
        if (d >= 0) {
            e = e.substr(d + c.length);
            if (b == undefined) {
                return e;
            }
            d = e.indexOf(b);
            if (d >= 0) {
                a = e.substr(0, d);
            }
        }
    }
    return a;
}

function decLongUrl(a) {
    if (dPr(a) != "" && a.indexOf("%") >= 0) {
        while (a.indexOf("%") >= 0) {
            a = decodeURIComponent(a);
        }
    }
    return a;
}

function getFsToVideo(url) {
    var request = API.Request(url);
    request = request.split('is_first: 1,');
    video_url = request[1].match(/\/get\/play\/(.*?)',/);
    return video_url[1];
}

function Super_parser(e) {
    var c = e;
    if (e.indexOf("#germetJSParser") >= 0) {
        e = e.replace("#germetJSParser", "");
    }
    if (Main.ver > 2.42 && Main.parser != "" && Main.parser.indexOf("://") > 0) {
        e = decLongUrl(e);
        if (e.indexOf('http://fs.to/get/play/md5hash') > 0) {
            var parserfs = Main.parser;
			parserfs.split('|');
            c = e.replace("md5hash", getFsToVideo(parserfs[0]));
        } else {
            var g = parser(e, "s_key=");
            c = decLongUrl(GetHash(Main.parser, e, g));
        }

    } else {
        if (e.indexOf("vk.com") > 0 || e.indexOf("vk.com/video_") > 0) {
            c = getVkUrl(e);
        } else {
            if (e.indexOf("youtube.com/watch?v=") > 0) {
                var i = e.substr(e.indexOf("=") + 1);
                c = lrdPr(getYoutubeUrl(i));
            } else {
                if (e.indexOf("rutube.ru/video/") > 0) {
                    c = getRuTubeUrl(e);
                } else {
                    if (e.indexOf("//kino-v-online.ru/kino/md5") > 0 || e.indexOf("//kino-v-online.ru/serial/md5") > 0) {
                        var b = API.Request("http://kino-v-online.ru/2796-materik-online-film.html");
                        c = e.replace("md5hash", parser(b, "/kino/", "/"));
                    } else {
                        if (e.indexOf("kinoprosmotr.net/") > 0) {
                            var b = API.Request(e);
                            c = dSp(parser(b, ";file=", ".flv").replace(/\x5cn/, "") + ".flv");
                        } else {
                            if (e.indexOf("//vtraxe.com/") > 0) {
                                var b = API.Request(e);
                                b = parser(b, "3Fv=", "&");
                                c = API.Request("http://gegen-abzocke.com/xml/nstrim/uletno/code.php?code_url=" + b);
                            } else {
                                if (e.indexOf("kino-dom.tv/s/md5") > 0) {
                                    var b = API.Request("http://kino-dom.tv/drama/1110-taynyy-krug-the-sesret-sirsle-1-sezon-1-seriya-eng-onlayn.html");
                                    c = e.replace("md5hash", parser(b, "file=http://kino-dom.tv/", "/play/"));
                                } else {
                                    if (e.indexOf("linecinema.org/s/md5") > 0) {
                                        var b = API.Request("http://www.linecinema.org/newsz/boevyk-online/508954-bliznecy-drakony-twin-dragons-1992-dvdrip-onlayn.html");
                                        c = e.replace("md5hash", parser(b, "linecinema.org/s/", "/"));
                                    } else {
                                        if (e.indexOf(".igru-film.net/") > 0) {
                                            var b = parser(e, "xyss", "xys");
                                            e = parser(e, "ssa", "xyss");
                                            b = API.Request("http://fepcom.net/" + b);
                                            b = parser(b, ";file=", "&");
                                            b = API.Request("http://gegen-abzocke.com/xml/nstrim/fepcom/code.php?code_url=" + b);
                                            c = e.replace("md5hash", b);
                                        } else {
                                            if (e.indexOf("kinoylei.ru/video/") > 0) {
                                                var b = API.Request("http://kinoylei.ru/load/zhanry/boevik/otstavnik_2/38-1-0-2280");
                                                b = parser(b, '"myvideo" src="', '">');
                                                b = API.Request(b);
                                                b = parser(b, "--", '"');
                                                c = e.replace("md5hash", b);
                                            } else {
                                                if (e.indexOf("nowfilms.ru/video/md5hash") > 0) {
                                                    var b = parser(e, "xyss", "xys");
                                                    e = parser(e, "ssa", "xyss");
                                                    b = API.Request("http://" + b);
                                                    var a = parser(b, ";pl=", '"');
                                                    if (a.indexOf("/tmp/") > 0) {
                                                        b = API.Request(a);
                                                        a = parser(e, "/md5hash/", "xys");
                                                        if (b.indexOf(a) > 0) {
                                                            var f = b.substr(b.indexOf(a) - 23, 22);
                                                            c = e.replace("md5hash", f);
                                                        }
                                                    } else {
                                                        c = parser(b, ";file=", '"');
                                                    }
                                                } else {
                                                    if (e.indexOf("//77.120.119") > 0) {
                                                        e = API.Request(e);
                                                        e = parser(e, 'file":"', '"');
                                                        c = API.Request("http://gegen-abzocke.com/xml/nstrim/liveonline/code.php?code_url=" + e);
                                                    } else {
                                                        if (e.indexOf("uletno.info/") > 0) {
                                                            e = API.Request(e);
                                                            e = parser(e, 'file":"', '"');
                                                            c = API.Request("http://gegen-abzocke.com/xml/nstrim/uletno/code.php?code_url=" + e);
                                                        } else {
                                                            if (e.indexOf("//kinostok.tv/video/") > 0) {
                                                                e = API.Request(e);
                                                                e = parser(e, 'file: "', '"');
                                                                c = API.Request("http://gegen-abzocke.com/xml/nstrim/kinostok/code.php?code_url=" + e);
                                                            } else {
                                                                if (e.indexOf("/streaming.video.") > 0) {
                                                                    var b = parser(e, "get-location/", "/m");
                                                                    b = API.Request("http://static.video.yandex.ru/get-token/" + b + "?nc=0.50940609164536");
                                                                    b = parser(b, "token>", "</token>");
                                                                    b = API.Request(e.replace("md5hash", b));
                                                                    c = parser(b, "video-location>", "</video-location>").replace("&amp;", "&");
                                                                } else {
                                                                    if (e.indexOf("/video.sibnet.ru") > 0) {
                                                                        var b = API.Request(e);
                                                                        b = b.replace("&amp;", "&");
                                                                        c = parser(b, "<file>", "</file>");
                                                                    } else {
                                                                        if (e.indexOf("filmix.net/s/md5hash") > 0 || e.indexOf("filevideosvc.org/s/md5hash") > 0) {
                                                                            var b = API.Request("http://filmix.net/semejnyj/36974-tor-legenda-vikingov-legends-of-valhalla-thor-2011.html");
                                                                            b = parser(b, ";file=", ";vast_preroll").replace("&amp", "");
                                                                            b = API.Request("http://gegen-abzocke.com/xml/nstrim/filmix/code.php?code_url=" + b);
                                                                            c = e.replace("md5hash", b);
                                                                        } else {
                                                                            if (e.indexOf("http://streaming2.video.yandex.ru") >= 0) {
                                                                                c = e.replace("streaming2", "streaming");
                                                                            } else {
                                                                                if (e.indexOf("bigcinema.tv") > 0) {
                                                                                    var b = API.Request("http://bigcinema.tv/movie/prometey---prometheus.html");
                                                                                    b = parser(b, 'file:"', '"');
                                                                                    b = API.Request("http://gegen-abzocke.com/xml/nstrim/bigcinema/code.php?code_url=" + b);
                                                                                    c = e.replace("md5hash", b);
                                                                                } else {
                                                                                    if (e.indexOf("allserials.tv/s/md5") > 0) {
                                                                                        var b = API.Request("http://allserials.tv/serial-2166-osennie-cvety-1-sezon.html");
                                                                                        c = e.replace("md5hash", parser(b, ".tv/pl/", "/"));
                                                                                    } else {
                                                                                        if (e.indexOf("kinopod.org/get/md5") > 0) {
                                                                                            var b = API.Request("http://kinopod.ru/video.html?id=22110");
                                                                                            c = e.replace("md5hash", parser(b, "/get/", "/"));
                                                                                        } else {
                                                                                            if (e.indexOf("allinspace.com/") > 0) {
                                                                                                e = parser(e, "&", "&&");
                                                                                                e = API.Request(e);
                                                                                                c = parser(e, "<td width=80px ><a href='", "' > Download </a>");
                                                                                            } else {
                                                                                                if (e.indexOf("77.91.77") > 0) {
                                                                                                    var b = API.Request("http://inetcom.tv/channel/russia_1");
                                                                                                    c = e + "?sid=" + parser(b, "?sid=", "'");
                                                                                                } else {
                                                                                                    if (e.indexOf("watchcinema.ru") > 0) {
                                                                                                        e = API.Request(e);
                                                                                                        e = parser(e, '<iframe src="', '"');
                                                                                                        e = e.replace("&amp;", "&").replace("//vkontakte.ru/", "//vk.com/");
                                                                                                        e = API.Request(e);
                                                                                                        e = parser(e, 'src="http://www.youtube.com/embed/', "?");
                                                                                                        c = getYoutubeUrl(e);
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return c;
}