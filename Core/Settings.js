import { me } from "./ObjectManager";

// Define the settings object
let settings = {
  Character: {}
};

// Path to settings file
const settingsPath = `${__dataDir}/settings.json`;

// Function to load settings from the file
function loadSettings() {
  try {
    try {
      fs.access(settingsPath, fs.constants.F_OK);
      const data = fs.readFile(settingsPath, 'utf-8');
      settings = JSON.parse(data);
    } catch (error) {
      console.warn('Settings file not found, creating a new one.');
      fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

// Save settings back to the file
function saveSettings() {
  try {
    fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    console.info('Settings saved successfully.');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Create a Proxy for the settings object
const Settings = new Proxy(settings, {
  get(target, key) {
    if (key === 'saveSettings') {
      return saveSettings;
    }

    if (key in target) {
      return target[key];
    }

    // Get character-specific settings
    const playerKey = `player${me?.guid?.low}`;
    const charSettings = settings.Character[playerKey];

    if (charSettings && key in charSettings) {
      return charSettings[key];
    }

    return undefined;
  },

  set(target, key, value) {
    // Prevent direct modification of the Character object
    if (key === 'Character') {
      console.error("Cannot directly set 'Character'. Please use specific keys.");
      return false;
    }

    const playerKey = `player${me.guid.low}`;

    // Ensure character object exists
    if (!settings.Character[playerKey]) {
      settings.Character[playerKey] = {};
    }

    // Set the value at the last level for the player
    settings.Character[playerKey][key] = value;

    // Save the updated settings to the file
    saveSettings();

    return true;
  }
});

// Load the settings initially
loadSettings();

// Export the Settings object as the global singleton
export default Settings;
