/* var com_conf = {
     'reco_type': 'alsobuy',
     'pids': 1033099101,
     'type': 12,
     'div': 'search_tuijian_content_alsobuy',
     'url': 'http://tuijian.dangdang.com/recobar2/',
     'css': 'shoppingcart_tuijian.css'
 };*/
(function(window, $, com_conf, data){

    function loadJss(jss){
        var srcs = $.isArray(jss) ? jss : [jss];
        var head = document.getElementsByTagName('HEAD')[0], script = '';
        for(var i in srcs) {
            var script = document.createElement('SCRIPT');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', srcs[i]);
            head.appendChild(script);
        }        
    }

    function loadCss(css){
        var h=document.getElementsByTagName('head'),link=document.createElement('link');
        link.rel="stylesheet";
        link.type="text/css";
        link.href=css;
        h[0].appendChild(link);        
    }

    function loadJs(src, callback){
        var head = document.getElementsByTagName('HEAD')[0];
        var script = document.createElement('SCRIPT');
        var args = Array.prototype.slice.call(arguments, 2);
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);
        if(typeof(callback) != 'undefined') {
            script.onload = function() {callback(args)};
            script.onreadystatechange = function() {
                if(this.readyState == 'complete' || this.readyState == 'loaded') {
                    callback(args);
                }
            }
        }
        head.appendChild(script);              
    }

    function initRender(args){
        try{
            var div = args[0];
            var data = $(eval('recobar_data'+args[1]));
            $("#"+div).empty().append(data);
            var conf = {
                'container': $("#"+div).find('div.shoppingcart_recommend_list > ul'),
                'LPAGE': $("#"+div).find('div.left'),
                'RPAGE': $("#"+div).find('div.right'),
                'PAGES': $("#"+div).find('div.recommend_fanye > span')
            }
            RECOBAR(conf, data).init();
        }catch(e){

        }
    }

    function loadData(com_conf){
        var reco_type = com_conf.reco_type.split(',');
        var div = com_conf.div.split(',');
        var src;
        for(var i in reco_type) {
            src = com_conf.url + "jsonp.php?type=" + com_conf.type + "&pids=" + com_conf.pids + "&reco_type=" + reco_type[i];
            loadJs(src, initRender, div[i], reco_type[i]);
        }
    }

    function initBase(com_conf){
        //loadJss(com_conf.js);
        loadCss(com_conf.url + '/css/' + com_conf.css);
        loadData(com_conf);
    };

    function initConf(conf){
        return {
            'rows': conf.rows ? conf.rows : 1,
            'type': conf.type ? conf.type : 1, 
            'reco_type': conf.reco_type ? conf.reco_type : 'alsobuy',
            'container': conf.container ? conf.container : '',
            'LPAGE': conf.LPAGE ? conf.LPAGE : '',
            'RPAGE': conf.RPAGE ? conf.RPAGE : '',
            'PAGES': conf.PAGES ? conf.PAGES : ''
        };
    }

    function initData(data){
        var data = data ? data : []; 
        data = $(data).find("div.lie");
        return data;
    }

    function Element(conf, data){
        this.CONF = initConf(conf);
        this.DATA = initData(data);
    };

    var elementEvents = {
        init : function(){
           this.initEvent();
        },
        initEvent : function(){
            this.lrloop();
            this.pageindex();
        },
        lrloop : function(){
            var pages = this.DATA.length;
            var pagenum = 0;
            var that = this;

            $(this.CONF.LPAGE).bind('click', function(){
                pagenum = that.currentpage();
                if(--pagenum < 0) {
                    pagenum = pages-1;
                }
                that.pageRender(pagenum);
            });
            $(this.CONF.RPAGE).bind('click', function(){
                pagenum = that.currentpage();
                if(++pagenum > pages-1) {
                    pagenum = 0;
                }
                that.pageRender(pagenum);
            });
        },
        currentpage : function(){
            var pagenum = 0;
            $(this.CONF.PAGES).each(function(index, ele){
                if($(ele).hasClass('now')){
                    pagenum = index;
                }
            });
            return pagenum;    
        },
        pageindex : function(){
            var that = this;
            $(this.CONF.PAGES).each(function(index, ele){
                $(ele).bind('click', function(){
                    that.pageRender(index);
                });
            });
        },
        pageRender : function(index){
            var node = this.DATA[index] ? this.DATA[index] : undefined;
            var span = $(this.CONF.PAGES);

            if(node === undefined){
                return false;
            }

            $(span).each(function(i, j){
                if($(j).hasClass('now')){
                    $(j).removeClass('now');                            
                }
            });

            if(!$(span[index]).hasClass('now')){
                $(span[index]).addClass('now');
            }

            $(this.CONF.container).empty().append($(node));
        }
    };
    Element.prototype = elementEvents;
    window.RECOBAR = function (conf, data){
        return new Element(conf, data);
    }
    initBase(com_conf); 
})(window, jQuery, com_conf, {})
