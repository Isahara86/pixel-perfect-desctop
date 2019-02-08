import SetWindowPosition = PixelPerfectDesktop.SetWindowPosition;

const {remote} = (<any>window).require('electron');

const setWindowPosition: SetWindowPosition = remote.getGlobal('setWindowPosition');


const imageInput = <any>document.getElementById('imgInput');
const image = <any>document.getElementById('image');
const moveBtn = <any>document.getElementById('moveBtn');

let isDown = false;
let mousePosition: { x: number, y: number };

let isChoseImageHiden = false;

imageInput.onchange = (event: any) => {
    if (!isChoseImageHiden) {
        // @ts-ignore
        document.getElementById('choseImage').style.display = 'none';
    }

    const files = event.target.files;

    image.src = files[0].path;

    image.onload = function () {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
    }
};

moveBtn.addEventListener('mousedown', (evt: any) => {
    isDown = true;
    disableScroll();
    mousePosition = {
        x: evt.clientX,
        y: evt.clientY
    };
}, true);

moveBtn.ondragstart = function () {
    return false;
};

document.addEventListener('mouseup', () => {
    isDown = false;
    enableScroll();
}, true);

// @ts-ignore
document.addEventListener( 'mousemove' , (e: any) => {
    e.preventDefault();
    if (!isDown) {
        return;
    }

    let newMousePosition = {
        x: e.clientX,
        y: e.clientY

    };

    setWindowPosition(newMousePosition.x - mousePosition.x, newMousePosition.y - mousePosition.y);
});

function disableScroll() {
    document.body.style.overflow = 'hidden';
}

function enableScroll () {
    document.body.style.overflow = '';
}

