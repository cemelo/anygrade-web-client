import inBrowser from '../util/in-browser';

function toOptionString(options) {
  const opts = [];

  if (options.audio) opts.push('audio');
  if (options.video) opts.push('video');

  return opts.join(', ');
}

export default function (options = {}) {
  return new Promise((resolve, reject) => {
    if (!inBrowser) {
      resolve({
        capture() {},
        save() {},
      });

      return;
    }

    const getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia).bind(navigator);

    if (typeof getUserMedia === 'function') {
      // getUserMedia supported
      const context = 'webrtc';

      // constructing a getUserMedia config-object and
      // an string (we will try both)

      let container;
      const videoEl = document.createElement('video');

      if (typeof options.el === 'string') {
        container = document.querySelector(options.el);
      } else {
        container = options.el;
      }

      const offsetHeight = parseInt(container.offsetHeight, 10);
      const offsetWidth = parseInt(container.offsetWidth, 10);

      if (options.width < offsetWidth && options.height < offsetHeight) {
        videoEl.height = offsetHeight;
        videoEl.width = offsetWidth;
      } else {
        videoEl.height = options.height;
        videoEl.width = options.width;
      }

      videoEl.autoplay = true;

      const videoChild = container.appendChild(videoEl);

      const successFn = (stream) => {
        const video = videoChild;
        const result = { el: videoChild, context, stream, onMediaError() {} };

        if ((typeof MediaStream !== 'undefined' && MediaStream !== null)
            && stream instanceof MediaStream) {
          if (video.mozSrcObject !== undefined) { // Firefox 18a
            video.mozSrcObject = stream;
          } else { // Firefox 16a, 17a
            video.src = stream;
          }

          video.play();
        } else {
          const vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
        }

        video.onerror = (...args) => {
          stream.stop();
          result.onMediaError(args);
        };

        resolve(result);
      };

      try {
        getUserMedia({
          audio: options.audio,
          video: options.video,
        }, successFn, (err) => reject(err));
      } catch (e) {
        try {
          getUserMedia(toOptionString(options),
            successFn, (err) => reject(err));
        } catch (e2) {
          reject(e2);
        }
      }
    } else {
      if (options.noFallback) {
        reject(new Error('WebRTC not supported.'));
        return;
      }

      // Fallback to flash
      const source = `<!--[if IE]>
      <object id="XwebcamXobjectX" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        width="${options.width}" height="${options.height}">
        <param name="movie" value="${options.swffile}" />
        <![endif]-->
        <!--[if !IE]>-->
        <object id="XwebcamXobjectX" type="application/x-shockwave-flash" data="${options.swffile}"
          width="${options.width}" height="${options.height}">
        <!--<![endif]-->
        <param name="FlashVars" value="mode=${options.mode}&amp;quality=${options.quality}" />
        <param name="allowScriptAccess" value="always" />
      </object>`;

      const container = document.getElementById(options.el);
      container.innerHTML = source;

      const result = {
        context: 'flash',
      };

      (function register(run) {
        const cam = document.getElementById('XwebcamXobjectX');

        if (cam.capture !== undefined) {
          // Simple callback methods are not allowed
          result.capture = (opts) => new Promise((_resolve) => {
            _resolve(cam.capture(opts));
          });

          result.save = (opts) => new Promise((_resolve) => {
            _resolve(cam.save(opts));
          });

          result.setCamera = (opts) => new Promise((_resolve) => {
            _resolve(cam.setCamera(opts));
          });

          result.getCameraList = () => new Promise((_resolve) => {
            _resolve(cam.getCameraList());
          });

          // result.onLoad();
          result.onLoad = () => {
            resolve(result);
          };
        } else if (run === 0) {
          // result.debug("error", "Flash movie not yet registered!");
          reject(new Error('Flash timeout exception.'));
        } else {
          // Flash interface not ready yet
          setTimeout(register, 1000 * (4 - run), run - 1);
        }
      }(3));
    }
  });
}
