const puppeteer = require("puppeteer");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");
const xlsx = require("xlsx");

// 1. Crawl the content of the Facebook posts

async function processPosts(postIDs) {
  const ws =
    "ws://127.0.0.1:9222/devtools/browser/b9d1c0a3-a125-4612-8df2-4c9479d33526";
  const browser = await puppeteer.connect({
    headless: true,
    browserWSEndpoint: ws,
    defaultViewport: null,
  });
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
          function getAllDeepestChildDivs(parentElement) {
            let deepestDivs = [];

            function traverse(element) {
              const children = element.children;
              if (children.length === 0) {
                // Base case: No children, add the div to the deepestDivs array
                if (element.tagName.toLowerCase() === "div") {
                  deepestDivs.push(element);
                }
              } else {
                // Recursive case: Traverse each child element
                for (let i = 0; i < children.length; i++) {
                  traverse(children[i]);
                }
              }
            }

            traverse(parentElement);

            return deepestDivs;
          }

          // Example usage:

          let div1 = document.querySelectorAll("div.x126k92a")[0];
          const deepestChildDivs_1 = getAllDeepestChildDivs(div1);

          console.log(deepestChildDivs_1);
          let div1_length = 0;
          let text_div1 = "";
          if (!!div1) {
            div1_length = deepestChildDivs_1.length;

            for (let i = 0; i < div1_length; i++) {
              let curDiv = deepestChildDivs_1[i];
              text_div1 += curDiv.textContent + "\n";
            }
          }

          let div2 = document.querySelectorAll("span.x1yc453h")[12];
          let div3 = document.querySelectorAll("span.xzsf02u")[17];
          let div4 = document.querySelectorAll("div.xu06os2 ")[2];
          let div5 = document.querySelectorAll("span.x1yc453h")[2];

          let div6 = document.querySelectorAll("span.x1yc453h")[2];
          const deepestChildDivs_6 = getAllDeepestChildDivs(div6);

          console.log(deepestChildDivs_1);
          let div6_length = 0;
          let text_div6 = "";
          if (!!div6) {
            div6_length = deepestChildDivs_6.length;

            for (let i = 0; i < div6_length; i++) {
              let curDiv = deepestChildDivs_6[i];
              text_div6 += curDiv.textContent + "\n";
            }
          }

          //find max length in above div
          let div1Length = text_div1.length;
          let div2Length = div2?.textContent.length || 0;
          let div3Length = div3?.textContent.length || 0;
          let div4Length = div4?.textContent.length || 0;
          let div5Length = div5?.textContent.length || 0;
          let div6Length = text_div6.length;

          let max = Math.max(
            div1Length,
            div2Length,
            div3Length,
            div4Length,
            div5Length,
            div6Length
          );
          let content = "";
          if (max == div1Length) {
            content = text_div1;
          } else if (max == div2Length) {
            content = div2.textContent.trim();
          } else if (max == div3Length) {
            content = div3.textContent.trim();
          } else if (max == div4Length) {
            content = div4.textContent.trim();
          } else if (max == div5Length) {
            content = div5.textContent.trim();
          } else if (max == div6Length) {
            content = text_div6;
          }

          return content;
        });
        // Save the content to a file
        if (postContent.length > 150) {
          const result = `${postID}|${postContent}\n\n\n`;
          fs.appendFileSync("postResults_test.txt", result, (err) => {
            if (err) {
              console.error(`Error writing result for post ${postID}: ${err}`);
            } else {
              console.log(
                `Result for post ${postID} saved to postResults_test.txt`
              );
            }
          });
        }
      } catch (error) {
        console.error(`Error fetching post ${postID}: ${error.message}`);
      }
    }
  }
}

// 2. Format the content file

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function main(prompt) {
  if (!!prompt && prompt.length > 100) {
    const maxRetries = 5;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          max_tokens: 2000,
          temperature: 1,
          messages: [
            {
              role: "user",
              content: `rewrite this content on Vietnamese, remove special icon, remove all hashtags and correct spelling, remove source and image refer: '${prompt}'`,
            },
          ],
        });
        return response.data.choices[0].message.content;
      } catch (error) {
        if (error.message.includes("rate limit")) {
          const waitTime = Math.pow(2, i + 1); // Exponential backoff
          console.log(`Rate limit hit, retrying after ${waitTime} seconds.`);
          await sleep(waitTime * 1000); // Convert to milliseconds
        } else {
          console.error("An error occurred:", error);
          break;
        }
      }
    }
  } else {
    return "";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processFile(inputFile, outputFile) {
  const content = fs.readFileSync(inputFile, "utf-8");
  const posts = content.split("\n\n\n");
  const results = [];

  for (const post of posts) {
    const splitLine = post.split("|");
    const postId = splitLine[0];
    const postContent = splitLine[1];

    const formattedContent = await main(postContent);

    results.push({ postId, postContent, formattedContent });

    fs.appendFileSync(outputFile, `${postId}|${formattedContent}\n\n\n`);
  }

  return results;
}

// 3. Write the content to an Excel file

function writeToExcel(results, excelFileName) {
  let dataForExcel = results.map((result) => [
    result.postId,
    result.postContent,
    result.formattedContent,
  ]);
  dataForExcel.unshift(["Post ID", "Original Content", "Formatted Content"]); // Adding headers at the top

  let ws = xlsx.utils.aoa_to_sheet(dataForExcel);
  let wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  xlsx.writeFile(wb, excelFileName);
}

// Main execution

fs.readFile("listID_test.txt", "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const postIDs = data.split("\n");
  await processPosts(postIDs);

  const results = await processFile(
    "postResults_test.txt",
    "chatgpt_output_test.txt"
  );
  writeToExcel(results, "results_test.xlsx");
});
