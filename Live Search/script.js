//Data source/API URL
const search = document.getElementById("search");
const results = document.getElementById("results");
//Search input event listener
search.addEventListener("input", function() {
    const query = search.value.trim();

    if (query === "") {
        results.innerHTML = "";
        return;
    }

    searchProducts(query);
});
//Fetch/AJAX implementation
async function searchProducts(query) {
    results.innerHTML = "Loading...";

    const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Unable to fetch data");
        }

        results.innerHTML = "";
//JSON processing and dynamic result display
        if (data.products.length === 0) {
            results.innerHTML = "No products found.";
            return;
        }

        data.products.forEach(product => {
            const div = document.createElement("div");
            div.className = "result";

            div.innerHTML = `
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <p>Category: ${product.category}</p>
            `;

            results.appendChild(div);
        });
//Error and empty-result handling
    } catch (error) {
        results.innerHTML = error.message;
    }
}
