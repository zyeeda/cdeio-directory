<#import "boilerplates/signin.ftl" as bp>

<@bp.signin>
<div class="signin-form-above">欢迎</div>
<div class="signin-form">
    <div class="tabbable" id="infoTab">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#currentUser" data-toggle="tab">当前用户</a></li>
            <li><a href="#onlineSystems" data-toggle="tab">在线系统</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="currentUser">
                <table class="table table-bordered">
                    <tr>
                        <td><strong>用户名:</strong></td>
                        <td>${account.username}</td>
                    </tr>
                    <tr>
                        <td><strong>姓&nbsp;&nbsp;&nbsp;&nbsp;名:</strong></td>
                        <td>${account.realName!""}</td>
                    </tr>
                    <tr>
                        <td><strong>邮&nbsp;&nbsp;&nbsp;&nbsp;箱:</td>
                        <td>${account.email!""}</td>
                    </tr>
                </table>
            </div>
            <div class="tab-pane" id="onlineSystems">
                <#if sites??>
                <table class="table table-bordered">
                <tr>
                    <th>#</th>
                    <th>系统名称</th>
                    <th>操作</th>
                </tr>
                <#list sites as site>
                <tr>
                    <td>${site_index + 1}</td>
                    <td><a href="${site.indexUrl}" target="_blank">${site.name}</a></td>
                    <td><a href="${site.signOutUrl}" target="_blank">退出</a></td>
                </tr>
                </#list>
                </table>
                <#else>
                <div class="alert alert-info">
                    <div class="no-online-system"><strong>当前无在线系统</strong></div>
                </div>
                </#if>
            </div>
        </div>
    </div>
</div>
<div class="signin-form-below">
    <div class="row-fluid">
        <div class="span12 signout-btn">
            <a class="btn btn-large btn-success" href="${signOutPath}"><i class="icon-lock icon-white c-icon-small"></i>&nbsp;&nbsp;退出全站</a>
        </div>
    </div>
</div>

<script>
    $('#infoTab a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
</script>
</@bp.signin>
