<#import "html.ftl" as bp>

<#macro signin>
<@bp.html basePath="../">
<body class="login-layout">
    <div class="mask">
        <div class="main-container container-fluid">
            <div class="main-content">
                <div class="row-fluid">
                    <div class="login-container">
                        <div class="row-fluid">
                            <div class="position-relative">
                                <div id="login-box" class="login-box visible widget-box no-border">
                                    <div class="widget-body">
                                        <div class="widget-main">
                                            <#nested>
                                        </div><!-- /widget-main -->
                                    </div><!-- /widget-body -->
                                </div><!-- /login-box -->
                            </div><!-- /position-relative -->
                        </div>
                    </div>
                </div><!-- /.row-fluid -->
            </div>
        </div>
    </div>
</body>
</@bp.html>
</#macro>
