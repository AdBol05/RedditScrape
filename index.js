const https = require("https");

let source = process.argv.slice(2)[0];
let options = {
    host: "www.reddit.com",
    path: source,
    headers: {"user-agent": "request"}
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
                let data = JSON.parse(json);
                
                console.log(data.data.children);
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