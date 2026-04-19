exports.handler = async (event) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const playlistId = "PLHZOhV2rP0rmPbrmqUhy09Jq1MOj_l78g";

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=50`;
    
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno en el servidor" }),
    };
  }
};