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

// 2. 기본 스도쿠 배열을 가지고 랜덤하게 배열을 바꿈(문제 랜덤 생성)
/**
 * 묶음들을 랜덤으로 돌리기 위한 랜덤수
 */
function bundle() {
  const defaultNumArr = [0, 1, 2]; // 3개행을 랜덤으로 배치하기 위한 인덱스 배열
  const randomNumArr = []; // 3개에 숫자를 랜덤으로 담을 배열
  const copyDefault = defaultNumArr.slice(); // 카운트로 쓰기 위한 복사 배열
  defaultNumArr.forEach(() => { // 인덱스 배열을 하나씩 돌면서
    const numberIndex = Math.floor((Math.random() * copyDefault.length)); // 0부터 복사 배열에 개수중에 랜덤 인덱스를 생성 
    const getNumber = copyDefault[numberIndex]; // 랜덤 인덱스에 해당되는 값을 가져와서
    randomNumArr.push(getNumber); // 결과 배열에 담음
    copyDefault.splice(numberIndex, 1); // 중복을 피하기 위해 복사 배열에 있는 값중에 랜덤으로 쓴값을 지움
  });
  return randomNumArr; // 예) [1, 0, 2]
}
/**
 * 기본 스도쿠 배열을 랜덤으로 배열해서 소도쿠 문제를 생성해주는 로직
 * @param {array} arr - 2차원 배열
 */
function random(arr) {
  for (let i = 0; i < 9; i += 3) { // 기준이 되는 행 0, 3, 6
    for (let j = 0; j < 3; j++) { // 기준이 되는 열 0, 1, 2
      const order = [ // 바꾸어야 할 한 묶음 예) i=0, j=0일 때 위에 설명 4번과 동일
        arr[i][j], arr[i][j + 3], arr[i][j + 6],
        arr[i + 1][j], arr[i + 1][j + 3], arr[i + 1][j + 6],
        arr[i + 2][j], arr[i + 2][j + 3], arr[i + 2][j + 6]
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
      [arr[i][j], arr[i][j + 3], arr[i][j + 6]] = cArr1;
      [arr[i + 1][j], arr[i + 1][j + 3], arr[i + 1][j + 6]] = cArr2;
      [arr[i + 2][j], arr[i + 2][j + 3], arr[i + 2][j + 6]] = cArr3;
    }
  }

  return arr;
}

// 3. 랜덤하게 바뀐 배열중에 문제를 만들기 위해 랜덤하게 값 숨김
/**
 * 랜덤하게 값을 숨기기 위해 랜덤으로 0을 부여하는 로직
 * @param {array} arr - 2차원 배열
 * @param {number} difficulty - 값을 숨길 숫자(난이도 : 쉬움 - 40개, 보통 - 50개, 어려움 - 60개)
 */
function makePuzzle(arr, difficulty) {
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


console.log('기본 스도쿠 배열');
console.log(defaultSudoku);

const copyDefault = defaultSudoku.slice(); // 랜덤으로 문제를 생성하기 위한 복사 배열
const answer = random(copyDefault); // 현재 스도쿠 문제 정답
console.log('현재 스도쿠 문제 정답 배열');
console.log(answer);

const answerCopy = answer.slice(); // 정답 배열로 문제를 만들기 위한 복사 배열
const difficulty = 43; // 난이도 : 쉬움 - 40개, 보통 - 50개, 어려움 - 60개
const puzzle = makePuzzle(answerCopy, difficulty);
console.log('현재 스도쿠 문제 배열');
console.log(puzzle);


