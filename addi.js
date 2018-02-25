/**
 *  
 * ADDI = Axels Drag and drop implementation
 * 
 *   create draggable divs on screen if they have a defined class
 *   (named "draggable" by default - but you can use any other name)
 * 
 * @author    Axel Hahn
 * @version   0.02
 *
 * @this addi
 * 
 * @example
 * // make all divs with class "draggable" be movable on screen
 * addi.init();
 * 
 * @constructor
 * @return nothing
 */
var addi = function(){

    this.iFenceWidth=document.body.style.width;
    this.iFenceHeight=document.body.style.height;
    
    return {
        _saveData: [],
        _dragClass: 'draggable',
        
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
        init : function(sClass){
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
         * get a top left position to fix current position and make a div 
         * fully visible
         * @see move()
         * 
         * @private
         * @param {object} oDiv2Drag  movable object
         * @param {type} xpos
         * @param {type} ypos
         * @returns {addiaddi.addiAnonym$0.getVisibl_getVisiblePositionym$2}
         */
        _fixVisiblePosition : function(oDiv2Drag,xpos,ypos){
            // get screensize and max position of a div
            var iMaxX=document.body.style.width  ? document.body.style.width-oDiv2Drag.clientWidth : xpos;
            var iMaxY=document.body.style.height ? document.body.style.height-oDiv2Drag.clientHeight : ypos;

            xpos=Math.max(0,xpos);
            xpos=Math.min(iMaxX,xpos);
            
            ypos=Math.max(0,ypos);
            ypos=Math.min(iMaxY,ypos);

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
        _getVarname : function(s){
            return 'addi.saveddiv-'+s;
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
        _styleSave : function(oDiv2Drag){
            aStyles = window.getComputedStyle(oDiv2Drag);
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
        _styleRestore : function(oDiv2Drag){
            for (var sAttr in this._savstyles){
                oDiv2Drag.style[sAttr]=this._saveData[oDiv2Drag.id][sAttr];
            }
            return true;
        },
        // ------------------------------------------------------------
        // public functions
        // ------------------------------------------------------------
        
        /**
         * make a single div movable: 
         * - add listener and 
         * - restore last saved position (if class "saveposition" exists)
         * 
         * @param {object} oDiv2Drag  movable object
         * @returns {undefined}
         */
        initDiv: function(oDiv2Drag,oDiv2Click){
            var sDivId=oDiv2Drag.id;
            if(!sDivId){
                // oDiv2Drag.id=''
                return false;
            }
            // add events
            // using atributes instead of addEventListener
            o=(oDiv2Click ? oDiv2Click : oDiv2Drag);
            o.onmousedown = function (event) {
                addi.startMoving(document.getElementById(sDivId),event);
            };
            o.onmouseup = function () {
                addi.stopMoving(document.getElementById(sDivId));
            };
            // for FF only:
            // oDiv2Drag.setAttribute('draggable', 'true');
            
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
        load : function(oDiv2Drag){
            var id=this._getVarname(oDiv2Drag.id);
            var aData=localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : false;
            if(aData && aData.left && aData.top){
                // this._styleSave(oDiv2Drag);
                this.move(oDiv2Drag,aData.left,aData.top);
                // this._styleRestore(oDiv2Drag);
            }
            return aData;
        },
        /**
         * move obj to new position and store position in localstorage
         * called from startMoving() and _load()
         * 
         * @param {object} oDiv2Drag  movable object
         * @param {integer} xpos      position x
         * @param {integer} ypos      position y
         * @returns {undefined}
         */
        move : function(oDiv2Drag,xpos,ypos){
            oDiv2Drag.style.bottom = 'auto';
            var aPos=this._fixVisiblePosition(oDiv2Drag,xpos,ypos);
            oDiv2Drag.style.left = aPos['xpos'] + 'px';
            oDiv2Drag.style.top = aPos['ypos'] + 'px';
            this.save(oDiv2Drag);
            return true;
        },
        /**
         * save position of the given dom object
         * 
         * @param {object} oDiv2Drag  movable object
         * @returns {undefined}
         */
        save : function(oDiv2Drag){
            aData={
                left: oDiv2Drag.style.left.replace('px',''),
                top:  oDiv2Drag.style.top.replace('px','')
            };
            localStorage.setItem(this._getVarname(oDiv2Drag.id),JSON.stringify(aData));
        },

        /**
         * called by onmousedown event
         * 
         * @param {object} oDiv2Drag  movable object
         * @param {object} evt        event
         * @returns {undefined}
         */
        startMoving : function(oDiv2Drag,evt){
            if (oDiv2Drag.className.indexOf(this._dragClass)===false){
                return false;
            }
            
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY;

            // save some styles
            this._styleSave(oDiv2Drag);

            iDivWidth = parseInt(oDiv2Drag.style.width),
            iDivHeight = parseInt(oDiv2Drag.style.height);

            oDiv2Drag.style.cursor='move';
            
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
        stopMoving : function(oDiv2Drag){
            oDiv2Drag.style.cursor='default';
            // retore styles
            this._styleRestore(oDiv2Drag);
            // oDiv2Drag.style.transition=this._saveData[oDiv2Drag.id].transition;
            // this._saveData[oDiv2Drag.id]=false;
            
            document.onmousemove = function(){};
        },
        /**
         * reset style, onmousedown, onmouseup to make divs unmovable
         * @param {string} sClass  optional: class of draggable elements; default: "draggable"
         * @param {bool}   bRemoveLocalstorage  flag: remove saved local variable too
         * @returns {undefined}
         */
        reset : function(sClass,bRemoveLocalstorage){
            if(sClass){
                this._dragClass='draggable';
            }
            // scan all elements with class draggable and reset
            var oList = document.getElementsByClassName(this._dragClass);
            if(oList && oList.length){
                for (var i = 0; i < oList.length; i++) {
                    this.resetDiv(oList[i]);
                }
            }
        },
        /**
         * reset a single div and make it unmovable
         * @param {object} oDiv2Drag            movable object 
         * @param {bool}   bRemoveLocalstorage  flag: remove saved local variable too
         * @returns {undefined}
         */
        resetDiv : function(oDiv2Drag, bRemoveLocalstorage){
            oDiv2Drag.onmousemove = null;
            oDiv2Drag.onmouseup = null;
            oDiv2Drag.onmousedown = null;
            // FF only
            // oDiv2Drag.removeAttribute('draggable');
            if(bRemoveLocalstorage){
                localStorage.delItem(this._getVarname(oDiv2Drag.id));
            }
        }
    };
}();
