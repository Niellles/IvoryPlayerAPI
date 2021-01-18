# IvoryPlayerAPI
## Introduction
I found myself in need to interact with the Ivory Studio interactive videoplayer to hide a menu when video playback was started (and unhide it when the video was paused). After some messing around with overlaying transparent divs on the iframe I discovered I could interact with the iframe via [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). Fortunately Ivory Studio's player already sends messages and listens to received messages. This API just provides a wrapper to make this all a little easier.

## Usage
First we need a page with the videoplayer and an unique id for the iframe. Of course we will also need the `IvoryPlayerAPI` class:
```html
<iframe id="iv_iframe" src="https://projects.ivorystudio.net/embed/projects/1234"></iframe>
<script src="IvoryPlayerAPI.js" type="application/javascript"></script>
```
Then we can use the following code to interact with the player:
```javascript
videoplayer = new IvoryPlayerAPI('iv_iframe');

window.addEventListener("iv_player_playing", function(e){
	// Some code to hide our menu.
});

window.addEventListener("iv_player_paused", function(e){
	// Some code to unhide our menu.
});

// Or we can pause/resume the video, like so:
videoplayer.pause();
videoplayer.resume(); // Only possible after the video has been started by a user interaction at least once.

// If your code needs to know whether the video is currently playing:
videoplayer.playing // (bool) true/false
```
