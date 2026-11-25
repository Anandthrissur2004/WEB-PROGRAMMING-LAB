//API URL and API key
const apiKey = "61ca080b1518444aa33a7598dfc0eb65";

async function getNews() {
    const container = document.getElementById("news-container");

    container.innerHTML = "Loading news...";

    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
//Fetch API and JSON response handling
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load news");
        }

        container.innerHTML = "";
//Iterating through and displaying news articles
        data.articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "news-card";

            card.innerHTML = `
                <img src="${article.urlToImage || ''}" 
                     alt="News image"
                     onerror="this.style.display='none'">

                <h2>${article.title || "No title"}</h2>

                <p>${article.description || "No description available"}</p>

                <p><b>Source:</b> ${article.source.name}</p>

                <p><b>Date:</b> ${
                    new Date(article.publishedAt).toLocaleDateString()
                }</p>
            `;

            container.appendChild(card);
        });

        if (data.articles.length === 0) {
            container.innerHTML = "No news available.";
        }

    } catch (error) {
        container.innerHTML = error.message;
    }
}

getNews();
