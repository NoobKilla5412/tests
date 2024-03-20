const { log } = require("console");
const { writeFileSync, readFileSync } = require("fs");
const Seqstring = require("seqstring");

(async () => {
  const { default: fetch } = await import("node-fetch");

  const letters = Array.from(Array(126 - 32 + 1), (_, i) => String.fromCharCode(i + 32)).filter((v) => v != ";");
  log(letters);

  function done(pass) {
    writeFileSync("done.csv", (readFileSync("done.csv") || "") + pass + "\n");
  }

  const generator = new Seqstring(1, 20, letters);

  for (const pass of generator) {
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
      break;
    }
    done(pass);
  }
})();
