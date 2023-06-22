//開場動畫的部分
let animationWrapper = document.querySelector("section.animation-wrapper");
let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");

const time_line = new TimelineMax();
//parameter1 是要控制的對象
//parametet2 是動畫時間的duration
//parametet3 是控制對象的原始狀態
//parametet4 是控制對象動畫結束後的狀態
//parameter5 是控制對象的動畫進場時間
time_line
  .fromTo(
    hero,
    2,
    { height: "0%" },
    //後者是 gsap 裡面提供的一個功能，等同於設定動畫的加速度函式
    { height: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    hero,
    //上一個兩秒執行完後，再執行這個
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    //把背景色先隱藏起來
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    //這樣設定會和第二個動畫同時開始
    "-=1.2"
  )
  .fromTo(
    animationWrapper,
    0.3,
    { opacity: 1 },
    //將透明度更改為 0 (看不到，但仍存在)
    { opacity: 0 }
  );

//過3.5s後，執行此 css 屬性
//將上層區塊 (透明的) animationWrapper 變成無法接收滑鼠事件
//如此一來，就可以穿透到下層區塊，選取到文字或連結
setTimeout(() => {
  animationWrapper.style.pointerEvents = "none";
}, 3500);

//--------------------------------------------------

//設定 GPA 時，改變顏色 & 改變總平均
let allSelects = document.querySelectorAll("select");
// static Nodelist
allSelects.forEach((select) => {
  // change 代表有人更改選單內容時
  select.addEventListener("change", (e) => {
    //這邊的 e.target 就是 <select>
    changeColor(e.target);
    setGPA();
  });
});

//改變顏色的函式
function changeColor(target) {
  if (target.value == "A" || target.value == "A-") {
    target.style = "background-color: palevioletred";
  } else if (
    target.value == "B+" ||
    target.value == "B" ||
    target.value == "B-"
  ) {
    target.style = "background-color: orange";
  } else if (
    target.value == "C+" ||
    target.value == "C" ||
    target.value == "C-"
  ) {
    target.style = "background-color: green";
  } else if (
    target.value == "D+" ||
    target.value == "D" ||
    target.value == "D-"
  ) {
    target.style = "background-color: lightblue";
  } else if (target.value == "F") {
    target.style = "background-color: gray";
  } else {
    target.style = "background-color: white";
  }
}

//設定 credit 時，改變總平均
let allCredits = document.querySelectorAll(".class-credit");
allCredits.forEach((credit) => {
  credit.addEventListener("change", () => {
    setGPA();
  });
});

//將 GPA 轉換成數字
function convertor(grade) {
  // 用 switch statement 來處理
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

//總平均計算的函式
function setGPA() {
  let formLength = document.querySelectorAll("form").length;
  let credits = document.querySelectorAll(".class-credit");
  let selects = document.querySelectorAll("select");
  let sum = 0; //GPA計算用分子
  let creditSum = 0; //GPA計算用分母

  for (let i = 0; i < credits.length; i++) {
    // valueAsNumber 為 Nodelist 每一項元素的其中一個屬性，會記錄現在的 credit 為多少
    // 當 credit 未填寫時，valueAsNumber 為 NaN
    if (!isNaN(credits[i].valueAsNumber)) {
      creditSum += credits[i].valueAsNumber;
    }
  }

  for (let i = 0; i < formLength; i++) {
    if (!isNaN(credits[i].valueAsNumber * convertor(selects[i].value))) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
  }

  //防止分母為 0 而出現 Infinity 的情況
  //分母有可能為 0，因為可能有 0 學分的課
  let result;
  if (creditSum == 0) {
    // .toFixed() 為 Number 的 method
    // 用來將一個 number 轉成固定小數位數的 string
    result = (0).toFixed(2);
  } else {
    result = (sum / creditSum).toFixed(2);
  }
  // result is string
  document.getElementById("result-gpa").innerText = result;
}

//刪除 form (trash can button)
let allTrash = document.querySelectorAll(".trash-button");
allTrash.forEach((trash) => {
  trash.addEventListener("click", (e) => {
    //縮小 form 的動畫，樣式寫在 CSS 裡面 (讓 form 被刪除時，不會那麼突兀)
    //只寫這樣只會縮小，但其位置還保留著
    e.target.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
  });
});
//刪除的部分寫在這個 function 裡面
//如果直接在上面函式的底下寫 remove()，會導致刪除速度太快而沒有動畫效果
allTrash.forEach((trash) => {
  let form = trash.parentElement.parentElement;
  form.addEventListener("animationend", (e) => {
    //等動畫結束後，再刪除 form & 改變總平均
    e.target.remove();
    setGPA();
  });
});

//當按下 plus button 時，新增一個 form
let plusButton = document.querySelector(".plus-button");
plusButton.addEventListener("click", () => {
  let newForm = document.createElement("form");
  let newDiv = document.createElement("div");
  newDiv.classList.add("grader");

  //製作div標籤裡面的5個小元素
  //input 1
  let newInput1 = document.createElement("input");
  newInput1.setAttribute("list", "opt");
  newInput1.classList.add("class-type");
  newInput1.setAttribute("placeholder", "class category");
  //input 2
  let newInput2 = document.createElement("input");
  newInput2.setAttribute("type", "text");
  newInput2.classList.add("class-number");
  newInput2.setAttribute("placeholder", "class number");
  //input 3
  let newInput3 = document.createElement("input");
  newInput3.setAttribute("type", "number");
  newInput3.classList.add("class-credit");
  newInput3.setAttribute("placeholder", "credits");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  //當新增的 input3 (credit)，有所變更時
  //改變總平均
  newInput3.addEventListener("change", () => {
    setGPA();
  });
  // select 4
  let newSelect = document.createElement("select");
  newSelect.setAttribute("name", "select");
  newSelect.classList.add("select");
  var opt1 = document.createElement("option");
  opt1.setAttribute("value", "");
  //設定內部的文字訊息
  let textNode1 = document.createTextNode("");
  opt1.appendChild(textNode1);
  var opt2 = document.createElement("option");
  opt2.setAttribute("value", "A");
  let textNode2 = document.createTextNode("A");
  opt2.appendChild(textNode2);
  var opt3 = document.createElement("option");
  opt3.setAttribute("value", "A-");
  let textNode3 = document.createTextNode("A-");
  opt3.appendChild(textNode3);
  var opt4 = document.createElement("option");
  opt4.setAttribute("value", "B+");
  let textNode4 = document.createTextNode("B+");
  opt4.appendChild(textNode4);
  var opt5 = document.createElement("option");
  opt5.setAttribute("value", "B");
  let textNode5 = document.createTextNode("B");
  opt5.appendChild(textNode5);
  var opt6 = document.createElement("option");
  opt6.setAttribute("value", "B-");
  let textNode6 = document.createTextNode("B-");
  opt6.appendChild(textNode6);
  var opt7 = document.createElement("option");
  opt7.setAttribute("value", "C+");
  let textNode7 = document.createTextNode("C+");
  opt7.appendChild(textNode7);
  var opt8 = document.createElement("option");
  opt8.setAttribute("value", "C");
  let textNode8 = document.createTextNode("C");
  opt8.appendChild(textNode8);
  var opt9 = document.createElement("option");
  opt9.setAttribute("value", "C-");
  let textNode9 = document.createTextNode("C-");
  opt9.appendChild(textNode9);
  var opt10 = document.createElement("option");
  opt10.setAttribute("value", "D+");
  let textNode10 = document.createTextNode("D+");
  opt10.appendChild(textNode10);
  var opt11 = document.createElement("option");
  opt11.setAttribute("value", "D");
  let textNode11 = document.createTextNode("D");
  opt11.appendChild(textNode11);
  var opt12 = document.createElement("option");
  opt12.setAttribute("value", "D-");
  let textNode12 = document.createTextNode("D-");
  opt12.appendChild(textNode12);
  var opt13 = document.createElement("option");
  opt13.setAttribute("value", "F");
  let textNode13 = document.createTextNode("F");
  opt13.appendChild(textNode13);

  newSelect.appendChild(opt1);
  newSelect.appendChild(opt2);
  newSelect.appendChild(opt3);
  newSelect.appendChild(opt4);
  newSelect.appendChild(opt5);
  newSelect.appendChild(opt6);
  newSelect.appendChild(opt7);
  newSelect.appendChild(opt8);
  newSelect.appendChild(opt9);
  newSelect.appendChild(opt10);
  newSelect.appendChild(opt11);
  newSelect.appendChild(opt12);
  newSelect.appendChild(opt13);

  //當新增的 select 4 (GPA)，有所變更時
  //改變顏色 & 改變總平均
  newSelect.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target);
  });
  //button 5
  let newButton = document.createElement("button");
  newButton.setAttribute("type", "button");
  newButton.classList.add("trash-button");
  let newI = document.createElement("i");
  //這邊 class 有兩個 value 要分開寫
  newI.classList.add("fa-solid");
  newI.classList.add("fa-trash-can");
  newButton.appendChild(newI);
  //處理點擊新的垃圾桶圖示的事件
  newButton.addEventListener("click", (e) => {
    //防止 form 內部的 button 交出表單
    e.preventDefault();
    // newButton.parentElement.parentElement => <form>
    newButton.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
    newButton.parentElement.parentElement.addEventListener(
      "animationend",
      (e) => {
        e.target.remove();
        setGPA();
      }
    );
  });
  //統整 5個小元素，形成一個完整的 new <form>
  newDiv.appendChild(newInput1);
  newDiv.appendChild(newInput2);
  newDiv.appendChild(newInput3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(newButton);
  newForm.appendChild(newDiv);
  document.querySelector(".all-inputs").appendChild(newForm);
  //放大 form 的動畫，樣式寫在 CSS 裡面 (讓 form 加進來時，不會那麼突兀)
  newForm.style.animation = "scaleUp 0.5s ease forwards";
});

