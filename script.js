function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('show');
}

function toggleDarkMode() {
  document.querySelector('body').classList.toggle("dark");
}

dragElement(document.querySelector(".horizontal #separator"), "H");  

function dragElement(element, direction) {
    const drag = { x: 0, y: 0 };
    const delta = { x: 0, y: 0 };
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        drag.x = e.clientX;
        drag.y = e.clientY;
        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        };
    }

    function onMouseMove(e) {
        const first = document.getElementById("first");
        const second = document.getElementById("second");
       
        if (direction === "H") {
            const currentX = e.clientX;
            delta.x = currentX - drag.x;

            let firstWidth = first.clientWidth + delta.x;
            let secondWidth = second.clientWidth - delta.x;

            const splitterWidth = document.getElementById("splitter").clientWidth;

            if (firstWidth >= 0 && secondWidth >= 0 && (firstWidth + secondWidth) <= splitterWidth) {
                first.style.width = firstWidth + "px";
                second.style.width = secondWidth + "px";
                element.style.left = firstWidth + "px";
            }

            drag.x = currentX;
        } else if (direction === "V") {
            const currentY = e.clientY;
            delta.y = currentY - drag.y;

            let firstHeight = first.clientHeight + delta.y;
            let secondHeight = second.clientHeight - delta.y;

            const splitterHeight = document.getElementById("splitter").clientHeight;

            if (firstHeight >= 0 && secondHeight >= 0 && (firstHeight + secondHeight) <= splitterHeight) {
                first.style.height = firstHeight + "px";
                second.style.height = secondHeight + "px";
                element.style.top = firstHeight + "px";
            }

            drag.y = currentY;
        }

        setSizeIndicator();
    }
}

document.addEventListener('DOMContentLoaded', function () {
  if(window.innerWidth <= 430){
    setOrientation();
  }
  
  setSizeIndicator();
  window.addEventListener('resize', setSizeIndicator); 


  let textBoxes = document.querySelectorAll(".textbox");
  textBoxes.forEach(textBox => {
    textBox.addEventListener('keydown', (e)=>{
     
      if (e.key == 'Tab') {
        e.preventDefault();
        var start = textBox.selectionStart;
        var end = textBox.selectionEnd;
    
        textBox.value = textBox.value.substring(0, start) +
          "\t" + textBox.value.substring(end);
          
        textBox.selectionEnd = start + 1;
      }
    });
  });
});

function setSizeIndicator() {
  const first = document.querySelector("#first");
  const second = document.querySelector("#second");
  const splitter = document.querySelector(".splitter");
  let sizeIndicator = document.getElementById("sizeIndicator");
  
  if(splitter.classList.contains("horizontal")){
    const firstWidth = first.clientWidth;
    const secondWidth = second.clientWidth;
    sizeIndicator.innerHTML = firstWidth + " x " + secondWidth;
    
  }else if(splitter.classList.contains("vertical")){
    const firstHeight = first.clientHeight;
    const secondHeight= second.clientHeight;
    sizeIndicator.innerHTML = firstHeight + " x " + secondHeight;
    
  }
}

function setOrientation(orientation=""){
  
  var splitter = document.querySelector(".splitter");
  if(splitter.classList.contains("horizontal")){
    splitter.classList.remove("horizontal");
    splitter.classList.add("vertical");
    dragElement(document.querySelector(".vertical #separator"), "V");


  }else if(splitter.classList.contains("vertical")){
    splitter.classList.remove('vertical');
    splitter.classList.add('horizontal');
    dragElement(document.querySelector(".horizontal #separator"), "H");
   
  }
  setSizeIndicator();
  let orientationIcon = document.querySelector(".orientation-icon");
  orientationIcon.classList.toggle('rotate-90');
}


