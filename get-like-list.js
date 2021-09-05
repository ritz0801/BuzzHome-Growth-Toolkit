require("chromedriver");
var fs = require('fs');
const chrome = require('selenium-webdriver/chrome');
let {  fr, xs, c_user, datr, sb } = require("./credentials.json");
let { chromeBinaryPath } = require("./chrome-binary-path.json");

let swd = require("selenium-webdriver");
let browser = new swd.Builder();
let tab = browser.forBrowser("chrome").setChromeOptions(new chrome.Options()
    .addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36')
    .addArguments('--disable-infobars')
    .addArguments('--start-maximized')
    .addArguments('--disable-plugins-discovery')
    .addArguments('--disable-extensions')
    .addArguments('--profile-directory=Default')
    .addArguments('--incognito')
    .addArguments('--disable-blink-features')
    .addArguments('--disable-blink-features=AutomationControlled')
    .setChromeBinaryPath(chromeBinaryPath))
    .build();



(async function automaticComment(){
    try{
        await tab.executeScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        const userAgent = await tab.executeScript("return navigator.userAgent");
        await console.log(userAgent);
        await tab.get("https://www.facebook.com/");
        
        await tab.manage().setTimeouts({
            implicit: 3000, // 3 seconds 
        });
        

        await tab.manage().addCookie({ name: 'fr', value: fr });
        await tab.manage().addCookie({ name: 'xs', value: xs });
        await tab.manage().addCookie({ name: 'c_user', value: c_user });
        await tab.manage().addCookie({ name: 'datr', value: datr });
        await tab.manage().addCookie({ name: 'sb', value: sb });
           await tab.sleep(10000);

        console.log("Successfully signed in Facebook!");
        await tab.get("https://www.facebook.com/");
        await tab.sleep(2000)
        await tab.get("https://www.facebook.com/wordsmine.official/settings/?tab=people_and_other_pages");
        console.log("Successfully go to list!");
        await tab.sleep(5000);
        // await tab.executeScript("var elem = document.getElementByTagName('table'); elem.scrollTop=elem.scrollHeight;");
        // const facebook = await tab.executeScript("return document.getElementsById('globalContainer')")
        const iframe = await tab.findElement(swd.By.css("iframe[class='k4urcfbm jgljxmt5 a8c37x1j izx4hr6d humdl8nn bn081pho gcieejh5 esnais5j']"))
        await tab.switchTo().frame(iframe)
        let oldHeight = await tab.executeScript("return document.body.scrollHeight")
        console.log('start scroll')
        while (true) {
            await tab.executeScript("window.scrollTo(0, document.body.scrollHeight);")
            await tab.sleep(1000)
            let newHeight = await tab.executeScript("return document.body.scrollHeight")
            if(newHeight === oldHeight) {
                break
            }else{
                oldHeight=newHeight
            }
        }
        console.log('end scroll')
        console.log('start get uid')
        
        const listATag = await tab.findElements(swd.By.css("a[class='_3cb8']"))
        const times =  await tab.findElements(swd.By.css("abbr[class='livetimestamp']"))
        await tab.sleep(1000)
        // let test = await listATag[0].getAttribute("href")
        // console.log(test)
        let lastTime = require('./uid.json').lastTime||0
        let uid = require('./uid.json').uid||[]
        for(let i=0;i<listATag.length ;i++){
            let utime = parseInt(await times[i].getAttribute("data-utime")) 
            if(utime > lastTime){
                tmp = await listATag[i].getAttribute("href")
                let tmp2=tmp.split("/")
                uid.push(parseInt(tmp2.slice(-1).pop()))
            }else{
                break
            }
        }
        console.log('end get uid')
        console.log('write to file')
        lastTime = parseInt(await (await tab.findElement(swd.By.css("abbr[class='livetimestamp']"))).getAttribute("data-utime"))
        fs.writeFileSync('./uid.json',JSON.stringify({uid,lastTime}))
        console.log("Done")
        

    }
    catch (err) {
        console.log("ERROR: ", err);
        // console.log("Get error before comment")
    }
})()