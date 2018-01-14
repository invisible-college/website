var usedColors = [];
var fadeTime = 400;
var animated = false;

function getColor() {
    let colors = ['#98dafc', '#b0aac2', '#f2efe8', '#c2d4d8', '#dbe9d8'];
    let vibrants = ['#92DCE5' ,'#B8B8F3', '#D7B8F3', '#F397D6', '#F42272', '#232E21', '#000000'];
    let greyscale = ['#FFFBFE', '#7A7D7D', '#D0CFCF', '#565254'];

    let color = vibrants[Math.floor(Math.random() * 100 * colors.length) % colors.length];

    if (usedColors.length === colors.length) usedColors = [];
    if (usedColors.indexOf(color) !== -1) return getColor();

    usedColors.push(color);

    return color;
}

function isHidden(el) {
    return (el.offsetParent === null);
}

function fadeIn(el) {
    let opacity = parseInt(window.getComputedStyle(el).opacity);

    let interval = setInterval( () => {
        if (opacity > 0.99) clearInterval(interval);
        opacity += 0.01;
        el.style.opacity = opacity;
    });
}

function toggleDescription(e) {
    let descr = e.target.nextSibling;

    if (!descr) descr = e.target.parentNode.nextSibling;

    descr.style.display = isHidden(descr) ? "block" : "none";
}

function randOffsetCenter(el, prev) {
    let amt = rand(-60, 40) - prev;
    el.style.transform = `translateX(${amt}%)`;
    return amt;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function showMenu(artists) {
  if (!document.getElementById("artists")) return () => {
    setTimeout( () => showMenu(artists), 1000);
  }
  console.log("showMenu()");
  console.log(artists);
    let menu = document.createElement("div");
    menu.setAttribute("id", "artist-menu");

    artists.forEach( (artist, index) => {
        let anchor = document.createElement("a");
        anchor.href = `#artist-${index}`;
        anchor.textContent = artist.name;
        menu.appendChild(anchor);
    });

    document.body.insertBefore(menu, document.getElementById("artists"));
}

function animatePhotos() {
  let photos = document.querySelectorAll(".artist-photo-wrap");
  if (!photos.length) return;
  if (animated) return;

  animated = true;
  photos.forEach( (photo, idx) => {
      let prevOffset = 0;
      setTimeout( () => {
          prevOffset = randOffsetCenter(photo, prevOffset);
      }, idx * fadeTime);
  }, 1000);

}