async function importFetch() {
    const fetch = (await import('node-fetch')).default;
    return fetch;
}

async function getGif(searchTerm) {
    const tenorKey = process.env.TENOR_API_KEY;
    if (!tenorKey) {
        console.error('Tenor API key not found!');
        return null;
    }

    try {
        const fetch = await importFetch();
        const response = await fetch(
            `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${tenorKey}&limit=20&contentfilter=high`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        // Obtener un GIF aleatorio de los resultados
        const randomGif = data.results[Math.floor(Math.random() * data.results.length)];
        return randomGif.media_formats.gif.url;
    } catch (error) {
        console.error('Error fetching GIF from Tenor:', error);
        return null;
    }
}

module.exports = {
    getGif
};