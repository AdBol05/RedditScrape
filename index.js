const https = require("https");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let source = "/r/";// + source + ".json"
readline.question('Enter subreddit name: ', sub => {
    source = source + sub + ".json";
    readline.close();

    let options = {
        host: "www.reddit.com",
        path: source,
        headers: { "user-agent": "request" }
    };

    let urls = [];


    console.log("Input url: " + options.host + source + "\nRetrieved links:");

    https.get(options, function (res) {
        let json = '';
        res.on('data', function (chunk) {
            json += chunk;
        });

        res.on('end', function () {
            if (res.statusCode === 200) {
                try {
                    let data = JSON.parse(json).data.children;

                    //console.log(data);
                    for (i in data) {
                        urls.push(data[i].data.url);
                    }
                    console.table(urls);

                } catch (e) {
                    console.log('Error parsing JSON!');
                }
            } else {
                console.log('Status:', res.statusCode);
            }
        });

    }).on('error', function (err) {
        console.log('Error:', err);
    });
});