import { logInUser } from "../Controllers/userController.js";

const router = express.Router();

//Create new user
router.post("/logIn", logInUser);

export default router;
