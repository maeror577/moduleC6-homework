/*
 * Задание 1.
 * Сверстайте кнопку, которая будет содержать в себе icon_01 (как в примере в
 * последнем видео). При клике на кнопку иконка должна меняться на icon_02.
 * Повторный клик меняет иконку обратно.
 */

const buttonNode = document.querySelector(".button");
const unfilledIconNode = document.querySelector(".unfilled");
const filledIconNode = document.querySelector(".filled")

buttonNode.addEventListener("click", () => {
  unfilledIconNode.classList.toggle("hidden");
  filledIconNode.classList.toggle("hidden");
});
