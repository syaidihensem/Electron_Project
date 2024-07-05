function searchWord() {
    const word = document.getElementById('word').value.trim();
    const type = document.getElementById('type').value.trim();

    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    if (type) {
        apiUrl += `/${type}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const entryContainer = document.getElementById('entryContainer');

            // Clear previous results
            entryContainer.innerHTML = '';

            if (data.length > 0) {
                const entry = data[0]; // Use the first entry to display the word and phonetic info

                // Display word and phonetic info
                let entryHTML = `<div class="word-info">`;
                entryHTML += `<h2>${entry.word}</h2>`;
                if (entry.phonetics && entry.phonetics.length > 0) {
                    entryHTML += `<audio controls><source src="${entry.phonetics[0].audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                    if (entry.phonetics[0].sourceUrl) {
                        entryHTML += `<p><a href="${entry.phonetics[0].sourceUrl}" target="_blank">${entry.phonetics[0].sourceUrl}</a></p>`;
                    }
                }
                entryHTML += `</div>`;
                entryContainer.innerHTML = entryHTML;

                // Loop through all entries to display meanings (definitions, examples, synonyms, antonyms)
                data.forEach(entry => {
                    entry.meanings.forEach(meaning => {
                        let meaningsHTML = `<div class="meanings">`;
                        meaningsHTML += `<h3>${meaning.partOfSpeech}</h3>`;

                        // Definitions
                        if (meaning.definitions && meaning.definitions.length > 0) {
                            meaningsHTML += `<div class="definitions">`;
                            meaningsHTML += `<h4>Definitions:</h4>`;
                            meaning.definitions.slice(0, 3).forEach(definition => {
                                meaningsHTML += `<p>${definition.definition}</p>`;
                            });
                            meaningsHTML += `</div>`;
                        }

                        // Examples
                        if (meaning.examples && meaning.examples.length > 0) {
                            meaningsHTML += `<div class="examples">`;
                            meaningsHTML += `<h4>Examples:</h4>`;
                            meaning.examples.slice(0, 3).forEach(example => {
                                meaningsHTML += `<p>${example.text}</p>`;
                            });
                            meaningsHTML += `</div>`;
                        }

                        // Synonyms
                        if (meaning.synonyms && meaning.synonyms.length > 0) {
                            meaningsHTML += `<div class="synonyms">`;
                            meaningsHTML += `<h4>Synonyms:</h4>`;
                            meaningsHTML += `<p>${meaning.synonyms.join(', ')}</p>`;
                            meaningsHTML += `</div>`;
                        }

                        // Antonyms
                        if (meaning.antonyms && meaning.antonyms.length > 0) {
                            meaningsHTML += `<div class="antonyms">`;
                            meaningsHTML += `<h4>Antonyms:</h4>`;
                            meaningsHTML += `<p>${meaning.antonyms.join(', ')}</p>`;
                            meaningsHTML += `</div>`;
                        }

                        meaningsHTML += `</div>`; // Close meanings div
                        entryContainer.innerHTML += meaningsHTML; // Append to entryContainer
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
