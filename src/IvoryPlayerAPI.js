class IvoryPlayerAPI {
    constructor(iframe_id, options = {}) {
        const domain = "https://projects.ivorystudio.net";
        this._iv_player_playing_event = new Event('iv_player_playing', {bubbles: true});
        this._iv_player_paused_event = new Event('iv_player_paused', {bubbles: true});

        this.iframe_id = iframe_id;
        this.iframe;
        this.update_iframe();

        this._has_played = false;
        this.playing = false;

        /* For future implementation:
        this._monitor_time = (typeof options.monitor_time === 'boolean') ? options.monitor_time : false; */
        
        if (typeof options.domain === 'string') {
            domain_expression = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
            if (!options.domain.match(new RegExp(domain_expression))){
                console.error("Provided domain is not a valid domain.");
                    return;
            }

            this.domain = options.domain;
        } else {
            this.domain = domain;
        }

        window.addEventListener("message", this);
    }

    update_iframe() {
        this.iframe = document.getElementById(this.iframe_id);
    }

    handleEvent(e) {
        if (this.domain != e.origin) return;
        data = JSON.parse(e.data);
        if (typeof data.type === 'undefined' || data.type !== "timeupdate") return;

        return this.handleEventData(data.data);
    }

    handleEventData(data) {
        if (!this._has_played && data.playing){
            this._has_played = true;
        }

        if (this.playing !== data.playing) {
            this.playing = data.playing;
            this.fireStateChangeEvent();
        }   

        /* For future implementation:
        if (!this._monitor_time){
            return
        }

        return handleMonitorTime(data); */
    }

    fireStateChangeEvent() {
        if (this.playing) {
            window.dispatchEvent(this._iv_player_playing_event);
        } else if (!this.playing) {
            window.dispatchEvent(this._iv_player_paused_event);
        }
    }

    pause() {
        if (!this.playing) {
            console.warn('Cannot pause when player is already paused.');
            return;
        }

        this._iframeAction('pause');
    }

    resume() {
        if (!this._has_played) {
            console.error('Can only resume already started (and paused) video. Cannot start playing without user interaction.')
        }

        if (this.playing) {
            console.warn('Cannot resume when player is already playing.');
        }

        this._iframeAction('play');
    }

    _iframeAction(action) {
        if (typeof action !== 'string' || ['play', 'pause'].indexOf(action) < 0) {
            console.error('Invalid action sent to iframe.');
            return;
        }

        this.iframe.contentWindow.postMessage(JSON.stringify({"type": action}), this.domain);
    }
}