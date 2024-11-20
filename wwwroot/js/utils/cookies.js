class Cookie { 
    constructor(data = {}) {
        this.data = data
    }

    setCookie(name, value, options = {}) {
      const date = new Date();
      date.setTime(date.getTime() + (options['exdays'] * 24 * 60 * 60 * 1000));
      let expires = "expires=" + date.toUTCString();
  
      let cookieString = name + "=" + value + ";" + expires + ";path=/";
  
      // Add Secure flag if using HTTPS
      if (window.location.protocol === 'https:' && options["secure"]) {
          cookieString += "; Secure";
      }
  
      document.cookie = cookieString;
   }
  

    getCookie(cName) {
        let name = cName + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }

          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }

        return "";
    }
}

export { Cookie };
