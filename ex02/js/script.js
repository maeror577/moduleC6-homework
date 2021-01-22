const buttonNode = document.querySelector(".button");

buttonNode.addEventListener("click", () => {
  alert(`
  Screen size: ${window.screen.width}x${window.screen.height}
  Viewport size (w/o scrollbar): ${document.documentElement.clientWidth}x${document.documentElement.clientHeight}
  Viewport size (w/ scrollbar): ${window.innerWidth}x${window.innerHeight}
  `);
});



/* -- FOR TESTING -- */
const testNode = document.querySelector(".testing-text");
const testText = "This text was added for scrollbars to appear ";

for (let count = 1; count <= 100; count++) {
  testNode.innerHTML += `<p>${testText.repeat(50)}</p>`;
}
/* ----------------- */