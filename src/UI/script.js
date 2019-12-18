"use strict";
const managerGlobal = window.require('electron').remote.getGlobal('managerGlobal');
const image = document.getElementById('image');
const imgContainer = document.getElementById('imgContainer');
const sliderPicker = document.getElementById('sliderPicker');
const slider = document.getElementById('slider');
const delayPromise = (sec) => new Promise(resolve => setTimeout(resolve, sec));
let isChoseImageHidden = false;
init();
function init() {
    initDropImage();
    initMouseEvents();
    initKeyboardEvents();
    initMinimizeCloseButtons();
    initOpacitySlider();
    initImageChoseBtn();
    // Must be called the latest
    setMemento();
}
function initImageChoseBtn() {
    const imageInput = document.getElementById('imgInput');
    imageInput.onchange = (event) => {
        const imgPath = event.target.files[0].path;
        updateImage(imgPath);
    };
}
function initOpacitySlider() {
    let isSliderActive = false;
    let saveTimeoutID;
    sliderPicker.onmousedown = (e) => {
        e.preventDefault();
        isSliderActive = true;
    };
    document.onmouseup = (e) => {
        e.preventDefault();
        isSliderActive = false;
    };
    document.onmouseleave = () => {
        isSliderActive = false;
    };
    document.onmousemove = function (e) {
        if (isSliderActive) {
            const sliderSize = slider.getBoundingClientRect().width;
            let opacity = (e.clientX - slider.getBoundingClientRect().left) / sliderSize;
            opacity = Math.round(opacity * 1000) / 1000;
            if (opacity > 1) {
                opacity = 1;
            }
            else if (opacity < 0) {
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
function updateOpacity(opacity) {
    const pickerSize = sliderPicker.getBoundingClientRect().width;
    const sliderSize = slider.getBoundingClientRect().width;
    sliderPicker.style.left = Math.round(sliderSize * opacity - pickerSize / 2) + 'px';
    image.style.opacity = opacity;
}
function updateImage(imgPath, callBack) {
    if (!isChoseImageHidden) {
        document.getElementById('choseImageText').style.display = 'none';
        isChoseImageHidden = true;
    }
    image.src = imgPath;
    image.onload = function () {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
        callBack && callBack();
    };
}
function initMinimizeCloseButtons() {
    const minimizeBtn = document.getElementById('minimizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    minimizeBtn.onclick = () => {
        managerGlobal.minimize();
    };
    closeBtn.onclick = () => {
        managerGlobal.close(getMemento());
    };
}
function initMouseEvents() {
    const moveArea = document.getElementById('toolbar');
    let isDown = false;
    let mousePosition;
    moveArea.addEventListener('mousedown', (evt) => {
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
    document.addEventListener('mousemove', (e) => {
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
    function setUIRestore() {
        moveArea.style.cursor = '-webkit-grabbing';
        imgContainer.style.overflow = 'hidden';
    }
    function setUIMoving() {
        moveArea.style.cursor = '';
        imgContainer.style.overflow = '';
    }
}
function initKeyboardEvents() {
    let draggedKeyCode = '';
    let keyEventTimeStamp;
    let moveIntervalId;
    document.addEventListener('keydown', (e) => {
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
    async function setMoveInterval(x, y, e) {
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
        }, 60);
    }
}
function setMemento() {
    const uiState = managerGlobal.storeModule.getSettings().uiState;
    updateOpacity(uiState.opacity);
    updateImage(uiState.imgPath, () => {
        imgContainer.scrollTop = uiState.scrollData.top;
        imgContainer.scrollLeft = uiState.scrollData.left;
    });
}
function getMemento() {
    return {
        scrollData: {
            top: imgContainer.scrollTop,
            left: imgContainer.scrollLeft,
        },
        imgPath: image.src,
        opacity: image.style.opacity,
    };
}
function initDropImage() {
    const supportedFileTypes = ['jpg', 'jpeg', 'png'];
    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    };
    document.body.ondrop = (ev) => {
        ev.preventDefault();
        if (!ev.dataTransfer || !ev.dataTransfer.files || !ev.dataTransfer.files[0]) {
            return;
        }
        const imgPath = ev.dataTransfer.files[0].path;
        const fileType = imgPath.split('.').reverse()[0];
        console.log(fileType);
        if (supportedFileTypes.includes(fileType)) {
            updateImage(imgPath);
        }
    };
}
//# sourceMappingURL=script.js.map