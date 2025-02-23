# SpotifyAudiobookPlayer

[![Netlify Status](https://api.netlify.com/api/v1/badges/8ad2e5f9-a2d5-4dc5-a1c9-57bf2583da7d/deploy-status)](https://app.netlify.com/sites/audiobook-player/deploys)

An app that allows to listen and keep track of your progress of audiobooks on Spotify.

[Official Audiobooks](https://www.spotify.com/us/audiobooks/) on Spotify are not available outside the US yet. But there exist countless audiobooks as normal "music" albums.
The problem is hat Spotify does not keep track of your listening progress within these albums.
With this app you can keep track of your progress and continue listening where you left off.

Currently, everything is stored in the browsers local storage - no data is sent to external servers. Concluded from this the progress is not synced across different devices.

In the future we might add the option to sync the progress by communicating with some server or your Spotify library.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
