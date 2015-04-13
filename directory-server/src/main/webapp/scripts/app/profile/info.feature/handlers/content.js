define([
    'jquery',
    'scripts/cdeio/vendors/jquery/jquery.magnific-popup.js'
], function($) {
    return {
        showChangePasswordForm: function() {
            $('button[id$="change-password-btn"]').hide();
            
            $('button[id$="quit-password"]').on('click', function() {
                $('.info-password').slideUp('300', function() {
                    $('.c-action-form-changePassword').remove();
                    $('button[id$="change-password-btn"]').show();
                });
            });

            $('button[id$="reset-password"]').on('click', function() {
                $('input[type="password"]').attr('');
            });
            
            var app = this.feature.module.getApplication(), me = this;
            var accFeature = app.loadFeature('system/scaffold:accounts');
            accFeature.done(function(feature) {
                var view = feature.views['form:changePassword'];
                view.$el = $('.changePassword');
                view.render();
                $('.info-password').hide();
                $('.info-password').slideDown('300');
                
                $('button[id$="submit-password"]').on('click', function() {
                    var data = view.getFormData();
                    feature.request({
                        url: 'password',
                        type: 'put',
                        data: data,
                        success: function(d) {
                            app.success('密码修改成功');
                    }});
                });
            });
        },
    };
});
