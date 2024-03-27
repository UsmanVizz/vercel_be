
exports.extractLatLongFromUrl = async (url) => {


    const parsedUrl = new URL(url);

    // Extract latitude and longitude from the URL
    let lat, lng;

    // Extract latitude and longitude for Google Maps URLs
    if (parsedUrl.hostname === 'www.google.com' && parsedUrl.pathname.includes('/@')) {
        const [, latitude, longitude] = parsedUrl.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || [];
        lat = latitude;
        lng = longitude;
    }
    // Extract latitude and longitude for maps.app.goo.gl URLs
    else if (parsedUrl.hostname === 'maps.app.goo.gl') {
        const [, coordinates] = parsedUrl.pathname.match(/\/@([^\?]+)/) || [];
        if (coordinates) {
            const [longitude, latitude] = coordinates.split(',');
            lat = latitude;
            lng = longitude;
        }
    }

    return { lat, lng };
};






