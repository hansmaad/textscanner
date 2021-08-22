import { query, html, on } from '../common/index.js';

export function home(ctx) {
    ctx.container.innerHTML = '';
    const destroy = [cam(ctx.container)];
    return (ctx) => {
        destroy.forEach(d => d());
    }
}


const cam = (container) => {
    const camContainer = html(`<div class="app-cam"></div>`);
    container.appendChild(camContainer);
    const player = html(`<video autoplay></video>`);
    const off = [];
    let currentStream;

    const stopCam = () => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => {
                track.stop();
            });
            currentStream = null;
        }
    }
    const activateCam = (id) => {
        stopCam();
        const videoConstraints = { deviceId: id ? { exact: id }: undefined };
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: videoConstraints
        }).then(stream => {
            currentStream = stream;
            player.srcObject = stream;
        });
    };

    const selectBtn = (camera, index) => {
        const btn = html(`<button class="btn">${camera.label || 'Camera ' + index}</button>`)
        const destroy = on(btn, 'click', () => {
            activateCam(camera.deviceId);
        });
        off.push(destroy);
        return btn;
    }

    const showSelect = (cameras) => {
        const selectContainer = html(`<div class="app-cam-btns"></div>`);
        cameras.forEach((c, index) => {
            selectContainer.appendChild(selectBtn(c, index));
        })
        camContainer.appendChild(selectContainer);
    }

    camContainer.innerHTML = 'Loading...';
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
        camContainer.replaceChildren(player);

        const cameras = mediaDevices.filter(dev => dev.kind === 'videoinput');
        if (cameras.length < 0) {
            activateCam();
        }
        else {
            showSelect(cameras);
        }
    });

    return () => {
        off.forEach(o => o());
    };
}