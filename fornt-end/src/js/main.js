const inputElm = document.querySelector("#flexSwitchCheckDefault");
const element = document.body;

inputElm.addEventListener("change", () => {
    if (inputElm.checked) {
        element.dataset.bsTheme = "dark";
    } else {
        element.dataset.bsTheme = "light";
    }
})