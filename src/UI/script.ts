import UIState = PixelPerfectDesktop.UIState;
import ManagerGlobal = PixelPerfectDesktop.ManagerGlobal;

const managerGlobal: ManagerGlobal = (<any>window).require('electron').remote.getGlobal('managerGlobal');

const image = <any>document.getElementById('image');
const imgContainer = document.getElementById('imgContainer')!;
const sliderPicker = document.getElementById('sliderPicker')!;
const slider = document.getElementById('slider')!;
const widthInput: HTMLInputElement = document.getElementById('width-input')! as HTMLInputElement;
const heightInput: HTMLInputElement = document.getElementById('height-input')! as HTMLInputElement;

const delayPromise = (sec: number) => new Promise(resolve => setTimeout(resolve, sec));

let isChoseImageHidden = false;

init();

function init() {
    initDropImage();
    initMouseEvents();
    initKeyboardEvents();
    initMinimizeCloseButtons();
    initOpacitySlider();
    initImageChoseBtn();
    initImageResize();
    // Must be called the latest
    setMemento();
}

function initImageResize() {
    widthInput.oninput = (e: any) => {
        let newWidth = e.target.value;
        console.log(newWidth);

        const width = image.naturalWidth;
        const height = image.naturalHeight;
        const delta = newWidth / width;
        let newHeight: number = Math.round(height * delta);

        console.log('width', newWidth, 'height', newHeight);

        newWidth = newWidth < 1 ? 1 : newWidth;
        newHeight = newHeight < 1 ? 1 : newHeight;

        image.width = newWidth;
        image.height = newHeight;
        heightInput.value = newHeight.toString();


    }
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


function updateImage(imgPath: string, callBack?: () => void) {
    if (!isChoseImageHidden) {
        document.getElementById('choseImageText')!.style.display = 'none';
        isChoseImageHidden = true;
    }

    image.src = imgPath;

    image.onload = function () {
        const width = image.naturalWidth;
        const height = image.naturalHeight;

        image.width = width;
        image.height = height;

        widthInput.value = width;
        heightInput.value = height;

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
    let keyEventTimeStamp: number;
    let moveIntervalId: NodeJS.Timeout;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (draggedKeyCode) {
            return;
        }

        switch (e.code) {
            case 'ArrowUp':
                setMoveInterval(0, -1, e);
                break;
            case 'ArrowDown':
                setMoveInterval(0, 1, e);
                break;
            case 'ArrowLeft':
                setMoveInterval(-1, 0, e);
                break;
            case 'ArrowRight':
                setMoveInterval(1, 0, e);
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

    async function setMoveInterval(x: number, y: number, e: KeyboardEvent): Promise<void> {
        draggedKeyCode = e.code;
        keyEventTimeStamp = e.timeStamp;

        managerGlobal.setWindowPosition(x, y);

        setTimeout(() => {
            x *= 10;
            y *= 10;
        }, 1000);

        x *= 2;
        y *= 2;

        await delayPromise(300);
        if (!draggedKeyCode || e.timeStamp !== keyEventTimeStamp) {
            return;
        }

        moveIntervalId = setInterval(() => {
            managerGlobal.setWindowPosition(x, y);
        }, 60)
    }
}

function setMemento(): void {
    const uiState: UIState = managerGlobal.storeModule.getSettings().uiState;

    updateOpacity(uiState.opacity);
    updateImage(uiState.imgPath, () => {
        imgContainer.scrollTop = uiState.scrollData.top;
        imgContainer.scrollLeft = uiState.scrollData.left;
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


function initDropImage(): void {

    const supportedFileTypes = ['jpg', 'jpeg', 'png'];

    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    };

    document.body.ondrop = (ev) => {
        ev.preventDefault();
        if (!ev.dataTransfer || !ev.dataTransfer.files || !ev.dataTransfer.files[0]) {
            return;
        }

        const imgPath = ev.dataTransfer!.files[0].path;

        const fileType = imgPath.split('.').reverse()[0];

        console.log(fileType);

        if (supportedFileTypes.includes(fileType)) {
            updateImage(imgPath);
        }
    };

}
