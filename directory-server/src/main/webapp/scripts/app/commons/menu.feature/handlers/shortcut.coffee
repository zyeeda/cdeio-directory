define ['jquery'], ($) ->
    setting: (e) ->
        setting = $(e.target);

        if @feature.settingShowed?
            delete @feature.settingShowed
            setting.popover 'hide'
        else 
            setting.attr 'data-content' , '<div id="setting-container"><div>'
            setting.popover
                html: true
            setting.popover 'show'
            app.startFeature 'profile/info',
                container: $('#setting-container')
                ignoreExists: true
            @feature.settingShowed = {}

