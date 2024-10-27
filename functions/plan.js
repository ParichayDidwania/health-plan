const { ERROR_TYPES, CustomError } = require("../error-manager/errorManager");

class PlanFunctions {
    static patchObject(target, patch) {
        for (const key in patch) {
            if (Array.isArray(patch[key])) {
                target[key] = Array.isArray(target[key]) ? [...target[key], ...patch[key]] : patch[key];  
            } else if (typeof patch[key] === 'object') {
                target[key] = PlanFunctions.patchObject(target[key], patch[key]);
            } else {
                if (key != 'objectId' || (key == 'objectId' && target[key] == patch[key])) {
                    target[key] = patch[key];
                } else {
                    throw new CustomError(ERROR_TYPES.PATCH_OBJECT_ID);
                }
            }
        }

        return target;
    }
}

module.exports = PlanFunctions;
