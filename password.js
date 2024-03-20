const { log } = require("console");

(async () => {
  const { default: fetch } = await import("node-fetch");

  function generatePass(len) {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= len; i++) {
      let char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  main: for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 65 * (i + 3); j++) {
      let pass = generatePass(i);
      const text = await (
        await fetch("https://pawn.pieces.tafca.co.uk", {
          headers: {
            cookie: `password=${pass}`
          }
        })
      ).text();
      if (
        text !=
        `<script>
    document.cookie = \`password=\${prompt('Enter the password')}\`;
    location.reload();
</script>`
      ) {
        console.log(pass);
        break main;
      }
    }
    log(i + 1);
  }
})();
