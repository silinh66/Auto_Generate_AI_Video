const puppeteer = require("puppeteer");
const fs = require("fs");

async function processPosts(postIDs) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < postIDs.length; i++) {
    const postID = postIDs[i].trim();
    if (postID !== "") {
      try {
        await page.goto(`https://www.facebook.com/${postID}`, {
          waitUntil: "networkidle0",
        });

        // Extract the post content
        const postContent = await page.evaluate(() => {
          const div = document.querySelector("div._5pbx.userContent._3576");
          return div ? div.textContent.trim() : "";
        });
        // Save the content to a file
        const result = `${postID}|${postContent}\n`;
        fs.appendFileSync("postResults.txt", result, (err) => {
          if (err) {
            console.error(`Error writing result for post ${postID}: ${err}`);
          } else {
            console.log(`Result for post ${postID} saved to postResults.txt`);
          }
        });
      } catch (error) {
        console.error(`Error fetching post ${postID}: ${error.message}`);
      }
    }
  }

  await browser.close();
}

// Read the list of post IDs from the file
fs.readFile("listID.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const postIDs = data.split("\n");

  // Process posts and save results to file
  processPosts(postIDs);
});