let button1 = document.querySelector(".descend-button");
let button2 = document.querySelector(".ascend-button");
//降序，從大到小
button1.addEventListener("click", () => {
  handleSorting("descend");
});
//升序，從小到大
button2.addEventListener("click", () => {
  handleSorting("ascend");
});

function handleSorting(direction) {
  let graders = document.querySelectorAll(".grader");
  let objectArray = [];

  //製作 arrays of objects
  for (let i = 0; i < graders.length; i++) {
    //value 拿回來都是 string
    let class_name = graders[i].children[0].value;
    let class_number = graders[i].children[1].value;
    let class_credit = graders[i].children[2].value;
    let class_grade = graders[i].children[3].value;

    //如果 form 內部一個都沒填，不製作 class object (之後會被刪除)
    //只要 form 內部任一部分有填寫，就製作 class object (刪除後會再排序加回來)
    if (
      !(
        class_name == "" &&
        class_number == "" &&
        class_credit == "" &&
        class_grade == ""
      )
    ) {
      // object unpacking
      let class_object = {
        class_name,
        class_number,
        class_credit,
        class_grade,
      };
      objectArray.push(class_object);
    }
  }

  //取得 object array 後，把 object 裡面的 GPA 成績換成數字
  for (let i = 0; i < objectArray.length; i++) {
    objectArray[i].GPA_Number = convertor(objectArray[i].class_grade);
  }

  //執行合併排序法(預設：由小到大排序)
  objectArray = mergeSort(objectArray);
  //當參數等於 descend 時，加入 reverse()
  //變成由大到小排序
  if (direction == "descend") {
    objectArray = objectArray.reverse();
  }

  //根據 object array 的內容，更新網頁
  let allInputs = document.querySelector(".all-inputs");
  //當至少有一個 form 是有填寫東西的時候
  if (!objectArray.length == 0) {
    //先清空所有的內容
    allInputs.innerHTML = "";
  }

  //把有填寫的 form (排序後的 object) 依序加回來
  for (let i = 0; i < objectArray.length; i++) {
    allInputs.innerHTML += `<form>
      <div class="grader">
        <input
        list="opt"
        class="class-type"
        placeholder="class category"
        value=${objectArray[i].class_name}
        /><!--
    --><input
        type="text"
        class="class-number"
        placeholder="class number"
        value=${objectArray[i].class_number}
        /><!--
        --><input
        type="number"
        class="class-credit"
        placeholder="credits"
        min="0"
        max="6"
        value=${objectArray[i].class_credit}
        /><!--
        --><select name="select" class="select">
        <option value=""></option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D+">D+</option>
        <option value="D">D</option>
        <option value="D-">D-</option>
        <option value="F">F</option></select
        ><!--
        --><button type="button" class="trash-button">
        <!-- 從font-awesome拿來的icon -->
        <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </form>`;
  }

  // select 的部分，無法用上面 value 的形式來更改
  // 因此要另外透過 DOM 的形式來進行更改
  graders = document.querySelectorAll(".grader");
  for (let i = 0; i < graders.length; i++) {
    graders[i].children[3].value = objectArray[i].class_grade;
  }

  //將加回的 all credits 加入事件監聽器
  allCredits = document.querySelectorAll(".class-credit");
  allCredits.forEach((credit) => {
    credit.addEventListener("change", () => {
      //當有任一 credit，有所變更時
      //改變總平均
      setGPA();
    });
  });

  //將加回的 all selects 加入事件監聽器
  allSelects = document.querySelectorAll(".select");
  allSelects.forEach((select) => {
    //加回的每個 select 的顏色要先和之前一樣
    changeColor(select);
    select.addEventListener("change", (e) => {
      //當有任一 select，有所變更時
      //改變顏色 & 改變總平均
      changeColor(e.target);
      setGPA();
    });
  });

  //將加回的 all trash buttons 加入事件監聽器
  let allTrash = document.querySelectorAll(".trash-button");
  allTrash.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.parentElement.parentElement.style.animation =
        "scaleDown 0.5s ease forwards";
      e.target.parentElement.parentElement.addEventListener(
        "animationend",
        (e) => {
          e.target.remove();
          setGPA();
        }
      );
    });
  });
}

//合併排序法(由小到大排序)
//步驟1：將 arr 重覆分成左右兩邊 (使用遞迴)，直到 arr 內部剩下一個元素 or 空元素
function mergeSort(arr) {
  if (arr.length == 0) {
    return;
  }

  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
  }
}

//步驟2：將左右兩側的 array 當中的元素進行排序並合併成一個 array
function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    // 使用 GPA_Number 來比較
    // 如果 a1 比 a2 小，則 a1 放 a2 前面
    if (a1[i].GPA_Number < a2[j].GPA_Number) {
      result.push(a1[i]);
      i++;
    } else {
      result.push(a2[j]);
      j++;
    }
  }
  //當有其中一邊已加完，將另一邊剩餘的元素加入合併的 array 當中
  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }
  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }

  return result;
}
