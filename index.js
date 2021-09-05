// Include the chrome driver 
require("chromedriver");
const chrome = require('selenium-webdriver/chrome')
const commentContents = require('./commentContent');
const groupNameData = require('./groupName');
// Get the credentials from the JSON file 
let { email, pass, fr, xs, c_user, datr, sb } = require("./credentials.json");
let { chromeBinaryPath } = require("./chrome-binary-path.json");

let count = 0;
const MAX_COUNT_POST = 3;
let previousGroup = [];

// Include selenium webdriver 
let swd = require("selenium-webdriver");
const { keys } = require("./commentContent");
let browser = new swd.Builder();

// Two options: first option will open browser and execute scenario, second option will implicit execute not open browser
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
// let tab = browser.forBrowser("chrome").setChromeOptions(new chrome.Options().headless()).build();

const randomCommentContent = () => {
    const randomCommentContent = commentContents[Math.floor(Math.random() * commentContents.length)];
    return randomCommentContent;
}

(async function automaticComment() {
    try {
        await tab.executeScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        const userAgent = await tab.executeScript("return navigator.userAgent");
        await console.log(userAgent);
        await tab.get("https://m.facebook.com/");

        await tab.manage().setTimeouts({
            implicit: 3000, // 3 seconds 
        });

        // const usernameBox = await tab.findElement(swd.By.css("#m_login_email"));
        // await usernameBox.sendKeys(email);
        // console.log("Username entered successfully in");

        // const passwordBox = await tab.findElement(swd.By.css("#m_login_password"));
        // await passwordBox.sendKeys(pass);
        // console.log("Password entered successfully in");

        // const signInBtn = await tab.findElement(swd.By.css("button[name='login']"));
        // await signInBtn.click();
        // const notNowBtn = await tab.findElement(swd.By.css("a[class='_54k8 _56bs _26vk _56b_ _56bw _56bt']"));
        // await notNowBtn.click();

        await tab.manage().addCookie({ name: 'fr', value: fr });
        await tab.manage().addCookie({ name: 'xs', value: xs });
        await tab.manage().addCookie({ name: 'c_user', value: c_user });
        await tab.manage().addCookie({ name: 'datr', value: datr });
        await tab.manage().addCookie({ name: 'sb', value: sb });

        // TODO: delete later
        await tab.sleep(10000);

        console.log("Successfully signed in Facebook!");


        while (1) {
            await postCommentByScroll();

            let randomTime = Math.floor(Math.random() * 30) + 60; // Random 60-90 minutes
            console.log("Waiting " + randomTime + " minutes for next section...");

            await tab.sleep(randomTime * 60 * 1000);
            // await tab.sleep(30000);
        }
    }
    catch (err) {
        // console.log("ERROR: ", err);
        console.log("Get error before comment")
    }
})()

// const postCommentBySearch = async (group) => {
//     await tab.sleep(randomTimeSleep());


// }

