"use strict";
const { remote } = window.require('electron');
const setWindowPosition = remote.getGlobal('setWindowPosition');
const minimize = remote.getGlobal('minimize');
const closeWindow = remote.getGlobal('close');
const settingsModule = remote.getGlobal('settingsModule');
const imageInput = document.getElementById('imgInput');
const image = document.getElementById('image');
const moveBtn = document.getElementById('moveBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const slider = document.getElementById('slider');
const sliderPicker = document.getElementById('sliderPicker');
const imgContainer = document.getElementById('imgContainer');
let saveTimeoutID;
let isSliderActive = false;
let isDown = false;
let mousePosition;
let isChoseImageHidden = false;
initUI();
imageInput.onchange = (event) => {
    const imgPath = event.target.files[0].path;
    settingsModule.setImagePath(imgPath);
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
// @ts-ignore
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
    // @ts-ignore
    imgContainer.style.overflow = 'hidden';
}
function enableScroll() {
    // @ts-ignore
    imgContainer.style.overflow = '';
}
/////////////////////////////// slider ////////////////////////////////
// @ts-ignore
sliderPicker.onmousedown = (e) => {
    e.preventDefault();
    isSliderActive = true;
};
document.onmouseup = (e) => {
    e.preventDefault();
    isSliderActive = false;
};
// @ts-ignore
document.onmouseleave = (e) => {
    isSliderActive = false;
};
document.onmousemove = function (e) {
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
        }
        else if (opacity < 0) {
            opacity = 0;
        }
        updateOpacity(opacity, sliderSize, pickerSize);
        if (saveTimeoutID) {
            clearTimeout(saveTimeoutID);
            saveTimeoutID = null;
        }
        saveTimeoutID = setTimeout(() => {
            settingsModule.setOpacity(opacity);
        }, 1000);
    }
};
function updateOpacity(opacity, sliderSize, pickerSize) {
    // @ts-ignore
    sliderPicker.style.left = Math.round(sliderSize * opacity - pickerSize / 2) + 'px';
    image.style.opacity = opacity;
}
/////////////////////////////// slider end ////////////////////////////////
function initUI() {
    const settings = settingsModule.getSettings();
    // @ts-ignore
    const pickerSize = sliderPicker.getBoundingClientRect().width;
    // @ts-ignore
    const sliderSize = slider.getBoundingClientRect().width;
    updateOpacity(settings.opacity, sliderSize, pickerSize);
    if (settings.imageFilePath) {
        updateImage(settings.imageFilePath);
    }
}
function updateImage(imgPath) {
    if (!isChoseImageHidden) {
        // @ts-ignore
        document.getElementById('choseImageText').style.display = 'none';
        isChoseImageHidden = true;
    }
    image.src = imgPath;
    image.onload = function () {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
    };
}
