let editor;

document.querySelector("#formatBtn").addEventListener("click", function () {

    try {
        let jsonString = document.querySelector("#jsonStringInput").value;
        let jsonObj = JSON.parse(jsonString);
        document.querySelector(".saveButton").classList.remove('disabled');
        document.querySelector(".editorArea").innerHTML = "";

        let jsonEditor = new JsonEditor();
        let editorArea = document.querySelector(".editorArea");
        let data = jsonObj;
        jsonEditor.vsCodeEditor(editorArea, data);

    } catch (err) {
        document.querySelector(".saveButton").classList.add('disabled');
        document.querySelector(".editorArea").innerHTML = '<div class="error_display w-100 h-100 d-flex flex-column align-items-center justify-content-center">'
            + '<div class="icon-box error_icon"><i class="bi bi-exclamation-octagon"></i></div>'
            + '<div class="message" id="messageOfPassenger">Invalid Input</div>'
            + '</div>';
    }
});
class JsonEditor {

    constructor() {

    }


    vsCodeEditor(element, data, theme = "vs-light") {
        theme = document.querySelector('body').classList.contains("dark") ? "custom-dark" : "vs-light";

        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            monaco.editor.defineTheme('custom-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#212529',
                }
            });

            editor = monaco.editor.create(element, {
                value: JSON.stringify(data, null, 4),
                language: 'json',
                theme: theme,
                readOnly: true,
                stickyScroll: {
                    enabled: false 
                }
            });

            window.addEventListener('resize', function () {

                editor.layout();

                const splitter = document.getElementById("splitter");
                const first = document.getElementById("first");
                const second = document.getElementById("second");
            
                const splitterWidth = splitter.clientWidth;
                let firstWidth = first.clientWidth;
                let secondWidth = second.clientWidth;
            
                if (splitterWidth > (firstWidth + secondWidth)) {
                    const extraSpace = splitterWidth - (firstWidth + secondWidth);
                    firstWidth += extraSpace / 2;
                    secondWidth += extraSpace / 2;
                }
            
                first.style.width = firstWidth + "px";
                second.style.width = secondWidth + "px";

            });

            let observableDiv = document.querySelector("body");
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const newClassList = observableDiv.classList;
                        if (newClassList.contains('dark')) {
                            monaco.editor.setTheme('custom-dark');
                        } else {
                            monaco.editor.setTheme('vs-light');
                        }
                    }
                });
            });

            observer.observe(observableDiv, { attributes: true });

            var resizeObserver = new ResizeObserver(function (entries) {
                for (let entry of entries) {
                    editor.layout();
                }
            });

            resizeObserver.observe(document.getElementById("second"));
        });
    }


}

function observeClassListChanges(element, callback) {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'class') {
                callback(mutation.target.classList);
            }
        }
    });

    observer.observe(element, { attributes: true });
}

function downloadFormattedJson(){

    if(document.querySelector(".saveButton").classList.contains('disabled')){
        return;
    }

    let content = editor.getValue();

    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.download = 'formatted-json.json';
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
