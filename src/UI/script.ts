import SetWindowPosition = PixelPerfectDesktop.SetWindowPosition;
import MinimizeFunc = PixelPerfectDesktop.MinimizeFunc;
import CloseFunc = PixelPerfectDesktop.CloseFunc;
import ISettings = PixelPerfectDesktop.ISettings;
import StoreModuleLike = PixelPerfectDesktop.StoreModuleLike;
import ScrollData = PixelPerfectDesktop.ScrollData;

const {remote} = (<any>window).require('electron');

const storeModule: StoreModuleLike = remote.getGlobal('storeModule');

const image = <any>document.getElementById('image');
const imgContainer = document.getElementById('imgContainer')!;


init();

function init() {
    initMainProcessFunctions();
    initWindowMove();
    initWindowState();
    initMinimizeCloseButtons();
    initOpacitySlider();
    initImageChoseBtn();
}

function initImageChoseBtn() {
    const imageInput = document.getElementById('imgInput')!;

    imageInput.onchange = (event: any) => {
        const imgPath = event.target.files[0].path;
        storeModule.setImagePath(imgPath);
        updateImage(imgPath);
    };
}


function initOpacitySlider() {
    const sliderPicker = document.getElementById('sliderPicker')!;
    const slider = document.getElementById('slider')!;

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
            const pickerSize = sliderPicker.getBoundingClientRect().width;
            const sliderSize = slider.getBoundingClientRect().width;

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
}

function updateOpacity(opacity: number, sliderSize: number, pickerSize: number) {
    // @ts-ignore
    sliderPicker.style.left = Math.round(sliderSize * opacity - pickerSize / 2) + 'px';

    image.style.opacity = opacity;
}

function updateImage(imgPath: string) {
    let isChoseImageHidden = false;

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

function initMinimizeCloseButtons() {
    const minimize: MinimizeFunc = remote.getGlobal('minimize');
    const closeWindow: CloseFunc = remote.getGlobal('close');

    const minimizeBtn: HTMLElement = document.getElementById('minimizeBtn')!;
    const closeBtn: HTMLElement = document.getElementById('closeBtn')!;

    minimizeBtn.onclick = () => {
        minimize();
    };

    closeBtn.onclick = () => {
        closeWindow();
    };
}

function initWindowState() {
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

function initWindowMove() {
    const setWindowPosition: SetWindowPosition = remote.getGlobal('setWindowPosition');
    const moveBtn = <any>document.getElementById('moveBtn');

    let isDown = false;
    let mousePosition: { x: number, y: number };

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
}

function initMainProcessFunctions() {
    // @ts-ignore
    window.getScrollPosition = (): ScrollData => {
        // @ts-ignore
        return {top: imgContainer.scrollTop, left: imgContainer.scrollLeft}
    };

    // @ts-ignore
    window.setScroll = (scrollData: ScrollData) => {
        // @ts-ignore
        imgContainer.scrollTop = scrollData.top;
        // @ts-ignore
        imgContainer.scrollLeft = scrollData.left;
    }
}

