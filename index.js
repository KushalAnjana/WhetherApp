const http = require("http");
const fs = require("fs");
var requests = require("requests")

const homefile = fs.readFileSync("index.html" ,"utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}" , Math.round(orgVal.main.temp-273.15));

      temperature = temperature.replace("{%tempmin%}" , Math.round(orgVal.main.temp_min-273.15));
      temperature = temperature.replace("{%tempmax%}" , Math.round(orgVal.main.temp_max-273.15));
      temperature = temperature.replace("{%temphum%}" , Math.round(orgVal.main.humidity));
      temperature = temperature.replace("{%temppres%}" , Math.round(orgVal.main.pressure));
      temperature = temperature.replace("{%location%}" , orgVal.name);
      temperature = temperature.replace("{%country%}" , orgVal.sys.country);
      temperature = temperature.replace("{%tempStatus%}" , orgVal.weather[0].main);
      return temperature;

}

const server = http.createServer((req,res) =>{

    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Ujjain&appid=80a73011dab79aef98e88709a1bd1774')
        .on('data',function (chunk){
            const ondata = JSON.parse(chunk);
            const arrdata = [ondata];
       //     console.log(arrdata[0].main.temp);

            const realTimeData = arrdata.map((val) =>  replaceVal(homefile,val))
            .join("");
            res.write(realTimeData) ;
        })
        .on("end",function (err){
            if(err) return console.log("connection closed due to some error" , err);
            res.end();
        });
    }

});
server.listen(8000, "127.0.0.1");