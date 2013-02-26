define({
    layout: {
        components: [{
            type: 'layout',
            defaults: {
                spacing_open: 0,
                hideTogglerOnSlide: true,
                resizable: false
            },
            north: {
                size: 51,
                togglerLength_open: 0
            },
            south: {
                size: 42
            },
            west: {
                size: 380,
                spacing_open: 5
            },
            center: {
                findNestedContent: true,
                onresize: function (paneName, paneElement) {
                    $.layout.callbacks.resizeTabLayout(paneName, paneElement);
                    cbTabs.resizeFitTabPanel(paneName, paneElement);
                }
            }
        }],

        regions: {
            header: 'header',
            footer: 'footer',
            sidebar: 'sidebar',
            content: 'content'
        }
    },

    views: [
        { name: 'header', region: 'header' },
        { name: 'footer', region: 'footer' },
        { name: 'departments', region: 'sidebar' },
        { name: 'accounts', region: 'content' }
    ]
});
