/**
 *  
 * ADDI = Axels Drag and drop implementation
 * 
 *   create draggable divs on screen if they have a defined class
 *   (named "draggable" by default - but you can use any other name)
 * 
 * @author    Axel Hahn
 * @version   1.0
 *
 * @this addi
 * 
 * @example
 * <pre>
 * // make all divs with class "draggable" be movable on screen<br>
 * addi.init();
 * </pre>
 * 
 * @constructor
 * @return nothing
 */
var addi = function(){

    return {
        _saveData: [],
        _dragClass: 'draggable',
        _draggingClass: 'isdragging',

        // last z-index value of last activated div 
        _addi_zIndex: 100,
        
         // fixed rectangle earea whe a div can be moved
         oFence: {
            bFullscreen: true,
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        },
        
        // override existing style values while moving the div
        _savstyles:{
            transition: 'auto'
        },
        
        /**
         * detect all draggable objects on a page and init each
         * 
         * @see initDiv()
         * @param {string} sClass  optional: class of draggable elements; default: "draggable"
         * @returns {undefined}
         */
        init(sClass){
            if(sClass){
                this._dragClass=sClass;
            }
            // scan all elements with class draggable and make them movable
            var oList = document.getElementsByClassName(this._dragClass);
            if(oList && oList.length){
                for (var i = 0; i < oList.length; i++) {
                    this.initDiv(oList[i], false);
                }
            }
        },
        // ------------------------------------------------------------
        // private functions
        // ------------------------------------------------------------
        /**
         * get a top left position {xpos, ypos} to fix current position and 
         * make a div fully visible
         * @see move()
         * 
         * @private
         * @param {object} oDiv2Drag  movable object
         * @param {type} xpos
         * @param {type} ypos
         * @returns {object}
         */
        _fixVisiblePosition(oDiv2Drag,xpos,ypos){
            
            this._updateFence(oDiv2Drag.style.paddingLeft);
            var aStyles = window.getComputedStyle(oDiv2Drag);

            var divDeltaX=0
                + parseInt(aStyles.borderLeftWidth)
                + parseInt(aStyles.borderRightWidth)
                + parseInt(aStyles.marginLeft)
                + parseInt(aStyles.marginRight)
                + parseInt(aStyles.paddingLeft)
                + parseInt(aStyles.paddingRight)
                - (window.innerWidth - document.documentElement.clientWidth) // scrollbar
                ;
            var divDeltaY=0
                + parseInt(aStyles.borderTopWidth)
                + parseInt(aStyles.borderBottomWidth)
                + parseInt(aStyles.marginTop)
                + parseInt(aStyles.marginBottom)
                // + parseInt(aStyles.paddingTop)
                //+ parseInt(aStyles.paddingBottom)
                ;

            xpos=Math.max(this.oFence.left,xpos);
            xpos=Math.min(this.oFence.left+this.oFence.width-oDiv2Drag.clientWidth-divDeltaX,xpos);

            ypos=Math.max(this.oFence.top,ypos);
            if (aStyles.position==='fixed') {                
                ypos=Math.min(this.oFence.top+this.oFence.height-oDiv2Drag.clientHeight-divDeltaY,ypos);
            }
            
            return {
                xpos: xpos,
                ypos: ypos
            };
            
        },
        /**
         * helper: get a varname for localstorage to save / get last position
         * 
         * @private
         * @param {string} s   id of movable element
         * @returns {String}
         */
        _getVarname(s){
            return 'addi.saveddiv-'+s;
        },
        /**
         * save position of the given dom object
         * 
         * @private
         * @param {object} oDiv2Drag  movable object
         * @returns {undefined}
         */
         _save(oDiv2Drag){
            aData={
                left: oDiv2Drag.style.left.replace('px',''),
                top:  oDiv2Drag.style.top.replace('px','')
            };
            localStorage.setItem(this._getVarname(oDiv2Drag.id),JSON.stringify(aData));
        },

        /**
         * helper: save attributes in a variable: transition
         * it is used for dragging: a transition slows down all movements
         * @see _styleRestore()
         * 
         * @private
         * @param {object} oDiv2Drag  movable object
         * @returns {Boolean}
         */
        _styleSave(oDiv2Drag){
            var aStyles = window.getComputedStyle(oDiv2Drag);
            // create subitem for div id
            if(this._saveData[oDiv2Drag.id] === undefined){
                this._saveData[oDiv2Drag.id]=new Object();
            };
            for (var sAttr in this._savstyles){
                // store value
                this._saveData[oDiv2Drag.id][sAttr]=aStyles.getPropertyValue(sAttr);
                // apply temp value
                oDiv2Drag.style[sAttr]=this._savstyles[sAttr];
            }
            return true;
        },
        /**
         * helper: retore attributes after moving
         * @see _styleSave()
         * @private
         * @param {object} oDiv2Drag  movable object
         * @returns {Boolean}
         */
        _styleRestore(oDiv2Drag){
            for (var sAttr in this._savstyles){
                oDiv2Drag.style[sAttr]=this._saveData[oDiv2Drag.id][sAttr];
            }
            return true;
        },
        /**
         * helper: update size of this.oFence if it is set to fullscreen in 
         * case of resizing of the browser window
         * 
         * @private
         * @returns {undefined}
         */
        _updateFence(){
            if(this.oFence.bFullscreen){
                this.oFence={
                    bFullscreen: true,
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            };
        },

        /**
         * generate an id for a draggable div that has no id yet
         * 
         * @private
         * @returns {string}
         */
        _generateId(){
            var sPrefix='generatedId-';
            var iCount=1;
            while (document.getElementById(sPrefix+iCount)){
                iCount++;
            }
            return sPrefix+iCount;
        },
        
        // ------------------------------------------------------------
        // public functions
        // ------------------------------------------------------------
        
        /**
         * make a single div movable: 
         * - add listener and 
         * - restore last saved position (if class "saveposition" exists)
         * 
         * @param {object} oDiv2Drag   movable object
         * @param {object} oDiv2Click  optional: clickable object
         * @returns {undefined}
         */
        initDiv(oDiv2Drag,oDiv2Click){
            var sDivId=oDiv2Drag.id;
            if(!sDivId){
                sDivId=this._generateId();
                oDiv2Drag.id=sDivId;
            }

            // force position: fixed
            var aStyles = oDiv2Drag.currentStyle || window.getComputedStyle(oDiv2Drag);

            // console.log(oDiv2Drag.id + ' position: ' + aStyles.position);
            if(!aStyles.position || aStyles.position=='static'  /* || aStyles.position!='fixed' */){
                // oDiv2Drag.style.position='fixed';
            }

            // add events
            // using atributes instead of addEventListener
            o=(oDiv2Click ? oDiv2Click : oDiv2Drag);
            o.onmousedown = function (event) {
                addi._isDragging=true;
                addi.startMoving(document.getElementById(sDivId),event);
            };
            o.onmouseup = function () {
                addi._isDragging=false;
                addi.stopMoving(document.getElementById(sDivId));
            };
            
            // restore last position
            if (oDiv2Drag.className.indexOf('saveposition')!==false){
                this.load(oDiv2Drag);
            }
        },
        /**
         * load stored position and apply it to given dom object
         * 
         * @param {object} oDiv2Drag  movable object
         * @returns {Array|Object|Boolean}
         */
         load(oDiv2Drag){
            var id=this._getVarname(oDiv2Drag.id);

            // detect the highest z-index
            var aStyles = oDiv2Drag.currentStyle || window.getComputedStyle(oDiv2Drag);
            if(aStyles.zIndex && aStyles.zIndex>0){
                this._addi_zIndex=Math.max(parseInt(aStyles.zIndex), this._addi_zIndex);
            }
            oDiv2Drag.style.zIndex=this._addi_zIndex++;

            var aData=localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : false;
            if(aData && aData.left && aData.top){
                this.move(oDiv2Drag,aData.left,aData.top, true);
            }
            return aData;
        },
        /**
         * move obj to new position and store position in localstorage
         * called from startMoving() and load()
         * 
         * @param {object} oDiv2Drag  movable object
         * @param {integer} xpos      position x
         * @param {integer} ypos      position y
         * @param {boolean} bNoFix    flag: skip fixing the position based on window size (is set to true in the load method)
         * @returns {undefined}
         */
        move(oDiv2Drag,xpos,ypos, bNoFix){
            oDiv2Drag.style.bottom = 'auto';
            
            var aPos=bNoFix ? { 'xpos':xpos, 'ypos':ypos } : this._fixVisiblePosition(oDiv2Drag,xpos,ypos);
            oDiv2Drag.style.left = aPos['xpos'] + 'px';
            oDiv2Drag.style.top = aPos['ypos'] + 'px';            
            this._save(oDiv2Drag);
            return true;
        },

        /**
         * called by onmousedown event
         * 
         * @param {object} oDiv2Drag  movable object
         * @param {object} evt        event
         * @returns {undefined}
         */
        startMoving(oDiv2Drag,evt){
            if (oDiv2Drag.className.indexOf(this._dragClass)===false){
                return false;
            }
            
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY;

            // save some styles
            this._styleSave(oDiv2Drag);


            if(oDiv2Drag.className.indexOf(this._draggingClass)<0){
                oDiv2Drag.className+= ' '+this._draggingClass;
            }

            // for FF only:
            // if (navigator.appCodeName==='Mozilla' && navigator.userAgent.indexOf('Firefox/')>0){
            document.body.style.userSelect='none';

            iDivWidth = parseInt(oDiv2Drag.style.width),
            iDivHeight = parseInt(oDiv2Drag.style.height);

            oDiv2Drag.style.cursor='move';
            oDiv2Drag.style.zIndex=this._addi_zIndex++;
            
            iDivLeft = oDiv2Drag.style.left ? oDiv2Drag.style.left.replace('px','') : oDiv2Drag.offsetLeft;
            iDivTop  = oDiv2Drag.style.top? oDiv2Drag.style.top.replace('px','')  : oDiv2Drag.offsetTop;
            var diffX = posX - iDivLeft,
                diffY = posY - iDivTop;
            document.onmousemove = function(evt){
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;
                addi.move(oDiv2Drag,aX,aY);
            };
            return true;
        },
        /**
         * called on mouse up event
         * 
         * @param {object} oDiv2Drag  movable object
         * @returns {undefined}
         */
        stopMoving(oDiv2Drag){
            oDiv2Drag.style.cursor='default';
            // retore styles
            this._styleRestore(oDiv2Drag);
            document.body.style.userSelect='auto';
            oDiv2Drag.className=oDiv2Drag.className.replace(' '+this._draggingClass, '');
            oDiv2Drag.className=oDiv2Drag.className.replace(this._draggingClass, '');
            
            document.onmousemove = function(){};
        },
        /**
         * reset position 
         * 
         * @param {bool}   bRemoveLocalstorage  flag: remove saved local variable too
         * @returns {undefined}
         */
         resetPos(){
            var oList = document.getElementsByClassName(this._dragClass);
            if(oList && oList.length){
                for (var i = 0; i < oList.length; i++) {
                    oList[i].style = '';
                    this._save(oList[i]);
                }
            }
        },
        /**
         * reset style, onmousedown, onmouseup to make divs unmovable again
         * 
         * @param {bool}   bRemoveLocalstorage  flag: remove saved local variable too
         * @returns {undefined}
         */
        reset(bRemoveLocalstorage){
            // scan all elements with class draggable and reset
            var oList = document.getElementsByClassName(this._dragClass);
            if(oList && oList.length){
                for (var i = 0; i < oList.length; i++) {
                    this._resetDiv(oList[i],bRemoveLocalstorage);
                }
            }
        },
        /**
         * reset a single div and make it unmovable
         * 
         * @private
         * @param {object} oDiv2Drag            movable object 
         * @param {bool}   bRemoveLocalstorage  flag: remove saved local variable too
         * @returns {undefined}
         */
        _resetDiv(oDiv2Drag, bRemoveLocalstorage){
            oDiv2Drag.onmousemove = null;
            oDiv2Drag.onmouseup = null;
            oDiv2Drag.onmousedown = null;
            oDiv2Drag.style = '';
            if(bRemoveLocalstorage){
                localStorage.removeItem(this._getVarname(oDiv2Drag.id));
            }
        }
    };
}();
