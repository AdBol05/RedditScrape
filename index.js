const https = require("https");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let arg = process.argv.splice(2);

let source = "/r/";
readline.question('Enter subreddit name and number of results [<name> <number>]: ', sub => {
    let args = sub.split(" ");
    if (args[1] === undefined) { args[1] = "30" }
    source = source + args[0] + ".json?limit=" + args[1];
    readline.close();

    let urls = [];
    let options = {};

    if (arg[0] == "tor") {
        console.log("Routing via tor network");
        const { SocksProxyAgent } = require("socks-proxy-agent");
        const proxy = new SocksProxyAgent("socks://127.0.0.1:9050");
        options = {
            host: "www.reddit.com",
            path: source,
            agent: proxy
        };
    }
    else {
        options = {
            host: "www.reddit.com",
            path: source,
            headers: { "user-agent": "request" }
        };
    }

    console.log("Sending https get request to: " + options.host + source + "\nPlease wait...");
    https.get(options, function (res) {
        let json = '';

        res.on('data', function (chunk) { json += chunk; });
        res.on('end', function () {
            if (res.statusCode === 200) {
                try {
                    console.log("Retrieved links:");
                    let data = JSON.parse(json).data.children;
                    for (i in data) { urls.push(data[i].data.url); }
                    console.table(urls);
                }
                catch (e) { console.log('Error parsing JSON!\n' + e); }
            }
            else { console.log('Status:', res.statusCode); }
        });

    }).on('error', function (err) {
        console.log('Error:', err);
    });
});