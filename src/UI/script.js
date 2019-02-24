"use strict";
const { remote } = window.require('electron');
const storeModule = remote.getGlobal('storeModule');
const image = document.getElementById('image');
const imgContainer = document.getElementById('imgContainer');
const sliderPicker = document.getElementById('sliderPicker');
const slider = document.getElementById('slider');
let isChoseImageHidden = false;
init();
function init() {
    initWindowMove();
    initMinimizeCloseButtons();
    initOpacitySlider();
    initImageChoseBtn();
    // Must be called the latest
    initState();
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
        const choseImageText = document.getElementById('choseImageText');
        choseImageText.style.display = 'none';
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
    const minimize = remote.getGlobal('minimize');
    const closeWindow = remote.getGlobal('close');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    minimizeBtn.onclick = () => {
        minimize();
    };
    closeBtn.onclick = () => {
        closeWindow(getMemento());
    };
}
function initState() {
    const uiState = storeModule.getSettings().uiState;
    updateOpacity(uiState.opacity);
    updateImage(uiState.imgPath, () => {
        setScroll(uiState.scrollData);
    });
}
function initWindowMove() {
    const setWindowPosition = remote.getGlobal('setWindowPosition');
    const moveBtn = document.getElementById('moveBtn');
    let isDown = false;
    let mousePosition;
    moveBtn.addEventListener('mousedown', (evt) => {
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
    document.addEventListener('mousemove', (e) => {
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
        imgContainer.style.overflow = 'hidden';
    }
    function enableScroll() {
        imgContainer.style.overflow = '';
    }
    document.addEventListener('keydown', (e) => {
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
function setScroll(scrollData) {
    imgContainer.scrollTop = scrollData.top;
    imgContainer.scrollLeft = scrollData.left;
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
//# sourceMappingURL=script.js.map