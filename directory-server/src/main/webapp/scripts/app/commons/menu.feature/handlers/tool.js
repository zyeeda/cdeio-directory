define({
    minMenu: function() {
        var el = this.feature.layout.$el;
        el.toggleClass('menu-min');
        this.$('btn').toggleClass("icon-double-angle-right");
        if (el.hasClass('menu-min')) {
            console.log('aa');
            $(".open > .submenu").removeClass("open");
        }
    }
});
