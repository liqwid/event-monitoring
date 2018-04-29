import { createApp } from "./src/app";

const PORT = process.env.PORT || 3000;

createApp().then(app => {
  app.listen(PORT, () => {
    console.log(`Events app listening on port ${PORT}!`);
  });

  app.on("error", console.error);
});
