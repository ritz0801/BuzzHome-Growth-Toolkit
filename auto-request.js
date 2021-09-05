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
        const list = require('./uid.json')
        const uid = require('./uid.json').uid||[]
        let uids  = uid.slice()
        const added = require('./uid.json').added||[]
        for(let i= 0; i<uid.length;i++){
            await tab.get(`https://www.facebook.com/${uid[i]}`);
            await tab.sleep(2000)
            try {
                // const addBtn = await tab.findElement(swd.By.css("div[class='oajrlxb2 oo1teu6h gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys d1544ag0 qt6c0cv9 tw6a2znq i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l beltcj47 p86d2i9g aot14ch1 kzx2olss cbu4d94t taijpn5t ni8dbmo4 stjgntxs k4urcfbm tv7at329']"));
                // await addBtn.click();
                const btnGroup = await tab.findElement(swd.By.className('bp9cbjyn j83agx80 fop5sh7t g2wf7z4h f10w8fjw pybr56ya bkfpd7mw'))
                
                const btnAdd = await btnGroup.findElement(swd.By.css("div[class='oajrlxb2 oo1teu6h gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys d1544ag0 qt6c0cv9 tw6a2znq i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l beltcj47 p86d2i9g aot14ch1 kzx2olss cbu4d94t taijpn5t ni8dbmo4 stjgntxs k4urcfbm tv7at329']"));
                
                const text = await btnAdd.getAttribute("aria-label")
                if(text == "Add Friend"){
                    await btnAdd.click()
                    added.push(uid[i])
                    uids = uids.filter(id=>id!==uid[i])
                }else{
                    added.push(uid[i])
                    uids = uids.filter(id=>id!==uid[i])
                }
                await tab.sleep(1000)
            } catch (error) {
                console.log(error)
            }

        }  
        console.log('write to file')
        fs.writeFileSync('./uid.json',JSON.stringify({...list,uid:uids,added}))
        console.log("Done")
    }
    catch (err) {
        console.log("ERROR: ", err);
        // console.log("Get error before comment")
    }
})()