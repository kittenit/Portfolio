function toggleMusic(button) {
    const audio = document.getElementById("myAudio");
    const icon = button.querySelector("i");

    if (audio.paused) {
      audio.play();
      icon.classList.remove("fa-play");
      icon.classList.add("fa-stop");
    } else {
      audio.pause();
      icon.classList.remove("fa-stop");
      icon.classList.add("fa-play");
    }
}
