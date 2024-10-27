const express = require('express');
const router = express.Router();
const PlanService = require('../service/plan');
const etag = require('etag');

router.get('/:id', async (req, res, next) => {
    try {
        const plan = await PlanService.getPlan(req.params.id);
        const generatedEtag = etag(JSON.stringify(plan), { weak: true });

        res.setHeader('ETag', generatedEtag);

        if(!req.headers['if-none-match'] || req.headers['if-none-match'] != generatedEtag) {
            return res.status(200).send(plan);
        }

        return res.status(304).send();       
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const stringifiedRecord = await PlanService.createPlan(req.body);
        const generatedEtag = etag(stringifiedRecord, { weak: true });

        res.setHeader('ETag', generatedEtag);
    } catch (e) {
        return next(e);
    }

    return res.status(201).send({
        message: "Plan created successfully",
        status_code: 201
    });
})

router.patch('/:id', async (req, res, next) => {
    try {
        const plan = await PlanService.getPlan(req.params.id);
        const oldGeneratedEtag = etag(JSON.stringify(plan), { weak: true });

        const record = await PlanService.updatePlan(req.params.id, plan, req.body, req.headers['if-match'], oldGeneratedEtag);
        const newGeneratedEtag = etag(JSON.stringify(record), { weak: true });

        res.setHeader('ETag', newGeneratedEtag);

        return res.status(200).send(record);
    } catch (e) {
        return next(e);
    }
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
