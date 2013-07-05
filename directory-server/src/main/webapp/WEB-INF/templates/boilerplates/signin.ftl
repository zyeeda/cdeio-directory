<#import "html.ftl" as bp>

<#macro signin>
<@bp.html>
<body>
    <div class="content">
        <div class="content-bg">
            <img src="../assets/images/background.jpg" />
        </div>
        <div class="container-fluid">
            <div class="row-fluid">
                <div class="span5 offset1 hidden-phone">
                    <div class="left-padding"></div>
                    <div class="row-fluid">
                        <div class="span12 system-logo">
                            <img src="../assets/images/system-signin-logo.png" />
                        </div>
                    </div>
                </div>
                <div class="span4">
                    <div class="right-padding hidden-phone"></div>
                    <div class="row-fluid">
                        <div class="span12">
                            <div class="signin-content">
                                <#nested>
                            </div>
                        </div>
                    </div>
                    <div class="row-fluid">
                        <div class="span12">
                            <div class="copyright">
                                Copyright &copy; 2008-${.now?string("yyyy")} by ZYEEDA All Rights Reserved
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</@bp.html>
</#macro>
