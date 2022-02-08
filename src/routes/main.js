import { Router } from "express";

const router = Router();

router.get('/', function (req, res) {
    return res.render('main')
});

export { router };