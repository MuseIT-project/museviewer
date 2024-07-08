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
        const host = 'https://database.sharemusic.se';
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
		const url = data["ore:describes"]['publication']['publicationURL']
		const urlObject = new URL(url);
		const pathname = urlObject.pathname.split('/');
		const videoId = pathname[pathname.length - 1];
		document.getElementById("vimeo").src = "https://player.vimeo.com/video/" + videoId + "?h=97c0e1a853";
   		const elementsList = listElements(data);
                document.getElementById('jsonElements').textContent = elementsList;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
