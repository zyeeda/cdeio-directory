
define({

    components: [{
        type: 'layout',
        defaults: {
            spacing_open: 0,
            hideTogglerOnSlide: true,
            resizable: false
        },
        north: {
            //size: 83,
            size: 60,
            togglerLength_open: 0
        },
        south: {
            size: 42
            //size: 52
        },
        west: {
            size: 360,
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

});

