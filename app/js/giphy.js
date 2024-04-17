export async function getGifs(keywords, amount) {
  let giphyLinks = [];

  let limit = Math.ceil(amount / keywords.length);

  // Loop trough keywords (1 api call per keyword)
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];

    try {
      let response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=Cg8LhhwgM5rlpH23LQRH0qs3UM9gciRy&q=${keyword}&limit=${limit}`
      );
      let resp = await response.json();

      if (resp.data.length > 0) {
        // loop trough each gif object
        for (let j = 0; j < resp.data.length; j++) {
          const gifObj = resp.data[j];

          let gifUrl = "";

          // if (gifObj.images.downsized_medium.size < 1000000){
          //     gifUrl = gifObj.images.downsized_medium.url
          // }else{
          //     //console.log('too large!');
          //     //console.log('prev size: ' + gifObj.images.preview_gif.size );
          //     gifUrl = gifObj.images.preview_gif.url;
          // }

          if (gifObj.images.preview_gif.url) {
            gifUrl = gifObj.images.preview_gif.url;
          } else {
            gifUrl = gifObj.images.downsized_medium.url;
          }

          giphyLinks.push(gifUrl);
        }
      } else {
        console.log("NO gifs were found for keyword: " + keyword);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return giphyLinks;
}
