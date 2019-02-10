import SetWindowPosition = PixelPerfectDesktop.SetWindowPosition;
import MinimizeFunc = PixelPerfectDesktop.MinimizeFunc;
import CloseFunc = PixelPerfectDesktop.CloseFunc;

const {remote} = (<any>window).require('electron');

const setWindowPosition: SetWindowPosition = remote.getGlobal('setWindowPosition');
const minimize: MinimizeFunc = remote.getGlobal('minimize');
const closeWindow: CloseFunc = remote.getGlobal('close');


const imageInput = <any>document.getElementById('imgInput');
const image = <any>document.getElementById('image');
const moveBtn = <any>document.getElementById('moveBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

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
        } else if (mouseX < 0) {
            // @ts-ignore
            sliderPickerLeft = 0;
        }
        // @ts-ignore
        sliderPicker.style.left = sliderPickerLeft + 'px';

        image.style.opacity = (sliderPickerLeft / (sliderSize - pickerOffset * 2)).toFixed(3);

        console.log((sliderPickerLeft / (sliderSize - pickerOffset * 2)).toFixed(3))

    }
};

/////////////////////////////// slider end ////////////////////////////////
