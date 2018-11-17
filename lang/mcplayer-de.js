var aAmcLang = {
    about: {
        description: '<strong>A</strong>xels <strong>M</strong>ulti <strong>C</strong>hannel <strong>Player</strong>.<br><br>Dies ist ein webbasierter HTML5-Player.<br>Sein Fokus liegt auf dem Handling von Medien in stereo und surround ein und desselben Titels.',
        labeldownload: 'Herunterladen:<br>',
        labellicense: 'Lizenz: ',
        license: 'GPL 3.0',
        labelurl: 'Projekt-URL:<br>',
        labeldocurl: 'Dokumentation:<br>',
    },
    links: {
        play: {
                title: 'Abspielen'
        }
    },
    aPlayer: {
        buttons: {
            // 
            // player controls
            //
            play: {
                title: 'Abspielen'
            },
            pause: {
                title: 'Pause'
            },
            stop: {
                title: 'Anhalten'
            },
            backward: {
                title: 'zurück'
            },
            forward: {
                title: 'vorwärts'
            },
            jumpprev: {
                title: 'voriger Titel'
            },
            jumpnext: {
                title: 'nächster Titel'
            },
            audiochannels: {
                title: 'zwischen stereo/ surround umschalten',
                noswitch: 'stereo/ surround Umschaltung deaktiviert (Mobilger&auml;t oder Opera Presto Engine)'
            },
            // 
            // volume buttons
            //
            volmute: {
                title: 'stumm schalten'
            },
            volfull: {
                title: 'volle Lautst&auml;rke'
            },
            // 
            // other buttons
            //
            about: {
                title: 'ueber ...'
            },
            playlist: {
                title: 'Titelliste anzeigen/ ausblenden'
            },
            repeat: {
                title: 'Wiederholung'
            },
            shuffle: {
                title: 'Zufallswiedergabe'
            },
            download: {
                title: 'Download anzeigen/ ausblenden'
            },
            maximize: {
                label: 'Player',
                title: 'Playerfenster anzeigen'
            },
            minimize: {
                label: '',
                title: 'Minimieren'
            },
            statusbar: {
                label: '',
                title: 'Statusbar mit Netzwerk und Mediastatus'
            }
        },
        bars: {
            volume: {
                title: 'Lautst&auml;rke setzen'
            },
            progress: {
                title: 'Abspielposition setzen'
            }
        },
        about: {
            title: '&Uuml;ber...'
        },
        playlist: {
            title: 'Titelliste'
        },
        download: {
            title: 'Audios herunterladen',
            noentry: 'Bitte ein Audio w&auml;hlen oder abspielen, um dessen Downloads zu zeigen.',
            hint: 'Verwende die rechte Maustaste oder das Kontextmen&uuml;, um das Linkziel zu speichern'
        },
        songinfo: {
            album: 'Album',
            year: 'Jahr',
            bpmspeed: 'Geschwindigkeit',
            bpm: 'Bpm',
            genre: 'Genre',
            url: 'Webadresse'
        },
        status:{
            networkstate: {
                label: 'Netzwerk',                
                0: [ 'Leer', '0 = NETWORK_EMPTY - Audio/Video wurde noch nicht initialisiert'],
                1: [ 'Idle', '1 = NETWORK_IDLE - Audio/Video ist aktiv und hat eine Ressource ausgew&auml;hlt, verwendet aber nicht das Netzwerk'],
                2: [ 'Laden','2 = NETZWERK_LADEN - der Browser l&auml;dt Daten herunter'],
                3: [ 'Keine Quelle','3 = NETZWERK_NO_SOURCE - keine Audio-/Videoquelle gefunden']
                
            },
            readystate: {
                label: 'Status',
                0: ['Nichts', '0 = HAVE_NOTHING - keine Information, ob das Audio/Video bereit ist oder nicht'],
                1: ['Metadaten vorh.', '1 = HAVE_METADATA - Metadaten für das Audio/Video sind bereit'],
                2: ['OK, Aktuelle Daten vorh.', '2 = HAVE_CURRENT_DATA - Daten für die aktuelle Wiedergabeposition sind verfügbar, aber nicht genügend Daten für eine Wiedergabe'],
                3: ['OK, Zukunftsdaten', '3 = HAVE_FUTURE_DATA - Daten für den aktuellen und mindestens den n&auml;chsten Frame sind verf&uuml;gbar'],
                4: ['OK, genug Daten', '4 = HAVE_ENOUGH_DATA - genug Daten vorhanden, um mit dem Spielen zu beginnen']
            }
        }            
    }
};