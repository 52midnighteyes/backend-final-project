import { PORT } from "./app/configs/config";
import app from "./app/index";

const port = Number(PORT) || 8080;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
