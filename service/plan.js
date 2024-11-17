const db = require("../database/db");
const { CustomError, ERROR_TYPES } = require("../error-manager/errorManager");
const PlanFunctions = require("../functions/plan");
const validatePlanPost = require("../models/plan");
const { publisher } = require("../publisher/publisher");

class PlanService {
    static KEY = "plan";

    static async getPlan(id) {
        const res = await db.redis.HGET(PlanService.KEY, id);
        if(!res) {
            throw new CustomError(ERROR_TYPES.NOT_FOUND);
        }
        return JSON.parse(res);
    }

    static async createPlan(plan) {
        if(!validatePlanPost(plan)) {
            throw new CustomError(ERROR_TYPES.VALIDATION_FAILUIRE);
        }
        const res = await db.redis.HGET(PlanService.KEY, plan.objectId);
        if(res) {
            throw new CustomError(ERROR_TYPES.ALREADY_EXISTS);
        }
        await db.redis.HSET(PlanService.KEY, plan.objectId, JSON.stringify(plan));

        const record = await db.redis.HGET(PlanService.KEY, plan.objectId);

        publisher.publish('create', JSON.parse(record));

        return record;
    }

    static async updatePlan(id, oldPlan, patchObject, ifMatch, oldPlanETag) {
        if(ifMatch && ifMatch != oldPlanETag) {
            throw new CustomError(ERROR_TYPES.PRECONDITION_FAILED);
        }

        const newPlan = PlanFunctions.patchObject(oldPlan, patchObject);

        if(!validatePlanPost(newPlan)) {
            throw new CustomError(ERROR_TYPES.VALIDATION_FAILUIRE);
        }

        await db.redis.HSET(PlanService.KEY, id, JSON.stringify(newPlan));

        const record = await db.redis.HGET(PlanService.KEY, id);

        publisher.publish('update', JSON.parse(record));

        return JSON.parse(record);
    }

    static async deletePlan(id) {
        const record = await db.redis.HGET(PlanService.KEY, id);
        if(!record) {
            throw new CustomError(ERROR_TYPES.NOT_FOUND);
        }
        publisher.publish('delete', JSON.parse(record));
        await db.redis.HDEL(PlanService.KEY, id);
    }
}

module.exports = PlanService;
