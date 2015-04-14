define
    layout: 
        regions: 
            breadcrumbs: 'breadcrumbs'

    views: [
        name: 'inline:breadcrumbs', region: 'breadcrumbs', avoidLoadingHandlers: false,
        extend: 
            serializeData: (_super) ->
                data = _super.apply(this) || {}
                data.home = this.home
                data.items = this.items
                data
        events: {
            'click view-source': 'viewSource',
            'click view-example': 'viewExample'
        }
    ]

    extend: 
        onStart: (_super) ->
            d = $.Deferred()
            d1 = undefined
            app.viewport = @

            header = @layout.$('header')
            sidebar = @layout.$('sidebar')
            content = @layout.$('content')
            app.startFeature('commons/header', { container: header, ignoreExists: true }).done (headerFeature) ->
                d1 = app.startFeature('admin/account-menu', { container: headerFeature.views['inline:inner-header'].$('notification'), ignoreExists: true })
                d1
            d2 = app.startFeature('commons/menu', { container: sidebar, ignoreExists: true }).done (feature) ->
                app.menuFeature = feature
                d2
            app.config.featureContainer = content

            this.setHome({ name: '首页', featurePath: 'main/home', iconClass: 'icon-home' })
            this.updateNavigator()

            $.when(d1, d2).then ->
                d.resolve()

            $('.menu-toggler').on 'click', ->
                # $('.sidebar').toggleClass('display')
                # $(this).toggleClass('display')
                # false

            d.promise()

        onStop: (_super) ->
            mainModule = app.findModule('main')
            # cdeioFeatures = app['cdeio-features']
            app.menuFeature.stop()

            mainModule.findFeature('header').stop()

            mainModule.findFeature('account-menu').stop()

        setHome: (_super, home) ->
            @views['inline:breadcrumbs'].home = home
            null
            
        updateNavigator: (_super, menuItem) ->
            v = @views['inline:breadcrumbs']
            menu = menuItem.toJSON() if menuItem
            v.home.isLast = !menuItem
            v.items = []
            while (menu)
                v.items.unshift(menu)
                menu = menu.parent
            
            if v.items.length > 0
                v.items[v.items.length - 1].isLast = true
            v.render()

