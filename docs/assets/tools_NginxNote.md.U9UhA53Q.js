import{_ as a,c as n,a2 as i,o as e}from"./chunks/framework.CAQ3h1-a.js";const g=JSON.parse('{"title":"Nginx Note","description":"","frontmatter":{},"headers":[],"relativePath":"tools/NginxNote.md","filePath":"tools/NginxNote.md","lastUpdated":null}'),p={name:"tools/NginxNote.md"};function l(t,s,h,o,c,d){return e(),n("div",null,s[0]||(s[0]=[i(`<h1 id="nginx-note" tabindex="-1">Nginx Note <a class="header-anchor" href="#nginx-note" aria-label="Permalink to &quot;Nginx Note&quot;">​</a></h1><p>nginx 是一个高性能的HTTP和反向代理服务器，它可以作为HTTP服务器、反向代理服务器、邮件代理服务器或通用的TCP/UDP代理服务器，同时也提供了IMAP/POP3/SMTP服务。</p><h2 id="_0-基础介绍" tabindex="-1">0. 基础介绍 <a class="header-anchor" href="#_0-基础介绍" aria-label="Permalink to &quot;0. 基础介绍&quot;">​</a></h2><h3 id="正向代理" tabindex="-1">正向代理 <a class="header-anchor" href="#正向代理" aria-label="Permalink to &quot;正向代理&quot;">​</a></h3><p>当你的电脑无法直接访问一个服务器时，那么你可以通过一个代理服务器进行帮助你访问，那么这个代理服务器就是在帮助你做正向代理这一概念。 即，你的电脑 A 访问某一个网站是被禁止的，但是电脑 B 访问这一网站是被允许的，那么你可以通过访问 B 来帮助你去访问被禁止的网站。而这个过程就是正向代理，且电脑 B 可以使用 nginx 来进行实现。</p><h3 id="反向代理" tabindex="-1">反向代理 <a class="header-anchor" href="#反向代理" aria-label="Permalink to &quot;反向代理&quot;">​</a></h3><p>当电脑 A 访问网站 B 时，通常会直接访问网站 B 所搭建的服务器。但是一个大型网站通常有很多个子服务器，所以通常会在外面套一层服务器，即电脑 A 访问网站 B 的临时服务器，然后通过一定的分配策略来进行跳转到其他服务器。那么这个过程就是反向代理，而 nginx 也是可以实现这一功能的。</p><h3 id="负载均衡" tabindex="-1">负载均衡 <a class="header-anchor" href="#负载均衡" aria-label="Permalink to &quot;负载均衡&quot;">​</a></h3><p>一个大型网站，通常有很多个服务器来进行运行，即一个大型品牌商店，它通常有多个小的分店来满足消费者的需求。当用户进行消费时，如果只有一家店，那么光排队就排了很久，且一家店的用户容量是有上限的，所以为了满足消费者的需求，通常会选择继续多开分店来进行人流的分流。那么换作在网站服务器上也是类似的原理。那么如何分流？目前主要分为两个：轮询、权重分流。</p><p><strong>轮询</strong> 即用户访问服务器的时候，按照配置顺序的子服务器进行分流。</p><p><strong>权重</strong> 即用户访问服务器的时候，安装配置的权重进行对服务器分流。权重越高，分流的概率越大。</p><h3 id="动静分离" tabindex="-1">动静分离 <a class="header-anchor" href="#动静分离" aria-label="Permalink to &quot;动静分离&quot;">​</a></h3><p>网站的静态资源和动态资源分离，可以把静态资源放在Nginx服务器上，动态资源放在Tomcat服务器(可以是其他语言的后端)上，这样可以提高网站的访问速度。</p><h2 id="_1-nginx-安装" tabindex="-1">1. nginx 安装 <a class="header-anchor" href="#_1-nginx-安装" aria-label="Permalink to &quot;1. nginx 安装&quot;">​</a></h2><p>linux下安装Nginx：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nginx</span></span></code></pre></div><p>根据提示进行进一步的安装，安装完成后通常在 <code>/usr/local/nginx/sbin</code> 目录下有nginx的可执行文件。</p><h2 id="_2-nginx-常用命令" tabindex="-1">2. nginx 常用命令 <a class="header-anchor" href="#_2-nginx-常用命令" aria-label="Permalink to &quot;2. nginx 常用命令&quot;">​</a></h2><h3 id="nginx-基本配置" tabindex="-1">nginx 基本配置 <a class="header-anchor" href="#nginx-基本配置" aria-label="Permalink to &quot;nginx 基本配置&quot;">​</a></h3><p>首先进行配置linux下所有命令都能进行使用 nginx 命令。以下提供两种方法，采用其中一种即可。</p><ol><li>添加软连接（<strong>二选一</strong>）</li></ol><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ln</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/local/nginx/sbin/nginx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/bin/nginx</span></span></code></pre></div><ol start="2"><li>添加到环境变量（<strong>二选一</strong>）</li></ol><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> vi</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/profile</span></span></code></pre></div><p>在文件末尾添加：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PATH</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$PATH:/usr/local/nginx/sbin</span></span></code></pre></div><p>使环境变量生效：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">source</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/profile</span></span></code></pre></div><h3 id="nginx-基本命令" tabindex="-1">nginx 基本命令 <a class="header-anchor" href="#nginx-基本命令" aria-label="Permalink to &quot;nginx 基本命令&quot;">​</a></h3><ol><li><strong>查看nginx版本信息</strong></li></ol><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -V</span></span></code></pre></div><ol start="2"><li><strong>启动nginx</strong></li></ol><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span></span></code></pre></div><ol start="3"><li><strong>停止nginx</strong></li></ol><p>暴力停止:</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stop</span></span></code></pre></div><p>优雅停止:</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> quit</span></span></code></pre></div><p>区别: 优雅停止会将正在请求的连接处理完，再退出。</p><ol start="4"><li><strong>重启nginx</strong></li></ol><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reload</span></span></code></pre></div><ol start="5"><li><strong>重新加载nginx配置</strong></li></ol><p>在进行修改了 /usr/local/nginx/conf/nginx.conf 配置文件后，需要重新加载nginx的配置文件，使之生效。</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reload</span></span></code></pre></div><ol start="6"><li><strong>显示nginx的配置文件路径</strong></li></ol><p>该命令主要作用是查看nginx配置文件的语法错误，并打印出配置文件的路径。</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span></span></code></pre></div><ol start="7"><li><strong>显示nginx的运行状态</strong></li></ol><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ps</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -ef</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nginx</span></span></code></pre></div><h2 id="_3-nginx-配置文件" tabindex="-1">3. nginx 配置文件 <a class="header-anchor" href="#_3-nginx-配置文件" aria-label="Permalink to &quot;3. nginx 配置文件&quot;">​</a></h2><p>nginx 的配置文章位于 <code>/usr/local/nginx/conf/nginx.conf</code> 文件中。而 <code>/usr/local/nginx/conf/nginx.conf.default</code> 文件是默认的配置文件，可以作为参考。所以，随便修改 <code>nginx.conf</code> 文件，大不了使用 <code>nginx.conf.default</code> 文件进行还原。</p><p>其配置文件内容，网上搜索即可，都是概念相关。</p><h2 id="_4-nginx-反向代理" tabindex="-1">4. nginx 反向代理 <a class="header-anchor" href="#_4-nginx-反向代理" aria-label="Permalink to &quot;4. nginx 反向代理&quot;">​</a></h2><p>在 nginx 中，通常使用 proxy_pass 指令来实现反向代理到其他服务器上。</p><ol><li>使用 proxy_pass 反向代理到其他服务器</li></ol><div class="language-nginx.conf vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx.conf</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server {</span></span>
<span class="line"><span>    listen 5500;</span></span>
<span class="line"><span>    server_name localhost;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        root /usr/share/nginx/html;</span></span>
<span class="line"><span>        index index.html index.htm;</span></span>
<span class="line"><span>        proxy_pass http:bilibili.com; # 访问 / 目录会跳转到 bilibili.com 服务器</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="2"><li>使用 proxy_pass 实现跨域</li></ol><div class="language-nginx.conf vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx.conf</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server {</span></span>
<span class="line"><span>    listen 5500;</span></span>
<span class="line"><span>    server_name localhost;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        root /usr/share/nginx/html;</span></span>
<span class="line"><span>        index index.html index.htm;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    location /api {</span></span>
<span class="line"><span>        proxy_pass http://localhost:8080; # 访问 /api 目录会跳转到 8080 端口的服务器(后端服务器地址) 解决跨域问题</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="_5-nginx-与-vue-history-模式冲突" tabindex="-1">5. Nginx 与 Vue history 模式冲突 <a class="header-anchor" href="#_5-nginx-与-vue-history-模式冲突" aria-label="Permalink to &quot;5. Nginx 与 Vue history 模式冲突&quot;">​</a></h2><p>由于 Vue 开发的是单页面应用，所以在使用 history 模式时，如果 nginx 配置了 index.html 作为默认的首页，那么在访问其他页面时，会出现 404 错误。</p><p>解决方法：</p><div class="language-nginx.conf vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx.conf</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>server {</span></span>
<span class="line"><span>    listen 5500;</span></span>
<span class="line"><span>    server_name localhost;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        root /usr/share/nginx/html;</span></span>
<span class="line"><span>        index index.html; # 这里将 index.html 作为默认的首页</span></span>
<span class="line"><span>        try_files $uri $uri/ /index.html; # 这里配置 try_files 规则，将所有请求都重定向到 index.html</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上解决方法关键是在于这一句指令：<code>try_files $uri $uri/ /index.html;</code> , 它告诉 nginx 尝试去找 <code>$uri</code> 文件，如果找不到，则尝试去找 <code>$uri/</code> 文件，如果还是找不到，则重定向到 <code>/index.html</code> 文件。也就是说如果访问 <code>/about</code> 页面时，nginx 会尝试去找 <code>/about</code> 文件，如果找不到，则尝试去找 <code>/about/</code> 文件，如果还是找不到，则重定向到 <code>/index.html</code> 文件。而 Vue 的 history 模式会在前端使用 <code>pushState</code> 方法时，将 URL 加入到浏览器的历史记录中，所以在访问其他页面时，不会出现 404 错误。</p><h2 id="_6-nginx-负载均衡" tabindex="-1">6. Nginx 负载均衡 <a class="header-anchor" href="#_6-nginx-负载均衡" aria-label="Permalink to &quot;6. Nginx 负载均衡&quot;">​</a></h2><p>负载均衡主要是 upstream 块，它与 server 块是同级的。</p><div class="language-nginx.conf vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx.conf</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 轮询方式</span></span>
<span class="line"><span>upstream backendA {</span></span>
<span class="line"><span>    server 192.168.1.100:8080; # 后端服务器A地址</span></span>
<span class="line"><span>    server 192.168.1.101:8080; # 后端服务器B地址</span></span>
<span class="line"><span>    server 192.168.1.102:8080; # 后端服务器C地址</span></span>
<span class="line"><span>} </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 权重方式</span></span>
<span class="line"><span>upstream backendB {</span></span>
<span class="line"><span>    server 192.168.1.100:8080 weight=3; # 后端服务器A地址，权重为3</span></span>
<span class="line"><span>    server 192.168.1.101:8080 weight=2; # 后端服务器B地址，权重为2</span></span>
<span class="line"><span>    server 192.168.1.102:8080 weight=1; # 后端服务器C地址，权重为1</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 超时补救策略</span></span>
<span class="line"><span>upstream backendC {</span></span>
<span class="line"><span>    server 192.168.1.100:8080 max_fails=2 fail_timeout=60s; # 后端服务器A地址，最大失败次数为2，失败超时时间为30秒</span></span>
<span class="line"><span>    server 192.168.1.101:8080 max_fails=3 fail_timeout=40s; # 后端服务器B地址，最大失败次数为3，失败超时时间为40秒</span></span>
<span class="line"><span>    server 192.168.1.102:8080 max_fails=3 fail_timeout=20s; # 后端服务器C地址，最大失败次数为3，失败超时时间为20秒</span></span>
<span class="line"><span>    server backup1.example.com:8080 backup; # 备用服务器地址 上面三台服务器都出现其对应的错误就会转向备用服务器</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>    listen 5500;</span></span>
<span class="line"><span>    server_name localhost;  </span></span>
<span class="line"><span>    location /A {</span></span>
<span class="line"><span>        proxy_pass http://backend; # 访问 /A 目录会跳转到 backendA 服务器组</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    location /B {</span></span>
<span class="line"><span>        proxy_pass http://backendB; # 访问 /B 目录会跳转到 backendB 服务器组</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,66)]))}const k=a(p,[["render",l]]);export{g as __pageData,k as default};
