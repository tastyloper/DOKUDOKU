/**
 * <스도쿠 문제 생성 방식>
 * 출처 : http://coderush-textcube.blogspot.com/2009/10/%EC%8A%A4%EB%8F%84%EC%BF%A0-%EB%A1%9C%EC%A7%81.html
 * 1. 배치
 *  1 2 3    1 2 3    1 2 3
 *  4 5 6    4 5 6    4 5 6
 *  7 8 9    7 8 9    7 8 9
 * 
 *  1 2 3    1 2 3    1 2 3
 *  4 5 6    4 5 6    4 5 6
 *  7 8 9    7 8 9    7 8 9
 * 
 *  1 2 3    1 2 3    1 2 3
 *  4 5 6    4 5 6    4 5 6
 *  7 8 9    7 8 9    7 8 9
 * 
 * 2. 행에 룰을 만족하기 위해 첫 묶음 1행을 마지막으로 시프트, 마지막 묶음 3행을 처음으로 시프트
 *  4 5 6    1 2 3   <7 8 9>
 *  7 8 9    4 5 6    1 2 3
 * <1 2 3>   7 8 9    4 5 6
 * 
 *  4 5 6    1 2 3   <7 8 9>
 *  7 8 9    4 5 6    1 2 3
 * <1 2 3>   7 8 9    4 5 6
 * 
 *  4 5 6    1 2 3   <7 8 9>
 *  7 8 9    4 5 6    1 2 3
 * <1 2 3>   7 8 9    4 5 6
 * 
 * 3. 열에 룰을 만족하기 위해 3번째 묶음 마지막열을 첫번째 묶음 1열로 시프트, 7번째 묶음 1열을 마지막 묶음 마지막 열로 시프트
 * <9>4 5    6 1 2    3 7 8
 * <3>7 8    9 4 5    6 1 2
 * <6>1 2    3 7 8    9 4 5
 * 
 *  4 5 6    1 2 3    7 8 9
 *  7 8 9    4 5 6    1 2 3
 *  1 2 3    7 8 9    4 5 6
 * 
 *  5 6 1    2 3 7    8 9<4>
 *  8 9 4    5 6 1    2 3<7>
 *  2 3 7    8 9 4    5 6<1>
 * 
 * 4. 아래 <> 묶음처럼 합이 같은 행 끼리 변경이 가능하므로 그 묶음끼리 행을 랜덤으로 배치 가능
 * (3! x 3! x 3!) x (3! x 3! x 3!) x (3! x 3! x 3!) = 216 x 216 x 216 = 10,077,696‬
 * <9>4 5   <6>1 2   <3>7 8
 * <3>7 8   <9>4 5   <6>1 2
 * <6>1 2   <3>7 8   <9>4 5
 * 
 *  4 5 6    1 2 3    7 8 9
 *  7 8 9    4 5 6    1 2 3
 *  1 2 3    7 8 9    4 5 6
 * 
 *  5 6 1    2 3 7    8 9 4
 *  8 9 4    5 6 1    2 3 7
 *  2 3 7    8 9 4    5 6 1
 */

const $tbody = document.querySelector('.doku-body');

// 1. 기본 스도쿠 배열
const defaultSudoku = [
  [9, 4, 5, 6, 1, 2, 3, 7, 8],
  [3, 7, 8, 9, 4, 5, 6, 1, 2],
  [6, 1, 2, 3, 7, 8, 9, 4, 5],
  [4, 5, 6, 1, 2, 3, 7, 8, 9],
  [7, 8, 9, 4, 5, 6, 1, 2, 3],
  [1, 2, 3, 7, 8, 9, 4, 5, 6],
  [5, 6, 1, 2, 3, 7, 8, 9, 4],
  [8, 9, 4, 5, 6, 1, 2, 3, 7],
  [2, 3, 7, 8, 9, 4, 5, 6, 1]
];
console.log('기본 스도쿠 배열');
console.log(defaultSudoku);
const copyDefault = defaultSudoku.map(n => n.map(v => v)); // 랜덤으로 문제를 생성하기 위한 복사 배열

// 2. 기본 스도쿠 배열을 가지고 랜덤하게 배열을 바꿈(문제 랜덤 생성)
/**
 * 묶음들을 랜덤으로 돌리기 위한 랜덤수
 */
