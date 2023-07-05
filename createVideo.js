const fs = require("fs");
const delay = require("delay");
const fetch = require("node-fetch");
const axios = require("axios");
const xlsx = require("xlsx");

let listAudio_error = [];

// 1. Create audios from the content
let authorization =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmRzE4X1Z1TGRTQ2tFbHlIS0g0NEY1WGNHd1dXUG1zbXRydnJBaXV2b2JzIn0.eyJleHAiOjE2ODg2Mjg0MjgsImlhdCI6MTY4ODU0MjAyOCwiYXV0aF90aW1lIjoxNjg4NTQyMDAwLCJqdGkiOiIwODQ0YzM1Zi0yOTNiLTRiOTMtYTY5OS02MTVhYTEzMWVjMWQiLCJpc3MiOiJodHRwczovL2FjY291bnRzLnZiZWUudm4vYXV0aC9yZWFsbXMvdmJlZS1ob2xkaW5nIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjY4ZTgxNGJiLWZhNjgtNDI4OC1iMTA2LTNmYTIzYzAxOTU3NSIsInR5cCI6IkJlYXJlciIsImF6cCI6InZiZWUtdHRzLWNybSIsIm5vbmNlIjoiNDYxZGY5M2YtZGMwMS00YmU4LTg0OGEtMDNhZWEyMGQ4NjQ1Iiwic2Vzc2lvbl9zdGF0ZSI6IjIzZWNiZTA3LTRiZTgtNDVhNi05ODUzLWEyMjNjYzdlNmEwMCIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly92YmVlLnZuIiwiaHR0cHM6Ly9ob21lLnZiZWUudm4iLCJodHRwczovL2FwaS52YmVlLnZuIiwiaHR0cHM6Ly9zdHVkaW8udmJlZS52biIsImh0dHBzOi8vd3d3LnZiZWUudm4iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtdmJlZS1ob2xkaW5nIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiIyM2VjYmUwNy00YmU4LTQ1YTYtOTg1My1hMjIzY2M3ZTZhMDAiLCJpZGVudGl0eV9wcm92aWRlciI6ImVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlwIjoiMTgzLjgwLjI0OC4yIiwibmFtZSI6Ik11bHRpRmVhcnoiLCJhdmF0YXIiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRlRlY3UEtPblJDN3J2NXR5c3VVSlJYV0lsZkxrZ0Q1YkFSV0hZXz1zOTYtYyIsInByZWZlcnJlZF91c2VybmFtZSI6InZvY2Fsbm8wMUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiTXVsdGlGZWFyeiIsImVtYWlsIjoidm9jYWxubzAxQGdtYWlsLmNvbSJ9.L30emrGe320E1NwzwRaIFeEmj9bN6z26qFvtM04CRPoXOg1rVxEm2OfgsOIYAJ4jHf-lqBtwq8FUmM72Qc-ZiVX0cO75XhzUYFBxGsjy83rZLG_f0byufjnQXdEazlEIrlI-dEcqm13wVCbTnf-QUnHrXaPJjlf4YbsXjcMqr48-5lXLUmU8GH6k6JhNKJZs4QQwiOmJ330fUIeR5JpLvnxGri4SwD8pPjjo10TT4Khllntg3Yh2o797fflxI6PgWeHmDv2I0yr5_J5KQsumyrEM_YkLS3TJ7c2zwlt5zMNnxe8WPQVllRQD_ptm1bwZCbYt2ja-skl5kRjeRqX7kA";

async function createAudio(title, text) {
  let response = await fetch("https://vbee.vn/api/v1/synthesis", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language":
        "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,ru-RU;q=0.6,ru;q=0.5",
      authorization: `Bearer ${authorization}`,
      "content-type": "application/json",
      "sec-ch-ua":
        '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://studio.vbee.vn/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"audioType":"wav","bitrate":128000,"title":"${title}","backgroundMusic":{"volume":80},"text":"${text}","voiceCode":"hn_male_phuthang_stor80dt_48k-fhg","speed":1.05}`,
    method: "POST",
  });
  let result = await response.json();
  return result.result.request_id;
}

