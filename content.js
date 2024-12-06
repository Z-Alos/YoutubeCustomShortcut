// content.js
document.addEventListener("keydown", (event) => {
    if (event.key === "q") {
      console.log("Q key pressed - Add your logic here.");
      // Add your YouTube-specific code here
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

  });
  