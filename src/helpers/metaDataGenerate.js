export function metaDataGenerate(title, image, intro) {
  document.head.querySelector('meta[property="og:title"]').content = title;
  document.head.querySelector('meta[property="og:image"]').content = image;
  document.head.querySelector('meta[property="og:description"]').content = intro;
}
