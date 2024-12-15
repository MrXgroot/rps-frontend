async function preloadImages(imageSrcArray) {
  const cacheName = "image-cache-v1";

  const cache = await caches.open(cacheName);

  let loadedCount = 0;
  const totalImages = imageSrcArray.length;

  return Promise.all(
    imageSrcArray.map(async (src) => {
      const cachedResponse = await cache.match(src);
      if (cachedResponse) {
        loadedCount += 1;
        if (loadedCount === totalImages) {
          return Promise.resolve();
        }
      } else {
        const img = new Image();
        img.src = src;

        return new Promise((resolve, reject) => {
          img.onload = async () => {
            await cache.put(src, new Response(img.src));
            loadedCount += 1;
            resolve();
          };

          img.onerror = () => {
            // console.error(`Failed to load image: ${src}`);
            loadedCount += 1;
            resolve();
          };
        });
      }
    })
  ).then(() => {
    if (loadedCount === totalImages) {
    }
  });
}
export { preloadImages };
