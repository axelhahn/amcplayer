/***********************************************************************
 
 amcPlayer ... Axels Multi Channel Player
 
 There are tons of html5 audio players around but I needed a special
 feature: I wanted to play a song which is available in stereo and
 5.1 surround with a single playlist item and switch between them.
 
 --------------------------------------------------------------------------------
 
 This player is unter development but very close to 1.0 :-)
 
 --------------------------------------------------------------------------------
 
 License: GPL 3.0 - http://www.gnu.org/licenses/gpl-3.0.html
 THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE 
 LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR 
 OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, 
 EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE 
 ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. 
 SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY 
 SERVICING, REPAIR OR CORRECTION.
 
 --------------------------------------------------------------------------------
 project home:
 https://www.axel-hahn.de/amcplayer
 http://sourceforge.net/p/amcplayer/
 
 docs:
 https://www.axel-hahn.de/docs/amcplayer/index.htm
 
 --------------------------------------------------------------------------------
 
 */


/** 
 * mcPlayer ... Multi Channel Player
 * 
 * @author    Axel Hahn
 * @version   0.31
 *
 * @this mcPlayer
 * 
 * @example
 * oMcPlayer=new mcPlayer();
 * oMcPlayer.init();     // draw player gui
 * oMcPlayer.minimize(); // ... and hide the gui
 * 
 * @constructor
 * @return nothing
 */
