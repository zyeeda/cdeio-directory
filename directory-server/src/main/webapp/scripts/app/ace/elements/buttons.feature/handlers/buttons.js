define({
    changeButtonBorder: function() {
        this.$('default-buttons').find('.btn').toggleClass('no-border');
        console.log(this.$('default-buttons'), this.$('default-buttons').find('.btn'))
    }
});
