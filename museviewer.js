function getYouTubeVideoID(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Check if the URL is from YouTube
    if (hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtu.be') {
      // Extract the video ID from the URL
      if (hostname === 'youtu.be') {
        // For shortened youtu.be URLs
        return urlObj.pathname.slice(1);
      } else {
        // For regular youtube.com URLs
        return urlObj.searchParams.get('v');
      }
    } else {
      return null; // Not a YouTube URL
    }
  } catch (e) {
    return null; // Invalid URL
  }
}

// Function to process the publication data
function processPublications(data) {
  let publications = data["ore:describes"]['publication'];
  
  if (!publications) {
    console.error('No publication data found.');
    return;
  }
  
  if (!Array.isArray(publications)) {
    publications = [publications]; // Convert single object to an array
  }
  
  publications.forEach(publication => {
    let url = publication['publicationURL'];
    let youtubeId = getYouTubeVideoID(url);
    let urlObject = new URL(url);
    let pathname = urlObject.pathname.split('/');
    let videoId = pathname[pathname.length - 1];

    console.log("URL:", publication);
    console.log("YouTube ID:", youtubeId); // Prints YouTube video ID
    console.log("Video ID from pathname:", videoId); // Prints the last segment of the path
  });

  return publications
}

// Function to recursively list all elements in the JSON object
function listElements(obj, indent = '') {
            let result = '';
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        result += `${indent}${key}:\n`;
                        result += listElements(obj[key], indent + '  ');
                    } else {
                        result += `${indent}${key}: ${obj[key]}\n`;
                    }
                }
  }
  return result;
}

    	const params = new URLSearchParams(window.location.search);
	const persistentId = params.get('persistentId');
        const host2 = 'https://database.sharemusic.se';
        const host = 'https://dev.now.museum';
	const fullURL = host + '/api/datasets/export?exporter=OAI_ORE&persistentId=' + persistentId;
        const directURL = host + '/dataset.xhtml?persistentId=' + persistentId;
	console.log('Persistent ID:', persistentId);
	fetch(fullURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Extract the title from the JSON data
                const title = data["ore:describes"]["title"];

                // Insert the title into the HTML element
                document.getElementById("title").textContent = title;
		document.getElementById("description").textContent = data["ore:describes"]["citation:dsDescription"]["citation:dsDescriptionValue"];
		document.getElementById('persistentId').innerHTML = '<a href="' + directURL + '">' + persistentId + '</a>';
		let url = data["ore:describes"]['publication']['publicationURL']
                let urls = processPublications(data);
                let videoId = "";
                let youtubeId = "";
		let urlObject = new URL(url);
                youtubeId = getYouTubeVideoID(url);
		let pathname = urlObject.pathname.split('/');
		videoId = pathname[pathname.length - 1];
                console.log('YouTube: ', youtubeId);
                console.log(urls);

                if (videoId) {
		document.getElementById("video").src = "https://player.vimeo.com/video/" + videoId + "?h=97c0e1a853";
                } else { document.getElementById("video").src = ""; }

                if (youtubeId) {
                document.getElementById("video").src = "https://www.youtube.com/embed/" + youtubeId;
                } else { document.getElementById("video").src = ""; }

   		const elementsList = listElements(data);
                document.getElementById('jsonElements').textContent = elementsList;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
