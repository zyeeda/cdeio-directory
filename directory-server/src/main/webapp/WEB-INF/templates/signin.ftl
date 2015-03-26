<#-- $Id$ -->
<#import "boilerplates/signin.ftl" as bp>

<@bp.signin>
<form method="post">
    <div class="signin-form-above hidden-phone">
        <#if applicationName??>
        <h4>${applicationName}</h4>
        <#else>
        <h4>中昱达单点登录系统</h4>
        </#if>
    </div>
    <div class="signin-form">
        <#if request.getAttribute("signInFailure")??>
        <#assign signInFailure = request.getAttribute("signInFailure")>
        <div class="alert alert-error">
        <#if signInFailure == "org.apache.shiro.authc.UnknownAccountException" || signInFailure == "org.apache.shiro.authc.IncorrectCredentialsException">
            用户名或密码错误，请重试
        <#elseif signInFailure == "INVALID_SIGN_IN_TOKEN">
            非法操作或页面已过期，请刷新后重试
        <#elseif signInFailure == "INVALID_CAPTCHA">
            验证码不正确，请重试
        <#elseif signInFailure == "REQUEST_TOO_FAST">
            请求太快，请稍后重试
        <#else>
            未知登录错误，请重试或联系管理员
        </#if>
        </div>
        </#if>
        <div class="row-fluid">
            <div class="span12">
                <label><strong>用户名</strong></label>
            </div>
        </div>
        <div class="row-fluid">
            <span class="block input-icon input-icon-right">
                <input id="username" name="username" type="text" class="input-block-level" />
                <i class="icon-user"></i>
            </span>
        </div>
        <div class="row-fluid">
            <div class="password">
                <label><strong>密码</strong></label>
            </div>
            <div class="forget-password">
                <label><strong>忘记密码?</strong></label>
            </div>
        </div>
        <div class="row-fluid">
            <span class="block input-icon input-icon-right">
                <input id="password" name="password" type="password" class="input-block-level" />
                <i class="icon-lock"></i>
            </span>
        </div>
        <#if request.getAttribute("signInToken")??>
        <#assign signInToken = request.getAttribute("signInToken")>
        <#if signInToken.isCaptchaRequired()>
        <div class="row-fluid">
            <div class="captcha-label">
                <label><strong>验证码</strong></label>
            </div>
            <div class="captcha-unclear">
                <a class="change-captcha" href="javascript:changeCaptcha();">看不清楚?</a>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span8">
                <input name="captcha" type="text" class="input-block-level" />
            </div>
            <div class="span4">
                <img id="captcha" src="/captcha.jpg" alt="验证码" />
            </div>
        </div>
        <div class="help-block">
        </div>
        </#if>
        </#if>
    </div>
    <div class="signin-form-below">
        <div class="row-fluid">
            <div class="remember-me">
                <label>
                    <input name="rememberMe" type="checkbox" value="true">
                    <span class="lbl">&nbsp;保持登录状态</span>
                </label>
            </div>
            <div class="signin-btn">
                <button class="btn btn-large btn-success" type="submit"><i class="icon-lock icon-white c-icon-small"></i>&nbsp;&nbsp;登&nbsp;录</button>
            </div>
        </div>
    </div>
</form>

<script>
    window.onload = function() {
        document.getElementById('username').focus();
    }

    function changeCaptcha() {
        document.getElementById('captcha').setAttribute('src', '/captcha.jpg?' + new Date().getTime());
    }
</script>
</@bp.signin>
