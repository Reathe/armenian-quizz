function innerHTML_for_SVG(svgURL) {
    let class_name = "handwritten-img";
    // if dark mode is on
    if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
        class_name += " dark";
    }
    return `<img src="${svgURL}" class="${class_name}" alt="Handwritten"/>`;
}

function innerHTML_for_audio(audioURL) {
    return `<audio controls src="${audioURL}" class="object-fit-sm-contain audio"/>`;
}

function addToElement(content, element) {
    if (content.endsWith(".mp3")) {
        element.innerHTML = innerHTML_for_audio(content);
    } else if (content.endsWith(".svg")) {
        element.innerHTML = innerHTML_for_SVG(content);
    } else {
        element.textContent = content;
    }
}

async function fetchAlphabet() {
    return await (await fetch("/get_alphabet")).json();
}