function bundle() {
  const defaultNumArr = [0, 1, 2]; // 3개행을 랜덤으로 배치하기 위한 인덱스 배열
  const randomNumArr = []; // 3개에 숫자를 랜덤으로 담을 배열
  const copyArr = defaultNumArr.slice(); // 카운트로 쓰기 위한 복사 배열
  defaultNumArr.forEach(() => { // 인덱스 배열을 하나씩 돌면서
    const numberIndex = Math.floor((Math.random() * copyArr.length)); // 0부터 복사 배열에 개수중에 랜덤 인덱스를 생성 
    const getNumber = copyArr[numberIndex]; // 랜덤 인덱스에 해당되는 값을 가져와서
    randomNumArr.push(getNumber); // 결과 배열에 담음
    copyArr.splice(numberIndex, 1); // 중복을 피하기 위해 복사 배열에 있는 값중에 랜덤으로 쓴값을 지움
  });
  return randomNumArr; // 예) [1, 0, 2]
}
/**
 * 기본 스도쿠 배열을 랜덤으로 배열해서 소도쿠 문제를 생성해주는 로직
 * @param {array} arr - 2차원 배열
 */
function random(arr) {
  const newArr = arr.map(n => n.map(v => v));
  for (let i = 0; i < 9; i += 3) { // 기준이 되는 행 0, 3, 6
    for (let j = 0; j < 3; j++) { // 기준이 되는 열 0, 1, 2
      const order = [ // 바꾸어야 할 한 묶음 예) i=0, j=0일 때 위에 설명 4번과 동일
        newArr[i][j], newArr[i][j + 3], newArr[i][j + 6],
        newArr[i + 1][j], newArr[i + 1][j + 3], newArr[i + 1][j + 6],
        newArr[i + 2][j], newArr[i + 2][j + 3], newArr[i + 2][j + 6]
      ];
      const randomNum = bundle(); // 예) [1, 0, 2] -> 3개의 행을 랜덤으로 놓기 위한 인덱스 배열
      const cArr1 = [ // 묶음에 1번째 행을 랜덤 인덱스 배열 기준으로 랜덤하게 변경
        order[randomNum[0]],
        order[randomNum[1]],
        order[randomNum[2]]
      ];
      const cArr2 = [ // 묶음에 2번째 행을 랜덤 인덱스 배열 기준으로 랜덤하게 변경
        order[randomNum[0] + 3],
        order[randomNum[1] + 3],
        order[randomNum[2] + 3]
      ];
      const cArr3 = [ // 묶음에 3번째 행을 랜덤 인덱스 배열 기준으로 랜덤하게 변경
        order[randomNum[0] + 6],
        order[randomNum[1] + 6],
        order[randomNum[2] + 6]
      ];
      // 랜덤하게 변경한 값들을 기존 값과 바꾸어 적용
      [newArr[i][j], newArr[i][j + 3], newArr[i][j + 6]] = cArr1;
      [newArr[i + 1][j], newArr[i + 1][j + 3], newArr[i + 1][j + 6]] = cArr2;
      [newArr[i + 2][j], newArr[i + 2][j + 3], newArr[i + 2][j + 6]] = cArr3;
    }
  }

  return newArr;
}

// 3. 랜덤하게 바뀐 배열중에 문제를 만들기 위해 랜덤하게 값 숨김
/**
 * 랜덤하게 값을 숨기기 위해 랜덤으로 0을 부여하는 로직
 * @param {array} arr - 2차원 배열
 * @param {number} difficulty - 값을 숨길 숫자(난이도 : 쉬움 - 40개, 보통 - 50개, 어려움 - 60개)
 */
function randomHide(arr, difficulty) {
  let idx = 0;
  while (idx < difficulty) {
    const x = Math.floor(Math.random() * 9);
    const y = Math.floor(Math.random() * 9);
    if (arr[x][y] !== 0) {
      arr[x][y] = 0;
      idx++;
    }
  }

  return arr;
}

// 4. html 뿌려줌
/**
 * @param {array} arr -2차원 배열
 */
function htmlRendering(tbody, arr) {
  let html = '';
  let areaNum = 0;
  arr.forEach((tr, trIdx) => {
    html += '<tr class="doku-row">';
    if (trIdx >= 0 && trIdx < 3) areaNum = 0;
    if (trIdx > 2 && trIdx < 6) areaNum = 3;
    if (trIdx > 5 && trIdx < 9) areaNum = 6;
    tr.forEach((td, tdIdx) => {
      if (tdIdx === 3 || tdIdx === 6) areaNum += 1;
      console.log(areaNum);
      html += `<td data-tr="${trIdx}" data-td="${tdIdx}" data-area="${areaNum}" class="${(td === 0) ? 'doku-value' : ''}">${(td === 0) ? '' : td}</td>`;
    });
    html += '</tr>';
  });

  tbody.innerHTML = html;
}

/**
 * 스도쿠 문제를 만드는 로직
 * @param {object} tbody - tbody 요소
 * @param {number} difficulty - 난이도 : 쉬움 - 40개, 보통 - 50개, 어려움 - 60개
 */
