const imgMatcher = /\.(jpeg|jpg|png)$/;
const audioMatcher = /\.(wav|mp3|ogg)$/;

export async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function loadSound(url: string): Promise<HTMLAudioElement> {
  const sound = new Audio();

  return new Promise((resolve, reject) => {
    sound.onload = () => resolve(sound);
    sound.onerror = reject;
    sound.src = url;
  });
}

export async function loadAsset(
  url: string
): Promise<HTMLImageElement | HTMLAudioElement> {
  if (url.match(imgMatcher)) return loadImage(url);
  if (url.match(audioMatcher)) return loadSound(url);

  const urlSplitted = url.split(".");
  const ext = urlSplitted[urlSplitted.length - 1];

  throw {
    message: `Unrecognized file extension of ${ext}`
  };
}

export async function loadAssets(
  resourceUrls: Record<string, string>,
  onProgress: (
    loadedResources: Record<string, HTMLImageElement | HTMLAudioElement>,
    errors: Record<string, unknown>,
    progress: number
  ) => void
) {
  const promises: Promise<unknown>[] = [];
  const result: Record<string, HTMLImageElement | HTMLAudioElement> = {};
  const keys = Object.keys(resourceUrls);
  const total = keys.length;
  let loaded = 0;
  let errorCount = 0;
  const errors: Record<string, unknown> = {};

  for (const k of keys) {
    const url = resourceUrls[k];

    const promise = new Promise<void>(async resolve => {
      try {
        const res = await loadAsset(url);

        result[k] = res;
      } catch (err) {
        errorCount++;

        errors[k] = err;
      } finally {
        loaded++;

        onProgress(result, errors, loaded / total);

        resolve();
      }
    });

    promises.push(promise);
  }

  await Promise.all(promises);

  if (errorCount > 0) {
    throw {
      loadedResources: result,
      errors,
      errorCount
    };
  }

  return result;
}