const postCommentByScroll = async () => {
    count = 0;
    await tab.get("https://m.facebook.com/");
    await tab.sleep(randomTimeSleep());

    while (count < MAX_COUNT_POST) {
        try {
            let randomContent = randomCommentContent();
            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            await tab.executeScript('window.scrollTo(0,10000);');

            await tab.sleep(randomTimeSleep());
            // Get article

            const article = await tab.findElements(swd.By.tagName("article"));

            let isFound = false;

            for (let i = 0; i < article.length; i++) {
                try {
                    const name = await article[i].findElement(swd.By.css("a[class='_20u1']"));
                    const foundName = await name.getText();
                    if (isPropertyGroup(foundName) && !isFound && !isInPreviousGroups(foundName)) {
                        console.log("Method 1: Post Comment By Scroll")
                        const likeBtn = await article[i].findElement(swd.By.css("a[class='_15ko _77li touchable']"));
                        const commentBtn = await article[i].findElement(swd.By.css("a[class='_15kq _77li _l-a']"));

                        console.log("Found group: ", foundName);

                        // Like the post
                        await likeBtn.click();
                        console.log("Successfully like the post!");

                        // Click Comment button
                        await tab.sleep(randomTimeSleep());
                        await commentBtn.click();
                        console.log("Successfully click comment button!");

                        // First fill to the comment box
                        await tab.sleep(randomTimeSleep());
                        const commentBox = await tab.findElement(swd.By.css("#composerInput"));
                        await commentBox.sendKeys(randomContent);
                        console.log("Successfully fill the comment box!");

                        // Click Post button
                        await tab.sleep(randomTimeSleep());
                        const postBtn = await tab.findElement(swd.By.css("button[type='submit']"));
                        await postBtn.click();

                        // Click More button
                        await tab.sleep(randomTimeSleep());
                        const moreButtons = await tab.findElements(swd.By.css("a[class='_1l26 _2b0a']"))
                        await moreButtons[moreButtons.length - 1].click();

                        // Click Edit button
                        await tab.sleep(randomTimeSleep());
                        const editBtn = await tab.findElement(swd.By.css("a[data-sigil='touchable touchable editCommentSigil edit-link enabled_action']"));
                        await editBtn.click();

                        // Clear the old comment and replace with new comment
                        await tab.sleep(randomTimeSleep());
                        const editBox = await tab.findElement(swd.By.css("textarea[class='commentEditTextArea mentions-input']"));
                        await editBox.clear();
                        await tab.sleep(randomTimeSleep());

                        await tab.sleep(randomTimeSleep());
                        await editBox.sendKeys(randomContent.replace("buzzho[.]me", "https://buzzho[.]me"));

                        // Click Update button
                        await tab.sleep(randomTimeSleep());
                        let updateBtn;
                        try {
                            updateBtn = await tab.findElement(swd.By.css("button[value='Update']"));

                        } catch {
                            updateBtn = await tab.findElement(swd.By.css("button[value='Cập nhật']"));
                        }
                        await updateBtn.click();

                        console.log("Successfully comment the first post!");

                        // after comment
                        isFound = true;
                        count++;
                        console.log("COUNT: ", count)
                        afterComment(foundName)

                        await tab.sleep(randomTimeSleep());
                        // console.log("Posted comment in group: ", previousGroup);
                        console.log("Content of comment: ", randomContent);
                        // return;
                        break; // go out from for loop

                    }
                    else {
                        console.log("Method 2: Post Comment By Search")
                        const filterGroup = filterAnotherElementOfArray();

                        console.log("Found group: ", filterGroup[0]);

                        try {
                            let randomContent = randomCommentContent();
                            await tab.sleep(randomTimeSleep());

                            // Click the Search Button
                            const searchBtn = await tab.findElement(swd.By.css("a[name='Search']"));
                            await searchBtn.click();

                            // Fill the Search input
                            await tab.sleep(randomTimeSleep());
                            const searchBox = await tab.findElement(swd.By.css("input[id='main-search-input']"));
                            await searchBox.sendKeys(filterGroup[0], swd.Key.ENTER)

                            // Choose Group Tab
                            await tab.sleep(randomTimeSleep());
                            // const groupTab = await tab.findElement(swd.By.xpath("//div[a[text()='Groups']]"));
                            let groupTab = await tab.findElement(swd.By.xpath("//a[contains(text(),'Groups')]"));
                            if (!groupTab) {
                                groupTab = await tab.findElement(swd.By.xpath("//a[contains(text(),'Nhóm')]"));
                            }
                            await groupTab.click();

                            // Click the result group
                            await tab.sleep(randomTimeSleep());
                            const resultGroupWrap = await tab.findElement(swd.By.css("div[data-testid='results']"))
                            const resultGroup = await resultGroupWrap.findElement(swd.By.css("div[data-nt='NT:BOX_3_CHILD']"));
                            // const resultGroup = await tab.findElement(swd.By.css("button[aria-label='Joined']"))
                            await resultGroup.click();

                            // Like the first post
                            await tab.sleep(randomTimeSleep());
                            const likeBtn = await tab.findElement(swd.By.css("a[class='_15ko _77li touchable']"))
                            await likeBtn.click();
                            console.log("Successfully like the post!");

                            // Click comment the first post
                            await tab.sleep(randomTimeSleep());
                            const commentBtn = await tab.findElement(swd.By.css("a[class='_15kq _77li']"))
                            await commentBtn.click();
                            console.log("Successfully click comment button!");

                            // First fill to the comment box
                            await tab.sleep(randomTimeSleep());
                            const commentBox = await tab.findElement(swd.By.css("#composerInput"));
                            await commentBox.sendKeys(randomContent);
                            console.log("Successfully fill the comment box!");

                            // Click Post button
                            await tab.sleep(randomTimeSleep());
                            const postBtn = await tab.findElement(swd.By.css("button[type='submit']"));
                            await postBtn.click();

                            // Click More button
                            await tab.sleep(randomTimeSleep());
                            const moreButtons = await tab.findElements(swd.By.css("a[class='_1l26 _2b0a']"))
                            await moreButtons[moreButtons.length - 1].click();

                            // Click Edit button
                            await tab.sleep(randomTimeSleep());
                            const editBtn = await tab.findElement(swd.By.css("a[data-sigil='touchable touchable editCommentSigil edit-link enabled_action']"));
                            await editBtn.click();

                            // Clear the old comment and replace with new comment
                            await tab.sleep(randomTimeSleep());
                            const editBox = await tab.findElement(swd.By.css("textarea[class='commentEditTextArea mentions-input']"));
                            await editBox.clear();
                            await tab.sleep(randomTimeSleep());

                            await tab.sleep(randomTimeSleep());
                            await editBox.sendKeys(randomContent.replace("buzzho[.]me", "https://buzzho[.]me"));

                            // Click Update button
                            await tab.sleep(randomTimeSleep());
                            let updateBtn;
                            try {
                                updateBtn = await tab.findElement(swd.By.css("button[value='Update']"));

                            } catch {
                                updateBtn = await tab.findElement(swd.By.css("button[value='Cập nhật']"));
                            }
                            await updateBtn.click();

                            console.log("Successfully comment the first post!");

                        }
                        catch (err) {
                            console.log("Can't post comment");
                        }

                        // after comment
                        isFound = true;
                        count++;
                        console.log("COUNT: ", count)
                        afterComment(filterGroup[0])

                        await tab.sleep(randomTimeSleep());
                        // console.log("Posted comment in group: ", previousGroup);
                        console.log("Content of comment: ", randomContent);
                        // return;
                        break; // go out from for loop
                    }

                } catch (err) {
                    // console.log("error: ", err);
                    console.log("Cannot post comment in this group")
                }
            }

            // after for loop
            console.log("isFound: ", isFound)
            if (!isFound) {
                if (previousGroup === []) {
                    count++;
                } else {
                    console.log("not found 404 => clear previous group")
                    clearPreviousGroup()
                    await tab.get("https://m.facebook.com/");

                }
            } else {
                const randomTime = Math.floor(Math.random() * 2) + 3; // Random 2p -> 3p
                console.log(`sleep ${randomTime} minutes to continue comment`)

                await tab.sleep(randomTime * 60 * 1000);
                // await tab.sleep(5000);

                if (count < MAX_COUNT_POST) { // if not last time => reload
                    // Back to the home page
                    await tab.get("https://m.facebook.com/");
                }
            }

        }
        catch (err) {
            // console.log("ERROR: ", err);
            console.log("Cannot post comment")
        }
    }
}

