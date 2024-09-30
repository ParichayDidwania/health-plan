const db = require("../database/db");
const { CustomError, ERROR_TYPES } = require("../error-manager/errorManager");
const validatePlanPost = require("../models/plan");

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
        await db.redis.HSET(PlanService.KEY, plan.objectId, JSON.stringify(plan));
    }

    static async deletePlan(id) {
        const res = await db.redis.HDEL(PlanService.KEY, id);
        if(res == 0) {
            throw new CustomError(ERROR_TYPES.NOT_FOUND);
        }
    }
}

module.exports = PlanService;
