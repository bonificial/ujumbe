
import { start } from "./src/index.js";
Promise
  .resolve()
  .then(start)
  .catch(console.error);
