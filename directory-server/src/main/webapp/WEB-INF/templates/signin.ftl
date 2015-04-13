<#import "boilerplates/signin.ftl" as bp>

<@bp.signin>
<form method="post">
    <div class="logo">
        <img src="../assets/images/logo.svg" />
        <#if applicationName??>
            ${applicationName}
        <#else>
            CDEIO 单点登录系统
        </#if>
    </div>
    
    <div class="space-6"></div>
    <fieldset>
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

        <label>
            <span class="block input-icon">
                <i class="icon-user svg-icon"></i>
                <input type="text" id="username" name="username" class="span12" placeholder="账号">
                
            </span>
        </label>

        <label>
            <span class="block input-icon">
                <i class="icon-lock svg-icon"></i>
                <input type="password" id="password" name="password" class="span12" placeholder="密码">
            </span>
        </label>

        <div class="space-1"></div>
        
        <#if request.getAttribute("signInToken")??>
        <#assign signInToken = request.getAttribute("signInToken")>
        <#if signInToken.isCaptchaRequired()>
        <label>
            <span class="block input-icon">
                <i class="icon-qrcode svg-icon" onclick="javascript:changeCaptcha();"></i>
                <input type="text" name="captcha" class="span8" placeholder="验证码">
                <img id="captcha" class="span4 pull-right captcha" src="../captcha.jpg" alt="验证码" onclick="javascript:changeCaptcha();" />
            </span>
        </label>
        <div class="space-1"></div>
        </#if>
        </#if>
        
        <div class="clearfix">
            <label class="inline remember">
                <input type="checkbox" class="ace">
                <span class="lbl"> 记住密码 ?</span>
            </label>
        </div>
        <div class="space-2"></div>

        <div class="clearfix">
            <input type="reset" class="width-30 pull-right btn reset" value="重 置">
            <input type="submit" class="width-30 pull-right btn login" value="登 录">
        </div>

        <div class="space-4"></div>
    </fieldset>
</form>

<script>
    window.onload = function() {
        document.getElementById('username').focus();
    }

    function changeCaptcha() {
        document.getElementById('captcha').setAttribute('src', '../captcha.jpg?' + new Date().getTime());
    }
</script>
</@bp.signin>