async function getAudioUrl(requestID) {
  let response = await fetch(`https://vbee.vn/api/v1/requests/${requestID}`, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language":
        "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,ru-RU;q=0.6,ru;q=0.5",
      authorization: `Bearer ${authorization}`,
      "sec-ch-ua":
        '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://studio.vbee.vn/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });
  let result = await response.json();
  console.log("audio_link: ", result.result.audio_link);
  return result.result.audio_link;
}

async function processAudios(inputFile, outputFile) {
  const content = fs.readFileSync(inputFile, "utf-8").replace();
  const posts = content.split("\n\n\n").filter((item) => item !== "");
  const results = [];

  for (const post of posts) {
    const splitLine = post.split("|");
    const postId = splitLine[0]
      .replaceAll('"', "")
      .replaceAll("\r", "")
      .replace(/\n/g, "")
      .replace(/\n\n/g, "")
      .trim();
    const postContent = splitLine[1]
      .replaceAll('"', "")
      .replaceAll("\r", "")
      .replace(/\n/g, "\\n")
      .replace(/\n\n/g, "\\n")
      .trim();
    const requestID = await createAudio(postId, postContent);
    await delay(35 * 1000);
    const audioUrl = await getAudioUrl(requestID);
    // const audioUrl = await axios(config);

    results.push({ postId, postContent, audioUrl });

    fs.appendFileSync(outputFile, `${postId}|${audioUrl}\n`);
  }
  return results;
}

// 2. Create video AI
async function createVideo(i, audioUrl, apiKey, postID) {
  let listImage = fs
    .readFileSync("listImage.txt", "utf8")
    .split("\n")
    .filter((item) => item !== "");
  //randome image
  let linkImage =
    listImage[Math.floor(Math.random() * listImage.length)].trim();

  try {
    let res = await axios.post(
      "https://api.d-id.com/talks",
      {
        source_url: linkImage,
        script: {
          type: "audio",
          audio_url: audioUrl,
        },
        config: {
          stitch: true,
          driver_expressions: {
            expressions: [
              {
                start_frame: 0,
                expression: "serious",
                intensity: 1.0,
              },
            ],
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${apiKey}`,
        },
      }
    );
    let id = res.data.id;
    console.log(`${i}. id: `, id);
    fs.appendFileSync(
      "listID_video.txt",
      `${id}|${apiKey}|${audioUrl}|${postID}` + "\n"
    );
    return id;
  } catch (error) {
    // console.error(error);
    listAudio_error.push(`${postID}|${audioUrl}`);
    return null;
  }
}

async function getVideoUrl(id, apiKey) {
  try {
    const res = await axios.get(`https://api.d-id.com/talks/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
    });
    return res.data.result_url;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function processVideos(audioFile, videoFile) {
  const content = fs.readFileSync(audioFile, "utf-8");
  let listAudio = content.split("\n").filter((item) => item !== "");
  let listAPIKey = fs.readFileSync("APIKey.txt", "utf8").split("\n");
  const results = [];

  while (listAudio.length > 0) {
    console.log("listAudio: ", listAudio);
    let promises = [];
    let apiKey = listAPIKey[0].trim();

    for (let i = 0; i < listAudio.length; i++) {
      let postID = listAudio[i].split("|")[0].trim();
      let audioUrl = listAudio[i].split("|")[1].trim();
      promises.push(createVideo(i, audioUrl, apiKey, postID));
    }

    let errors = await Promise.all(promises);

    if (errors.some((error) => error === null)) {
      listAPIKey.shift();
      fs.writeFileSync("APIKey.txt", listAPIKey.join("\n"));
    }

    listAudio = [];

    while (listAudio_error.length > 0) {
      listAudio.push(listAudio_error.shift());
    }

    if (listAPIKey.length === 0) {
      console.error("No API key left!");
      break;
    }
  }

  console.log("wait 5 minutes to get video url");
  //wait 5 minutes
  await delay(1000 * 60 * 5);

  let listVideoID = fs
    .readFileSync("listID_video.txt", "utf-8")
    .split("\n")
    .filter((item) => item !== "");

  for (let i = 0; i < listVideoID.length; i++) {
    let requestID = listVideoID[i].split("|")[0].trim();
    let apiKey = listVideoID[i].split("|")[1].trim();
    let audioUrl = listVideoID[i].split("|")[2].trim();
    let postId = listVideoID[i].split("|")[3].trim();
    let videoUrl = await getVideoUrl(requestID, apiKey);
    await delay(100); // Wait for 100ms after each video URL retrieval
    results.push({ postId, audioUrl, videoUrl });
    fs.appendFileSync(videoFile, `${postId}|${videoUrl}\n`);
  }

  return results;
}

// 3. Write the content to an Excel file
function writeToExcel(audioResults, videoResults, excelFileName) {
  let dataForExcel = audioResults.map((audioResult, i) => [
    audioResult.postId,
    audioResult.postContent.replace(/\\n/g, "\n"),
    audioResult.audioUrl,
    videoResults[i].videoUrl,
  ]);
  dataForExcel.unshift([
    "Post ID",
    "Original Content",
    "Audio URL",
    "Video URL",
  ]); // Adding headers at the top

  let ws = xlsx.utils.aoa_to_sheet(dataForExcel);
  let wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  xlsx.writeFile(wb, excelFileName);
}

// Main execution
async function main() {
  //   let audioResults = await processAudios(
  //     "chatgpt_output_test.txt",
  //     "audioUrl_test.txt"
  //   );

  //   // Wait 5 seconds
  //   await delay(5 * 1000);

  let videoResults = await processVideos(
    "audioUrl_test.txt",
    "videoUrl_test.txt"
  );
  console.log("videoResults: ", videoResults);

  //   writeToExcel(audioResults, videoResults, "results_all.xlsx");
}

main();
