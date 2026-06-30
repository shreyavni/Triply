// import { useState, useEffect } from 'react';

// export function useWikipediaImage(wikipediaUrl) {
//     const [imageUrl, setImageUrl] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // If no URL is provided, reset states and do nothing
//         if (!wikipediaUrl) {
//             setImageUrl(null);
//             return;
//         }

//         const fetchImage = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 // 1. Extract the clean article title from the URL string
//                 const urlParts = wikipediaUrl.split('/wiki/');
//                 if (urlParts.length < 2) {
//                     throw new Error("Invalid Wikipedia URL format");
//                 }
//                 const pageTitle = urlParts[1];

//                 // 2. Fetch the mobile HTML DOM structure directly from Wikipedia's open API
//                 const apiUrl = `https://wikipedia.org{pageTitle}`;
//                 const response = await fetch(apiUrl);

//                 if (!response.ok) {
//                     throw new Error(`Wikipedia API error: ${response.status}`);
//                 }

//                 const htmlText = await response.text();

//                 // 3. Convert the string text into a searchable DOM object tree
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(htmlText, 'text/html');

//                 // 4. Query all image elements from the DOM
//                 const imgTags = doc.querySelectorAll('img');
//                 let foundUrl = null;

//                 // 5. Loop through images to find the first high-quality thumbnail
//                 for (let img of imgTags) {
//                     const src = img.getAttribute('src');
//                     if (src) {
//                         const width = parseInt(img.getAttribute('width')) || 0;

//                         // Skip tiny icons, flags, UI symbols, tracking pixels, and SVGs
//                         if (src.includes('placeholder') || src.includes('.svg') || (width > 0 && width < 60)) {
//                             continue;
//                         }

//                         // Convert relative protocol link (//upload.wikimedia...) to a valid absolute URL
//                         foundUrl = src.startsWith('//') ? `https:${src}` : src;
//                         break; // Stop looping once the first valid image is found
//                     }
//                 }

//                 setImageUrl(foundUrl);
//             } catch (err) {
//                 console.error("Error fetching Wikipedia thumbnail:", err);
//                 setError(err.message);
//                 setImageUrl(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchImage();
//     }, [wikipediaUrl]); // Re-runs automatically if the input URL changes

//     return { imageUrl, loading, error };
// }
