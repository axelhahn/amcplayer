/***********************************************************************
 
 amcPlayer ... Axels Multi Channel Player
 
 There are tons of html5 audio players around but I needed a special
 feature: I wanted to play a song which is available in stereo and
 5.1 surround with a single playlist item and switch between them.
 
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
 https://github.com/axelhahn/amcplayer/
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
 * @version   1.04
 *
 * @this mcPlayer
 * 
 * @example
 * <pre>
 * // --- #1
 * oMcPlayer=new mcPlayer();
 * oMcPlayer.init();         // draw player gui
 * oMcPlayer.minimize(true); // ... and hide the gui without animation
 * 
 * // --- #2
 * var oMcPlayer = new mcPlayer({
 *   settings:{
 *     autoopen: true,
 *     repeatlist: false
 *   }
 * });
 * oMcPlayer.init();     // draw player gui
 * oMcPlayer.minimize(); // ... and hide the gui
 * </pre>
 * 
 * @constructor
 * @return nothing
 */
class mcPlayer {

    // ----------------------------------------------------------------------
    // config
    // ----------------------------------------------------------------------
    cfg = {
        about: {
            version: '1.04-dev',
            label: 'AMC Player',
            description: '<strong>A</strong>xels <strong>M</strong>ulti <strong>C</strong>hannel <strong>Player</strong>.<br>This is a webbased HTML5 audio player.<br>It\'s focus is the handling of media in stereo and surround for a title.',
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
                    noswitch: 'stereo/ surround switch was deactivated (mobile device or Opera Presto engine)'
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
                },
                statusbar: {
                    label: '',
                    title: 'Toggle statusbar with network activity and media status'
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
                noentry: 'Select or play an audio first to show its downloads.',
                hint: 'Use the right mousebutton or context menu to save the link target'
            },
            songinfo: {
                album: 'Album',
                year: 'Year',
                bpmspeed: 'Speed',
                bpm: 'bpm',
                genre: 'Genre',
                url: 'Web'
            },
            status: {
                networkstate: {
                    label: 'Network activity',
                    0: ['Empty', '0 = NETWORK_EMPTY - audio/video has not yet been initialized'],
                    1: ['Idle', '1 = NETWORK_IDLE - audio/video is active and has selected a resource, but is not using the network'],
                    2: ['Loading', '2 = NETWORK_LOADING - browser is downloading data'],
                    3: ['No Source', '3 = NETWORK_NO_SOURCE - no audio/video source found']
                },
                readystate: {
                    label: 'Status',
                    0: ['Have nothing', '0 = HAVE_NOTHING - no information whether or not the audio/video is ready'],
                    1: ['Have Metadata', '1 = HAVE_METADATA - metadata for the audio/video is ready'],
                    2: ['OK, Current data', '2 = HAVE_CURRENT_DATA - data for the current playback position is available, but not enough data to play next frame/millisecond'],
                    3: ['OK, Future data', '3 = HAVE_FUTURE_DATA - data for the current and at least the next frame is available'],
                    4: ['OK, Enough data', '4 = HAVE_ENOUGH_DATA - enough data available to start playing']
                }
            }
        },
        settings: {
            autoopen: false,
            movable: true,
            repeatlist: true,
            showsonginfos: true,
            showhud: true,
            showstatusbar: false,
            shuffle: false,
            volume: 0.9
        }
    };

    // ----------------------------------------------------------------------
    // other internal vars
    // ----------------------------------------------------------------------
    oAudio = false;           // current audio object
    sCurrentChannel = false;  // current audio - one of false | "2.0"| "5.1"
    iMaxVol = 1;

    iCurrentTime = false;     // current audio position (in sec)

    bIsFading = false;        // flag: is a fading active?
    iVolInc = 0.02;           // X-Fading: volume value to change
    iTimer = 20;              // X-Fading: change interval in ms

    iHudTimer = 5;            // time to display hud message in s
    iRemoveTimer = 2;


    // get playlist of all audiotags of the current document
    aPL = [];
    iCurrentSong = -1;
    aPlayorderList = [];
    iPlaylistId = -1;

    _iMinDelta = 100;
    _sContainerId = false;
    sScreensize = false;

    name = false;

    playlink = '[title]';

    /**
     * constructor of the player
     * 
     * @see setConfig
     * @see init
     * 
     * @param {object}  configuation data to override defaults using 
     * @return {boolean}
     */
    constructor(oConfig) {

        if (oConfig) {
            this.setConfig(oConfig);
        }

        this.canPlaySurround();
        try {
            this.sCurrentChannel = localStorage.getItem("amcp.channels") ? localStorage.getItem("amcp.channels") : false;
            this.cfg.settings.volume = localStorage.getItem("amcp.volume") / 1 ? localStorage.getItem("amcp.volume") / 1 : 1;
        } catch (e) {
            // nop
        }

        return true;
    }
    // **********************************************************************
    /**
     * Check: does the browser support 5.1 channels?<br>
     * tablets and mobile devices: false<br>
     * older Opera versions: false<br>
     * all other: true<br>
     *
     * @return {boolean}
     */
    canPlaySurround() {
        var bReturn = true;
        // older Opera makes a stereo downmixing of surround media
        if (navigator.userAgent.indexOf("Presto/") >= 0) {
            bReturn = false;
        }
        // tablets and other mobile, ... devices
        // see https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser#11381730
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                bReturn = false;
        })(navigator.userAgent || navigator.vendor || window.opera);

        return bReturn;
    }

    /**
     * scan AUDIO tags and its sources in a document to create an
     * object with all current songs
     * 
     * @private
     * @return {array}
     */
    #scanAudios() {
        var oAudioList = document.getElementsByTagName("AUDIO");
        var a = new Array();
        var aSource = false;
        var sChannels = false;
        var aSong = false;
        var o = false;
        var dummy = false;

        for (var i = 0; i < oAudioList.length; i++) {
            oAudioList[i].style.display = "none";
            aSong = {
                title: oAudioList[i].dataset.title
                    ? oAudioList[i].dataset.title
                    : oAudioList[i].title
                        ? oAudioList[i].title
                        : '',

                artist: oAudioList[i].dataset.artist ? oAudioList[i].dataset.artist : false,
                album: oAudioList[i].dataset.album ? oAudioList[i].dataset.album : false,
                year: oAudioList[i].dataset.year ? oAudioList[i].dataset.year : false,
                image: oAudioList[i].dataset.image ? oAudioList[i].dataset.image : false,
                genre: oAudioList[i].dataset.genre ? oAudioList[i].dataset.genre : false,
                bpm: oAudioList[i].dataset.bpm ? oAudioList[i].dataset.bpm : false,
                url: oAudioList[i].dataset.url ? oAudioList[i].dataset.url : false,
                sources: {}
            };
            for (var j = 0; j < oAudioList[i].children.length; j++) {
                o = oAudioList[i].children[j];
                if (o.tagName === "SOURCE") {
                    sChannels = "any";
                    // if (o.dataset && o.dataset.ch)sChannels=o.dataset.ch;
                    if (o.title) {
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
            // add it to playlist
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
    }


    /**
     * Add a song to the playlist.
     * This method is called on init too if all audios are scanned.
     * 
     * @param {array} aSong  data for a single song object
     * @example
     * <pre>
     * oMcplayer=addAudio({
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
     *     });
     * </pre>
     * @returns {Boolean}
     */
    addAudio(aSong) {
        if (!aSong["sources"]) {
            return false;
        }
        if (!aSong.title) {
            aSong.title = 'audio ' + (this.aPL.length + 1);
        }
        this.aPL.push(aSong);
        this.#generatePlayorder();
    };


    /**
     * get default html code of player controls
     * 
     * @private
     * @return {string}  html code
     */
    #genPlayer() {
        var s = '';
        var idLink = false;

        s += '<div id="mcpplayersonginfo"></div>';

        // add buttons
        var aTmp = new Array("play", "pause", "stop", "backward", "forward");
        if (this.aPL.length > 1) {
            aTmp.push("jumpprev", "jumpnext");
        }
        s += '<div id="mcpplayerbtndiv">';
        for (var i = 0; i < aTmp.length; i++) {
            s += '<a href="#" id="mcp' + aTmp[i] + '"'
                + ' onclick="' + this.name + '.playeraction(\'' + aTmp[i] + '\'); return false;' + '"'
                + ' title="' + this.cfg.aPlayer.buttons[aTmp[i]].title + '"'
                + '></a>';
        }
        s += '</div>'
            + '<div id="mcpprogressdiv"'
            + (this.cfg.aPlayer.bars["progress"].visible ? '' : 'style="display: none"')
            + '>'
            // + '<canvas id="mcpprogresscanvas" title="' + this.cfg.aPlayer.bars["progress"].title + '"></canvas>'
            + '<div class="mcpslider">'
            + '<div class="mcpslider-default"></div>'
            + '<div id="mcpprogressbar" class="mcpslider-active"></div>'
            + '</div>'
            + '</div>'
            + '<span id="mcptime"><span id="mcptimeplayed">-:--</span>/ <span id="mcptimetotal">-:--</span></span>'

            + '<div id="mcpvolumesection">'

            + '<a href="#" id="mcpvolmute" onclick="' + this.name + '.setVolume(0); return false;" '
            + (this.cfg.aPlayer.buttons["volmute"].visible ? '' : 'style="display: none" ')
            + 'title="' + this.cfg.aPlayer.buttons["volmute"].title + '"></a>'

            + '<div id="mcpvolumediv" title="volume">'
            // + '<canvas id="mcpvolumecanvas" '
            // + (this.cfg.aPlayer.bars["volume"].visible ? '' : 'style="display: none" ')
            // + 'title="' + this.cfg.aPlayer.bars["volume"].title + '"></canvas>'
            + '<div class="mcpslider">'
            + '<div class="mcpslider-default"></div>'
            + '<div id="mcpvolumebar" class="mcpslider-active"></div>'
            + '</div>'
            + '</div>'

            + '<a href="#" id="mcpvolfull" onclick="' + this.name + '.setVolume(1); return false;" '
            + (this.cfg.aPlayer.buttons["volfull"].visible ? '' : 'style="display: none" ')
            + 'title="' + this.cfg.aPlayer.buttons["volfull"].title + '"></a>'

            + '</div>'

            + '<div id="mcpchannels"></div>'

            + '<div id="mcpoptions">'
            + '<a href="#" onclick="' + this.name + '.toggleRepeat(); return false;" id="mcpoptrepeat" '
            + (this.isRepeatlist() ? 'class="active" ' : '')
            + 'title="' + this.cfg.aPlayer.buttons["repeat"].title + '"></a>'
            + '<a href="#" onclick="' + this.name + '.toggleShuffle(); return false;" id="mcpoptshuffle" '
            + (this.cfg.settings.shuffle ? 'class="active" ' : '')
            + 'title="' + this.cfg.aPlayer.buttons["shuffle"].title + '"></a>'
            + '<a href="#" onclick="' + this.name + '.toggleStatusbar(); return false;" id="mcpoptstatusbar" '
            + (this.isVisibleStatusbar() ? 'class="active" ' : '')
            + 'title="' + this.cfg.aPlayer.buttons["statusbar"].title + '"></a>';
        var aBtn = ['download', 'playlist', 'about'];
        for (var i = 0; i < aBtn.length; i++) {
            idLink = 'mcpopt' + aBtn[i];
            s += '<a href="#" onclick="' + this.name + '.toggleBoxAndButton(\'' + aBtn[i] + '\'); return false;" id="mcpopt' + aBtn[i] + '" '
                + (this.cfg.aPlayer.buttons[aBtn[i]].visible ? '' : 'style="display: none" ')
                + ' title="' + this.cfg.aPlayer.buttons[aBtn[i]].title + '"></a>';
        }
        s += '</div>'
            + '<div id="mcpstatusbar"'
            + (this.cfg.settings.showstatusbar ? ' class="active" ' : '')
            + '>'
            + '<div>'
            + this.cfg.aPlayer.status.networkstate.label + ': '
            + '<span id="mcpstatusnetwork"></span>'
            + '</div>'
            + '<div>'
            + this.cfg.aPlayer.status.readystate.label + ': '
            + '<span id="mcpstatusready"></span>'
            + '</div>'
            + '</div>';

        return s;
    };

    /**
     * generate html code for about box
     * 
     * @private
     * @return {html_code}
     */
    #genAboutbox() {

        return '<div class="mcpbox">'
            + '<span class="ico-about"> ' + this.cfg.aPlayer.about.title + '</span>'
            + '<span class="mcpsystembutton"><a href="#" class="icon-down-open-1" onclick="' + this.name + '.toggleBoxAndButton(\'about\', \'minimize\'); return false;" title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a></span></div><div>'
            + '<p class="amclogo"></p>'
            + '<div class="title">' + this.cfg.about.label + ' v' + this.cfg.about.version + '</div>'
            + '<p>' + this.cfg.about.description + '</p>'
            + '<p>' + this.cfg.about.labellicense + '' + this.cfg.about.license + '</p>'
            + '<p>' + this.cfg.about.labelurl + '<a href="' + this.cfg.about.url + '" target="_blank">' + this.cfg.about.url + '</a></p>'
            + '<p>' + this.cfg.about.labeldownload + '<a href="' + this.cfg.about.download + '" target="_blank">' + this.cfg.about.download + '</a></p>'
            + '<p>' + this.cfg.about.labeldocurl + '<a href="' + this.cfg.about.docurl + '" target="_blank">' + this.cfg.about.docurl + '</a></p>'
            + '</div>';
    };

    /**
     * generate html code for the playlist
     * 
     * @private
     * @return {html_code}
     */
    #genPlaylist() {

        var sHtmlPL = ''
            + '<div class="mcpbox">'
            + '<span class="ico-playlist"> ' + this.cfg.aPlayer.playlist.title + '</span>'
            + '<span class="mcpsystembutton">'
            + '<a href="#" class="icon-down-open-1" onclick="' + this.name + '.toggleBoxAndButton(\'playlist\', \'minimize\'); return false;" '
            + 'title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a>'
            + '</span>'
            + '</div>';
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
     * 
     * @private
     * @return {html_code}
     */
    #genSonginfos() {

        if (!this.cfg.settings.showsonginfos) {
            return '';
        }
        var sHtml = ''
            + (this.getSongArtist() ? '<div class="artist">' + this.getSongArtist() + '</div>' : '')
            + (this.getSongAlbum() ? '<div class="album">' + this.cfg.aPlayer.songinfo.album + ': ' + this.getSongAlbum() + '</div>' : '')
            + (this.getSongYear() ? '<div class="year">' + this.cfg.aPlayer.songinfo.year + ': ' + this.getSongYear() + '</div>' : '')
            + (this.getSongBpm() ? '<div class="bpm">' + this.cfg.aPlayer.songinfo.bpmspeed + ': ' + this.getSongBpm() + ' ' + this.cfg.aPlayer.songinfo.bpm + '</div>' : '')
            + (this.getSongGenre() ? '<div class="genre">' + this.cfg.aPlayer.songinfo.genre + ': ' + this.getSongGenre() + '</div>' : '')
            + (this.getSongUrl() ? '<div class="url">' + this.cfg.aPlayer.songinfo.url + ': <a href="' + this.getSongUrl() + '" target="_blank">' + this.getSongUrl() + '</a></div>' : '');
        if (sHtml || this.getSongImage()) {
            sHtml = '<div>'
                + (this.getSongImage() ? '<img src="' + this.getSongImage() + '">' : '')
                + (this.getSongTitle() ? '<div class="title">' + this.getSongTitle() + '</div>' : '')
                + sHtml;

            sHtml += '<div style="clear: both;"></div>';
            sHtml += '</div>';
        }

        return sHtml;
    };


    /**
     * scan AUDIO tags and its sources in a document to create an
     * object with all current songs
     * @private
     * @return {html_code}
     */
    #genDownloads() {
        var sHtml = '';
        var sSong = false;
        var sSrc = false;
        var sExt = false;

        if (this.aPL.length > 0) {
            sHtml += '<div class="mcpbox">'
                + '<span class="ico-download"> ' + this.cfg.aPlayer.download.title + '</span>'
                + '<span class="mcpsystembutton"><a href="#" class="icon-down-open-1" onclick="' + this.name + '.toggleBoxAndButton(\'download\', \'minimize\'); return false;" '
                + 'title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a>'
                + '</span>'
                + '</div>'
                + '<ul>';
            if (this.iCurrentSong === -1) {
                sHtml += '<li>' + this.cfg.aPlayer.download.noentry + '</li>';
            } else {
                sHtml += '<li>' + this.cfg.aPlayer.download.hint + '<br><br></li>';
                for (var i = 0; i < this.aPL.length; i++) {
                    sSong = this.aPL[i]["title"];
                    if (!sSong) {
                        sSong = "Audio #" + (i + 1);
                    }
                    if (this.iCurrentSong === -1 || this.iCurrentSong == i) {
                        sHtml += '<li '
                            + (this.iCurrentSong == i ? ' class="active"' : '')
                            + '><strong>' + sSong + '</strong>'
                            + '<ul>';
                        for (var sChannel in this.aPL[i]["sources"]) {
                            sHtml += '<li>' + sChannel + ': ';
                            for (var j = 0; j < this.aPL[i]["sources"][sChannel].length; j++) {
                                sSrc = this.aPL[i]["sources"][sChannel][j]["src"];
                                sExt = this.aPL[i]["sources"][sChannel][j]["type"].replace('audio/', '');
                                // sExt='';
                                if (!sExt)
                                    sExt = this.aPL[i]["sources"][sChannel][j]["src"].replace(/^.*\/|\.[^.]*$/g, '');

                                sHtml += (j > 0 ? ' | ' : '')
                                    + '<a href="' + this.aPL[i]["sources"][sChannel][j]["src"]
                                    + '" title="' + sSong + ' (' + sChannel + '; ' + sExt + ')' + "\n" + this.aPL[i]["sources"][sChannel][j]["src"] + '"'
                                    + '>' + sExt + '</a>';
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
    #generatePlaylist() {
        // this.aPL = this._scanAudios(); 
        this.#scanAudios();
        this.#generatePlayorder();
    };

    /**
     * helper function for generatePlayorder; shuffle javascript array
     * @private
     * @param {type} a
     * @param {type} b
     * @returns {Number}
     */
    #randomSort(a, b) {
        return (parseInt(Math.random() * 10) % 2);
    };

    /**
     * update playorder list with/ without shuffling
     * @private
     * @returns {undefined}
     */
    #generatePlayorder() {
        this.aPlayorderList = [];
        if (this.aPL.length) {
            for (var i = 0; i < this.aPL.length; i++) {
                this.aPlayorderList[i] = i;
            }
            if (this.isShuffled()) {
                // on shuffling: current song will be the first element
                if (this.iCurrentSong >= 0) {
                    this.aPlayorderList.splice(this.iCurrentSong, 1);
                }
                this.aPlayorderList.sort(this.#randomSort);
                if (this.iCurrentSong >= 0) {
                    this.aPlayorderList.unshift(this.iCurrentSong);
                }
            }
            this.#findPlaylistId();
        }
    };

    /**
     * get id in the playlist that matches the current song id
     * @private
     * @returns {Number|Boolean}
     */
    #findPlaylistId() {
        this.iPlaylistId = false;
        if (this.iCurrentSong >= 0) {
            for (var i = 0; i < this.aPlayorderList.length; i++) {
                if (this.aPlayorderList[i] === this.iCurrentSong) {
                    this.iPlaylistId = i;
                }
            }
        }
        return this.iPlaylistId;
    };

    /**
     * add html code in the player div
     * 
     * @private
     * @param {string} sHtml  html code to add
     */
    #addHtml(sHtml) {
        var oContainer = document.getElementById(this._sContainerId) ? document.getElementById(this._sContainerId) : document.getElementsByTagName("BODY")[0];
        if (oContainer) {
            oContainer.innerHTML += sHtml;
        }
    };

    // ----------------------------------------------------------------------
    /**
     * init html code of the player - by creating all missing elements
     * 
     * @private
     * @return nothing
     */
    #initHtml() {

        var styleTop = ' style="top: ' + ((document.documentElement.clientHeight + 100) + 'px') + ';"';
        this.oDivDownloads = document.getElementById("mcpdownloads");
        if (!this.oDivDownloads) {
            this.#addHtml('<div id="mcpdownloads" class="draggable saveposition"' + styleTop + '></div>');
            this.oDivDownloads = document.getElementById("mcpdownloads");
        }
        this.oDivDownloads.innerHTML = this.#genDownloads();

        this.oDivPlaylist = document.getElementById("mcpplaylist");
        if (!this.oDivPlaylist) {
            this.#addHtml('<div id="mcpplaylist" class="draggable saveposition"' + styleTop + '></div>');
            this.oDivPlaylist = document.getElementById("mcpplaylist");
        }
        this.oDivPlaylist.innerHTML = this.#genPlaylist();


        this.oDivPlayerwrapper = document.getElementById("mcpwrapper");
        if (!this.oDivPlayerwrapper) {
            this.#addHtml('<div id="mcpwrapper"' + (this.cfg.settings.movable ? ' class="draggable saveposition"' : '') + '></div>');
            this.oDivPlayerwrapper = document.getElementById("mcpwrapper");
        }
        this.oDivHeader = document.getElementById("mcpheader");
        if (!this.oDivHeader) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcpheader" class="mcpbox">' + '<span class="ico-playlist"> ' + this.cfg.about.label + ' v' + this.cfg.about.version + ' <span id="mcptitle"></span><span class="mcpsystembutton"><a href="#" class="icon-down-open-1" onclick="' + this.name + '.minimize(); return false" title="' + this.cfg.aPlayer.buttons["minimize"].title + '">' + this.cfg.aPlayer.buttons["minimize"].label + '</a></span></div>';
        }

        if (!this.oDivAudios) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcpplayeraudios"></div>';
            this.oDivAudios = document.getElementById("mcpplayeraudios");
        }
        this.oDivPlayer = document.getElementById("mcplayer");
        if (!this.oDivPlayer) {
            this.oDivPlayerwrapper.innerHTML += '<div id="mcplayer"></div>';
            this.oDivPlayer = document.getElementById("mcplayer");
            this.oDivPlayer.innerHTML = this.#genPlayer();
        }
        this.oAPlayermaximize = document.getElementById("mcpmaximize");
        if (!this.oAPlayermaximize) {
            this.#addHtml('<a href="#" id="mcpmaximize" class="mcpsystembutton hidebutton" onclick="' + this.name + '.maximize(); return false" title="' + this.cfg.aPlayer.buttons["maximize"].title + '"> ' + this.cfg.aPlayer.buttons["maximize"].label + '</a>');
            this.oAPlayermaximize = document.getElementById("mcpmaximize");
        }
        this.#addHtml('<div id="mcpabout" class="draggable saveposition"' + styleTop + '>' + this.#genAboutbox() + '</div>');
        this.oDivPlayerhud = document.getElementById("mcphud");
        if (!this.oDivPlayerhud) {
            this.#addHtml('<div id="mcphud"></div>');
            this.oDivPlayerhud = document.getElementById("mcphud");
        }
        this.#playerheightSet();
    };

    // ----------------------------------------------------------------------
    /**
     * minimize player GUI and show a maximize icon
     * @example
     * <pre>
     * &lt;a href="#" onclick="oMcPlayer.minimize(); return false;"&gt;hide player&lt;/a&gt;
     * </pre>
     * @param {boolean}  bFast     flag to override speed in css transistion
     * @return nothing
     */
    minimize(bFast) {
        o = document.getElementById("mcpwrapper");
        o.style['transition-duration'] = bFast ? '0s' : '';
        o.style.top = (document.documentElement.clientHeight + this._iMinDelta) + 'px';

        this.minimizeBox('about');
        this.minimizeBox('download');
        this.minimizeBox('playlist');

        document.getElementById("mcpmaximize").className = '';
    };

    /**
     * set if make the main player window is movable.
     * This method is useful if you added drag and drop support (addi.min.js)
     * for the windows but the main player is fixed on the bottom.
     *
     * @param {boolean} bMove  flag true/ false
     * @returns {undefined}
     */
    makeMainwindowMovable(bMove) {
        this.cfg.settings.movable = bMove;
        o = document.getElementById("mcpwrapper");
        if (this.cfg.settings.movable) {
            o.className = 'draggable saveposition';
            if (typeof addi !== 'undefined') {
                addi.initDiv(o);
            } else {
                this.cfg.settings.movable = false;
            }
        }
        if (!this.cfg.settings.movable) {
            o.className = '';
            if (typeof addi !== 'undefined') {
                addi.resetDiv(o);
            }
            this.maximize();
            o.setAttribute('style', '');

        }
    };

    /**
     * show/ maximize the player GUI
     * @example
     * <pre>
     * &lt;a href="#" onclick="oMcPlayer.maximize(); return false;"&gt;show the player&lt;/a&gt;
     * </pre>
     *
     * @return nothing
     */
    maximize() {
        o = document.getElementById("mcpwrapper");
        o.setAttribute('style', '');
        if (this.cfg.settings.movable && typeof addi !== 'undefined') {
            addi.load(document.getElementById("mcpwrapper"));
        }
        document.getElementById("mcpmaximize").className = 'hidebutton';
    };

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
    #showInfo(sMsg) {
        if (!this.cfg.settings.showhud || this.cfg.settings.autoopen || this.isVisiblePlayer()) {
            return false;
        }
        var o = document.getElementById("mcphud");
        this.iRemoveTimer = this.iHudTimer * 1000;
        o.className = 'active';
        o.innerHTML = sMsg;
        this.#decHudTimer();
        return true;
    };

    /**
     * hide HUD div
     * @private
     * @return nothing
     */
    #hideInfo() {
        var o = document.getElementById("mcphud");
        o.className = '';
        return true;
    };

    /**
     * decrease time to display HUD; if it is zero then call hideInfo()
     * @private
     * @return nothing
     */
    #decHudTimer() {
        this.iRemoveTimer = this.iRemoveTimer - 100;
        // this.showInfo(this.iRemoveTimer);
        if (this.iRemoveTimer > 0) {
            window.setTimeout(this.name + ".#decHudTimer()", 100);
        } else {
            this.#hideInfo();
            this.iRemoveTimer = false;
        }
    };

    /**
     * helper function for visible boxes
     * @see toggleBoxAndButton()
     * @private
     * @param {string}  sBaseId    sBaseId of the div and the button; one of download|playlist|about
     * @return {boolean}
     */
    #togglehelperGetDiv(sBaseId) {
        return (this.cfg.aPlayer.buttons[sBaseId] && this.cfg.aPlayer.buttons[sBaseId].box)
            ? document.getElementById(this.cfg.aPlayer.buttons[sBaseId].box)
            : (sBaseId === 'player')
                ? document.getElementById('mcpwrapper')
                : false;
    };

    /**
     * toggle visibility of a box (download, playlist, about)
     * @param {string}   sBaseId   sBaseId of the div and the button; one of download|playlist|about
     * @param {string}   sMode     optional: force action; one of minimize|maximize; default behaviuor is toggle
     * @param {boolean}  bFast     flag to override speed in css transistion
     * @return {boolean}
     */
    toggleBoxAndButton(sBaseId, sMode, bFast) {
        var oDiv = this.#togglehelperGetDiv(sBaseId);

        var oBtn = document.getElementById('mcpopt' + sBaseId);
        if (!sMode) {
            sMode = (oBtn.className.indexOf('active') < 0 ? 'maximize' : 'minimize');
        }

        if (oDiv) {
            // set a transition duration of "0s" sets it into the style and
            // overrides delay from css; using bFast flag on startup removes
            // the flickering on page load
            oDiv.style['transition-duration'] = bFast ? '0s' : '';
        }

        if (sMode === 'minimize') {
            if (oDiv) {
                oDiv.style.top = (document.documentElement.clientHeight + this._iMinDelta) + 'px';
                oDiv.style.opacity = 0.1;
            }
            if (oBtn) {
                oBtn.className = '';
            }
        } else if (sMode === 'maximize') {
            if (oDiv) {
                // oDiv.className += ' visible';
                oDiv.setAttribute('style', '');
                oDiv.style.opacity = 1;
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
    isVisibleBox(sBaseId) {
        // var oDiv=this.#togglehelperGetDiv(sBaseId);
        var sId = sBaseId === 'player' ? 'mcpmaximize' : 'mcpopt' + sBaseId;
        var oBtn = document.getElementById(sId);
        return oBtn ? !!oBtn.className : false;
    };

    /**
     * return if about dialog box is visible
     * @returns {Boolean}
     */
    isVisibleBoxAbout() {
        return this.isVisibleBox('about');
    };

    /**
     * return if download dialog box is visible
     * @returns {Boolean}
     */
    isVisibleBoxDownload() {
        return this.isVisibleBox('download');
    };

    /**
     * return if playlist dialog box is visible
     * @returns {Boolean}
     */
    isVisibleBoxPlaylist() {
        return this.isVisibleBox('playlist');
    };

    /**
     * return if player window is visible
     * @since v0.30
     * @returns {Boolean}
     */
    isVisiblePlayer() {
        return this.isVisibleBox('player');
    };

    /**
     * return if player window is visible
     * @since v0.33
     * @returns {Boolean}
     */
    isVisibleStatusbar() {
        return this.cfg.settings.showstatusbar;
    };

    // ----------------------------------------------------------------------
    /**
     * toggle playing option repeat playlist
     * @returns {undefined}
     */
    toggleRepeat() {
        if (this.isRepeatlist()) {
            return this.disableRepeat();
        } else {
            return this.enableRepeat();
        }
    };

    /**
     * enable playing option repeat playlist
     * @returns {undefined}
     */
    enableRepeat() {
        this.cfg.settings.repeatlist = true;
        this.toggleBoxAndButton('repeat', 'maximize');
    };

    /**
     * disable playing option repeat playlist
     * @returns {undefined}
     */
    disableRepeat() {
        this.cfg.settings.repeatlist = false;
        this.toggleBoxAndButton('repeat', 'minimize');
    };

    // ----------------------------------------------------------------------
    /**
     * toggle playing option shuffle playlist
     * @returns {undefined}
     */
    toggleShuffle() {
        if (this.isShuffled()) {
            return this.disableShuffle();
        } else {
            return this.enableShuffle();
        }
    };

    /**
     * enable playing option shuffle playlist
     * @returns {undefined}
     */
    enableShuffle() {
        this.cfg.settings.shuffle = true;
        this.#generatePlayorder();
        this.toggleBoxAndButton('shuffle', 'maximize');
    };

    /**
     * disable playing option shuffle playlist
     * @returns {undefined}
     */
    disableShuffle() {
        this.cfg.settings.shuffle = false;
        this.#generatePlayorder();
        this.toggleBoxAndButton('shuffle', 'minimize');
    };

    // ----------------------------------------------------------------------
    /**
     * set visibility of status bar
     * @private
     * @since v0.33
     * @param {boolean} bVisibility  flag; true or false
     * @returns {booleab}
     */
    #setStatusbar(bVisibility) {
        this.cfg.settings.showstatusbar = !!bVisibility;
        this.toggleBoxAndButton('statusbar', (bVisibility ? 'maximize' : 'minimize'));
        document.getElementById('mcpstatusbar').className = (bVisibility ? 'active' : '');
        this.#playerheightAdjust();
        return true;
    };

    /**
     * enable playing option shuffle playlist
     * @since v0.33
     * @returns {boolean}
     */
    enableStatusbar() {
        return this.#setStatusbar(true);
    };

    /**
     * disable playing option shuffle playlist
     * @since v0.33
     * @returns {boolean}
     */
    disableStatusbar() {
        return this.#setStatusbar(false);
    };

    /**
     * toggle playing option shuffle playlist
     * @since v0.33
     * @returns {boolean}
     */
    toggleStatusbar() {
        if (this.isVisibleStatusbar()) {
            return this.disableStatusbar();
        } else {
            return this.enableStatusbar();
        }
    };

    // ----------------------------------------------------------------------
    /**
     * minimize a box; argument is a base id of a button or div
     *
     * @example
     * <pre>
     * &lt;button onclick="oMcPlayer.minimizeBox('download')">hide Downloads&lt;/button>
     * </pre>
     * @param {string}   sBaseId  name of the div ("download" | "playlist" | "about")
     * @param {boolean}  bFast    flag to override speed in css transistion
     * @return {boolean}
     */
    minimizeBox(sBaseId, bFast) {
        return this.toggleBoxAndButton(sBaseId, 'minimize', bFast);
    };

    /**
     * maximize a box; argument is a base id of a button or div
     * @example
     * <pre>
     * &lt;button onclick="oMcPlayer.maximizeBox('download')">show Downloads&lt;/button>
     * </pre>
     * @param {string}   sBaseId  name of the div ("download" | "playlist" | "about")
     * @param {boolean}  bFast    flag to override speed in css transistion
     * @return {boolean}
     */
    maximizeBox(sBaseId, bFast) {
        return this.toggleBoxAndButton(sBaseId, 'maximize', bFast);
    };

    // ----------------------------------------------------------------------
    /**
     * handle actions of the player
     * @exmple
     * &lt;button onclick="oMcPlayer.playeraction('play')">play&lt;/button>
     * @param {string} sAction name of the action ("play" | "pause" | "stop" | "forward" | "backward" | "jumpprev" | "jumpnext")
     * @return nothing
     */
    playeraction(sAction) {
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

    /**
     * Set a position of the currently playing audio;
     * It returns the set position; if there is no audio it retuns false
     * @example
     * <pre>
     * &lt;button onclick="oMcPlayer.setAudioPosition(180.33);">oMcPlayer.setAudioPosition(180.33)&lt;/button>
     * </pre>
     *
     * @param {float}  iTime   new position in seconds
     * @return {boolean}
     */
    setAudioPosition(iTime) {
        if (!this.sCurrentChannel || this.oAudio.duration < iTime) {
            return false;
        }
        return this.oAudio.currentTime = iTime;
    };

    /**
     * start playing the previous song in playlist (if the current audio is
     * not the first played element)
     *
     * @example
     * <pre>
     * &lt;button onclick="oMcPlayer.setPreviousSong();">previous song&lt;/button>
     * </pre>
     * @return {boolean}
     */
    setPreviousSong() {
        if (!this.aPlayorderList || !this.aPlayorderList.length) {
            return false;
        }
        if (this.iPlaylistId > 0) {
            return this.setSong(this.aPlayorderList[this.iPlaylistId - 1]);
        }
        // go to last item ... but no randomize
        return this.setSong(this.aPlayorderList[this.aPlayorderList.length - 1]);
    };

    /**
     * play next song in playlist; if the audio is the last element in the
     * playlist the playlist will be shuffled (if shuffling is enabled).
     * It starts the first audio if the playing option "repeat" is enabled.
     *
     * @example
     * <pre>
     * &lt;button onclick="oMcPlayer.setNextSong();">next song&lt;/button>
     * </pre>
     * @return {boolean}
     */
    setNextSong() {
        if (!this.aPL || !this.aPL.length) {
            return false;
        }
        if (this.iPlaylistId < (this.aPlayorderList.length - 1)) {
            return this.setSong(this.aPlayorderList[this.iPlaylistId + 1]);
        } else {
            // if this.cfg.settings.shuffle is active then shuffle again
            this.#generatePlayorder();
            // repeat the list
            if (this.isRepeatlist()) {
                this.setSong(this.aPlayorderList[(this.isShuffled() ? 1 : 0)]);
            }
        }
    };

    /**
     * set a (new) song to play based on the position in document.
     * @see getPlaylist() to get all audios
     *
     * @example
     * <pre>
     * &lt;a href="#" onclick="oMcPlayer.setSong(0); return false;"&gt;first song&lt;/a&gt;
     * &lt;a href="#" onclick="oMcPlayer.setSong(1); return false;"&gt;second song&lt;/a&gt;
     * </pre>
     *
     * @param  {int}  sSongId  number of song to play; the first audio tag in the
     *                         html document has id 0
     * @return {boolean}
     */
    setSong(sSongId) {

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

        var source = false;
        var sourcesrc = false;
        var oLink = false;

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
                if (!sFirstChannel) {
                    sFirstChannel = sChannel;
                }
                if (sLastChannel !== sChannel) {

                    iChannels++;
                    sChannels += '<li>';
                    if (this.canPlaySurround()) {
                        sChannels += '<a href="#" onclick="' + this.name + '.setChannel(\'' + sChannel + '\'); return false;" title="' + this.cfg.aPlayer.buttons.audiochannels.title + ': ' + sChannel + '">' + sChannel + '</a>';
                    } else {
                        sChannels += '<a href="#" onclick="return false;" title="' + this.cfg.aPlayer.buttons.audiochannels.noswitch + '">' + sChannel + '</a>';
                    }
                    sChannels += '</li>';
                    sLastChannel = sChannel;

                    if (sChannel === this.sCurrentChannel) {
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
            // sChannels = '<li>' + sChannel + '</li>';
            sChannels = '';
        }
        document.getElementById("mcpplayeraudios").innerHTML = s;
        if (sChannels) {
            sChannels = '<ul>' + sChannels + '</ul>';
        }
        document.getElementById("mcpchannels").innerHTML = sChannels;
        this.iCurrentSong = sSongId;
        this.#findPlaylistId();

        // update playlist: highlight correct song
        document.getElementById("mcpplaylist").innerHTML = this.#genPlaylist();
        document.getElementById("mcpdownloads").innerHTML = this.#genDownloads();

        this.#playerheightSet();
        var sSonginfos = this.#genSonginfos();
        document.getElementById("mcpplayersonginfo").innerHTML = sSonginfos;
        this.#playerheightAdjust();

        // document.getElementById("mcptitle").innerHTML = sSonginfos ? '' : this.getSongTitle();
        document.getElementById("mcptitle").innerHTML = this.getSongTitle();

        // update links in the document
        var oAList = document.getElementsByTagName("A");
        for (var i = 0; i < oAList.length; i++) {
            oLink = oAList[i];
            if (oLink.className === "songbtn icon-play songbtnactive") {
                oLink.className = 'songbtn icon-play';
            }
        }
        var o = document.getElementById('mcpaudioPlay' + sSongId).className += ' songbtnactive';

        // play
        this.iCurrentTime = false;

        if (bLastChannelExist) {
            sFirstChannel = this.sCurrentChannel;
        }
        this.sCurrentChannel = false;
        this.setChannel(sFirstChannel);
        this.playeraction("play", true);

        this.#showInfo((sSongId + 1) + "/ " + this.aPL.length + "<br>&laquo;" + this.aPL[sSongId]["title"] + "&raquo;");

        if (this.cfg.settings.autoopen) {
            this.maximize();
        }

        return true;
    };

    /**
     * adjust player window after resize by showing other song content or status bar.
     * in the lower third top property will be decreased by the delta; in the
     * middle third it will be decreased by the half delta. In the upper delta there
     * is no change - it means: the window size increases simply downwards
     * 
     * @private
     * @returns {undefined}
     */
    #playerheightAdjust() {
        // remark: by default the position is fixed with css bottom attribute;
        // without drag and drop it resizes automatically
        if (typeof addi !== 'undefined' && this.cfg.settings.movable) {
            // show songinfos with adjusting the client height of player window
            var o = document.getElementById("mcpwrapper");
            var iTop = o.style.top.replace('px', '') / 1;
            var iMidOfWindow = iTop + o.clientHeight / 2;
            var iHeight = document.documentElement.clientHeight;
            if (iMidOfWindow > iHeight / 3) {
                var iHeightDelta = o.clientHeight - this._iHeightPlayerWindow;
                o.style.top = (iMidOfWindow > 2 * iHeight / 3 ? (iTop - iHeightDelta) : (iTop - iHeightDelta / 2)) + 'px';
            }
            this.#playerheightSet();
        }
    };

    /**
     * store height oft player main window; called after initilaizing the player
     * and in #playerheightAdjust for updates
     * 
     * @private
     * @returns {undefined}
     */
    #playerheightSet() {
        this._iHeightPlayerWindow = document.getElementById("mcpwrapper").clientHeight;
    };

    // ----------------------------------------------------------------------
    /**
     * set channels to switch between stereo/ surround
     * @see getAllAudioChannels() to get all valid channels for a song
     *
     * @param  {string}  sChannelId  number of audiochannels; typically one of "2.0" or "5.1"
     * @return {boolean}
     */
    setChannel(sChannelId) {

        var oALI = false;
        var oLI2 = false;

        // Link deaktivieren
        var oDiv = document.getElementById("mcpchannels");
        var oLI = oDiv.getElementsByTagName("LI");
        if (oLI.length) {
            for (var i = 0; i < oLI.length; i++) {
                oALI = oLI[i].getElementsByTagName("A");
                if (oALI && oALI.length > 0) {
                    oALI[0].className = "";
                    if (oALI[0].innerHTML && oALI[0].innerHTML === sChannelId) {
                        oLI2 = oALI[0].parentNode;
                        oALI[0].className = "active";
                    }
                }
                oLI[i].className = "";
            }
        }
        if (oLI2) {
            oLI2.className = "active";
        }
        var bIsPlaying = this.isPlaying();

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

            this.#fadeOut(this.sCurrentChannel);
            // this.oAudio.volume = 0;
            // oAudio.pause();
        }

        this.oAudio = false;
        if (sChannelId) {
            // document.getElementById("lnkaudio"+id).className="active";
            oAudioTmp4ChannelSwitch = document.getElementById("mcp" + sChannelId);
            oAudioTmp4ChannelSwitch.idurationchange = 0;
            oAudioTmp4ChannelSwitch.isStream = false;
            oAudioTmp4ChannelSwitch.lastDuration = false;
            this.oAudio = oAudioTmp4ChannelSwitch;
            if (this.oAudio) {
                if (bIsPlaying) {
                    this.#wait4Audio(this.oAudio, this.iCurrentTime);
                }

                this.oAudio.volume = this.cfg.settings.volume;

                document.getElementById('mcptimeplayed').innerHTML = '?:??';
                document.getElementById('mcptimetotal').innerHTML = '?:??';
                document.getElementById('mcptime').style.display = 'block';

                // --------------------------------------------------
                // draw / update time display
                // --------------------------------------------------
                this.oAudio.addEventListener("durationchange", function () {
                    if (oAudioTmp4ChannelSwitch.duration === Infinity) {
                        oAudioTmp4ChannelSwitch.isStream = true;
                    } else {
                        if (oAudioTmp4ChannelSwitch.lastDuration !== oAudioTmp4ChannelSwitch.duration) {
                            oAudioTmp4ChannelSwitch.idurationchange++;
                            oAudioTmp4ChannelSwitch.lastDuration = oAudioTmp4ChannelSwitch.duration;
                            if (oAudioTmp4ChannelSwitch.idurationchange > 3) {
                                oAudioTmp4ChannelSwitch.isStream = true;
                            }
                        }
                    }
                });
                oAudioTmp4ChannelSwitch.addEventListener("timeupdate", function () {

                    document.getElementById('mcpprogressdiv').style.display = oAudioTmp4ChannelSwitch.isStream ? 'none' : '';
                    document.getElementById('mcptime').style.display = oAudioTmp4ChannelSwitch.isStream ? 'none' : 'block';

                    // player buttons
                    document.getElementById('mcppause').style.display = oAudioTmp4ChannelSwitch.isStream ? 'none' : 'block';
                    document.getElementById('mcpbackward').style.display = oAudioTmp4ChannelSwitch.isStream ? 'none' : 'block';
                    document.getElementById('mcpforward').style.display = oAudioTmp4ChannelSwitch.isStream ? 'none' : 'block';

                    if (!oAudioTmp4ChannelSwitch.currentTime) {
                        document.getElementById('mcptimeplayed').innerHTML = '-:--';
                        document.getElementById('mcptimetotal').innerHTML = '-:--';
                        return false;
                    }
                    if (oAudioTmp4ChannelSwitch.isStream) {
                        return false;
                    }

                    var s = parseInt(oAudioTmp4ChannelSwitch.currentTime % 60);
                    var m = parseInt((oAudioTmp4ChannelSwitch.currentTime / 60) % 60);
                    if (s < 10) {
                        s = "0" + s;
                    }
                    var s2 = parseInt(oAudioTmp4ChannelSwitch.duration % 60);
                    var m2 = parseInt((oAudioTmp4ChannelSwitch.duration / 60) % 60);
                    if (s2 < 10) {
                        s2 = "0" + s2;
                    }
                    document.getElementById('mcptimeplayed').innerHTML = m + ':' + s;
                    document.getElementById('mcptimetotal').innerHTML = m2 + ':' + s2;

                    // since v1.1: div instead canvas
                    var oProgressbar = document.getElementById('mcpprogressbar');
                    if (oProgressbar) {
                        oProgressbar.style.width = oAudioTmp4ChannelSwitch.currentTime / oAudioTmp4ChannelSwitch.duration * 100 + '%';
                    }
                    /*
                    var canvas = document.getElementById('mcpprogresscanvas');
                    if (canvas.getContext) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        var iAlpha = 0.05 + oAudioTmp4ChannelSwitch.currentTime / oAudioTmp4ChannelSwitch.duration / 10 * 1;
                        ctx.fillStyle = "rgba(0,0,0, " + iAlpha + ")";
                        var fWidth = Math.round((oAudioTmp4ChannelSwitch.currentTime / oAudioTmp4ChannelSwitch.duration) * (canvas.width));
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
                    */
                }, false);

                // --------------------------------------------------
                //set up mouse click to control position of audio
                // --------------------------------------------------
                document.getElementById('mcpprogressdiv').addEventListener("click", function (event) {
                    if (event.x !== undefined && event.y !== undefined) {
                        var x = event.x;
                    } else {
                        var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    }
                    var oSelf = document.getElementById('mcpprogressdiv');
                    var oWrapper = document.getElementById('mcpwrapper');
                    x -= oSelf.offsetLeft + oWrapper.offsetLeft;
                    if (oAudioTmp4ChannelSwitch && oAudioTmp4ChannelSwitch.currentTime) {
                        oAudioTmp4ChannelSwitch.currentTime = oAudioTmp4ChannelSwitch.duration * (x / oSelf.clientWidth);
                    }
                }, true);

                // --------------------------------------------------
                // draw / update volumebar
                // --------------------------------------------------
                oAudioTmp4ChannelSwitch.addEventListener("volumechange", function () {
                    // since v1.1: div instead canvas
                    var oProgressbar = document.getElementById('mcpvolumebar');
                    if (oProgressbar) {
                        oProgressbar.style.width = oAudioTmp4ChannelSwitch.volume * 100 + '%';
                    }
                    /*
                    var canvasV = document.getElementById('mcpvolumecanvas');

                    if (canvasV.getContext) {
                        var ctxV = canvasV.getContext("2d");
                        ctxV.clearRect(0, 0, canvasV.width, canvasV.height);
                        var iAlpha = 0.05 + oAudioTmp4ChannelSwitch.volume / 10 * 1;
                        ctxV.fillStyle = "rgba(0,0,0, " + iAlpha + ")";
                        var fWidthV = Math.round(oAudioTmp4ChannelSwitch.volume * canvasV.width);
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
                    */
                }, false);

                // change volume 
                this.oAudio.volume = this.cfg.settings.volume - 0.01;
                this.oAudio.volume = this.cfg.settings.volume;


                // --------------------------------------------------
                //set up mouse click to control volume of audio
                // --------------------------------------------------
                document.getElementById('mcpvolumediv').addEventListener("click", function (event) {
                    if (event.x !== undefined && event.y !== undefined) {
                        var x = event.x;
                    } else {
                        var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    }
                    
                    var oSelf = document.getElementById('mcpvolumediv');
                    var oWrapper = document.getElementById('mcpwrapper');
                    x -= oSelf.offsetLeft + oWrapper.offsetLeft;
                    try {
                        localStorage.setItem("amcp.volume", x / oSelf.clientWidth);
                        oAudioTmp4ChannelSwitch.volume = (x / oSelf.clientWidth);
                    } catch (err) {
                        console.error("Error:" + err);
                    }
                }, true);
                /*
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
                        oAudioTmp4ChannelSwitch.volume = (x / canvas.clientWidth);
                    } catch (err) {
                        console.error("Error:" + err);
                    }
                }, true);
                */
                // --------------------------------------------------
                // set up audio event
                // --------------------------------------------------
                oAudioTmp4ChannelSwitch.addEventListener('ended', function () {
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
    setConfig(aCfg) {
        this.cfg = realMerge(this.cfg, aCfg);
    };

    // ----------------------------------------------------------------------
    /**
     * set volume; it works only if a song is playing
     * @example
     * <pre>
     * &lt;button onclick="oMcPlayer.setVolume(0.75)">75%&lt;/button>
     * </pre>
     *
     * @param {float} iNewVol volume (0..1)
     * @return {boolean}
     */
    setVolume(iNewVol) {
        this.cfg.settings.volume = iNewVol;
        localStorage.setItem("amcp.volume", this.cfg.settings.volume);
        if (this.oAudio) {
            this.oAudio.volume = iNewVol;
            // this._fade(iNewVol, this.getAudioChannels());
            return true;
        }
        return false;
    };

    /**
     * wait for other audio until it reaches the given timestamp
     * @private
     * @param  {audio_object} oAudio       audioobject
     * @param  {integer}      iStartTime   timestamp where to start the audio
     */
    #wait4Audio(oAudio, iStartTime) {

        oAudio.volume = 0.001;
        oAudio.play();

        if (iStartTime) {
            oAudio.currentTime = iStartTime;
        }
        return true;
    };

    /**
     * fade an audio in or out to a given final volume
     * @param  {float}    finalVolume     final volume (0 = muted or 1 = max)
     * @param  {string}   sChannelId      number of audio ... one of "2.0" | "5.1"
     * @return {boolean}
     */
    fade(finalVolume, sChannelId) {

        this.bIsFading = true;
        var o = document.getElementById("mcp" + sChannelId);
        if (!o) {
            return false;
        }
        var iVol = o.volume;
        var iInc = (finalVolume < iVol ? -this.iVolInc : this.iVolInc);

        iVol += iInc;
        if ((finalVolume === 0 && iVol > 0) || (finalVolume > 0 && iVol < finalVolume)) {
            o.volume = iVol;
            window.setTimeout(this.name + ".fade(" + finalVolume + ", \'" + sChannelId + "\')", this.iTimer);
        } else {
            this.bIsFading = false;
            o.volume = finalVolume;
            if (iVol <= 0) {
                o.pause();
            }
        }
        return true;
    };

    /**
     * fadeout an audio
     * @private
     * @param  {string}   sChannelId      number of audio ... one of "2.0" | "5.1"
     * @return {boolean}
     */
    #fadeOut(sChannelId) {
        this.fade(0, sChannelId);
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
     * @return {string}
     */
    getAudioChannels() {
        return this.sCurrentChannel;
    };

    /**
     * get an array of valid channels of the current song; if no song is active
     * it returns false.
     *
     * @return {array}
     */
    getAllAudioChannels() {
        var oSong = this.getSong();
        if (!oSong) {
            return false;
        }
        var aReturn = [];
        for (var sChannel in oSong['sources']) {
            aReturn.push(sChannel);
        }
        return aReturn;
    };

    /**
     * get duration in [sec] of the current song
     * @return {float}
     */
    getAudioDuration() {
        if (!this.sCurrentChannel) {
            return false;
        }
        return this.oAudio.duration;
    };

    /**
     * get network state of current audio (i.e. loading / idle)
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/networkState
     * @returns {Integer|false}
     */
    getAudioNetworkstate() {
        var oAudioTmp = this.oAudio ? this.oAudio : document.getElementById("mcp" + this.getAudioChannels());
        return oAudioTmp ? oAudioTmp.networkState : false;
    };

    /**
     * get position in [sec] of the current song
     * @return {float}
     */
    getAudioPosition() {
        if (!this.sCurrentChannel) {
            return false;
        }
        return this.oAudio.currentTime;
    };

    /**
     * get document state of current audio
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
     * @returns {Integer|false}
     */
    getAudioReadystate() {
        var oAudioTmp = this.oAudio ? this.oAudio : document.getElementById("mcp" + this.getAudioChannels());
        return oAudioTmp ? oAudioTmp.readyState : false;
    };

    /**
     * get used source url of the current song
     * @return {float}
     */
    getAudioSrc() {
        if (!this.sCurrentChannel) {
            return false;
        }
        return this.oAudio.currentSrc;
    };

    /**
     * get current volume (a value between 0..1)
     * @return {float}
     */
    getVolume() {
        if (this.oAudio) {
            this.cfg.settings.volume = this.oAudio.volume;
            return this.cfg.settings.volume;
        }
        return false;
    };

    /**
     * get playlist with all songtitles and its sources
     * @return {array}
     */
    getPlaylist() {
        return (!this.aPL || !this.aPL.length) ? false : this.aPL;
    };

    /**
     * get playlist with all songtitles and its sources
     * @return {array}
     */
    getPlaylistCount() {
        return (this.aPL ? this.aPL.length : false);
    };

    /**
     * get playlist with all songtitles and its sources
     * @return {array}
     */
    getPlayorder() {
        return this.aPlayorderList;
    };

    /**
     * get current song; you get an array with the song title and
     * all its audio sources and mime types
     * @return {array}
     */
    getSong() {
        if (!this.aPL || !this.aPL.length) {
            return false;
        }
        return this.aPL[this.iCurrentSong];
    };

    /**
     * get id of the currently active song; first song starts with 0;
     * value -1 means player did not start to play yet.
     * @returns {Number}
     */
    getSongId() {
        return this.iCurrentSong;
    };

    /**
     * get array element of the currently active song
     * @private
     * @param  {string}   sKey   key of song item; one of title|artist|album|year|image
     * @returns {string}
     */
    _getSongItem(sKey) {
        var oSong = this.getSong();
        return oSong ? oSong[sKey] : false;
    };

    /**
     * get title of the currently active song
     * @returns {string}
     */
    getSongTitle() {
        return this._getSongItem('title');
    };

    /**
     * get artist of the currently active song
     * @returns {string}
     */
    getSongArtist() {
        return this._getSongItem('artist');
    };

    /**
     * get album of the currently active song
     * @returns {string}
     */
    getSongAlbum() {
        return this._getSongItem('album');
    };

    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    getSongYear() {
        return this._getSongItem('year');
    };

    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    getSongImage() {
        return this._getSongItem('image');
    };

    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    getSongGenre() {
        return this._getSongItem('genre');
    };

    /**
     * get publishing year of the currently active song
     * @returns {string}
     */
    getSongBpm() {
        return this._getSongItem('bpm');
    };

    /**
     * get url for the song i.e. where to buy it
     * @returns {string}
     */
    getSongUrl() {
        return this._getSongItem('url');
    };

    /**
     * get id of the currently active song in the playlist (if shuffled)
     * @see getSongId() to get the song based on position in document
     *
     * @returns {Number}
     */
    getPlaylistId() {
        return this.iPlaylistId;
    };

    /**
     * get boolean value - volume is muted?
     * @returns {Boolean}
     */
    isMuted() {
        return (this.oAudio && (this.oAudio.muted || !this.oAudio.volume));
    };

    /**
     * get boolean value - playing audio is paused?
     * @returns {Boolean}
     */
    isPaused() {
        return (this.oAudio && this.oAudio.paused && this.oAudio.currentTime !== 0);
    };
    /**
     * get boolean value - audio is playing? It returns true if audio is
     * playing and false if paused or stopped.
     * @returns {Boolean}
     */
    isPlaying() {
        return (this.oAudio && !this.oAudio.paused);
    };
    /**
     * get boolean value - is shuffling mode on?
     * @returns {Boolean}
     */
    isRepeatlist() {
        return (this.cfg.settings.repeatlist
            ? !!this.cfg.settings.repeatlist
            : false);
    };
    /**
     * get boolean value - is shuffling mode on?
     * @returns {Boolean}
     */
    isShuffled() {
        return (this.cfg.settings.shuffle
            ? this.cfg.settings.shuffle
            : false);
    };
    /**
     * get boolean value - playing audio is stopped
     * @returns {Boolean}
     */
    isStopped() {
        return (!this.oAudio || this.oAudio.currentTime === 0);
    };
    /**
     * get boolean value - is the curemt played audio a stream?
     * remark: it is detected by audio.duration == Infinity (Chrome)
     * or count of durationchange events (used in Firefox)
     * @since 0.33
     * @returns {Boolean}
     */
    isStream() {
        return (this.oAudio && this.oAudio.isStream);
    };

    // ----------------------------------------------------------------------
    /**
     * update window positions if the browser is resized.
     * @returns {undefined}
     */
    updateOnResize() {
        var sCurrent = document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight;
        if (this.sScreensize && sCurrent == this.sScreensize) {
            // no resize detected
            return false;
        }
        this.sScreensize = sCurrent;

        // --- check window status
        var aWindowsNames = ['player', 'about', 'download', 'playlist'];
        for (var i = 0; i < aWindowsNames.length; i++) {
            var sBaseId = aWindowsNames[i];
            var oDiv = this.#togglehelperGetDiv(sBaseId);
            var iTop = oDiv.style.top.replace('px', '') / 1;
            var iLeft = oDiv.style.left.replace('px', '') / 1;

            if (this.isVisibleBox(sBaseId)) {
                // if iTop
                if (iTop < 0 || iTop > (document.documentElement.clientHeight - 50)) {
                    // player-window: put on buttom side
                    // others: remove top to use css default
                    oDiv.style.top = sBaseId === 'player'
                        ? (document.documentElement.clientHeight - oDiv.clientHeight - 50) + 'px'
                        : '';
                    // TODO: remove position in localstore 
                }
                if (iLeft > (document.documentElement.clientWidth - oDiv.clientWidth)) {
                    oDiv.style.left = (document.documentElement.clientWidth - oDiv.clientWidth) + 'px';
                }
                if (iLeft < 0) {
                    oDiv.style.left = '0px';
                }
            } else {
                // fast minimize if a window should be minimized but is visible
                if (iTop < (document.documentElement.clientHeight + this._iMinDelta)) {
                    this.toggleBoxAndButton(sBaseId, 'minimize', true);
                }
            }
        }
    };

    /**
     * get boolean value - is the curemt played audio a stream?
     * remark: it is detected by audio.duration == Infinity (Chrome)
     * or count of durationchange events (used in Firefox)
     * @since 0.33
     * @returns {Boolean}
     */
    updateStatus() {
        var iNet = this.getAudioNetworkstate();
        if (iNet) {
            var iStatus = this.getAudioReadystate();
            document.getElementById('mcpstatusnetwork').innerHTML = '<span class="networkstate' + iNet + '" title="' + this.cfg.aPlayer.status.networkstate[iNet][1] + '">' + this.cfg.aPlayer.status.networkstate[iNet][0] + '</span>';
            document.getElementById('mcpstatusready').innerHTML = '<span class="readystate' + iStatus + '" title="' + this.cfg.aPlayer.status.readystate[iStatus][1] + '">' + this.cfg.aPlayer.status.readystate[iStatus][0] + '</span>';
        } else {
            document.getElementById('mcpstatusnetwork').innerHTML = '-';
            document.getElementById('mcpstatusready').innerHTML = '-';
        }
        this.updateOnResize();
        return true;
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
    #getName() {
        // search through the global object for a name that resolves to this object
        for (var name in this.global) {
            if (this.global[name] === this) {
                return this.#setName(name);
            }
        }
    };

    /**
     * internal helper function - called in getName()
     * set internal varible
     * @private
     * @param {string} sName  name of the player object
     * @returns {string}
     */
    #setName(sName) {
        this.name = sName;
        return this.name;
    };

    // ----------------------------------------------------------------------
    // init
    // ----------------------------------------------------------------------
    /**
     * initialize player
     * @param {string} sContainerId  id of a div where to put the player. if false player will be added to body
     * @return {boolean}
     */
     init(sContainerId) {
        this._sContainerId=sContainerId;
        this.#getName();            // detect name of the object variable that initialized the player
        this.#generatePlaylist();   // scan audios on webpage
        this.#initHtml();           // generate html for the player        
        if (typeof addi !== 'undefined') {
            addi.init();
        }
        this.minimizeBox('about', true);
        this.minimizeBox('download', true);
        this.minimizeBox('playlist', true);
        window.setInterval(this.name + ".updateStatus()", 500);
        return true;
    };

}

var oAudioTmp4ChannelSwitch = false;
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
