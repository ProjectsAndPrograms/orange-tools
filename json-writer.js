
let editor;

document.addEventListener('DOMContentLoaded', function(){
    let element = document.querySelector(".editorArea");
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
            value: "{}",
            language: 'json',
            theme: theme,
            readOnly: false,
            stickyScroll: {
                enabled: false 
            }
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

        resizeObserver.observe(document.querySelector(".editorArea"));


        editor.onKeyUp(setLineColIndicator);
        editor.onKeyDown(setLineColIndicator);

        function setLineColIndicator(){
            const position = editor.getPosition(); 
            const line = position.lineNumber; 
            const column = position.column;

            document.getElementById("row_call_indicator").innerText = "Ln " + line + ", Col " + column;
        }
    });
});


function downloadFormattedJson(){

    if(document.querySelector(".saveButton").classList.contains('disabled')){
        return;
    }

    let content = editor.getValue();

    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.download = 'created-json.json';
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.querySelector('#formatBtn').addEventListener("click", function(){
    editor.getAction('editor.action.formatDocument').run();

    let content =  editor.getValue();
    var toastObject = new bootstrap.Toast(document.getElementById("liveToast"));
    var liveToast = document.getElementById("liveToast");

    try{
        if(content.trim() != ""){
            JSON.parse(content);
        }
    }catch(error){
        liveToast.style.backgroundColor = "#FECDD3";
        liveToast.style.color = 'red';
        document.getElementById('toast-alert-message').innerHTML = "File contain errors, unable to format!";
        toastObject.show(1);
    }

});