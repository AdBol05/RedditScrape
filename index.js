const https = require("https");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let arg = process.argv.splice(2);
let source = "/r/";

console.log('\x1b[32m%s\x1b[0m', "    ____           __    ___ __  _____                          ");
console.log('\x1b[32m%s\x1b[0m', "   / __ \\___  ____/ /___/ (_) /_/ ___/______________ _____  ___ ");
console.log('\x1b[32m%s\x1b[0m', "  / /_/ / _ \\/ __  / __  / / __/\\__ \\/ ___/ ___/ __ `/ __ \\/ _ \\");
console.log('\x1b[32m%s\x1b[0m', " / _, _/  __/ /_/ / /_/ / / /_ ___/ / /__/ /  / /_/ / /_/ /  __/");
console.log('\x1b[32m%s\x1b[0m', "/_/ |_|\\___/\\__,_/\\__,_/_/\\__//____/\\___/_/   \\__,_/ .___/\\___/ ");
console.log('\x1b[32m%s\x1b[0m', "                                               /_/           \n");

if (arg[0] == "tor") {
    console.log("Routing via tor network...");
    const { SocksProxyAgent } = require("socks-proxy-agent");
    global.proxy = new SocksProxyAgent("socks://127.0.0.1:9150");
}

readline.question('Enter subreddit name and number of results <name> [number]: ', sub => {
    let args = sub.split(" ");

    if(!args[0]){console.error('\x1b[31m%s\x1b[0m',"\nPlease input subreddit name"); process.exit(5);}

    source = source + args[0] + ".json";
    if (args[1]) { source = source + "?limit=" + args[1]; }
    readline.close();

    let output = [];
    let options = {
        host: "www.reddit.com",
        path: source,
        agent: arg[0] == "tor" ? proxy : undefined,
        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36" }
    };

    console.log("Sending https get request to: " + options.host + source + "\nPlease wait...");
    https.get(options, function (res) {
        let json = '';

        res.on('data', function (chunk) { json += chunk; });
        res.on('end', function () {
            if (res.statusCode === 200) {
                try {
                    console.log("Retrieved links:");
                    let data = JSON.parse(json).data.children;
                    for (i in data) { output.push({ title: data[i].data.title, link: data[i].data.url }); }
                    console.table(output);
                }
                catch (e) { console.log('Error parsing JSON!\n' + e); }
            }
            else { console.log('Status:', res.statusCode); }
        });

    }).on('error', function (err) {
        console.log('Error:', err);
    });
});