const fillCommentBox = async () => {
    // First fill to the comment box
    await tab.sleep(randomTimeSleep());
    const commentBox = await tab.findElement(swd.By.css("#composerInput"));
    await commentBox.sendKeys(randomContent);
    console.log("Successfully fill the comment box!");

    // Click Post button
    await tab.sleep(randomTimeSleep());
    const postBtn = await tab.findElement(swd.By.css("button[class='_54k8 _52jg _56bs _26vk _3lmf _3fyi _56bv _653w']"));
    await postBtn.click();

    // Click More button
    await tab.sleep(randomTimeSleep());
    const moreButtons = await tab.findElements(swd.By.css("a[class='_1l26 _2b0a']"))
    await moreButtons[moreButtons.length - 1].click();

    // Click Edit button
    await tab.sleep(randomTimeSleep());
    const editBtn = await tab.findElement(swd.By.css("a[data-sigil='touchable touchable editCommentSigil edit-link enabled_action']"));
    await editBtn.click();

    // Clear the old comment and replace with new comment
    await tab.sleep(randomTimeSleep());
    const editBox = await tab.findElement(swd.By.css("textarea[class='commentEditTextArea mentions-input']"));
    await editBox.clear();
    await tab.sleep(randomTimeSleep());

    await tab.sleep(randomTimeSleep());
    await editBox.sendKeys(randomContent.replace("buzzho[.]me", "https://buzzho[.]me"));

    // Click Update button
    await tab.sleep(randomTimeSleep());
    let updateBtn;
    try {
        updateBtn = await tab.findElement(swd.By.css("button[value='Update']"));

    } catch {
        updateBtn = await tab.findElement(swd.By.css("button[value='Cập nhật']"));
    }
    await updateBtn.click();

    console.log("Successfully comment the first post!");
}

const filterAnotherElementOfArray = () => {
    return groupNameData.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        previousGroup
    );
}

const isPropertyGroup = (groupName) => {
    const index = groupNameData.findIndex(item => item.includes(groupName));
    return index !== -1;
}

const clearPreviousGroup = () => {
    previousGroup = []
}

const afterComment = (newGroupName) => {
    // push group name to previous
    previousGroup.push(newGroupName)
    console.log("previous group: ", previousGroup)


    // check to clear previousGroup name
    if (previousGroup.length === groupNameData.length) {
        clearPreviousGroup()
    }
}

const isInPreviousGroups = (name) => {
    if (previousGroup.length === 0) {
        return false;
    }

    const index = previousGroup.indexOf(name)
    if (index === -1) {
        return false
    }
    return true;
}

const randomTimeSleep = () => {
    return Math.floor(Math.random() * 4000) + 3000
}