function makePuzzle(arr, tbody, difficulty = 43) {
  const answer = random(arr); // 현재 스도쿠 문제 정답
  console.log('현재 스도쿠 문제 정답 배열');
  console.log(answer);

  const answerCopy = answer.map(n => n.map(v => v)); // 정답 배열로 문제를 만들기 위한 복사 배열
  const puzzle = randomHide(answerCopy, difficulty);
  console.log('현재 스도쿠 문제 배열');
  console.log(puzzle);

  htmlRendering(tbody, puzzle);

  return answer;
}


/**
 * 모든 td에 클래스를 삭제하는 로직
 * @param {object} tds - 모든 td
 */
function otherSelectCancel(tds) {
  tds.forEach((td) => {
    td.classList.remove('doku-select');
    td.classList.remove('same-nums');
    td.classList.remove('relation-cell');
  });
}

/**
 * 같은 값을 표시, 같은 열,행을 표시
 * @param {object} tds - 모든 td
 * @param {object} thisTd - 선택한 td
 */
function guide(tds, thisTd) {
  tds.forEach((td) => {
    if (td.firstChild && td.textContent === thisTd.textContent) {
      td.classList.add('same-nums');
    }
    if (td.getAttribute('data-tr') === thisTd.getAttribute('data-tr') ||
        td.getAttribute('data-td') === thisTd.getAttribute('data-td') ||
        td.getAttribute('data-area') === thisTd.getAttribute('data-area')) {
      td.classList.add('relation-cell');
    }
  });
}

/**
 * 넘겨받은 숫자를 선택한 곳에 넣어주고 정답을 확인하는 로직
 * @param {array} arr - 정답 배열
 * @param {number} num - 숫자버튼 클릭 한 숫자
 */
function inputNumber(arr, num) {
  const $select = document.querySelector('.doku-select.doku-value');
  const selectAnswer = arr[$select.getAttribute('data-tr')][$select.getAttribute('data-td')];
  const $dataTrs = document.querySelectorAll(`[data-tr='${$select.getAttribute('data-tr')}']`);
  const $dataTds = document.querySelectorAll(`[data-td='${$select.getAttribute('data-td')}']`);
  $dataTrs.forEach((elem) => {
    elem.classList.remove('conflict');
  });
  $dataTds.forEach((elem) => {
    elem.classList.remove('conflict');
  });
  if ($select) $select.textContent = Number(num);
  if (selectAnswer == num) {
    $select.classList.remove('wrong-value');
  } else {
    $select.classList.add('wrong-value');
    $dataTrs.forEach((elem) => {
      if (elem.textContent === num && !elem.classList.contains('doku-select')) elem.classList.add('conflict');
    });
    $dataTds.forEach((elem) => {
      if (elem.textContent === num && !elem.classList.contains('doku-select')) elem.classList.add('conflict');
    });
  }

  const $tds = document.querySelectorAll('td');
  guide($tds, $select);

  const $valCells = document.querySelectorAll('.doku-value');
  let allClear = true;
  $valCells.forEach((cell) => {
    if (!cell.textContent || cell.classList.contains('wrong-value')) allClear = false;
  });
  const $success = document.querySelector('.success');
  if (allClear) $success.style.display = 'block';
}



let answerArr = makePuzzle(copyDefault, $tbody);
// --------------start 선택했을 때 ---------------
const $startBtn = document.querySelector('.taskbar-start');
$startBtn.addEventListener('click', () => {
  answerArr = makePuzzle(copyDefault, $tbody);
});
// ---------------------------------------------

// --------------levelEasy 선택했을 때 ---------------
const $levelEasy = document.querySelector('.level-easy');
$levelEasy.addEventListener('click', () => {
  answerArr = makePuzzle(copyDefault, $tbody);
});
// ---------------------------------------------

// --------------levelMidium 선택했을 때 ---------------
const $levelMidium = document.querySelector('.level-midium');
$levelMidium.addEventListener('click', () => {
  answerArr = makePuzzle(copyDefault, $tbody, 50);
});
// ---------------------------------------------

// --------------levelHard 선택했을 때 ---------------
const $levelHard = document.querySelector('.level-hard');
$levelHard.addEventListener('click', () => {
  answerArr = makePuzzle(copyDefault, $tbody, 60);
});
// ---------------------------------------------

// --------------TD을 선택했을 때 ---------------
const $tds = document.querySelectorAll('td');
$tbody.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    otherSelectCancel($tds);
    e.target.classList.add('doku-select');
    guide($tds, e.target);
  }
});
// ---------------------------------------------

// --------------숫자를 선택했을 때 ---------------
const $numberWrap = document.querySelector('.number-pad');
$numberWrap.addEventListener('click', (e) => {
  const clickTarget = e.target;
  if (clickTarget.classList.contains('number-btn')) {
    inputNumber(answerArr, clickTarget.value);
  }
});
// ---------------------------------------------
