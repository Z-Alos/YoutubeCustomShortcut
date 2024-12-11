document.addEventListener("keydown", (event) => {
    if (event.key === "q") {
      console.log("Q key pressed - Add your logic here.");
      const settingBtn = document.querySelector('[aria-label="Settings"]')

      if(settingBtn){
        settingBtn.click()
        console.log("Settings Btn Clicked.....")
        
        const qualityBtn = document.querySelector(".ytp-settings-menu .ytp-menuitem:last-child")

        if(qualityBtn){
            qualityBtn.click()
            console.log("Quality Btn Clicked.....")
        }else{
            console.log("404 - Quality Button Not Found")
        }
      }else{
        console.log("404 - Settings Button Not Found")
      }
    }

    if(event.shiftKey && event.key === "ArrowUp"){
      if (typeof window.GlideUpThroughVideo === "function") {
        window.GlideUpThroughVideo();
      } else {
          console.error("GlideUpThroughVideo is not defined!");
      }
    }

    if(event.shiftKey && event.key === "ArrowDown"){
      if (typeof window.GlideDownThroughVideo === "function") {
        window.GlideDownThroughVideo();
      } else {
          console.error("GlideDownThroughVideo is not defined!");
      }
    }

    if(event.key === "Enter"){
      window.enterVerdict()
    }

    if(event.key === "l"){
      const url = window.location.href;
      console.log(url)
      if(url === "https://www.youtube.com/"){
        console.log("On Home Page")
      }
      if(url.includes("youtube.com/results")){
        console.log("On Result Page")
      }
      if(url.includes("youtube.com/watch")){
        console.log("On Watch Page")
      }
    }
  });

window.initializeGlideMode();
  