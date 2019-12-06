import ScrollData = PixelPerfectDesktop.ScrollData;
import UIState = PixelPerfectDesktop.UIState;
import ManagerGlobal = PixelPerfectDesktop.ManagerGlobal;

const managerGlobal: ManagerGlobal = (<any>window).require('electron').remote.getGlobal('managerGlobal');

const image = <any>document.getElementById('image');
const imgContainer = document.getElementById('imgContainer')!;
const sliderPicker = document.getElementById('sliderPicker')!;
const slider = document.getElementById('slider')!;

const delayPromise = (sec: number) => new Promise(resolve => setTimeout(resolve, sec));

let isChoseImageHidden = false;

init();

function init() {
    initMouseEvents();
    initKeyboardEvents();
    initMinimizeCloseButtons();
    initOpacitySlider();
    initImageChoseBtn();
    // Must be called the latest
    setMemento();
}

function initImageChoseBtn() {
    const imageInput = <HTMLInputElement>document.getElementById('imgInput')!;

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
    const minimizeBtn: HTMLElement = document.getElementById('minimizeBtn')!;
    const closeBtn: HTMLElement = document.getElementById('closeBtn')!;

    minimizeBtn.onclick = () => {
        managerGlobal.minimize();
    };

    closeBtn.onclick = () => {
        managerGlobal.close(getMemento());
    };
}

function initMouseEvents(): void {
    const moveArea = <any>document.getElementById('toolbar');

    let isDown = false;
    let mousePosition: { x: number, y: number };

    moveArea.addEventListener('mousedown', (evt: any) => {
        if (evt.target !== moveArea) {
            return;
        }

        isDown = true;
        setUIRestore();
        mousePosition = {
            x: evt.clientX,
            y: evt.clientY
        };
    }, true);

    moveArea.ondragstart = function () {
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

        managerGlobal.setWindowPosition(newMousePosition.x - mousePosition.x, newMousePosition.y - mousePosition.y);
    });

    function setUIRestore(): void {
        moveArea.style.cursor = '-webkit-grabbing';
        imgContainer.style.overflow = 'hidden';
    }

    function setUIMoving(): void {
        moveArea.style.cursor = '';
        imgContainer.style.overflow = '';
    }


}

function initKeyboardEvents(): void {

    let draggedKeyCode = '';
    let moveIntervalId: NodeJS.Timeout;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (draggedKeyCode) {
            return;
        }

        switch (e.code) {
            case 'ArrowUp':
                setMoveInterval(0, -1, e.code);
                break;
            case 'ArrowDown':
                setMoveInterval(0, 1, e.code);
                break;
            case 'ArrowLeft':
                setMoveInterval(-1, 0, e.code);
                break;
            case 'ArrowRight':
                setMoveInterval(1, 0, e.code);
                break;
        }
    });

    // prevent arrow scrolling
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                e.preventDefault();
                break;
        }
    }, false);

    document.addEventListener('keyup', (e) => {
        if (e.code === draggedKeyCode) {
            draggedKeyCode = '';
            clearInterval(moveIntervalId);
        }
    }, true);

    async function setMoveInterval(x: number, y: number, keycode: string): Promise<void> {
        draggedKeyCode = keycode;

        managerGlobal.setWindowPosition(x, y);

        setTimeout(() => {
            x *= 10;
            y *= 10;
        }, 1000);

        x *= 2;
        y *= 2;

        await delayPromise(300);

        if (!draggedKeyCode) {
            return;
        }

        moveIntervalId = setInterval(() => {
            managerGlobal.setWindowPosition(x, y);
        }, 60)
    }
}


function setScroll(scrollData: ScrollData): void {
    imgContainer.scrollTop = scrollData.top;
    imgContainer.scrollLeft = scrollData.left;
}

function setMemento() {
    const uiState: UIState = managerGlobal.storeModule.getSettings().uiState;

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