var mcPlayer = function () {

    // settings
    this.cfg = {
        about: {
            version: '0.31',
            label: 'AMC Player - v0.31',
            description: '<strong>A</strong>xels <strong>M</strong>ulti <strong>C</strong>hannel <strong>Player</strong>.<br><br>This is a webbased HTML5 player.<br>It\'s focus is the handling of media in stereo and surround for a title.',
            labeldownload: 'Download:<br>',
            download: 'http://sourceforge.net/projects/amcplayer/files/latest/download',
            labellicense: 'License: ',
            license: 'GPL 3.0',
            labelurl: 'Project url:<br>',   
            url: 'https://github.com/axelhahn/amcplayer/',
            labeldocurl: 'Documentation:<br>',
            docurl: 'https://www.axel-hahn.de/docs/amcplayer/index.htm'
        },
        links: {
            play: {
                title: 'play'
            }
        },
        aPlayer: {
            buttons: {
                // 
                // player controls
                //
                play: {
                    sticky: true,
                    title: 'Play'
                },
                pause: {
                    sticky: true,
                    title: 'Pause'
                },
                stop: {
                    sticky: true,
                    title: 'Stop'
                },
                backward: {
                    sticky: false,
                    title: 'Back'
                },
                forward: {
                    sticky: false,
                    title: 'Forward'
                },
                jumpprev: {
                    sticky: false,
                    title: 'Previous title'
                },
                jumpnext: {
                    sticky: false,
                    title: 'Next title'
                },
                audiochannels: {
                    title: 'switch between stereo/ surround',
                    noswitch: 'stereo/ surround switch was deactivated (Opera, Firefox)'
                },
                // 
                // volume buttons
                //
                volmute: {
                    visible: true,
                    title: 'Mute'
                },
                volfull: {
                    visible: true,
                    title: 'Max. volume'
                },
                // 
                // other buttons
                //
                about: {
                    visible: true,
                    title: 'about ...',
                    box: 'mcpabout'
                },
                playlist: {
                    visible: true,
                    title: 'Toggle playlist',
                    box: 'mcpplaylist'
                },
                repeat: {
                    visible: true,
                    title: 'Repeat'
                },
                shuffle: {
                    visible: true,
                    title: 'Shuffle'
                },
                download: {
                    visible: true,
                    title: 'Toggle download list',
                    box: 'mcpdownloads'
                },
                maximize: {
                    label: 'Player',
                    sticky: false,
                    title: 'Show player'
                },
                minimize: {
                    label: '',
                    sticky: false,
                    title: 'Minimize'
                }
            },
            bars: {
                volume: {
                    visible: true,
                    title: 'Set volume'
                },
                progress: {
                    visible: true,
                    title: 'Set position'
                }
            },
            about: {
                title: 'About ...'
            },
            playlist: {
                title: 'Playlist'
            },
            download: {
                title: 'Download audio files',
                noentry: 'Select or play an audio first to show its downloads.'
            },
            songinfo: {
                bpm: 'bpm'
            }
        },
        settings:{
            autoopen: false,
            movable: 1,       // v0.26
            repeatlist: 1,
            showsonginfos: 1, // v0.29
            showhud: 1,       // v0.30
            shuffle: 0,
            volume: 0.9
        }
    };

    this.oAudio = false;           // current audio object
    this.sCurrentChannel = false;  // current audio - one of false | "2.0"| "5.1"
    this.iMaxVol = 1;

    this.iCurrentTime = false;     // aktuelle Abspielposition - bei Wechsel der Audioquelle
    this.bIsFading = false;        // Flag: erfolgt gerade ein X-Fading?

    this.iVolInc = 0.02;           // X-Fading: Schrittweite der Lautstaerke-Aenderung 
    this.iTimer = 20;              // X-Fading: Intervall der Lautstaerke-Aenderung 

    this.iHudTimer = 5;            // time to display hud message in s
    this.iRemoveTimer = 2;


    // get playlist of all audiotags of the current document
    this.aPL = [];
    this.iCurrentSong = -1;
    this.aPlayorderList = [];
    this.iPlaylistId = -1;
    // this.PlIndex = -1;
    
    // this.bRepeatPlaylist = 1;
    // this.bRepeatSong = false;

    
    this.name = false;

    this.playlink = '[title]';


// **********************************************************************


    /**
     * Check: does the browser support 5.1 channels?<br>
     * older Opera versions: no<br>
     * all other: Yes<br>
     * <br>
     * TODO: scan for tablets and mobile devices.
     * 
     * @return {boolean}
     */
    this.canPlaySurround = function () {
        var bReturn = true;
        // if (navigator.userAgent.indexOf("Gecko/")>=0) bReturn=false;
        if (navigator.userAgent.indexOf("Presto/") >= 0)
            bReturn = false;
        // TODO: tablets and other (mobile, ...) devices
        this.bCanSurround = bReturn;
        return bReturn;
    };
    
    // ----------------------------------------------------------------------
    /**
     * scan AUDIO tags and its sources in a document to create an
     * object with all current songs
     * @private
     * @return {Array}
     */
    this._scanAudios = function () {
        var oAudioList = document.getElementsByTagName("AUDIO");
        var a = new Array();
        var aSource = false;
        var sChannels = false;
        var aSong = false;
        var o = false;
        for (var i = 0; i < oAudioList.length; i++) {
            oAudioList[i].style.display = "none";
            aSong = {
                title: oAudioList[i].dataset.title 
                    ? oAudioList[i].dataset.title 
                    : oAudioList[i].title 
                        ? oAudioList[i].title 
                        : 'audio #' + (i + 1)
                    ,
                artist: oAudioList[i].dataset.artist ? oAudioList[i].dataset.artist : false,
                album:  oAudioList[i].dataset.album  ? oAudioList[i].dataset.album  : false,
                year:   oAudioList[i].dataset.year   ? oAudioList[i].dataset.year   : false,
                image:  oAudioList[i].dataset.image  ? oAudioList[i].dataset.image  : false,
                genre:  oAudioList[i].dataset.genre  ? oAudioList[i].dataset.genre  : false,
                bpm:    oAudioList[i].dataset.bpm    ? oAudioList[i].dataset.bpm    : false,
                url:    oAudioList[i].dataset.url    ? oAudioList[i].dataset.url    : false,
                sources: {}
            };
            for (var j = 0; j < oAudioList[i].children.length; j++) {
                o = oAudioList[i].children[j];
                if (o.tagName === "SOURCE") {
                    sChannels = "any";
                    // if (o.dataset && o.dataset.ch)sChannels=o.dataset.ch;
                    if (o.title){
                        sChannels = o.title;
                    }
                    aSource = {
                        src: o.src,
                        type: o.type
                    };
                    if (!aSong["sources"][sChannels])
                        dummy = aSong["sources"][sChannels] = new Array();
                    dummy = aSong["sources"][sChannels].push(aSource);
                }
            }
            // a.push(aSong);
            this.addAudio(aSong);

            var newA = document.createElement("A");
            newA.href = '#';
            newA.title = this.cfg.links.play.title + ': ' + aSong.title;
            // newA.innerHTML= this.playlink.replace('[title]', sTitle);
            newA.innerHTML = this.playlink.replace('[title]', "");
            newA.setAttribute('onclick', this.name + '.setSong(' + i + '); /* ' + this.name + '.maximize(); */ return false;');
            newA.setAttribute('class', 'songbtn icon-play');
            newA.setAttribute('id', 'mcpaudioPlay' + i);
            oAudioList[i].parentNode.appendChild(newA);
        }
        return a;
    };


    // ----------------------------------------------------------------------
    /**
     * add a song to the playlist
     * @example
     *      {
     *       "title": "Ticker",
     *       "sources": {
     *         "2.0": [
     *           {
     *             "src": "https://www.axel-hahn.de/axel/download/ticker_2.0_.ogg",
     *             "type": "audio/ogg"
     *           },
     *           {
     *             "src": "https://www.axel-hahn.de/axel/download/ticker_2.0_.mp3",
     *             "type": "audio/mp3"
     *           }
     *         ],
     *         "5.1": [
     *           {
     *             "src": "https://www.axel-hahn.de/axel/download/ticker_5.1_.m4a",
     *             "type": "audio/mp4"
     *           },
     *           {
     *             "src": "https://www.axel-hahn.de/axel/download/ticker_5.1_.ogg",
     *             "type": "audio/ogg"
     *           }
     *         ]
     *       }
     *     }
     * @param {array} aSong
     * @returns {Boolean}
     */
    this.addAudio = function (aSong) {
        if(!aSong["sources"]){
             return false;
        }
        if (!aSong.title){
            aSong.title='audio ' + (this.aPL.length + 1);
        }
        this.aPL.push(aSong);
        this._generatePlayorder();
    };


    // ----------------------------------------------------------------------
    /**
     * get default html code of player controls
     * @private
     * @return {html_code} 
     */
    this._genPlayer = function () {
        var s = '';

        s += '<div id="mcpplayersonginfo"></div>';
        // add buttons
        var aTmp = new Array("play", "pause", "stop", "backward", "forward");
        if (this.aPL.length>1) {
            aTmp.push("jumpprev", "jumpnext");
        }
        s += '<div id="mcpplayerbtndiv">';
        for (var i = 0; i < aTmp.length; i++) {
            s += '<a href="#" id="mcp' + aTmp[i] + '" onclick="'
                + '' + this.name + '.playeraction(\'' + aTmp[i] + '\'); return false;'
                + '" title="' + this.cfg.aPlayer.buttons[aTmp[i]].title + '"></a>';
        }
        s += '</div>'
        
    
            + '<div id="mcpprogressdiv"'
                + (this.cfg.aPlayer.bars["progress"].visible ? '' : 'style="display: none"')
                + '><canvas id="mcpprogresscanvas" title="' + this.cfg.aPlayer.bars["progress"].title + '"></canvas>'
                + '<div id="mcpprogressbar"></div>'
            + '</div>'
            + '<span id="mcptime"><span id="mcptimeplayed">-:--</span>/ <span id="mcptimetotal">-:--</span></span>'
    
            + '<div id="mcpvolumediv" title="volume">'
                + '<a href="#" id="mcpvolmute" onclick="' + this.name + '.setVolume(0); return false;" ' 
                + (this.cfg.aPlayer.buttons["volmute"].visible ? '' : 'style="display: none" ')
                + 'title="' + this.cfg.aPlayer.buttons["volmute"].title + '"></a>'

                + '<canvas id="mcpvolumecanvas" ' 
                + (this.cfg.aPlayer.bars["volume"].visible ? '' : 'style="display: none" ')
                + 'title="' + this.cfg.aPlayer.bars["volume"].title + '"></canvas>'

                + '<a href="#" id="mcpvolfull" onclick="' + this.name + '.setVolume(1); return false;" ' 
                + (this.cfg.aPlayer.buttons["volfull"].visible ? '' : 'style="display: none" ')
                + 'title="' + this.cfg.aPlayer.buttons["volfull"].title + '"></a>'
            + '</div>'
            
            + '<div id="mcpchannels"></div>'

            + '<div id="mcpoptions">'
            ;            
                // TODO: fill me with life
                s+='<a href="#" onclick="'+this.name+'.toggleRepeat(); return false;" id="mcpoptrepeat" '
                    + (this.isRepeatlist() ? 'class="active" ' : '')
                    + 'title="'+this.cfg.aPlayer.buttons["repeat"].title+'"></a>'
                    + '<a href="#" onclick="'+this.name+'.toggleShuffle(); return false;" id="mcpoptshuffle" '
                    + (this.cfg.settings.shuffle ? 'class="active" ' : '')
                    + 'title="'+this.cfg.aPlayer.buttons["shuffle"].title+'"></a>'
                    ;
                var aBtn=['download', 'playlist', 'about'];
                for (var i=0; i<aBtn.length; i++) {
                    idLink='mcpopt'+aBtn[i];
                    s += '<a href="#" onclick="' + this.name + '.toggleBoxAndButton(\''+aBtn[i]+'\'); return false;" id="mcpopt'+aBtn[i]+'" '
                        + (this.cfg.aPlayer.buttons[aBtn[i]].visible ? '' : 'style="display: none" ')
                        + ' title="' + this.cfg.aPlayer.buttons[aBtn[i]].title + '"></a>'
                        ;
                }
            s += '</div>';

        return s;
    };

    // ----------------------------------------------------------------------
    /**
     * generate html code for about box
     * @private
     * @return {html_code} 
     */
    this._genAboutbox = function () {

        return '<div class="mcpbox">' 
            + this.cfg.aPlayer.about.title + ''
            + '<span class="mcpsystembutton"><a href="#" class="icon-down-open-1" onclick="' + this.name + '.toggleBoxAndButton(\'about\', \'minimize\'); return false;" title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a></span></div><div>'
            + '<div class="title">' + this.cfg.about.label + '</div>'
            + '<p>' + this.cfg.about.description + '</p><hr>'
            + '<p>' + this.cfg.about.labellicense + '' + this.cfg.about.license + '</p>'
            + '<p>' + this.cfg.about.labelurl + '<a href="' + this.cfg.about.url + '" target="_blank">' + this.cfg.about.url + '</a></p>'
            + '<p>' + this.cfg.about.labeldownload + '<a href="' + this.cfg.about.download + '" target="_blank">' + this.cfg.about.download + '</a></p>'
            + '<p>' + this.cfg.about.labeldocurl + '<a href="' + this.cfg.about.docurl + '" target="_blank">' + this.cfg.about.docurl + '</a></p>'
            + '</div>';
    };

    // ----------------------------------------------------------------------
    /**
     * generate html code for the playlist
     * @private
     * @return {html_code} 
     */
    this._genPlaylist = function () {

        var sHtmlPL = ''
            + '<div class="mcpbox">' + this.cfg.aPlayer.playlist.title + ''
            + '<span class="mcpsystembutton">'
                + '<a href="#" class="icon-down-open-1" onclick="' + this.name + '.toggleBoxAndButton(\'playlist\', \'minimize\'); return false;" '
                    + 'title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a>'
            + '</span>'
            + '</div>'
            ;
        if (this.aPL.length > 0) {
            sHtmlPL += '<ul>';
            for (var i = 0; i < this.aPL.length; i++) {
                sHtmlPL += '<li' 
                        + (this.iCurrentSong === i ? ' class="active"' : '')
                        + '><a href="#" onclick="' + this.name + '.setSong(' + i + '); return false;">' 
                        + (this.aPL[i]["title"] ? this.aPL[i]["title"] : "Audio #" + (i + 1))
                        + '</a></li>';
            }
            sHtmlPL += '</ul>';
        }
        return sHtmlPL;
    };
    /**
     * generate html code details of then current song
     * @private
     * @return {html_code} 
     */
    this._genSonginfos = function () {

        if(!this.cfg.settings.showsonginfos){
            return '';
        }
        var sHtml = '';
        if (
            this.getSongImage()
            +this.getSongArtist()
        ){
            sHtml += '<div>';
            sHtml += this.getSongImage()  ? '<img src="'+this.getSongImage()+'">' : '';
            sHtml += this.getSongTitle()  ? '<div class="title">'+this.getSongTitle()+'</div>' : '';
            sHtml += this.getSongArtist() ? '<div class="artist">'+this.getSongArtist()+'</div>' : '';
            sHtml += this.getSongAlbum()  ? '<div class="album">'+this.getSongAlbum()+'</div>' : '';
            sHtml += this.getSongYear()   ? '<div class="year">'+this.getSongYear()+'</div>' : '';
            sHtml += this.getSongBpm()    ? '<div class="bpm">'+this.getSongBpm()+this.cfg.aPlayer.songinfo.bpm+'</div>' : '';
        
            // TODO:
            // this.getSongGenre()
            // this.getSongUrl()
        
            sHtml += '<div style="clear: both;"></div>';
            sHtml += '</div>';
        }
        
        return sHtml;
    };


    // ----------------------------------------------------------------------
    /**
     * scan AUDIO tags and its sources in a document to create an
     * object with all current songs
     * @private
     * @return {html_code} 
     */
    this._genDownloads = function () {
        var sHtml = '';

        if (this.aPL.length > 0) {
            sHtml += '<div class="mcpbox">' + this.cfg.aPlayer.download.title + ''
                + '<span class="mcpsystembutton"><a href="#" class="icon-down-open-1" onclick="' + this.name + '.toggleBoxAndButton(\'download\', \'minimize\'); return false;" '
                    +'title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a>'
                + '</span>'
                + '</div>'
                + '<ul>'
                ;
            if(this.iCurrentSong===-1){
                sHtml += '<li>' + this.cfg.aPlayer.download.noentry + '</li>';
            } else {
                for (var i = 0; i < this.aPL.length; i++) {
                    sSong = this.aPL[i]["title"];
                    if (!sSong){
                        sSong = "Audio #" + (i + 1);
                    }
                    if(this.iCurrentSong===-1 || this.iCurrentSong==i){
                        sHtml += '<li '
                            + (this.iCurrentSong==i ? ' class="active"' : '')
                            +'>' + sSong 
                            + '<ul>'
                            ;
                        for (var sChannel in this.aPL[i]["sources"]) {
                            sHtml += '<li>' + sChannel + ': ';
                            for (j = 0; j < this.aPL[i]["sources"][sChannel].length; j++) {
                                sSrc = this.aPL[i]["sources"][sChannel][j]["src"];
                                sExt = this.aPL[i]["sources"][sChannel][j]["type"].replace('audio/', '');
                                // sExt='';
                                if (!sExt)
                                    sExt = this.aPL[i]["sources"][sChannel][j]["src"].replace(/^.*\/|\.[^.]*$/g, '');

                                sHtml += (j>0 ? ' | ' : '')
                                            +'<a href="' + this.aPL[i]["sources"][sChannel][j]["src"] 
                                        + '" title="'+sSong+' ('+sChannel+'; '+sExt+')'+"\n"+this.aPL[i]["sources"][sChannel][j]["src"]+'"'
                                        +'>' + sExt + '</a>';
                            }
                            sHtml += '</li>';
                        }
                        sHtml += '</ul></li>';
                    }
                }
            }
            sHtml += '</ul>';
        }
        return sHtml;
    };
    
    /**
     * read all audio tags in the page and create playlist
     * @private
     * @returns {undefined}
     */
    this._generatePlaylist = function () {    
        // this.aPL = this._scanAudios(); 
        this._scanAudios(); 
        this._generatePlayorder();
    };

    /**
     * helper function for generatePlayorder; shuffle javascript array
     * @private
     * @param {type} a
     * @param {type} b
     * @returns {Number}
     */
    this._randomSort = function (a,b) {
        return( parseInt( Math.random()*10 ) %2 );
    };

    /**
     * update playorder list with/ without shuffling
     * @private
     * @returns {undefined}
     */
    this._generatePlayorder = function () {
        this.aPlayorderList=[];
        if (this.aPL.length){
            for (var i=0; i<this.aPL.length; i++){
                this.aPlayorderList[i]=i;
            }
            if(this.isShuffled()){
                // on shuffling: current song will be the first element
                if (this.iCurrentSong>=0){
                    this.aPlayorderList.splice(this.iCurrentSong, 1);
                }
                this.aPlayorderList.sort(this._randomSort);
                if (this.iCurrentSong>=0){
                    this.aPlayorderList.unshift(this.iCurrentSong);
                }
            }
            this._findPlaylistId();
        }
    };
    
    // ----------------------------------------------------------------------
    /**
     * get id in the playlist that matches the current song id
     * @private
     * @returns {Number|Boolean}
     */
    this._findPlaylistId = function (){
        this.iPlaylistId=false;
        if (this.iCurrentSong>=0){
            for (var i=0; i<this.aPlayorderList.length; i++){
                if (this.aPlayorderList[i]===this.iCurrentSong){
                    this.iPlaylistId=i;
                }
            }
        }
        return this.iPlaylistId;
    };

    // ----------------------------------------------------------------------
    /**
     * init html code of the player - by creating all missing elements
     * @private
     * @return nothing
     */
    this._initHtml = function () {

        var styleTop=' style="top: '+((document.documentElement.clientHeight + 100)+'px')+';"';
        this.oDivDownloads = document.getElementById("mcpdownloads");
        if (!this.oDivDownloads) {
            document.getElementsByTagName("BODY")[0].innerHTML += '<div id="mcpdownloads" class="draggable saveposition"'+styleTop+'></div>';
            this.oDivDownloads = document.getElementById("mcpdownloads");
        }
        this.oDivDownloads.innerHTML = this._genDownloads();

        this.oDivPlaylist = document.getElementById("mcpplaylist");
        if (!this.oDivPlaylist) {
            // this.oDivPlayerwrapper.innerHTML+='<div id="mcpplaylist"></div>';
            document.getElementsByTagName("BODY")[0].innerHTML += '<div id="mcpplaylist" class="draggable saveposition"'+styleTop+'></div>';
            this.oDivPlaylist = document.getElementById("mcpplaylist");
        }
        this.oDivPlaylist.innerHTML = this._genPlaylist();


        this.oDivPlayerwrapper = document.getElementById("mcpwrapper");
        if (!this.oDivPlayerwrapper) {
            document.getElementsByTagName("BODY")[0].innerHTML += '<div id="mcpwrapper"'+(this.cfg.settings.movable ? 'class="draggable saveposition"' :'')+'></div>';
            this.oDivPlayerwrapper = document.getElementById("mcpwrapper");
        }
        this.oDivHeader = document.getElementById("mcpheader");
        if (!this.oDivHeader) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcpheader" class="mcpbox">' + this.cfg.about.label + ' <span id="mcptitle"></span><span class="mcpsystembutton"><a href="#" class="icon-down-open-1" onclick="' + this.name + '.minimize(); return false" title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a></span></div>';
        }

        if (!this.oDivAudios) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcpplayeraudios"></div>';
            this.oDivAudios = document.getElementById("mcpplayeraudios");
        }
        this.oDivPlayer = document.getElementById("mcplayer");
        if (!this.oDivPlayer) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcplayer"></div>';
            this.oDivPlayer = document.getElementById("mcplayer");
            this.oDivPlayer.innerHTML = this._genPlayer();
        }
        this.oDivFooter = document.getElementById("mcpfooter");
        if (!this.oDivFooter) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcpfooter">' + this.about + '</div>';
        }
        this.oAPlayermaximize = document.getElementById("mcpmaximize");
        if (!this.oAPlayermaximize) {
            document.getElementsByTagName("BODY")[0].innerHTML += '<a href="#" id="mcpmaximize" class="mcpsystembutton hidebutton" onclick="' + this.name + '.maximize(); return false" title="' + this.cfg.aPlayer.buttons["maximize"].title + '">' + this.cfg.aPlayer.buttons["maximize"].label + '</a>';
            this.oAPlayermaximize = document.getElementById("mcpmaximize");
        }        
        document.getElementsByTagName("BODY")[0].innerHTML += '<div id="mcpabout" class="draggable saveposition"'+styleTop+'>' + this._genAboutbox() + '</div>';
        this.oDivPlayerhud = document.getElementById("mcphud");
        if (!this.oDivPlayerhud) {
            document.getElementsByTagName("BODY")[0].innerHTML += '<div id="mcphud"></div>';
            this.oDivPlayerhud = document.getElementById("mcphud");
        }
        
    };

    // ----------------------------------------------------------------------
    /**
     * minimize player GUI and show a maximize icon
     * @example
     * &lt;a href="#" onclick="oMcPlayer.minimize(); return false;"&gt;hide player&lt;/a&gt;
     * @return nothing
     */
    this.minimize = function () {
        o = document.getElementById("mcpwrapper");
        // o.className += ' minimized';
        // o.setAttribute('style','');
        o.style.top=(document.documentElement.clientHeight + 100) + 'px';

        this.minimizeBox('about');
        this.minimizeBox('download');
        this.minimizeBox('playlist');

        document.getElementById("mcpmaximize").className = '';
    };

    // ----------------------------------------------------------------------
    /**
     * set if make the main player window is movable.
     * This method is useful if you added drag and drop support (addi.min.js)
     * for the windows but the main player is fixed on the bottom.
     * 
     * @param {boolean} bMove  flag true/ false
     * @returns {undefined}
     */
    this.makeMainwindowMovable = function(bMove) {
        this.cfg.settings.movable=bMove;
        o=document.getElementById("mcpwrapper");
        if(this.cfg.settings.movable){
            o.className='draggable saveposition';
            if (typeof addi !== 'undefined') {
                addi.initDiv(o);
            } else {
                this.cfg.settings.movable=false;
            }
        }
        if(!this.cfg.settings.movable){
            o.className='';
            if (typeof addi !== 'undefined') {
                addi.resetDiv(o);
            }
            this.maximize(); 
            o.setAttribute('style', '');
            
        }
    };
    // ----------------------------------------------------------------------
    /**
     * show/ maximize the player GUI
     * @example
     * &lt;a href="#" onclick="oMcPlayer.maximize(); return false;"&gt;show the player&lt;/a&gt;
     * 
     * @return nothing
     */
    this.maximize = function () {
        o = document.getElementById("mcpwrapper");
        o.setAttribute('style','');
        if (this.cfg.settings.movable && typeof addi !== 'undefined') {
            addi.load(document.getElementById("mcpwrapper"));
        }
        document.getElementById("mcpmaximize").className = 'hidebutton';
    };


    // ----------------------------------------------------------------------
    /**
     * show info in HUD div if 
     * - option showhud was set
     * - option autoopen is false
     * - player is invisible (minimized) 
     * 
     * @private
     * @param  {string}  sMsg  message to show in hud
     * @return {boolean}
     */
    this._showInfo = function (sMsg) {
        if (!this.cfg.settings.showhud || this.cfg.settings.autoopen || this.isVisiblePlayer() ){
            return false;
        }
        var o = document.getElementById("mcphud");
        this.iRemoveTimer = this.iHudTimer * 1000;
        o.className = 'active';
        o.innerHTML = sMsg;
        this._decHudTimer();
        return true;
    };


    // ----------------------------------------------------------------------
    /**
     * hide HUD div
     * @private
     * @return nothing
     */
    this._hideInfo = function () {
        var o = document.getElementById("mcphud");
        o.className = '';
        return true;
    };

    // ----------------------------------------------------------------------
    /**
     * decrease time to display HUD; if it is zero then call hideInfo()
     * @private
     * @return nothing
     */
    this._decHudTimer = function () {
        this.iRemoveTimer = this.iRemoveTimer - 100;
        // this.showInfo(this.iRemoveTimer);
        if (this.iRemoveTimer > 0) {
            window.setTimeout(this.name + "._decHudTimer()", 100);
        } else {
            this._hideInfo();
            this.iRemoveTimer = false;
        }
    };
    
    // ----------------------------------------------------------------------
    /**
     * helper function for visible boxes
     * @see toggleBoxAndButton()
     * @see isVisible()
     * @private
     * @param {string}  sBaseId    sBaseId of the div and the button; one of download|playlist|about
     * @return {boolean}
     */
    this._togglehelperGetDiv = function (sBaseId) {
        return (this.cfg.aPlayer.buttons[sBaseId] && this.cfg.aPlayer.buttons[sBaseId].box)
            ? document.getElementById(this.cfg.aPlayer.buttons[sBaseId].box)
            : false
            ;      
    };

    /**
     * toggle visibility of a box (download, playlist, about)
     * @param {string}  sBaseId    sBaseId of the div and the button; one of download|playlist|about
     * @param {string}  sMode      optional: force action; one of minimize|maximize; default behaviuor is toggle
     * @return {boolean}
     */
    this.toggleBoxAndButton = function (sBaseId, sMode) {
        var oDiv=this._togglehelperGetDiv(sBaseId);
        
        var oBtn = document.getElementById('mcpopt'+sBaseId);
        if(!sMode){
            sMode=(oBtn.className.indexOf('active')<0 ? 'maximize': 'minimize');
        }
        
        if (sMode==='minimize') {
            if (oDiv) {
                oDiv.style.top=(document.documentElement.clientHeight + 10) + 'px';
                oDiv.style.opacity=0.1;
            }
            if (oBtn) {
                oBtn.className = '';
            }
        } else if (sMode==='maximize') {
            if (oDiv) {
                // oDiv.className += ' visible';
                oDiv.setAttribute('style', '');
                oDiv.style.opacity=1;
                if (typeof addi !== 'undefined') {
                    addi.load(oDiv);
                }
            }
            if (oBtn) {
                oBtn.className = 'active';
            }
        }
        return true;
    };
    
    /**
     * return if a dialog box is visible
     * @param {string}  sBaseId    sBaseId of the div and the button; one of download|playlist|about
     * @returns {Boolean}
     */
    this.isVisibleBox = function (sBaseId){
        // var oDiv=this._togglehelperGetDiv(sBaseId);
        var oBtn = document.getElementById('mcpopt'+sBaseId);
        return !!oBtn.className;
    };
    /**
     * return if about dialog box is visible
     * @returns {Boolean}
     */
    this.isVisibleBoxAbout = function (){
        return this.isVisibleBox('about');
    };
    /**
     * return if download dialog box is visible
     * @returns {Boolean}
     */
    this.isVisibleBoxDownload = function (){
        return this.isVisibleBox('download');
    };
    /**
     * return if playlist dialog box is visible
     * @returns {Boolean}
     */
    this.isVisibleBoxPlaylist = function (){
        return this.isVisibleBox('playlist');
    };
    /**
     * return if player window is visible
     * @since v0.30
     * @returns {Boolean}
     */
    this.isVisiblePlayer = function (){
        return document.getElementById("mcpmaximize").className>'';
    };

    // ----------------------------------------------------------------------
    /**
     * toggle playing option repeat playlist
     * @returns {undefined}
     */
    this.toggleRepeat = function () {
        if (this.isRepeatlist()){
            return this.disableRepeat();
        } else {
            return this.enableRepeat();
        }
    };

    // ----------------------------------------------------------------------
    /**
     * enable playing option repeat playlist
     * @returns {undefined}
     */
    this.enableRepeat = function () {
        this.cfg.settings.repeatlist=true;
        this.toggleBoxAndButton('repeat', 'maximize');
    };
    // ----------------------------------------------------------------------
    /**
     * disable playing option repeat playlist
     * @returns {undefined}
     */
    this.disableRepeat = function () {
        this.cfg.settings.repeatlist=false;
        this.toggleBoxAndButton('repeat', 'minimize');
    };
    
    // ----------------------------------------------------------------------
    /**
     * toggle playing option shuffle playlist
     * @returns {undefined}
     */
    this.toggleShuffle = function () {
        if (this.isShuffled()){
            return this.disableShuffle();
        } else {
            return this.enableShuffle();
        }
    };

    // ----------------------------------------------------------------------
    /**
     * enable playing option shuffle playlist
     * @returns {undefined}
     */
    this.enableShuffle = function () {
        this.cfg.settings.shuffle=true;
        this._generatePlayorder();
        this.toggleBoxAndButton('shuffle', 'maximize');
    };
    // ----------------------------------------------------------------------
    /**
     * disable playing option shuffle playlist
     * @returns {undefined}
     */
    this.disableShuffle = function () {
        this.cfg.settings.shuffle=false;
        this._generatePlayorder();
        this.toggleBoxAndButton('shuffle', 'minimize');
    };

    // ----------------------------------------------------------------------
    /**
     * minimize a box; argument is a base id of a button or div
     * 
     * @example
     * &lt;button onclick="oMcPlayer.minimizeBox('download')">hide Downloads&lt;/button>
     * @param {string}  sBaseId  name of the div ("download" | "playlist" | "about")
     * @return {boolean}
     */
    this.minimizeBox = function (sBaseId) {
        return this.toggleBoxAndButton(sBaseId,'minimize');
    };

    // ----------------------------------------------------------------------
    /**
     * maximize a box; argument is a base id of a button or div
     * @example
     * &lt;button onclick="oMcPlayer.maximizeBox('download')">show Downloads&lt;/button>
     * @param {string}  sBaseId  name of the div ("download" | "playlist" | "about")
     * @return {boolean}
     */
    this.maximizeBox = function (sBaseId) {
        return this.toggleBoxAndButton(sBaseId,'maximize');
    };


    // ----------------------------------------------------------------------
    /**
     * handle actions of the player
     * @exmple
     * &lt;button onclick="oMcPlayer.playeraction('play')">play&lt;/button>
     * @param {string} sAction name of the action ("play" | "pause" | "stop" | "forward" | "backward" | "jumpprev" | "jumpnext")
     * @return nothing
     */
    this.playeraction = function (sAction) {
        if (!this.oAudio) {
            if (sAction === "play") {
                this.setSong(this.aPlayorderList[0]);
            } else {
                return false;
            }
        }

        switch (sAction) {
            case "play":
                this.oAudio.play();
                break;
            case "pause":
                this.oAudio.pause();
                break;
            case "stop":
                this.oAudio.pause();
                try {
                    this.oAudio.currentTime = 0;
                } catch (e) {
                }
                break;
            case "forward":
                this.oAudio.currentTime += 10;
                break;
            case "backward":
                this.oAudio.currentTime -= 10;
                break;
            case "jumpprev":
                this.setPreviousSong();
                break;
            case "jumpnext":
                this.setNextSong();
                break;


            default:
                alert("playeraction not implemented yet: [" + sAction + "]");
        }

        if (this.cfg.aPlayer.buttons[sAction].sticky) {
            var oDiv = document.getElementById("mcpplayerbtndiv");
            var oLI = oDiv.getElementsByTagName("A");
            for (var i = 0; i < oLI.length; i++) {
                oLI[i].className = "";
            }
            document.getElementById("mcp" + sAction).className = "active";
        }
    };

    // ----------------------------------------------------------------------
    /**
     * Set a position of the currently playing audio; 
     * It returns the set position; if there is no audio it retuns false
     * @example 
     * &lt;button onclick="oMcPlayer.setAudioPosition(180.33);">oMcPlayer.setAudioPosition(180.33)&lt;/button>
     * 
     * @param {float}  iTime   new position in seconds
     * @return {boolean}
     */
    this.setAudioPosition = function (iTime) {
        if (!this.sCurrentChannel || this.oAudio.duration < iTime){
            return false;
        }
        return this.oAudio.currentTime = iTime;
    };


    // ----------------------------------------------------------------------
    /**
     * start playing the previous song in playlist (if the current audio is
     * not the first played element)
     * 
     * @example 
     * &lt;button onclick="oMcPlayer.setPreviousSong();">previous song&lt;/button>
     * @return {boolean}
     */
    this.setPreviousSong = function () {
        if (!this.aPlayorderList || !this.aPlayorderList.length) {
            return false;
        }
        if (this.iPlaylistId > 0) {
            return this.setSong(this.aPlayorderList[this.iPlaylistId - 1]);
        }
        // go to last item ... but no randomize
        return this.setSong(this.aPlayorderList[this.aPlayorderList.length -1]);
    };

    // ----------------------------------------------------------------------
    /**
     * play next song in playlist; if the audio is the last element in the
     * playlist the playlist will be shuffled (if shuffling is enabled).
     * It starts the first audio if the playing option "repeat" is enabled.
     * 
     * @example 
     * &lt;button onclick="oMcPlayer.setNextSong();">next song&lt;/button>
     * @return {boolean}
     */
    this.setNextSong = function () {
        if (!this.aPL || !this.aPL.length) {
            return false;
        }
        if (this.iPlaylistId < (this.aPlayorderList.length - 1)) {
            return this.setSong(this.aPlayorderList[this.iPlaylistId + 1]);
        } else {
            // if this.cfg.settings.shuffle is active then shuffle again
            this._generatePlayorder();
            // repeat the list
            if (this.isRepeatlist()){
                this.setSong(this.aPlayorderList[(this.isShuffled() ? 1 : 0)]);
            }
        }
    };

    // ----------------------------------------------------------------------
    /**
     * set a (new) song to play based on the position in document.
     * @see getPlaylist() to get all audios
     * 
     * @example
     * &lt;a href="#" onclick="oMcPlayer.setSong(0); return false;"&gt;first song&lt;/a&gt;
     * &lt;a href="#" onclick="oMcPlayer.setSong(1); return false;"&gt;second song&lt;/a&gt;
     * 
     * @param  {int}  sSongId  number of song to play; the first audio tag in the
     *                         html document has id 0
     * @return {boolean}
     */
    this.setSong = function (sSongId) {

        if (!this.aPL[sSongId]) {
            return false;
        }
        if (this.bIsFading) {
            return false;
        }

        var s = '';
        var sChannels = '';
        var sFirstChannel = false;
        var sLastChannel = false;
        var bLastChannelExist = false;
        var iChannels = 0;

        // stop a current audio
        // TODO: fade out a song (if it was set)
        if (this.oAudio) {
            this.getVolume();
            this.oAudio.pause();
            try {
                this.oAudio.currentTime = 0;
            } catch (e) {
            }
            this.oAudio = false;
        }

        // destroy current audiosources
        this.oDivAudios.innerHTML = '';

        // create audioobjects of new sources
        var audioattributes = '';
        for (var sChannel in this.aPL[sSongId]["sources"]) {
            if (this.aPL[sSongId]["sources"][sChannel].length) {
                if (!sFirstChannel){
                    sFirstChannel = sChannel;
                }
                if (sLastChannel !== sChannel) {

                    iChannels++;
                    sChannels += '<li class';
                    // TODO: use channel from a cookie
                    // if (sFirstChannel==sChannel)sChannels+='="active"';
                    sChannels += '>';
                    // HACK :-/
                    if (this.bCanSurround) {
                        sChannels += '<a href="#" onclick="' + this.name + '.setChannel(\'' + sChannel + '\'); return false;" title="' + this.cfg.aPlayer.buttons.audiochannels.title + ': ' + sChannel + '">' + sChannel + '</a>';
                    } else {
                        sChannels += '<a href="#" onclick="return false;" title="' + this.cfg.aPlayer.buttons.audiochannels.noswitch + '">' + sChannel + '</a>';
                    }
                    // sChannels+='<a href="#" onclick="'+this.name+'.setChannel(\''+sChannel+'\', this); return false;" title="switch channels">'+sChannel+'</a>'
                    sChannels += '</li>';
                    sLastChannel = sChannel;

                    if (sChannel === this.sCurrentChannel){
                        bLastChannelExist = true;
                    }
                }

                s += '<audio id="mcp' + sChannel + '" ' + audioattributes + ' >';
                for (i = 0; i < this.aPL[sSongId]["sources"][sChannel].length; i++) {
                    source = this.aPL[sSongId]["sources"][sChannel][i];
                    // hack for chrome: source must contain a "?"
                    sourcesrc = String(source.src);
                    if (sourcesrc.indexOf("?") < 0)
                        sourcesrc += "?";
                    s += '<source src="' + sourcesrc + '" type="' + source.type + '">';
                }
                s += '</audio>';
            }
        }
        if (iChannels === 1) {
            sChannels = '<li>' + sChannel + '</li>';
        }
        document.getElementById("mcpplayeraudios").innerHTML = s;
        if (sChannels){
            sChannels = '<ul>' + sChannels + '</ul>';
        }
        // if (sLastChannel!=sFirstChannel) 
        document.getElementById("mcpchannels").innerHTML = sChannels;
        this.iCurrentSong = sSongId;
        this._findPlaylistId();
        
        // update playlist: highlight correct song
        document.getElementById("mcpplaylist").innerHTML = this._genPlaylist();
        document.getElementById("mcpdownloads").innerHTML = this._genDownloads();
        
        // show songinfos with adjusting the client height of player window
        var iHeightSonginfosBefore=document.getElementById("mcpplayersonginfo").clientHeight;
        var sSonginfos=this._genSonginfos();
        document.getElementById("mcpplayersonginfo").innerHTML = sSonginfos;
        
        document.getElementById("mcptitle").innerHTML = sSonginfos ? '' : this.getSongTitle();
        var iHeightSonginfosAfter=document.getElementById("mcpplayersonginfo").clientHeight;
        if (typeof addi !== 'undefined') {
            o = document.getElementById("mcpwrapper");
            o.style.top=(o.style.top.replace('px', '')/1)+(iHeightSonginfosBefore-iHeightSonginfosAfter) + 'px';
        }

        // update links in the document
        var oAList = document.getElementsByTagName("A");
        for (var i = 0; i < oAList.length; i++) {
            oLink = oAList[i];
            if (oLink.className === "songbtn icon-play songbtnactive") {
                oLink.className = 'songbtn icon-play';
            }
        }

        o = document.getElementById('mcpaudioPlay' + sSongId).className += ' songbtnactive';


        // play
        this.iCurrentTime = false;

        if (bLastChannelExist) {
            sFirstChannel = this.sCurrentChannel;
        }
        this.sCurrentChannel = false;
        this.setChannel(sFirstChannel);
        this.playeraction("play", true);

        this._showInfo((sSongId + 1) + "/ " + this.aPL.length + "<br>&laquo;" + this.aPL[sSongId]["title"] + "&raquo;");

        if (this.cfg.settings.autoopen){
            this.maximize();
        }

        return true;
    };

    // ----------------------------------------------------------------------
    /**
     * set channels to switch between stereo/ surround
     * @see getAllAudioChannels() to get all valid channels for a song
     * 
     * @param  {string}  sChannelId  number of audiochannels; typically one of "2.0" or "5.1"
     * @return {boolean}
     */
    this.setChannel = function (sChannelId) {
        // Link deaktivieren
        var oDiv = document.getElementById("mcpchannels");
        var oLI = oDiv.getElementsByTagName("LI");
        if (oLI.length){
            for (var i = 0; i < oLI.length; i++) {
                oALI = oLI[i].getElementsByTagName("A");
                if (oALI && oALI.length > 0) {
                    oALI[0].className = "";
                    if (oALI[0].innerHTML && oALI[0].innerHTML === sChannelId) {
                        var oLI2 = oALI[0].parentNode;
                        oALI[0].className = "active";
                    }
                }
                oLI[i].className = "";
            }
        }
        if (oLI2){
            oLI2.className = "active";
        }

        if (this.sCurrentChannel === sChannelId) {
            return false;
        }
        if (this.bIsFading) {
            return false;
        }

        if (this.oAudio) {
            // fade out
            this.iCurrentTime = this.oAudio.currentTime;
            this.getVolume();

            this._fadeOut(this.sCurrentChannel);
            // oAudio.pause();
        }

        this.oAudio = false;
        if (sChannelId) {
            // document.getElementById("lnkaudio"+id).className="active";
            oAudioTmp = document.getElementById("mcp" + sChannelId);
            this.oAudio = oAudioTmp;
            if (this.oAudio) {
                this._wait4Audio(this.oAudio, this.iCurrentTime);

                this.oAudio.volume=this.cfg.settings.volume;

                // add events

                // --------------------------------------------------
                // draw / update progressbar
                // --------------------------------------------------
                oAudioTmp.addEventListener("timeupdate", function () {
                    if (!oAudioTmp.currentTime) {
                        document.getElementById('mcptimeplayed').innerHTML = '-:--';
                        document.getElementById('mcptimetotal').innerHTML = '-:--';
                        return false;
                    }

                    var s = parseInt(oAudioTmp.currentTime % 60);
                    var m = parseInt((oAudioTmp.currentTime / 60) % 60);
                    if (s < 10){
                        s = "0" + s;
                    }
                    var s2 = parseInt(oAudioTmp.duration % 60);
                    var m2 = parseInt((oAudioTmp.duration / 60) % 60);
                    if (s2 < 10){
                        s2 = "0" + s2;
                    }
                    document.getElementById('mcptimeplayed').innerHTML = m + ':' + s;
                    document.getElementById('mcptimetotal').innerHTML = m2 + ':' + s2;

                    var canvas = document.getElementById('mcpprogresscanvas');
                    if (canvas.getContext) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        var iAlpha = 0.05 + oAudioTmp.currentTime / oAudioTmp.duration / 10 * 1;
                        ctx.fillStyle = "rgba(0,0,0, " + iAlpha + ")";
                        var fWidth = Math.round((oAudioTmp.currentTime / oAudioTmp.duration) * (canvas.width));
                        if (fWidth > 0) {
                            ctx.fillRect(0, 0, fWidth, canvas.height);
                            
                            ctx.strokeStyle = "rgba(0,0,0,0.3)";
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(fWidth, 0);
                            ctx.lineTo(fWidth, canvas.height);
                            ctx.stroke();
                        }
                    }

                }, false);

                // --------------------------------------------------
                //set up mouse click to control position of audio
                // --------------------------------------------------
                document.getElementById('mcpprogresscanvas').addEventListener("click", function (event) {
                    var x = new Number();
                    var oWrapper = document.getElementById('mcpwrapper');
                    var oDdiv = document.getElementById('mcpprogressdiv');
                    var canvas = document.getElementById('mcpprogresscanvas');

                    if (event.x !== undefined && event.y !== undefined) {
                        x = event.x;
                    } else {
                        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    }

                    x -= canvas.offsetLeft + oWrapper.offsetLeft + oDdiv.offsetLeft;
                    if (oAudioTmp && oAudioTmp.currentTime) {
                        oAudioTmp.currentTime = oAudioTmp.duration * (x / canvas.clientWidth);
                    }

                }, true);

                // --------------------------------------------------
                // draw / update volumebar
                // --------------------------------------------------
                oAudioTmp.addEventListener("volumechange", function () {
                    var canvasV = document.getElementById('mcpvolumecanvas');
                    
                    if (canvasV.getContext) {
                        var ctxV = canvasV.getContext("2d");
                        ctxV.clearRect(0, 0, canvasV.width, canvasV.height);
                        var iAlpha = 0.05 + oAudioTmp.volume / 10 * 1;
                        ctxV.fillStyle = "rgba(0,0,0, " + iAlpha + ")";
                        var fWidthV = Math.round(oAudioTmp.volume * canvasV.width);
                        if (fWidthV > 0) {
                            ctxV.fillRect(0, 0, fWidthV, canvasV.height);
                            
                            ctxV.strokeStyle = "rgba(0,0,0,0.3)";
                            ctxV.lineWidth = 3;
                            ctxV.beginPath();
                            ctxV.moveTo((fWidthV), 0);
                            ctxV.lineTo(fWidthV, canvasV.height);
                            ctxV.stroke();
                        }
                    }
                    

                }, false);


                // --------------------------------------------------
                //set up mouse click to control volume of audio
                // --------------------------------------------------
                document.getElementById('mcpvolumecanvas').addEventListener("click", function (event) {
                    var x = new Number();
                    var wrapper = document.getElementById("mcpwrapper");
                    var canvas = document.getElementById("mcpvolumecanvas");

                    if (event.x !== undefined && event.y !== undefined) {
                        x = event.x;
                    } else {
                        // Firefox
                        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    }

                    x -= canvas.offsetLeft + wrapper.offsetLeft;
                    try {
                        localStorage.setItem("amcp.volume", x / canvas.clientWidth);
                        oAudioTmp.volume = (x / canvas.clientWidth);
                    } catch (err) {
                        console.error("Error:" + err);
                    }
                }, true);

                oAudioTmp.addEventListener('ended', function () {
                    document.getElementById('mcpjumpnext').click();
                    // mcPlayer.prototype.setNextSong();
                }, false);

            }
        } 

        this.sCurrentChannel = sChannelId;
        localStorage.setItem("amcp.channels", this.sCurrentChannel);

        return true;
    };
    // ----------------------------------------------------------------------
    /**
     * set config; override default vars
     * 
     * @since v0.30
     * @param {array} aCfg  array with config items
     * @return {boolean}
     */
    this.setConfig = function (aCfg){
        this.cfg = realMerge(this.cfg, aCfg);
    }; 
    
    // ----------------------------------------------------------------------
    /**
     * set volume; it works only if a song is playing
     * @example
     * &lt;button onclick="oMcPlayer.setVolume(0.75)">75%&lt;/button>
     * 
     * @param {float} iNewVol volume (0..1)
     * @return {boolean}
     */
    this.setVolume = function (iNewVol) {
        this.cfg.settings.volume = iNewVol;
        localStorage.setItem("amcp.volume", this.cfg.settings.volume);
        if (this.oAudio) {
            this.oAudio.volume = iNewVol;
            // this._fade(iNewVol, this.getAudioChannels());
            return true;
        }
        return false;
    };


    // ----------------------------------------------------------------------
    /**
     * wait for other audio until it reaches the given timestamp
     * @private
     * @param  {audio_object} oAudio       audioobject
     * @param  {integer}      iStartTime   timestamp where to start the audio
     */
    this._wait4Audio = function (oAudio, iStartTime) {

        oAudio.volume = 0.001;
        oAudio.play();

        if (iStartTime){
            oAudio.currentTime = iStartTime;
        }

        // to check: do I reach this?
        /*
         if (Math.abs(oAudio.currentTime-iStartTime)>1) {
         window.setTimeout(this.name+".wait4Audio("+oAudio+", "+iStartTime+")", 100);
         }
         */
        return true;
    };

    // ----------------------------------------------------------------------
    /**
     * fade an audio in or out to a given final volume
     * @private
     * @param  {float}    finalVolume     final volume (0 = muted or 1 = max)
     * @param  {string}   sChannelId      number of audio ... one of "2.0" | "5.1"
     * @return {boolean}
     */
    this._fade = function (finalVolume, sChannelId) {

        this.bIsFading = true;
        o = document.getElementById("mcp" + sChannelId);
        if (!o) {
            return false;
        }
        iVol = o.volume;
        iInc=(finalVolume < iVol ? -this.iVolInc : this.iVolInc);

        iVol += iInc;
        if ((finalVolume === 0 && iVol > 0) || (finalVolume > 0 && iVol < finalVolume)) {
            o.volume = iVol;
            window.setTimeout(this.name + "._fade(" + finalVolume + ", \'" + sChannelId + "\')", this.iTimer);
        } else {
            this.bIsFading = false;
            o.volume = finalVolume;
            if (iVol <= 0) {
                o.pause();
            }
        }
        return true;
    };

    // ----------------------------------------------------------------------
    /**
     * fadeout an audio
     * @private
     * @param  {string}   sChannelId      number of audio ... one of "2.0" | "5.1"
     * @return {boolean}
     */
    this._fadeOut = function (sChannelId) {
        this._fade(0, sChannelId);
    };



