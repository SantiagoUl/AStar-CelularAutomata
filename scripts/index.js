let obj2;
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerText = Math.floor(progress * (end - start) + start) + "%";
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  window.onload = (event) => {
    obj2 = document.getElementById("loadingNum");
    animateValue(obj2, 0, 100, 4000);
    setTimeout(() => {
        document.querySelector('.loading').classList.toggle('false');
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 1000);
    }, 4000);
  };
  