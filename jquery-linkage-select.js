/*
 *  Project:
 *  Description:
 *  Author:
 *  License:
 */

;
(function($, window, undefined) {
    var pluginName = 'linkage';
    var document = window.document;
    var emptyFn = function() {};
    var defaults = {
        afterRender: emptyFn,
        format: function(data) {
            if (!$.isArray(data)) {
                console.error('data should be array');
                return false;
            }
            return data;
        },
        forceEmpty: true,
        isRoot: false // 若为root，则渲染，不为，则等root渲染好后，再渲染
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.el = element;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype.init = function() {
        var options = this.options;
        var formatData;
        var self = this;
        this.el = $(this.el);
        if (this.el.length === 0) {
            console.error('not find el!!!');
            return;
        }

        if (options.isRoot) {
            if (options.next === undefined) {
                console.error('next is needed!');
                return;
            }
            options.next.before = this;
            if (options.data !== undefined) {
                this.proccess(this, options.data);
            } else if (options.url !== undefined) {
                this.sendAjax(this);
            } else {
                console.error('one of data and url shouldn\'t be undefined!');
                return;
            }
        }

        if(options.next){
            options.next.before = this;
        	// 联动
        	this.el.change(function(){
        		self.proccessNext(self);
        	});
        }

    };

    // 只会被设置一次，设置后会重置
    Plugin.prototype.setNextVal = function(val){
        this.nextVal = val;
    };

    Plugin.prototype.proccess = function(ctx, data) {
        var options = ctx.options;
        var selectedVal;
        if (ctx.before) {
            selectedVal = ctx.before.el.val();
        }
        if ($.isFunction(options.format)) {
            formatData = options.format(data, selectedVal);
        }
        ctx.render(ctx.el, formatData, ctx);
        ctx.proccessNext(ctx);
    };

    Plugin.prototype.proccessNext = function(ctx) {
        var options = this.options;
        if (options.next) {
            var next = options.next;
            var nextOpt = next.getOpt();
            if (nextOpt.data !== undefined) {
                this.proccess(next, nextOpt.data);
            } else if (nextOpt.url !== undefined) {
                this.sendAjax(next);
            } else {
                console.error('one of data and url shouldn\'t be undefined!');
                return;
            }
        }
    };

    Plugin.prototype.sendAjax = function(ctx) {
    	var selectedVal;
        if (ctx.before) {
            selectedVal = ctx.before.el.val();
        }
        var options = ctx.options;
        var ajaxUrl;
        if ($.isFunction(options.url)) {
            ajaxUrl = options.url(selectedVal);
        } else {
            ajaxUrl = options.url;
        }
        $.ajax({
            url: ajaxUrl,
            dataType: 'json'
        }).done(function(data) {
            ctx.proccess(ctx, data);
        });
    }

    Plugin.prototype.getOpt = function() {
        return this.options;
    };

    Plugin.prototype.render = function($sel, data, ctx) {
        var self = this;
        var options = ctx.options;
        var forceEmpty = options.forceEmpty;
        var afterRender = options.afterRender;
        var initOpt = options.initOpt;
        if (!$.isArray(data)) {
            console.error('data should be array');
            return;
        }
        if (forceEmpty) {
            $sel.empty();
        }
        var opts = [];
        if(initOpt){
        	opts.push(initOpt);
        }
        data.forEach(function(each) {
            opts.push(self._makeOptStr(each.value, each.text));
        });
        $sel.html(opts.join(''));
        if(ctx.before && ctx.before.nextVal){
            $sel.val(ctx.before.nextVal);
            ctx.before.nextVal = false;// 设置一次
        }
        if ($.isFunction(afterRender)) {
            afterRender($sel);
        }
    }

    Plugin.prototype._makeOptStr = function(value, text) {
        var optTemplate = '<option value="{value}">{text}</option>';
        return optTemplate
            .replace('{value}', value)
            .replace('{text}', text);
    }


    $.fn[pluginName] = function(options) {
        return new Plugin(this, options)
    }

}(jQuery, window));