// --------------------------------------------------------------------------------
// GETTER
// --------------------------------------------------------------------------------


    // ----------------------------------------------------------------------
    /**
     * get current count of channels of the current song
     * you typically get "2.0" for stereo or "5.1" for surround
     * 
     * @see getAllAudioChannels() to get the available channels of a song
     * 
     * @return {integer}
     */
    this.getAudioChannels = function () {
        return this.sCurrentChannel;
    };
    // ----------------------------------------------------------------------
    /**
     * get an array of valid channels of the current song; if no song is active
     * it returns false.
     * 
     * @return {float}
     */
    this.getAllAudioChannels = function () {
        var oSong=this.getSong();
        if(!oSong){
            return false;
        }
        var aReturn=[];
        for (var sChannel in oSong['sources']){
            aReturn.push(sChannel);
        }
        return aReturn;
    };

    // ----------------------------------------------------------------------
    /**
     * get duration in [sec] of the current song
     * @return {float}
     */
    this.getAudioDuration = function () {
        if (!this.sCurrentChannel){
            return false;
        }
        return this.oAudio.duration;
    };

    // ----------------------------------------------------------------------
    /**
     * get position in [sec] of the current song
     * @return {float}
     */
    this.getAudioPosition = function () {
        if (!this.sCurrentChannel){
            return false;
        }
        return this.oAudio.currentTime;
    };
    
    // ----------------------------------------------------------------------
    /**
     * get used source url of the current song
     * @return {float}
     */
    this.getAudioSrc = function () {
        if (!this.sCurrentChannel){
            return false;
        }
        return this.oAudio.currentSrc;
    };
    
    // ----------------------------------------------------------------------
    /**
     * get current volume (a value between 0..1)
     * @return {float}
     */
    this.getVolume = function () {
        if (this.oAudio) {
            this.cfg.settings.volume = this.oAudio.volume;
            return this.cfg.settings.volume;
        }
        return false;
    };

    // ----------------------------------------------------------------------
    /**
     * get playlist with all songtitles and its sources
     * @return {array}
     */
    this.getPlaylist = function () {
        return (!this.aPL || !this.aPL.length) ? false : this.aPL;
    };
    // ----------------------------------------------------------------------
    /**
     * get playlist with all songtitles and its sources
     * @return {array}
     */
    this.getPlaylistCount = function () {
        return (this.aPL ? this.aPL.length : false);
    };

    // ----------------------------------------------------------------------
    /**
     * get playlist with all songtitles and its sources
     * @return {array}
     */
    this.getPlayorder = function () {
        return this.aPlayorderList;
    };

    // ----------------------------------------------------------------------
    /**
     * get current song; you get an array with the song title and
     * all its audio sources and mime types
     * @return {array}
     */
    this.getSong = function () {
        if (!this.aPL || !this.aPL.length) {
            return false;
        }
        return this.aPL[this.iCurrentSong];
    };

    // ----------------------------------------------------------------------
    /**
     * get id of the currently active song; first song starts with 0;
     * value -1 means player did not start to play yet.
     * @returns {Number}
     */
    this.getSongId = function () {
        return this.iCurrentSong;
    };
    
    // ----------------------------------------------------------------------
    /**
     * get array element of the currently active song
     * @private
     * @param  {string}   sKey   key of song item; one of title|artist|album|year|image
     * @returns {string}
     */
    this._getSongItem = function (sKey) {
        var oSong = this.getSong();
        return oSong ? oSong[sKey] : false;
    };
    // ----------------------------------------------------------------------
    /**
     * get title of the currently active song
     * @returns {string}
     */
    this.getSongTitle = function () {
        return this._getSongItem('title');
    };
    // ----------------------------------------------------------------------
    /**
     * get artist of the currently active song
     * @returns {string}
     */
    this.getSongArtist = function () {
        return this._getSongItem('artist');
    };
    // ----------------------------------------------------------------------
    /**
     * get album of the currently active song
     * @returns {string}
     */
    this.getSongAlbum = function () {
        return this._getSongItem('album');
    };
    // ----------------------------------------------------------------------
    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    this.getSongYear = function () {
        return this._getSongItem('year');
    };
    // ----------------------------------------------------------------------
    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    this.getSongImage = function () {
        return this._getSongItem('image');
    };
    // ----------------------------------------------------------------------
    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    this.getSongGenre = function () {
        return this._getSongItem('genre');
    };
    // ----------------------------------------------------------------------
    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    this.getSongBpm = function () {
        return this._getSongItem('bpm');
    };
    // ----------------------------------------------------------------------
    /**
     * get url for the song i.e. where to buy it
     * @returns {string}
     */
    this.getSongUrl = function () {
        return this._getSongItem('url');
    };
    
    // ----------------------------------------------------------------------
    /**
     * get id of the currently active song in the playlist (if shuffled)
     * @see getSongId() to get the song based on position in document
     * 
     * @returns {Number}
     */
    this.getPlaylistId = function () {
        return this.iPlaylistId;
    };


    /**
     * get boolean value - volume is muted?
     * @returns {Boolean}
     */
    this.isMuted = function() {
        return (this.oAudio && (this.oAudio.muted || !this.oAudio.volume));
    };

    /**
     * get boolean value - playing audio is paused?
     * @returns {Boolean}
     */
    this.isPaused = function() {
        return (this.oAudio && this.oAudio.paused && this.oAudio.currentTime!==0);
    };
    /**
     * get boolean value - audio is playing? It returns true if audio is
     * playing and false if paused or stopped.
     * @returns {Boolean}
     */
    this.isPlaying = function() {
        return (this.oAudio && !this.oAudio.paused);
    };
    /**
     * get boolean value - is shuffling mode on?
     * @returns {Boolean}
     */
    this.isRepeatlist = function() {
        return (this.cfg.settings.repeatlist
            ? !!this.cfg.settings.repeatlist
            : false);
    };
    /**
     * get boolean value - is shuffling mode on?
     * @returns {Boolean}
     */
    this.isShuffled = function() {
        return (this.cfg.settings.shuffle
            ? this.cfg.settings.shuffle
            : false);
    };
    /**
     * get boolean value - playing audio is stopped
     * @returns {Boolean}
     */
    this.isStopped = function() {
        return (!this.oAudio || this.oAudio.currentTime===0);
    };

    // ----------------------------------------------------------------------
    /**
     * internal helper function - called in init()
     * it detects the name of the ocject variable that initialized the player
     * i.e. on var oMcPlayer=new mcPlayer();
     * it returns "oMcPlayer"
     * 
     * @private
     * @returns {string}
     */
    this._getName = function () {
        // search through the global object for a name that resolves to this object
        for (var name in this.global)
            if (this.global[name] === this) {
                return this._setName(name);
            }
    };

    // ----------------------------------------------------------------------
    /**
     * internal helper function - called in getName()
     * set internal varible
     * @private
     * @param {string} sName  name of the player object
     * @returns {string}
     */
    this._setName = function (sName) {
        this.name = sName;
        return this.name;
    };

    // ----------------------------------------------------------------------
    // init
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    /**
     * initialize player
     * @return {boolean}
     */
    this.init = function () {
        this._getName();            // detect name of the object variable that initialized the player
        this._generatePlaylist();   // scan audios on webpage
        this._initHtml();           // generate html for the player        
        if (typeof addi !== 'undefined') {
            addi.init();
        }
        this.minimizeBox('about');
        this.minimizeBox('download');
        this.minimizeBox('playlist');
        return true;
    };
    
    

    // ----------------------------------------------------------------------
    // MAIN
    // ----------------------------------------------------------------------

    if(arguments[0]){
        this.setConfig(arguments[0]);
    }

    this.canPlaySurround();
    try{
        this.sCurrentChannel = localStorage.getItem("amcp.channels") ? localStorage.getItem("amcp.channels") : false;
        this.cfg.settings.volume = localStorage.getItem("amcp.volume") ? localStorage.getItem("amcp.volume") : 1;
    } catch(e){
        // nop
    }
    // this.showInfo("<strong>" + this.aPL.length + "</strong> AUDIOs");

    return true;

};

mcPlayer.prototype.global = this; // required for getName()

// --------------------------------------------------------------------------------
// FUNCTIONS
// --------------------------------------------------------------------------------

/**
 * merge 2 objects
 * @param  to    assoc array 1
 * @param  from  assoc array 2
 */
var realMerge = function (to, from) {
    for (var n in from) {
        if (typeof to[n] !== 'object') {
            to[n] = from[n];
        } else if (typeof from[n] === 'object') {
            to[n] = realMerge(to[n], from[n]);
        }
    }

    return to;
};


// --------------------------------------------------------------------------------
