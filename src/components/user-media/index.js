import inBrowser from '../util/in-browser';

if (inBrowser && typeof navigator !== 'undefined') {
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
}

export function getUserMedia(options = {}) {
  if (!inBrowser) {
    return Promise.resolve({});
  }

  if (typeof navigator === 'undefined' || !navigator.getUserMedia) {
    return Promise.reject(new Error('WebRTC not supported.'));
  }

  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      {
        audio: options.audio,
        video: options.video,
      },
      (stream) => resolve(stream),
      (error) => reject(new Error(error))
    );
  });
}

export function streamToElement(element, stream) {
  const video = element;

  return new Promise((resolve, reject) => {
    if ((typeof MediaStream !== 'undefined' && MediaStream !== null)
            && stream instanceof MediaStream) {
      if (element.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
      } else {
        video.src = stream;
      }
    } else {
      video.src = (window.URL) ? window.URL.createObjectURL(stream) : stream;
    }

    // let playingOnce = false;
    video.addEventListener('error', (error) => reject(new Error(error)));
    video.addEventListener('loadeddata', () => {
      // if (playingOnce) return;
      // playingOnce = true;

      if (video.videoHeight > 0 && video.videoWidth > 0) {
        resolve(video);
      } else {
        reject(new Error('Camera not available.'));
      }
    });

    video.play();
  });
}

export function stopStream(stream) {
  return new Promise((resolve) => {
    if (!('stop' in stream)) {
      stream.getAudioTracks().forEach(track => track.stop());
      stream.getVideoTracks().forEach(track => track.stop());
    } else {
      stream.stop();
    }

    resolve(stream);
  });
}
