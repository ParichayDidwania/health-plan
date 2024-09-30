const express = require('express');
const router = express.Router();
const PlanService = require('../service/plan');

router.get('/:id', async (req, res, next) => {
    try {
        const plan = await PlanService.getPlan(req.params.id);
        return res.status(200).send(plan);
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        await PlanService.createPlan(req.body);
    } catch (e) {
        return next(e);
    }

    return res.status(201).send({
        message: "Plan created successfully",
        status_code: 201
    });
})

router.delete('/:id', async (req, res, next) => {
    try {
        await PlanService.deletePlan(req.params.id);
    } catch (e) {
        return next(e);
    }

    return res.status(204).send();
})

router.all('*', async (req, res) => {
    return res.status(405).send();
})

module.exports = router;
