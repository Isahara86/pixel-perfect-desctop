import SetWindowPosition = PixelPerfectDesktop.SetWindowPosition;
import MinimizeFunc = PixelPerfectDesktop.MinimizeFunc;
import CloseFunc = PixelPerfectDesktop.CloseFunc;
import StoreModuleLike = PixelPerfectDesktop.StoreModuleLike;
import ScrollData = PixelPerfectDesktop.ScrollData;
import UIState = PixelPerfectDesktop.UIState;

const {remote} = (<any>window).require('electron');

const storeModule: StoreModuleLike = remote.getGlobal('storeModule');

const image = <any>document.getElementById('image');
const imgContainer = document.getElementById('imgContainer')!;
const sliderPicker = document.getElementById('sliderPicker')!;
const slider = document.getElementById('slider')!;
const imageInput = <HTMLInputElement>document.getElementById('imgInput')!;

let isChoseImageHidden = false;

init();

function init() {
    initWindowMove();
    initMinimizeCloseButtons();
    initOpacitySlider();
    initImageChoseBtn();
    // Must be called the latest
    setMemento();
}

function initImageChoseBtn() {
    imageInput.onchange = (event: any) => {
        const imgPath = event.target.files[0].path;
        updateImage(imgPath);
    };
}


function initOpacitySlider() {

    let isSliderActive = false;
    let saveTimeoutID: any;

    sliderPicker.onmousedown = (e: MouseEvent) => {
        e.preventDefault();
        isSliderActive = true;
    };

    document.onmouseup = (e: MouseEvent) => {
        e.preventDefault();
        isSliderActive = false;
    };

    document.onmouseleave = () => {
        isSliderActive = false;
    };

    document.onmousemove = function (e: MouseEvent) {
        if (isSliderActive) {
            const sliderSize = slider.getBoundingClientRect().width;

            let opacity = (e.clientX - slider.getBoundingClientRect().left) / sliderSize;

            opacity = Math.round(opacity * 1000) / 1000;

            if (opacity > 1) {
                opacity = 1;
            } else if (opacity < 0) {
                opacity = 0;
            }

            updateOpacity(opacity);

            if (saveTimeoutID) {
                clearTimeout(saveTimeoutID);
                saveTimeoutID = null;
            }
            saveTimeoutID = setTimeout(() => {
            }, 1000);
        }
    };
}

function updateOpacity(opacity: number) {
    const pickerSize = sliderPicker.getBoundingClientRect().width;
    const sliderSize = slider.getBoundingClientRect().width;

    sliderPicker.style.left = Math.round(sliderSize * opacity - pickerSize / 2) + 'px';
    image.style.opacity = opacity;
}


function updateImage(imgPath: string, callBack?: any) {
    if (!isChoseImageHidden) {
        document.getElementById('choseImageText')!.style.display = 'none';
        isChoseImageHidden = true;
    }

    image.src = imgPath;

    image.onload = function () {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;

        callBack && callBack();
    }
}

function initMinimizeCloseButtons() {
    const minimize: MinimizeFunc = remote.getGlobal('minimize');
    const closeWindow: CloseFunc = remote.getGlobal('close');

    const minimizeBtn: HTMLElement = document.getElementById('minimizeBtn')!;
    const closeBtn: HTMLElement = document.getElementById('closeBtn')!;

    minimizeBtn.onclick = () => {
        minimize();
    };

    closeBtn.onclick = () => {
        closeWindow(getMemento());
    };
}

function initWindowMove() {
    const setWindowPosition: SetWindowPosition = remote.getGlobal('setWindowPosition');
    const moveBtn = <any>document.getElementById('moveBtn');

    let isDown = false;
    let mousePosition: { x: number, y: number };

    moveBtn.addEventListener('mousedown', (evt: any) => {
        isDown = true;
        setUIRestore();
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
        setUIMoving();
    }, true);

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

    function setUIRestore() {
        moveBtn.style.cursor = '-webkit-grabbing';
        imgContainer.style.overflow = 'hidden';
    }

    function setUIMoving() {
        moveBtn.style.cursor = '';
        imgContainer.style.overflow = '';
    }

    document.addEventListener('keydown', (e: KeyboardEvent) => {
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
    });

    // prevent arrow scrolling
    window.addEventListener("keydown", function(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                e.preventDefault();
                break;
        }
    }, false);
}

function setScroll(scrollData: ScrollData): void {
    imgContainer.scrollTop = scrollData.top;
    imgContainer.scrollLeft = scrollData.left;
}

function setMemento() {
    const uiState: UIState = storeModule.getSettings().uiState;

    updateOpacity(uiState.opacity);
    updateImage(uiState.imgPath, () => {
        setScroll(uiState.scrollData);
    });
}

function getMemento(): UIState {
    return {
        scrollData: {
            top: imgContainer.scrollTop,
            left: imgContainer.scrollLeft,
        },
        imgPath: image.src,
        opacity: image.style.opacity,
    }
}
