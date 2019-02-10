"use strict";
const { remote } = window.require('electron');
const setWindowPosition = remote.getGlobal('setWindowPosition');
const minimize = remote.getGlobal('minimize');
const closeWindow = remote.getGlobal('close');
const imageInput = document.getElementById('imgInput');
const image = document.getElementById('image');
const moveBtn = document.getElementById('moveBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
let isDown = false;
let mousePosition;
let isChoseImageHiden = false;
imageInput.onchange = (event) => {
    if (!isChoseImageHiden) {
        // @ts-ignore
        document.getElementById('choseImage').style.display = 'none';
    }
    const files = event.target.files;
    image.src = files[0].path;
    image.onload = function () {
        image.width = image.naturalWidth;
        image.height = image.naturalHeight;
    };
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
    document.body.style.overflow = 'hidden';
}
function enableScroll() {
    document.body.style.overflow = '';
}
/////////////////////////////// slider ////////////////////////////////
const slider = document.getElementById('slider');
const sliderPicker = document.getElementById('sliderPicker');
let isSliderActive = false;
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
    console.log('mousemove');
    if (isSliderActive) {
        // @ts-ignore
        const pickerOffset = sliderPicker.getBoundingClientRect().width / 2;
        // @ts-ignore
        const mouseX = e.clientX - slider.getBoundingClientRect().left - pickerOffset;
        // @ts-ignore
        const sliderSize = slider.getBoundingClientRect().width;
        let sliderPickerLeft = mouseX;
        if (mouseX > sliderSize - pickerOffset * 2) {
            // @ts-ignore
            sliderPickerLeft = sliderSize - pickerOffset * 2;
        }
        else if (mouseX < 0) {
            // @ts-ignore
            sliderPickerLeft = 0;
        }
        // @ts-ignore
        sliderPicker.style.left = sliderPickerLeft + 'px';
        image.style.opacity = (sliderPickerLeft / (sliderSize - pickerOffset * 2)).toFixed(3);
        console.log((sliderPickerLeft / (sliderSize - pickerOffset * 2)).toFixed(3));
    }
};
/////////////////////////////// slider end ////////////////////////////////
