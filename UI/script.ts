import SetWindowPosition = PixelPerfectDesktop.SetWindowPosition;
import MinimizeFunc = PixelPerfectDesktop.MinimizeFunc;
import CloseFunc = PixelPerfectDesktop.CloseFunc;
import ISettings = PixelPerfectDesktop.ISettings;
import StoreModuleLike = PixelPerfectDesktop.StoreModuleLike;
import ScrollData = PixelPerfectDesktop.ScrollData;

const {remote} = (<any>window).require('electron');

const setWindowPosition: SetWindowPosition = remote.getGlobal('setWindowPosition');
const minimize: MinimizeFunc = remote.getGlobal('minimize');
const closeWindow: CloseFunc = remote.getGlobal('close');
const storeModule: StoreModuleLike = remote.getGlobal('storeModule');


const imageInput = <any>document.getElementById('imgInput');
const image = <any>document.getElementById('image');
const moveBtn = <any>document.getElementById('moveBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const slider = document.getElementById('slider');
const sliderPicker = document.getElementById('sliderPicker');
const imgContainer = document.getElementById('imgContainer');


let saveTimeoutID: any;
let isSliderActive = false;
let isDown = false;
let mousePosition: { x: number, y: number };
let isChoseImageHidden = false;

initUI();

imageInput.onchange = (event: any) => {
    const imgPath = event.target.files[0].path;
    storeModule.setImagePath(imgPath);
    updateImage(imgPath);
};

// @ts-ignore
minimizeBtn.onclick = () => {
    minimize();
};

// @ts-ignore
closeBtn.onclick = () => {
    closeWindow();
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
document.addEventListener('mousemove', (e: any) => {
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
    // @ts-ignore
    imgContainer.style.overflow = 'hidden';
}

function enableScroll() {
    // @ts-ignore
    imgContainer.style.overflow = '';
}

/////////////////////////////// slider ////////////////////////////////
// @ts-ignore
sliderPicker.onmousedown = (e: MouseEvent) => {
    e.preventDefault();
    isSliderActive = true;
};

document.onmouseup = (e: MouseEvent) => {
    e.preventDefault();
    isSliderActive = false;
};

// @ts-ignore
document.onmouseleave = (e: MouseEvent) => {
    isSliderActive = false;
};

document.onmousemove = function (e: MouseEvent) {
    e.preventDefault();

    if (isSliderActive) {

        // @ts-ignore
        const pickerSize = sliderPicker.getBoundingClientRect().width;
        // @ts-ignore
        const sliderSize = slider.getBoundingClientRect().width;
        // @ts-ignore
        let opacity = (e.clientX - slider.getBoundingClientRect().left) / sliderSize;

        opacity = Math.round(opacity * 1000) / 1000;

        if (opacity > 1) {
            opacity = 1;
        } else if (opacity < 0) {
            opacity = 0;
        }

        updateOpacity(opacity, sliderSize, pickerSize);

        if (saveTimeoutID) {
            clearTimeout(saveTimeoutID);
            saveTimeoutID = null;
        }
        saveTimeoutID = setTimeout(() => {
            storeModule.setOpacity(opacity);
        }, 1000);
    }
};

function updateOpacity(opacity: number, sliderSize: number, pickerSize: number) {
    // @ts-ignore
    sliderPicker.style.left = Math.round(sliderSize * opacity - pickerSize / 2) + 'px';

    image.style.opacity = opacity;
}

/////////////////////////////// slider end ////////////////////////////////

function initUI() {
    const settings: ISettings = storeModule.getSettings();

    // @ts-ignore
    const pickerSize = sliderPicker.getBoundingClientRect().width;
    // @ts-ignore
    const sliderSize = slider.getBoundingClientRect().width;

    updateOpacity(settings.opacity, sliderSize, pickerSize);
    if (settings.imageFilePath) {
        updateImage(settings.imageFilePath);
    }
}

function updateImage(imgPath: string) {
    if (!isChoseImageHidden) {
        // @ts-ignore
        document.getElementById('choseImageText').style.display = 'none';
        isChoseImageHidden = true;
    }

    image.src = imgPath;

    image.onload = function () {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
    }
}


document.onkeydown = (e: KeyboardEvent) => {
    switch (e.code) {
        case 'ArrowUp':
            setWindowPosition(0, -1);
            break;
        case 'ArrowDown':
            setWindowPosition(0, 1);
            break;
        case 'ArrowLeft':
            setWindowPosition(-1, 0);
            break;
        case 'ArrowRight':
            setWindowPosition(1, 0);
            break;
    }
};

function getScrollPosition(): ScrollData {
    // @ts-ignore
    return { top: imgContainer.scrollTop, left: imgContainer.scrollLeft }
}

function setScroll(scrollData: ScrollData) {
    // @ts-ignore
    imgContainer.scrollTop  = scrollData.top;
    // @ts-ignore
    imgContainer.scrollLeft = scrollData.left;
}
