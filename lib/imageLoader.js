export default function imageLoader({ src, width, quality }) {
    // Handle URLs that already have query parameters
    const url = new URL(src, 'https://example.com');
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    return url.toString();
}