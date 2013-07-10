define([
    'jquery',
    'scripts/coala/vendors/jquery/jquery.magnific-popup.js'
], function($) {
    return {
        showEditInfoDialog: function() {
            var me = this;
            var layout = me.feature.layout;
            var dom = layout.$('edit-info-widget');
            var editInfoView = me.feature.views['inline:edit-info-form'];
            $.magnificPopup.open({
                items: {
                    src: dom,
                    type: 'inline',
                },
                showCloseBtn: false
            });
        }
    };
});
