// netlify/functions/youtube-proxy.js

//exports.handler = async (event) => { // ← exports (CommonJS) no export (ES Modules)
export const handler = async (event) => {
  try {
    // 1. Obtener la API key de la variable de entorno
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    // Variables fijas, no vienen del frontend
    const channelId = "UCvCTWHCbBC0b9UIeLeNs8ug";
    const query = "Dejaqueentreelsol";

    // 2. Construir URL y hacer fetch a YouTube
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&q=${query}&part=snippet&type=video&maxResults=50`;
    
    const response = await fetch(url);
    const data = await response.json();

    // 3. Retornar los datos al frontend
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