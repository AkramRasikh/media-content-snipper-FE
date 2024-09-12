import { v4 as uuidv4 } from 'uuid';

export const txtToJSON = (txtData) => {
  // Split the file content into lines
  const lines = txtData.trim().split('\n');

  // Initialize an array to hold the JSON objects
  const subtitlesArray = [];

  // Function to remove multiple spaces and trim Japanese text
  function trimSpacedText(text) {
    return text.replace(/[\s⸺]/g, '');
  }

  // Function to convert time string "HH:MM:SS" to total seconds
  function timeToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Loop through the lines (skip the header)
  for (let i = 1; i < lines.length; i++) {
    // Split each line by tab character (\t)
    const parts = lines[i].split('\t\t');

    // Extract time, targetLang (Japanese), and baseLang (English)
    const time = parts[0].trim();
    let targetLang = parts[1].trim();
    const baseLang = parts[2].trim();

    // Trim extra spaces in the Japanese text
    targetLang = trimSpacedText(targetLang);

    // Create a JSON object and push it into the array
    subtitlesArray.push({
      id: uuidv4(),
      time: timeToSeconds(time),
      targetLang: targetLang,
      baseLang: baseLang,
    });
  }

  console.log('## ', subtitlesArray);

  return subtitlesArray;
};
// Convert the array to JSON string with indentation
// const jsonString = JSON.stringify(subtitlesArray, null, 4);

// // Write the JSON string to 'output.json'
// fs.writeFileSync('output.json', jsonString, 'utf8');

// console.log('JSON data has been saved to output.json');
