import express from 'express';

const router = express();


router.route("/signup").post();
router.route("/login").post()

export default router;