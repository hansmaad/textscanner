import { query, html, on } from '../common/index.js';

export function home(ctx) {
    ctx.container.innerHTML = '<h1>Cam</h1>';

    const destroy = [cam(ctx.container)];

    return (ctx) => {
        destroy.forEach(d => d());
    }
}


const cam = (container) => {
    const player = html(`<video autoplay></video>`);
    const off = [];

    const activateCam = (id) => {
        const videoConstraints = { deviceId: id ? { exact: id }: undefined };
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: videoConstraints
        }).then(stream => {
            player.srcObject = stream;
        });
    };

    const selectBtn = (camera, index) => {
        const btn = html(`<button class="btn">${camera.label || 'Camera ' + index}</button>`)
        const destroy = on(btn, 'click', () => {
            activateCam(camera);
        });
        off.push(destroy);
        return btn;
    }

    const showSelect = (cameras) => {
        const selectContainer = html(`<div class="app-cam-btns"></div>`);
        cameras.forEach((c, index) => {
            selectContainer.appendChild(selectBtn(c, index));
        })
        container.appendChild(selectContainer);
    }

    container.appendChild(player);

    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
        const cameras = mediaDevices.filter(dev => dev.kind === 'videoinput');
        if (cameras.length === 3) {
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